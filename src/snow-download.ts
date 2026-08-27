import { requireNativeModule, EventEmitter } from 'expo-modules-core'
import { Platform } from 'react-native'

const NativeDownload = Platform.OS === 'android' ? requireNativeModule('SnowDownload') : null
const downloadEmitter = NativeDownload ? new EventEmitter(NativeDownload) : null

export interface DownloadOptions {
    url: string
    fileName?: string
    isTemp?: boolean
    treeUri?: string
    subDir?: string
    mimeType?: string
    openAfterDownload?: boolean
}

export interface DownloadResult {
    success: boolean
    uri: string
    filePath?: string
    mimeType?: string
}

export interface ProgressEvent {
    progress: number
}

export interface LogEvent {
    message: string
}

export const SnowDownload = {
    addProgressListener(listener: (event: ProgressEvent) => void) {
        if (!downloadEmitter) return { remove: () => { } }
        return (downloadEmitter as any).addListener('downloadProgress', listener)
    },

    addLogListener(listener: (event: LogEvent) => void) {
        if (!downloadEmitter) return { remove: () => { } }
        return (downloadEmitter as any).addListener('downloadLog', listener)
    },

    async pickDirectory(): Promise<string | null> {
        if (!NativeDownload) return null
        return await NativeDownload.pickDirectory()
    },

    async download(options: DownloadOptions): Promise<DownloadResult | null> {
        if (!NativeDownload) return null

        let destinationTreeUri = options.treeUri
        if (!options.isTemp && !destinationTreeUri) {
            const selectedTreeUri = await this.pickDirectory()
            if (!selectedTreeUri) return null
            destinationTreeUri = selectedTreeUri
        }

        return await NativeDownload.download({
            ...options,
            treeUri: destinationTreeUri
        })
    },

    async installApk(fileUriOrPath: string): Promise<boolean> {
        if (!NativeDownload) return false
        return await NativeDownload.installApk(fileUriOrPath)
    },

    async openFile(fileUriOrPath: string, mimeType?: string): Promise<boolean> {
        if (!NativeDownload) return false
        return await NativeDownload.openFile(fileUriOrPath, mimeType)
    },

    async getLogs(): Promise<string[]> {
        if (!NativeDownload) return []
        return await NativeDownload.getLogs()
    }
}

export default SnowDownload