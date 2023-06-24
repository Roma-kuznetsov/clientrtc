import { FC, useEffect, useRef } from "react";

export const VideoPlayer: FC<{ stream: MediaStream, muted: boolean }> = ({ stream, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream])
  return (
    <video ref={videoRef} autoPlay muted={muted} width={600} height={400} />
  )
}