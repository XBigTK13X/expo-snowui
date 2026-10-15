import { requireNativeModule } from 'expo-modules-core'
import { Platform } from 'react-native'

export interface PackageVersionInfo {
    versionName: string | null
    versionCode: number
}

interface NativeInspect {
    getInstalledVersion(appName: string): PackageVersionInfo | null
}

const Inspector = Platform.OS === 'android' ? requireNativeModule<NativeInspect>('SnowInspect') : null

export const SnowInspect = {
    getInstalledVersion(appName: string): PackageVersionInfo | null {
        if (!Inspector) return null
        return Inspector.getInstalledVersion(appName)
    }
}

export default SnowInspect