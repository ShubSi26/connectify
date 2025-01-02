import { useRef, useEffect } from "react";

export default function LiveCall({
  peerConnectionRef,
  mediaStream,
}: {
  peerConnectionRef: RTCPeerConnection | null;
  mediaStream: MediaStream | null;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);

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
  }, [peerConnectionRef]);

  return (
    <div className="flex sm:justify-center sm:items-center h-screen overflow-auto">
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
        className="rounded-2xl w-96 fixed z-10 bottom-0 right-0"
        
      />
    </div>
  );
}
