'use client';

import { useState } from 'react';
import { updateProfile } from '@/actions/profile';
import { Edit } from 'lucide-react';

interface EditableProfileProps {
  name: string;
  bio: string | null;
  username: string;
}

export default function EditableProfile({ name, bio, username }: EditableProfileProps) {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [bioValue, setBioValue] = useState(bio ?? '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    await updateProfile(nameValue, bioValue);
    setEditing(false);
    setLoading(false);
  }

  if (!editing) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-text-primary text-xl font-semibold">{nameValue}</h1>
          <button
            onClick={() => setEditing(true)}
            className="bg-background text-text-secondary p-2 border border-border rounded-xl text-xs hover:text-text-primary transition-colors cursor-pointer"
          >
            <Edit size={15} />
          </button>
        </div>
        {bioValue && <p className="text-text-secondary text-sm mt-1">{bioValue}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        className="px-3 py-1.5 text-sm bg-background border border-border rounded-md outline-none focus:border-accent text-text-primary"
      />
      <textarea
        value={bioValue}
        onChange={(e) => setBioValue(e.target.value)}
        placeholder="Add a bio..."
        rows={2}
        className="px-3 py-1.5 text-sm bg-background border border-border rounded-md outline-none focus:border-accent text-text-primary placeholder:text-text-secondary resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-3 py-1.5 bg-accent text-background text-xs font-medium rounded-md disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-3 py-1.5 border border-border text-text-secondary text-xs rounded-md cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
