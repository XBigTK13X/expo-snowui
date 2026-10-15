package com.simplepathstudios.snowui

import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.pm.PackageInfoCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class PackageVersionRecord : Record {
  @Field
  val versionName: String? = null

  @Field
  val versionCode: Long = 0L
}

class InspectModule : Module() {
  override fun definition() =
    ModuleDefinition {
      Name("SnowInspect")

      Function("getInstalledVersion") { appName: String ->
        val context = appContext.reactContext ?: return@Function null
        val packageManager = context.packageManager

        val packageName = "com.simplepathstudios." + appName

        val packageInfo: PackageInfo =
          try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
              packageManager.getPackageInfo(
                packageName,
                PackageManager.PackageInfoFlags.of(0L),
              )
            } else {
              @Suppress("DEPRECATION")
              packageManager.getPackageInfo(packageName, 0)
            }
          } catch (exception: PackageManager.NameNotFoundException) {
            return@Function null
          }

        val versionCode = PackageInfoCompat.getLongVersionCode(packageInfo)
        val versionName = packageInfo.versionName

        mapOf(
          "versionName" to versionName,
          "versionCode" to versionCode,
        )
      }
    }
}
