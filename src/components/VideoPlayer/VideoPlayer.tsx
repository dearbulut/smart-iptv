import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  onError,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch((error) => {
            console.error('Error playing video:', error);
            onError?.('Failed to autoplay video');
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              onError?.('Fatal HLS error');
              break;
          }
        }
      });
    } else {
      video.src = src;
      if (autoPlay) {
        video.play().catch((error) => {
          console.error('Error playing video:', error);
          onError?.('Failed to autoplay video');
        });
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.src = '';
    };
  }, [src, autoPlay, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => onPlay?.();
    const handlePause = () => onPause?.();
    const handleEnded = () => onEnded?.();
    const handleTimeUpdate = () => onTimeUpdate?.(video.currentTime);
    const handleError = () => onError?.('Video playback error');

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onEnded, onTimeUpdate, onError]);

  return (
    <Container>
      <Video ref={videoRef} playsInline />
    </Container>
  );
};

export default VideoPlayer;
