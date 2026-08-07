interface Props {
  youtubeId: string;
  label?: string;
}

export function YouTubeEmbed({ youtubeId, label }: Props) {
  return (
    <div className="video-embed">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={label || 'Video motivacional'}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
