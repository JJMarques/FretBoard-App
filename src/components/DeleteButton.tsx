"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSession } from '@/actions/sessions';

interface DeleteButtonProps {
    sessionId: string;
}

export default function DeleteButton({ sessionId }: DeleteButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if(!confirm("Tens a certeza que queres apagar esta sessão?")) return;

        setLoading(true);
        await deleteSession(sessionId);
        router.push("/feed");
    };

    return(
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm text-error border border-error rounded-md hover:bg-error-light disabled:opacity-50 transition-colors cursor-pointer"
        >
            {loading ? "A apagar..." : "Apagar sessão"}
        </button>
    )
}