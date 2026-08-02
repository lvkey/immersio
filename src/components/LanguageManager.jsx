import { useState } from 'react';
import { Plus, Trash2, Moon as DormantIcon, Sun as ActiveIcon } from 'lucide-react';

export function LanguageManager({ languages, onAdd, onToggleDormant, onDelete }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
      <h2 className="font-semibold text-slate-800 dark:text-white/90">Languages</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a language (e.g. Japanese)"
          className="flex-1 min-w-0 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 transition-colors shrink-0"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {languages.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-white/50">No languages yet. Add one to start logging.</p>
      ) : (
        <ul className="space-y-1.5">
          {languages.map((lang) => (
            <li
              key={lang.id}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
              <span
                className={`flex-1 min-w-0 truncate text-sm ${
                  lang.is_dormant
                    ? 'text-slate-400 dark:text-white/30 line-through'
                    : 'text-slate-700 dark:text-white/80'
                }`}
              >
                {lang.name}
              </span>
              <button
                type="button"
                onClick={() => onToggleDormant(lang.id, !lang.is_dormant)}
                title={lang.is_dormant ? 'Mark active' : 'Mark dormant'}
                className="flex items-center justify-center w-7 h-7 shrink-0 rounded-md text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                {lang.is_dormant ? <DormantIcon size={14} /> : <ActiveIcon size={14} />}
              </button>
              <button
                type="button"
                onClick={() => onDelete(lang.id)}
                title="Delete language"
                className="flex items-center justify-center w-7 h-7 shrink-0 rounded-md text-slate-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
