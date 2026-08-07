import type { VideoClip } from '../types';
import { YouTubeEmbed } from './YouTubeEmbed';
import { TikTokEmbed } from './TikTokEmbed';

export function MediaClipEmbed({ clip }: { clip: VideoClip }) {
  if (clip.provider === 'tiktok') {
    return <TikTokEmbed url={clip.url} videoId={clip.externalId} label={clip.label} />;
  }
  return <YouTubeEmbed youtubeId={clip.externalId} label={clip.label} />;
}
