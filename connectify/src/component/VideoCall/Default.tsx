


import { useRef, useEffect } from 'react';

export default function Default({ mediaStream }: { mediaStream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream,videoRef]);

  return (<>
  <div className='p-10 bg-slate-300'>
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="object-cover rounded-lg"
      style={{ width: '1280px', height: '720px' }} // Adjust these values as needed
    />
  </div>
  </>);
}