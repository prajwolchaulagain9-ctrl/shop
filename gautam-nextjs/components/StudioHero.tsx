"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { imageUrl, mediaUrl } from "@/lib/media/images";
export default function StudioHero() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !paused &&
          !reduced.matches &&
          !document.hidden
        ) {
          setReady(true);
          void video.play().catch(() => {});
        } else video.pause();
      },
      { threshold: 0.12 },
    );
    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused]);
  return (
    <div className="studio-hero">
      <Image
        src={imageUrl("/media/studio/heritage-mules.webp")}
        alt="A 3D study of red velvet mules with raised gold floral embroidery"
        fill
        priority
        sizes="(max-width: 800px) 100vw, 55vw"
        className="studio-poster"
      />
      <video
        ref={ref}
        src={ready ? mediaUrl("/media/studio/heritage-mules.mp4") : undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label="Animated 3D study of embroidered red mules"
      />
      <div className="studio-label">
        <span>THE HERITAGE EDIT</span>
        <span>01 / EMBROIDERED FOOTWEAR</span>
      </div>
      <button
        className="studio-toggle icon-button"
        aria-label={
          paused ? "Play product animation" : "Pause product animation"
        }
        onClick={() => {
          setPaused(!paused);
          if (paused) {
            setReady(true);
            void ref.current?.play();
          } else ref.current?.pause();
        }}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
}
