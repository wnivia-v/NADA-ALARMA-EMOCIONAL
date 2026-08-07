import { useEffect } from 'react';

interface Props {
  url: string;
  videoId: string;
  label?: string;
}

export function TikTokEmbed({ url, videoId, label }: Props) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [videoId]);

  return (
    <div className="video-embed tiktok-embed-wrapper">
      <blockquote className="tiktok-embed" cite={url} data-video-id={videoId}>
        <section>
          <a href={url} target="_blank" rel="noreferrer">
            {label || 'Ver en TikTok'}
          </a>
        </section>
      </blockquote>
    </div>
  );
}
