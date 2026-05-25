'use client';

interface MediaPlayerProps {
  mediaUrl: string;
  mediaType: string;
}

export default function MediaPlayer({ mediaUrl, mediaType }: MediaPlayerProps) {
  return (
    <div className="mb-3" onClick={(e) => e.stopPropagation()}>
      {mediaType === 'audio' ? (
        <audio controls src={mediaUrl} className="w-full h-8" />
      ) : (
        <video controls src={mediaUrl} className="w-full rounded-md max-h-48" />
      )}
    </div>
  );
}
