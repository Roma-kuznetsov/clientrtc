import { useEffect, useRef } from "react";

export const VideoPlayer: React.FC<{ stream?: MediaStream, myVideo?: boolean }> = ({ stream, myVideo }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);
    return (
        <video style={{ width: "100%" }} ref={videoRef} autoPlay muted={myVideo} />
    );
};
