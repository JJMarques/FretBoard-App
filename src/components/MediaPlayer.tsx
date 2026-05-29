'use client';

interface MediaPlayerProps {
  mediaUrl: string;
  mediaType: string;
}

export default function MediaPlayer({ mediaUrl, mediaType }: MediaPlayerProps) {
  return (
    <div className="mb-8" onClick={(e) => e.stopPropagation()}>
      {mediaType === 'audio' ? (
        <div className="p-3 bg-surface border border-border rounded-lg">
          <audio
            controls
            src={mediaUrl}
            className="w-full"
            style={{ accentColor: 'var(--color-accent)' }}
          />
        </div>
      ) : (
        <video
          controls
          src={mediaUrl}
          className="w-full rounded-lg"
          style={{ maxHeight: '400px', objectFit: 'contain', background: '#000' }}
        />
      )}
    </div>
  );
}
