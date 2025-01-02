import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import styled from 'styled-components';
import TizenVideoPlayer from './TizenVideoPlayer';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  startTime?: number;
}

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  background: #000;
`;

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = true,
  controls = true,
  onError,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  startTime = 0,
}) => {
  const isTizenTV = !!window.webapis?.avplay;

  if (isTizenTV) {
    return (
      <TizenVideoPlayer
        src={src}
        autoPlay={autoPlay}
        onError={(error) => onError?.(new Error(error))}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
    );
  }

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHLS = src.endsWith('.m3u8');
    let hls: Hls | null = null;

    const initializePlayer = () => {
      if (isHLS) {
        if (Hls.isSupported()) {
          hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hls.attachMedia(video);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls?.loadSource(src);
          });

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (startTime > 0) {
              video.currentTime = startTime;
            }
            if (autoPlay) {
              video.play().catch(console.error);
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls?.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls?.recoverMediaError();
                  break;
                default:
                  destroyPlayer();
                  onError?.(new Error('Fatal HLS error'));
                  break;
              }
            }
          });

          hlsRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        }
      } else {
        video.src = src;
      }
    };

    const destroyPlayer = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };

    initializePlayer();
    return destroyPlayer;
  }, [src, autoPlay, onError, startTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onTimeUpdate]);

  return (
    <VideoContainer>
      <StyledVideo
        ref={videoRef}
        autoPlay={autoPlay}
        controls={controls}
        onError={(e) => onError?.(new Error('Video playback error'))}
        onPlay={() => onPlay?.()}
        onPause={() => onPause?.()}
        onEnded={() => onEnded?.()}
      />
    </VideoContainer>
  );
};

export default VideoPlayer;
