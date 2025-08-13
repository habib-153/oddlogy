"use client";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&playsinline=1&origin=${encodeURIComponent(
    origin
  )}`;

  return (
    <div className="relative w-full h-full">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute top-0 left-0 w-full h-full rounded-xl border-0"
      />
    </div>
  );
}
