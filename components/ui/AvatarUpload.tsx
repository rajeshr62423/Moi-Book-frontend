"use client";

import { useRef, useState } from "react";
import { uploadImageApi } from "@/services/uploadService";
import { extractApiErrorMessage } from "@/services/apiTypes";

export interface AvatarUploadProps {
  value: string; // avatar URL, "" when unset
  onChange: (url: string) => void;
  fallback: string; // initial letter shown when no avatar is set
  label: string; // "Change Photo" button text
  onUploadingChange?: (uploading: boolean) => void;
}

const MAX_BYTES = 2 * 1024 * 1024;

/** Circular avatar picker for the settings profile tab — uploads via the shared POST /uploads (Cloudinary) endpoint. */
export default function AvatarUpload({ value, onChange, fallback, label, onUploadingChange }: AvatarUploadProps) {
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
    if (file.size > MAX_BYTES) {
      setError("Image must be under 2MB");
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

  const displaySrc = localPreview ?? value;

  return (
    <div className="profile-photo-row" style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        className="avatar-lg"
        role="button"
        tabIndex={0}
        aria-label={label}
        style={{ overflow: "hidden", cursor: uploading ? "default" : "pointer", position: "relative" }}
        onClick={() => !uploading && fileRef.current?.click()}
        onKeyDown={(e) => !uploading && (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
      >
        {displaySrc ? (
          <img src={displaySrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          fallback
        )}
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: "#fff",
              textAlign: "center",
            }}
          >
            …
          </div>
        )}
      </div>
      <div>
        <button type="button" className="btn outline small" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : label}
        </button>
        {error && (
          <div className="field-hint" style={{ color: "var(--danger, #C97A6A)" }}>
            {error}
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="thumb-upload-input"
        disabled={uploading}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
