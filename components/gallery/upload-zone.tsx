'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, Image, Video } from 'lucide-react'
import { formatBytes } from '@/lib/utils'

interface UploadZoneProps {
  galleryId: string
  onUploadComplete?: () => void
}

export function UploadZone({ galleryId, onUploadComplete }: UploadZoneProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('gallery_id', galleryId)

        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      setFiles([])
      onUploadComplete?.()
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-slate-900 bg-slate-50' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">Drag & drop files here</p>
            <p className="text-sm text-slate-600 mb-4">or click to browse</p>
            <p className="text-xs text-slate-500">
              Supports: JPG, PNG, GIF, WebP, MP4, MOV (max 50MB)
            </p>
          </>
        )}
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Files to upload ({files.length})</h3>
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? `Uploading... ${progress}%` : 'Upload All'}
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {file.type.startsWith('video/') ? (
                      <Video className="h-5 w-5 text-slate-600" />
                    ) : (
                      <Image className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-slate-600">{formatBytes(file.size)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
