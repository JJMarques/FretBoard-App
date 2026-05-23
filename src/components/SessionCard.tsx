import Link from "next/link";
import Image from "next/image";

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    instrument: string;
    durationMinutes: number;
    notes: string | null;
    mediaUrl: string | null;
    mediaType: string | null;
    createdAt: Date;
    user: {
      name: string;
      username: string;
      avatarUrl: string | null;
    };
  };
};

export default function SessionCard({ session }: SessionCardProps) {
    return(
        <Link href={`/sessions/${session.id}`}>
            <div className="p-4 bg-surface rounded-lg border border-border hover:border-accent transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary text-sm font-medium">
                        {session.title}
                    </span>
                    <span className="text-text-secondary text-xs">
                        {session.durationMinutes} min
                    </span>
                </div>
                <span className="text-text-secondary text-xs capitalize mb-2 block">
                    {session.instrument.replace(/_/g, ' ')}
                </span>
                {session.notes && (
                    <p className="text-text-secondary text-xs line-clamp-2 mb-3">
                        {session.notes}
                    </p>
                )}
                {session.mediaUrl && (
                    <div className="mb-3">
                        {session.mediaType === 'audio' ? (
                            <audio controls src={session.mediaUrl} className="w-full h-8" />
                        ) : (
                            <video controls src={session.mediaUrl} className="w-full rounded-md max-h-48" />
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                    {session.user.avatarUrl && (
                        <Image 
                            src={session.user.avatarUrl}
                            alt={session.user.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                    )}
                    <p className="text-text-secondary text-xs">{session.user.name}</p>
                    <p className="text-text-secondary text-xs">
                        · {new Date(session.createdAt).toLocaleDateString('en-GB')}
                    </p>
                </div>
            </div>
        </Link>
    );
};