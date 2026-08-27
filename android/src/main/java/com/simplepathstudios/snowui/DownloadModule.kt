package com.simplepathstudios.snowui

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.webkit.MimeTypeMap
import androidx.core.content.FileProvider
import androidx.documentfile.provider.DocumentFile
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.activityresult.AppContextActivityResultContract
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.io.OutputStream
import java.net.HttpURLConnection
import java.net.URL

class DownloadOptions : Record {
    @Field var url: String = ""
    @Field var fileName: String? = null
    @Field var isTemp: Boolean = true
    @Field var treeUri: String? = null
    @Field var subDir: String? = null
    @Field var mimeType: String? = null
    @Field var openAfterDownload: Boolean = false
}

class DownloadModule : Module() {
    private val moduleScope = CoroutineScope(Dispatchers.IO)
    private var pendingDirectoryPickerPromise: Promise? = null
    private val TAG = "SnowDownload"

    // Add a unique request code for the picker
    private val REQUEST_CODE_PICK_DIRECTORY = 9912

    private val logBuffer = mutableListOf<String>()

private fun sendLog(message: String) {
        Log.d(TAG, message)
        synchronized(logBuffer) {
            logBuffer.add("[${System.currentTimeMillis()}] $message")
            if (logBuffer.size > 500) logBuffer.removeAt(0)
        }
        try {
            sendEvent("downloadLog", mapOf("message" to message))
        } catch (e: Exception) {
            Log.e(TAG, "sendEvent failed: ${e.message}")
        }
    }

    override fun definition() = ModuleDefinition {
        Name("SnowDownload")
        Events("downloadProgress", "downloadLog")

        // 1. Listen for the raw Activity Result natively
        OnActivityResult { _, payload ->
            if (payload.requestCode == REQUEST_CODE_PICK_DIRECTORY) {
                val promise = pendingDirectoryPickerPromise
                pendingDirectoryPickerPromise = null

                if (promise == null) return@OnActivityResult

                if (payload.resultCode == Activity.RESULT_OK) {
                    val uri = payload.data?.data
                    if (uri != null) {
                        try {
                            val takeFlags = Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                            appContext.reactContext?.contentResolver?.takePersistableUriPermission(uri, takeFlags)
                            sendLog("Persistable URI permission granted successfully for: $uri")
                            promise.resolve(uri.toString())
                        } catch (e: Exception) {
                            sendLog("Failed to take persistable URI permission: ${e.message}")
                            promise.reject("ERR_PERSIST_PERMISSION", e.message, e)
                        }
                    } else {
                        sendLog("Directory selection cancelled (No URI).")
                        promise.resolve(null)
                    }
                } else {
                    sendLog("Directory selection cancelled.")
                    promise.resolve(null)
                }
            }
        }

        // 2. Launch using standard startActivityForResult on the current Activity
        AsyncFunction("pickDirectory") { promise: Promise ->
            if (pendingDirectoryPickerPromise != null) {
                promise.reject("ERR_PICKER_BUSY", "Directory picker is already open", null)
                return@AsyncFunction
            }
            pendingDirectoryPickerPromise = promise

            val activity = appContext.currentActivity
            if (activity == null) {
                pendingDirectoryPickerPromise = null
                promise.reject("ERR_NO_ACTIVITY", "Current activity is null", null)
                return@AsyncFunction
            }

            try {
                sendLog("Launching directory picker intent on Main thread...")
                val intent = Intent(Intent.ACTION_OPEN_DOCUMENT_TREE).apply {
                    addFlags(
                        Intent.FLAG_GRANT_READ_URI_PERMISSION or
                        Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
                        Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                    )
                }
                activity.startActivityForResult(intent, REQUEST_CODE_PICK_DIRECTORY)
            } catch (exception: Exception) {
                sendLog("Failed to launch directory picker: ${exception.message}")
                pendingDirectoryPickerPromise = null
                promise.reject("ERR_PICKER_FAILED", exception.message, exception)
            }
        }

        // ... Keep your existing download, installApk, and openFile functions here ...



    AsyncFunction("getLogs") { promise: Promise ->
    synchronized(logBuffer) {
        promise.resolve(logBuffer.toList())
    }
}

AsyncFunction("clearLogs") { promise: Promise ->
    synchronized(logBuffer) {
        logBuffer.clear()
    }
    promise.resolve(true)
}

        AsyncFunction("download") { options: DownloadOptions, promise: Promise ->
            sendLog("Download started: url=${options.url}, isTemp=${options.isTemp}, treeUri=${options.treeUri}, subDir=${options.subDir}")
            val context = appContext.reactContext
            if (context == null) {
                sendLog("React application context is not available")
                promise.reject("ERR_NO_CONTEXT", "React application context is not available", null)
                return@AsyncFunction
            }

            moduleScope.launch {
                var connection: HttpURLConnection? = null
                var inputStream: InputStream? = null
                var outputStream: OutputStream? = null

                try {
                    val resolvedFileName = options.fileName?.takeIf { it.isNotBlank() }
                        ?: options.url.substringAfterLast("/").substringBefore("?").takeIf { it.isNotBlank() }
                        ?: "downloaded_file"

                    val resolvedMimeType = options.mimeType?.takeIf { it.isNotBlank() }
                        ?: getMimeTypeFromFileName(resolvedFileName)

                    sendLog("Resolved file name: $resolvedFileName, mimeType: $resolvedMimeType")

                    var contentUri: Uri? = null
                    var filePath: String? = null

                    if (options.isTemp) {
                        val targetDir = if (!options.subDir.isNullOrBlank()) {
                            File(context.cacheDir, options.subDir ?: "").apply { mkdirs() }
                        } else {
                            context.cacheDir
                        }
                        val targetFile = File(targetDir, resolvedFileName)
                        if (targetFile.exists()) {
                            targetFile.delete()
                        }

                        outputStream = FileOutputStream(targetFile)
                        filePath = targetFile.absolutePath
                        contentUri = FileProvider.getUriForFile(
                            context,
                            "${context.packageName}.snowui.provider",
                            targetFile
                        )
                        sendLog("Target temp file path: $filePath")
                    } else {
                        val treeUriString = options.treeUri
                        if (treeUriString.isNullOrBlank()) {
                            sendLog("Error: A destination treeUri must be provided for permanent downloads")
                            promise.reject("ERR_INVALID_DESTINATION", "A destination treeUri must be provided for permanent downloads", null)
                            return@launch
                        }

                        val rootTreeUri = Uri.parse(treeUriString)
                        var targetDocumentDir = DocumentFile.fromTreeUri(context, rootTreeUri)
                        if (targetDocumentDir == null || !targetDocumentDir.canWrite()) {
                            sendLog("Error: Cannot write to selected directory: $treeUriString")
                            promise.reject("ERR_PERMISSION_DENIED", "Cannot write to selected directory", null)
                            return@launch
                        }

                        if (!options.subDir.isNullOrBlank()) {
                            val subFolders = options.subDir!!.split("/").filter { it.isNotBlank() }
                            for (folderName in subFolders) {
                                val existingDir = targetDocumentDir?.findFile(folderName)
                                targetDocumentDir = if (existingDir != null && existingDir.isDirectory) {
                                    existingDir
                                } else {
                                    targetDocumentDir?.createDirectory(folderName)
                                }
                            }
                        }

                        val existingFile = targetDocumentDir?.findFile(resolvedFileName)
                        existingFile?.delete()

                        val targetDocumentFile = targetDocumentDir?.createFile(resolvedMimeType, resolvedFileName)
                        if (targetDocumentFile == null) {
                            sendLog("Error: Unable to create target file in destination directory")
                            promise.reject("ERR_FILE_CREATE", "Unable to create target file in destination directory", null)
                            return@launch
                        }

                        contentUri = targetDocumentFile.uri
                        outputStream = context.contentResolver.openOutputStream(contentUri!!)
                        sendLog("Created permanent document file URI: $contentUri")
                    }

                    if (outputStream == null) {
                        sendLog("Error: Failed to open output stream")
                        promise.reject("ERR_STREAM_OPEN", "Failed to open output stream", null)
                        return@launch
                    }

                    val downloadUrl = URL(options.url)
                    connection = (downloadUrl.openConnection() as HttpURLConnection).apply {
                        connectTimeout = 15000
                        readTimeout = 20000
                        setRequestProperty("Accept-Encoding", "identity")
                        instanceFollowRedirects = true
                    }
                    connection.connect()

                    var totalBytes = connection.contentLengthLong
                    if (totalBytes <= 0L) {
                        val headerLength = connection.getHeaderField("Content-Length")
                        totalBytes = headerLength?.toLongOrNull() ?: -1L
                    }
                    sendLog("Connection established. Content-Length: $totalBytes bytes")

                    inputStream = connection.inputStream

                    val bufferArray = ByteArray(32768)
                    var bytesRead: Int
                    var totalBytesRead: Long = 0
                    var lastReportedPercent = -1

                    sendEvent("downloadProgress", mapOf("progress" to 0))

                    while (inputStream.read(bufferArray).also { bytesRead = it } != -1) {
                        outputStream.write(bufferArray, 0, bytesRead)
                        totalBytesRead += bytesRead

                        if (totalBytes > 0L) {
                            val percent = ((totalBytesRead * 100) / totalBytes).toInt()
                            if (percent != lastReportedPercent) {
                                lastReportedPercent = percent
                                sendEvent("downloadProgress", mapOf("progress" to percent))
                            }
                        }
                    }

                    outputStream.flush()
                    sendEvent("downloadProgress", mapOf("progress" to 100))
                    sendLog("Download completed successfully. Total bytes read: $totalBytesRead")

                    outputStream.close()
                    outputStream = null
                    inputStream.close()
                    inputStream = null
                    connection.disconnect()
                    connection = null

                    if (options.openAfterDownload && contentUri != null) {
                        sendLog("Opening file automatically...")
                        val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                            setDataAndType(contentUri, resolvedMimeType)
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
                        }
                        context.startActivity(viewIntent)
                    }

                    val resultMap = mapOf(
                        "success" to true,
                        "uri" to contentUri.toString(),
                        "filePath" to filePath,
                        "mimeType" to resolvedMimeType
                    )
                    promise.resolve(resultMap)
                } catch (exception: Exception) {
    sendLog("Download failed: ${exception.message}")
    try {
        sendEvent("downloadProgress", mapOf("progress" to -1))
    } catch (e: Exception) {
        // Suppress bridge crash so promise.reject still fires
    }
    promise.reject("ERR_DOWNLOAD_FAILED", exception.message, exception)
} finally {
                    try { outputStream?.close() } catch (ignored: Exception) {}
                    try { inputStream?.close() } catch (ignored: Exception) {}
                    try { connection?.disconnect() } catch (ignored: Exception) {}
                }
            }
        }

        AsyncFunction("installApk") { fileUriOrPath: String, promise: Promise ->
            try {
                val context = appContext.reactContext ?: throw Exception("Context not available")
                val contentUri = resolveContentUri(context, fileUriOrPath)
                val installIntent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(contentUri, "application/vnd.android.package-archive")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
                }
                context.startActivity(installIntent)
                promise.resolve(true)
            } catch (exception: Exception) {
                promise.reject("ERR_INSTALL_FAILED", exception.message, exception)
            }
        }

        AsyncFunction("openFile") { fileUriOrPath: String, explicitMimeType: String?, promise: Promise ->
            try {
                val context = appContext.reactContext ?: throw Exception("Context not available")
                val contentUri = resolveContentUri(context, fileUriOrPath)
                val mimeType = explicitMimeType?.takeIf { it.isNotBlank() }
                    ?: context.contentResolver.getType(contentUri)
                    ?: getMimeTypeFromFileName(fileUriOrPath)

                val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(contentUri, mimeType)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
                }
                context.startActivity(viewIntent)
                promise.resolve(true)
            } catch (exception: Exception) {
                promise.reject("ERR_OPEN_FAILED", exception.message, exception)
            }
        }
    }

    private fun resolveContentUri(context: android.content.Context, pathOrUri: String): Uri {
        return if (pathOrUri.startsWith("content://")) {
            Uri.parse(pathOrUri)
        } else {
            val resolvedFile = File(pathOrUri)
            FileProvider.getUriForFile(context, "${context.packageName}.snowui.provider", resolvedFile)
        }
    }

    private fun getMimeTypeFromFileName(fileName: String): String {
        val extension = fileName.substringAfterLast(".", "")
        if (extension.isNotEmpty()) {
            val extensionMimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.lowercase())
            if (extensionMimeType != null) return extensionMimeType
        }
        return "*/*"
    }
}