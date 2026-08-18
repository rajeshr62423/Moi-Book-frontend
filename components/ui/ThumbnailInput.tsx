"use client";

import { useId, useRef, useState } from "react";
import { CloseIcon, ImageIcon, UploadIcon } from "@/components/icons";
import { uploadImageApi } from "@/services/uploadService";
import { extractApiErrorMessage } from "@/services/apiTypes";

export interface ThumbnailInputProps {
  value: string; // uploaded image URL, "" when unset
  onChange: (url: string) => void;
  label?: string;
  maxSizeBytes?: number;
  disabled?: boolean;
  /** Lets the parent form block submission while an upload is still in flight. */
  onUploadingChange?: (uploading: boolean) => void;
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024; // matches the backend's POST /uploads limit

/** File picker + preview for an image field (event thumbnails, profile photos, ...), uploaded via POST /uploads. */
export default function ThumbnailInput({
  value,
  onChange,
  label = "Thumbnail",
  maxSizeBytes = DEFAULT_MAX_BYTES,
  disabled,
  onUploadingChange,
}: ThumbnailInputProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearLocalPreview() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setLocalPreview(null);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`Image must be under ${Math.round(maxSizeBytes / (1024 * 1024))}MB`);
      return;
    }

    clearLocalPreview();
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setLocalPreview(objectUrl);
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const response = await uploadImageApi(file);
      onChange(response.data.url);
    } catch (err) {
      setError(extractApiErrorMessage(err, "Couldn't upload that image"));
      clearLocalPreview();
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
    }
  }

  function handleRemove() {
    setError(null);
    clearLocalPreview();
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const displaySrc = localPreview ?? value;

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <div className={`thumb-upload${displaySrc ? " has-image" : ""}`}>
        {displaySrc ? (
          <div
            className="thumb-upload-preview-wrap"
            role="button"
            tabIndex={0}
            aria-label="Change thumbnail"
            title="Click to change"
            onClick={() => !uploading && fileRef.current?.click()}
            onKeyDown={(e) => !uploading && (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
          >
            <img src={displaySrc} alt="" className="thumb-upload-preview" />
            {uploading && <div className="thumb-upload-overlay">Uploading…</div>}
            <button
              type="button"
              className="thumb-upload-remove"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled || uploading}
              aria-label="Remove thumbnail"
              title="Remove thumbnail"
            >
              <CloseIcon />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="thumb-upload-empty"
            onClick={() => fileRef.current?.click()}
            disabled={disabled || uploading}
          >
            <ImageIcon />
            <span>
              <UploadIcon /> {uploading ? "Uploading…" : "Upload photo"}
            </span>
          </button>
        )}
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="thumb-upload-input"
          disabled={disabled || uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <span className="field-hint" style={{ color: "var(--danger, #C97A6A)" }}>{error}</span>}
    </div>
  );
}
