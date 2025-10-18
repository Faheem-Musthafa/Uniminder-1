"use client";

import { useState } from "react";
import { Upload, X, FileImage, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  maxSize?: number; // in MB
  file?: File;
  previewUrl?: string;
  required?: boolean;
  error?: string;
  onFileSelect: (file: File | undefined) => void;
  onUpload?: (file: File) => Promise<{ url: string }>;
}

export default function FileUploadInput({
  label,
  description,
  accept = "image/*",
  maxSize = 5,
  file,
  previewUrl,
  required = false,
  error,
  onFileSelect,
  onUpload,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string>("");

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (accept && !accept.includes(file.type.split("/")[0]) && !accept.includes(file.type)) {
      return `File type not supported. Accepted: ${accept}`;
    }

    return null;
  };

  const handleFileChange = async (selectedFile: File | undefined) => {
    if (!selectedFile) {
      setPreview(null);
      onFileSelect(undefined);
      return;
    }

    // Validate file
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setUploadError(validationError);
      setUploadStatus("error");
      return;
    }

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }

    onFileSelect(selectedFile);
    setUploadError("");
    setUploadStatus("idle");

    // Auto-upload if onUpload is provided
    if (onUpload) {
      try {
        setUploadStatus("uploading");
        await onUpload(selectedFile);
        setUploadStatus("success");
      } catch (err) {
        setUploadStatus("error");
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = () => {
    setPreview(null);
    setUploadStatus("idle");
    setUploadError("");
    handleFileChange(undefined);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary hover:bg-accent"
            }
            ${error ? "border-destructive" : ""}
          `}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, "-")}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, "-")}`}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">
                Drop your file here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {description || `Max ${maxSize}MB • ${accept}`}
              </p>
            </div>
          </label>
        </div>
      )}

      {file && (
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-start gap-3">
            {preview ? (
              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                <FileImage className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>

              {uploadStatus === "uploading" && (
                <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Uploading...</span>
                </div>
              )}

              {uploadStatus === "success" && (
                <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Uploaded successfully</span>
                </div>
              )}

              {uploadStatus === "error" && (
                <p className="text-xs text-destructive mt-2">{uploadError}</p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && !uploadError && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {description && !file && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
