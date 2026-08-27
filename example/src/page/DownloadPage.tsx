import { useState, useEffect } from 'react'
import Snow from 'expo-snowui'
import { Text, ScrollView, View } from 'react-native'

const sampleDownloadUrl = 'https://raw.githubusercontent.com/XBigTK13X/expo-snowui/refs/heads/master/README.md'

export default function DownloadPage() {
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [logs, setLogs] = useState<string[]>([])

    const appendLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
    }

    useEffect(() => {
        const progressSub = Snow.Download.addProgressListener((event: { progress: number }) => {
            setDownloadProgress(event.progress)
        })

        const logSub = (Snow.Download as any).addLogListener?.((event: { message: string }) => {
            appendLog(event.message)
        })

        return () => {
            progressSub.remove()
            logSub?.remove()
        }
    }, [])

    const handleDownloadPerm = async () => {
        appendLog('Triggering Perm Download...')
        try {
            const res = await Snow.Download.download({
                url: sampleDownloadUrl,
                fileName: 'sample_test.txt',
                isTemp: false,
                subDir: 'SnowsuiteDownloads',
                mimeType: 'text/plain',
                openAfterDownload: false
            })
            appendLog(`Perm download response: ${JSON.stringify(res)}`)
        } catch (e: any) {
            appendLog(`Perm download threw error: ${e.message}`)
        }
    }

    const handleDownloadPermAndOpen = async () => {
        appendLog('Triggering Perm Download and Open...')
        try {
            const res = await Snow.Download.download({
                url: sampleDownloadUrl,
                fileName: 'sample_test.txt',
                isTemp: false,
                subDir: 'SnowsuiteDownloads',
                mimeType: 'text/plain',
                openAfterDownload: true
            })
            appendLog(`Perm download & open response: ${JSON.stringify(res)}`)
        } catch (e: any) {
            appendLog(`Perm download & open threw error: ${e.message}`)
        }
    }

    const handleDownloadTemp = async () => {
        appendLog('Triggering Temp Download...')
        try {
            const res = await Snow.Download.download({
                url: sampleDownloadUrl,
                fileName: 'temp_test.txt',
                isTemp: true,
                subDir: 'temp_files',
                mimeType: 'text/plain',
                openAfterDownload: false
            })
            appendLog(`Temp download response: ${JSON.stringify(res)}`)
        } catch (e: any) {
            appendLog(`Temp download threw error: ${e.message}`)
        }
    }

    const handleDownloadTempAndOpen = async () => {
        appendLog('Triggering Temp Download and Open...')
        try {
            const res = await Snow.Download.download({
                url: sampleDownloadUrl,
                fileName: 'temp_test.txt',
                isTemp: true,
                subDir: 'temp_files',
                mimeType: 'text/plain',
                openAfterDownload: true
            })
            appendLog(`Temp download & open response: ${JSON.stringify(res)}`)
        } catch (e: any) {
            appendLog(`Temp download & open threw error: ${e.message}`)
        }
    }

    return (
        <>
            <Snow.Label>Native Component: Download ({downloadProgress}%)</Snow.Label>
            <Snow.Grid>
                <Snow.TextButton title="Download Perm" onPress={handleDownloadPerm} />
                <Snow.TextButton title="Download Perm and Open" onPress={handleDownloadPermAndOpen} />
                <Snow.TextButton title="Download Temp" onPress={handleDownloadTemp} />
                <Snow.TextButton title="Download Temp and Open" onPress={handleDownloadTempAndOpen} />
            </Snow.Grid>
            <Snow.Text style={{ fontWeight: 'bold' }}>Native Logs:</Snow.Text>
            {logs.map((log, index) => (
                <Snow.Text key={index} style={{ fontSize: 11 }}>{log}</Snow.Text>
            ))}
        </>
    )
}