import { useRef, useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function ReelCard({ reel, isActive, onSelect }) {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
     videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error("Video play failed:", error));
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleClick = () => {
    if (!isDragging) {
      onSelect(reel.id);
    }
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging && videoRef.current && progressBarRef.current) {
      e.stopPropagation();
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-shrink-0 w-[180px] h-[320px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2 scroll-snap-align-start select-none group"
    >
      {isActive ? (
        <div className="absolute inset-0 bg-black">
          <video
            ref={videoRef}
            src={reel.videoSrc}
            className="w-full h-full object-cover"        
            preload="auto"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black/80 border-2 border-white/20 pointer-events-auto"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </button>
          </div>

          <div className={`absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {formatTime(duration - currentTime)}
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={togglePlayPause}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 border border-white/30"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white fill-white" />
                ) : (
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 border border-white/30"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>

              <div className="flex-1 text-xs text-white/80 font-medium text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
              className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer group/progress"
            >
              <div
                className="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <img
            src={reel.poster}
            alt={reel.title || 'Reel'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white border-2 border-white/50">
              <Play className="w-7 h-7 text-gray-800 fill-gray-800 ml-1" />
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-300 group-hover:bg-black/80">
              {reel.title}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
