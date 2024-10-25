import { useRef, useEffect, useState } from "react";

export default function LiveCall({
  peerConnectionRef,
  f,
  mediaStream,
}: {
  peerConnectionRef: RTCPeerConnection | null;
  f: boolean;
  mediaStream: MediaStream | null;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (video.current && peerConnectionRef) {
      peerConnectionRef.getReceivers().forEach((receiver) => {
        if (receiver.track) {
          const stream = new MediaStream([receiver.track]);
          video.current!.srcObject = stream; // Attach existing tracks to a video element
        }
      });

      peerConnectionRef.ontrack = (event) => {
        video.current!.srcObject = event.streams[0];
      };
    }

    if (mediaStream && video2.current) {
      video2.current.srcObject = mediaStream;
    }
  }, [peerConnectionRef, f]);

  // Event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition((prev) => ({
      x: prev.x - e.movementX,
      y: prev.y - e.movementY,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-row justify-center items-center h-full">
      <video
        ref={video}
        autoPlay
        playsInline
        className="rounded-2xl h-screen"
      />
      <video
        ref={video2}
        autoPlay
        playsInline
        onMouseDown={handleMouseDown}
        className="rounded-2xl h-44 absolute"
        style={{
          bottom: position.y,
          right: position.x,
          transform: `translate(-${position.x}px, -${position.y}px)`,
        }}
      />
    </div>
  );
}
