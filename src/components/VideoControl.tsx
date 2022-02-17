import { FC, useEffect, useState, useRef } from 'react';

import * as handPose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

import { Direction } from '../types';

type VideoControlProps = {
  onDirectionChange: (direction: Direction) => void;
  WIDTH: number;
  HEIGHT: number;
  isVideoEnabled: boolean;
};

export const VideoControl: FC<VideoControlProps> = ({
  onDirectionChange,
  WIDTH,
  HEIGHT,
  isVideoEnabled,
}): JSX.Element => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [model, setModel] = useState<handPose.HandPose | null>(null);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const onNormalizeCoords = (x: number, y: number): Direction | undefined => {
      if (Math.abs(WIDTH / 2 - Math.abs(x)) > WIDTH / 4) {
        return Math.abs(x) < WIDTH / 2 ? 'RIGHT' : 'LEFT';
      } else if (Math.abs(HEIGHT / 2 - y) > HEIGHT / 4) {
        return y < HEIGHT / 2 ? 'UP' : 'DOWN';
      }
    };

    const processPredictions = () => {
      (async () => {
        if (!model || !video || !stream) return;

        const predictions = await model.estimateHands(video, true);

        if (predictions.length && predictions[0].handInViewConfidence > 0.999) {
          const [x, y] = predictions[0].annotations.middleFinger[2];
          const newDirection = onNormalizeCoords(x, y);

          if (newDirection) {
            onDirectionChange(newDirection);
          }
        }
      })();
    };

    intervalRef.current = window.setInterval(processPredictions, 80);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [model, video, stream, onDirectionChange, WIDTH, HEIGHT]);

  // get stream
  useEffect(() => {
    if (!isVideoEnabled) return;

    const getStream = async () => {
      const constraints = { video: { width: WIDTH, height: HEIGHT } };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
      } catch (error) {
        console.error(error);
      }
    };

    getStream();

    return () => {
      setStream((prev) => {
        prev?.getTracks().forEach((track) => track.stop());
        return null;
      });
    };
  }, [isVideoEnabled, WIDTH, HEIGHT]);

  // start video & load model
  useEffect(() => {
    if (!stream || !video) return;

    video.srcObject = stream;

    const loadModel = async () => {
      const model = await handPose.load();
      setModel(model);
    };

    loadModel();

    return () => {
      video.srcObject = null;
    };
  }, [stream, video]);

  return (
    <div className='video-wrapper' style={{ textAlign: 'center', padding: 10 }}>
      {stream && <video ref={setVideo} autoPlay muted></video>}
    </div>
  );
};
