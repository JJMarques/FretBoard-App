'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/actions/sessions';
import { INSTRUMENTS } from '@/constants/instruments';

export default function SessionForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [instrument, setInstrument] = useState('bass');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    durationMinutes?: string;
    notes?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await createSession(
      instrument,
      title,
      Number(durationMinutes),
      notes || null,
      null,
      null,
    );

    if (result?.errors) {
      setErrors(result.errors);
      setLoading(false);
      return;
    }

    if (result?.sessionId) {
      router.push(`/sessions/${result.sessionId}`);
    }
  }

  return (
    <div className="p-6 bg-surface rounded-lg border border-border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-text-primary text-sm font-medium">Title</label>
          <input
            type="text"
            placeholder="What did you work on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md outline-none focus:border-accent text-text-primary placeholder:text-text-secondary"
          />
          {errors.title && <p className="text-xs text-error">{errors.title}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-text-primary text-sm font-medium">Instrument</label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md outline-none focus:border-accent text-text-primary"
          >
            {INSTRUMENTS.map((inst) => (
              <option key={inst} value={inst}>
                {inst.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-text-primary text-sm font-medium">Duration (minutes)</label>
          <input
            type="number"
            min={1}
            max={480}
            placeholder="ex: 30"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md outline-none focus:border-accent text-text-primary placeholder:text-text-secondary"
          />
          {errors.durationMinutes && <p className="text-xs text-error">{errors.durationMinutes}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-text-primary text-sm font-medium">
            Notes <span className="text-text-secondary font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="What did you practice?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md outline-none focus:border-accent text-text-primary placeholder:text-text-secondary resize-none"
          />
          {errors.notes && <p className="text-xs text-error">{errors.notes}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-accent text-background text-sm font-medium rounded-md disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save session'}
        </button>
      </form>
    </div>
  );
}