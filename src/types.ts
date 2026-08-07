export interface Alarm {
  id: string;
  time: string; // "HH:MM"
  label: string;
  days: boolean[]; // 7 entries, Sunday=0 .. Saturday=6
  enabled: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

export interface GratitudeEntry {
  id: string;
  text: string;
  date: string; // ISO string
}
