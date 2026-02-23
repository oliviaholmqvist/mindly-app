import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Återanvändbar audio/video-spelare baserad på video.js
export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
      });
    }

    // uppdatera ljudkälla när src ändras
    if (playerRef.current) {
      playerRef.current.src({
        src,
        type: "audio/mpeg",
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <audio ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
}