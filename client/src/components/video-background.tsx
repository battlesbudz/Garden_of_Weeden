import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoBackgroundProps {
  videoSrc?: string;
  posterImage: string;
  alt: string;
  className?: string;
  showControls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function VideoBackground({
  videoSrc,
  posterImage,
  alt,
  className = '',
  showControls = false,
  autoplay = true,
  muted = true,
  loop = true,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(muted);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoSrc && videoRef.current && autoplay) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [videoSrc, autoplay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          console.error('Failed to play video');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  // If no video source or video failed to load, show image fallback
  if (!videoSrc || videoError) {
    return (
      <div className={`w-full h-full ${className}`}>
        <img 
          src={posterImage} 
          alt={alt} 
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoplay}
        muted={isMuted}
        loop={loop}
        playsInline
        poster={posterImage}
        onError={handleVideoError}
        preload="auto"
        aria-label={alt}
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Fallback text for browsers that don't support video */}
        <img src={posterImage} alt={alt} className="w-full h-full object-cover" />
      </video>

      {/* Optional Video Controls */}
      {showControls && videoSrc && !videoError && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <button
            onClick={togglePlay}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-midnight-grove/80 backdrop-blur-sm border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300 hover:scale-110"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            data-testid="video-play-pause"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-green-500" />
            ) : (
              <Play className="h-5 w-5 text-green-500 ml-1" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-midnight-grove/80 backdrop-blur-sm border-2 border-green-500/50 hover:border-green-500 hover:bg-green-500/20 transition-all duration-300 hover:scale-110"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            data-testid="video-mute-unmute"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-green-500" />
            ) : (
              <Volume2 className="h-5 w-5 text-green-500" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
