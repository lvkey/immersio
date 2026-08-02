import { useState } from 'react';
import { ACTIVITY_TYPES } from '../lib/activityTypes';
import { todayISODate } from '../lib/format';

export function LogForm({ languages, onSubmit }) {
  const activeLanguages = languages.filter((l) => !l.is_dormant);
  const [languageId, setLanguageId] = useState('');
  const [activity, setActivity] = useState(ACTIVITY_TYPES[0].id);
  const [minutes, setMinutes] = useState('');
  const [logDate, setLogDate] = useState(todayISODate());
  const [note, setNote] = useState('');

  const selectedLanguageId = languageId || activeLanguages[0]?.id || '';

  function handleSubmit(e) {
    e.preventDefault();
    const mins = Number(minutes);
    if (!selectedLanguageId || !mins || mins <= 0) return;
    onSubmit({ languageId: selectedLanguageId, activity, minutes: Math.round(mins), logDate, note: note.trim() });
    setMinutes('');
    setNote('');
  }

  if (activeLanguages.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm text-sm text-slate-500 dark:text-white/50">
        Add an active language below before logging a session.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4"
    >
      <h2 className="font-semibold text-slate-800 dark:text-white/90">Log a session</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-medium text-slate-500 dark:text-white/50">Language</span>
          <select
            value={selectedLanguageId}
            onChange={(e) => setLanguageId(e.target.value)}
            className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {activeLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-500 dark:text-white/50">Activity</span>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {ACTIVITY_TYPES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-500 dark:text-white/50">Minutes</span>
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="30"
            className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-slate-500 dark:text-white/50">Date</span>
          <input
            type="date"
            value={logDate}
            max={todayISODate()}
            onChange={(e) => setLogDate(e.target.value)}
            className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-slate-500 dark:text-white/50">Note (optional)</span>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you study?"
          className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-slate-800 dark:text-white/90 placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <button
        type="submit"
        className="w-full sm:w-auto text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors"
      >
        Log session
      </button>
    </form>
  );
}
