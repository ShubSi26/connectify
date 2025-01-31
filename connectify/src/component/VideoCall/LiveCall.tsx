import { useRef, useEffect, useState } from "react";
import { IconVideo } from '@tabler/icons-react';
import { Spinner } from '@chakra-ui/react'

export default function LiveCall({
  peerConnectionRef,
  mediaStream,
  endcallfunction
}: {
  peerConnectionRef: RTCPeerConnection | null;
  mediaStream: MediaStream | null;
  endcallfunction: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [connecting,setConnecting] = useState<boolean>(true);

  useEffect(() => {
    
    if (video.current && peerConnectionRef) {
      peerConnectionRef.getReceivers().forEach((receiver) => {
        if (receiver.track) {
          const stream = new MediaStream([receiver.track]);
          video.current!.srcObject = stream;
        }
      });

      peerConnectionRef.ontrack = (event) => {
        video.current!.srcObject = event.streams[0];
      };

      peerConnectionRef.onconnectionstatechange = () => {
        if (peerConnectionRef.connectionState === "connected") {
          setConnecting(false);
        }
      }
    }

    if (mediaStream && video2.current) {
      video2.current.srcObject = mediaStream;
      video2.current!.muted = true;
    }
  }, [peerConnectionRef]);

  // Event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
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
    position
    handleMouseDown
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
    <div className="sm:p-2 bg-slate-800 h-full overflow-hidden ">
      <div className="bg-slate-700 flex sm:justify-center sm:items-center h-full sm:p-2 overflow-auto sm:rounded-xl ">
        <video
          ref={video}
          autoPlay
          playsInline
          className="sm:rounded-2xl h-screen sm:h-screen"
        />
        <video
          ref={video2}
          autoPlay
          playsInline
          className="rounded-2xl sm:w-96 w-28 fixed z-10 bottom-0 right-0"
          
        />
        {connecting && <div className="absolute z-5 top-0 left-0 flex justify-center items-center flex-col h-screen w-screen">
          <Spinner
            thickness="4px"
            speed="0.5s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            className="w-fit"
          />
          <div className="mt-4">Connecting...</div>
        </div>}
        <div
          onClick={endcallfunction}
          className="bg-red-500 rounded-full cursor-pointer fixed z-20 bottom-4 left-1/2 transform -translate-x-1/2 p-4 hover:bg-red-400 hover:scale-110 transition-transform duration-300"
        >
          <IconVideo className="w-10 h-10 sm:w-20 sm:h-20 rounded-full" color="black" stroke={2} />
        </div>
        
      </div>
    </div>
  );
}
