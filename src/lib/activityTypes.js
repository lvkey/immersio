import { Headphones, BookOpen, Mic, PenLine, MessageSquare, Layers, GraduationCap, MoreHorizontal } from 'lucide-react';

export const ACTIVITY_TYPES = [
  { id: 'listening', label: 'Listening', icon: Headphones },
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'speaking', label: 'Speaking', icon: Mic },
  { id: 'writing', label: 'Writing', icon: PenLine },
  { id: 'output', label: 'Output / conversation', icon: MessageSquare },
  { id: 'srs', label: 'SRS / Anki', icon: Layers },
  { id: 'grammar', label: 'Grammar & study', icon: GraduationCap },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
];

export const ACTIVITY_BY_ID = Object.fromEntries(ACTIVITY_TYPES.map((a) => [a.id, a]));
