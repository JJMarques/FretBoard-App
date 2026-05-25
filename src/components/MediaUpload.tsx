'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface MediaUploadProps {
  onUploadComplete: (url: string, type: 'audio' | 'video') => void;
  onClear: () => void;
  currentUrl: string | null;
}

export default function MediaUpload({ onUploadComplete, onClear, currentUrl }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
    });

    const { signedUrl, publicUrl } = await res.json();

    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    const type = file.type.startsWith('audio') ? 'audio' : 'video';
    onUploadComplete(publicUrl, type);
    setIsUploading(false);
  }

  if (currentUrl) {
    return (
      <div className="flex items-center gap-2 p-3 bg-surface border border-border rounded-md">
        <span className="text-text-secondary text-xs flex-1">Media uploaded ✓</span>
        <button
          onClick={onClear}
          className="text-text-secondary hover:text-error transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <label className="flex items-center gap-2 p-3 bg-surface border border-border rounded-md cursor-pointer hover:border-accent transition-colors">
      <Upload size={14} className="text-text-secondary" />
      <span className="text-text-secondary text-xs">
        {isUploading ? `Uploading...` : 'Add audio or video (optional)'}
      </span>
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </label>
  );
}
