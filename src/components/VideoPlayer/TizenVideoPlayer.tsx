import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import VideoControls from './VideoControls';

interface TizenVideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  initialVolume?: number;
  initialQuality?: string;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: black;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TizenVideoPlayer: React.FC<TizenVideoPlayerProps> = ({
  src,
  autoPlay = true,
  initialVolume = 1,
  initialQuality = 'auto',
  onError,
  onPlay,
  onPause,
  onEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [quality, setQuality] = useState(initialQuality);
  const [showControls, setShowControls] = useState(false);
  const [qualities] = useState(['auto', '1080p', '720p', '480p', '360p']);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setPlaying(false);
      onPause?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setPlaying(false);
      onEnded?.();
    };

    const handleError = () => {
      onError?.(new Error('Video playback error'));
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onEnded, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'MediaPlayPause':
        case ' ':
          playing ? video.pause() : video.play();
          break;
        case 'MediaTrackNext':
        case 'ArrowRight':
          if (!showControls) {
            video.currentTime = Math.min(
              video.duration,
              video.currentTime + 10
            );
          }
          break;
        case 'MediaTrackPrevious':
        case 'ArrowLeft':
          if (!showControls) {
            video.currentTime = Math.max(0, video.currentTime - 10);
          }
          break;
        case 'ArrowUp':
          if (!showControls) {
            setVolume((prev) => Math.min(1, prev + 0.1));
          }
          break;
        case 'ArrowDown':
          if (!showControls) {
            setVolume((prev) => Math.max(0, prev - 0.1));
          }
          break;
        case 'Enter':
          setShowControls((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing, showControls]);

  // Update video volume when volume state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
  }, [volume]);

  // Update video quality when quality state changes
  useEffect(() => {
    // TODO: Implement quality switching logic
    console.log('Quality changed:', quality);
  }, [quality]);

  return (
    <Container>
      <Video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        onClick={() => setShowControls((prev) => !prev)}
      />

      {showControls && (
        <VideoControls
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          quality={quality}
          qualities={qualities}
          onPlay={() => videoRef.current?.play()}
          onPause={() => videoRef.current?.pause()}
          onSeek={(time) => {
            if (videoRef.current) {
              videoRef.current.currentTime = time;
            }
          }}
          onVolumeChange={setVolume}
          onQualityChange={setQuality}
          onClose={() => setShowControls(false)}
        />
      )}
    </Container>
  );
};

export default TizenVideoPlayer;
