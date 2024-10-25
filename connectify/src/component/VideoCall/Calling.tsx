import { Progress } from "@nextui-org/react";
import { video } from "framer-motion/client";
import { useEffect, useRef } from "react";

export default function Calling({name,mediaStream}:{name:String,mediaStream:MediaStream | null}) {

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream,video]);
    
    return(
        <div className="w-full h-full flex justify-center items-center flex-col">
            <div className=" p-5 rounded-lg ">
                <h1 className="text-2xl">Calling {name}</h1>
            </div>
            <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md en mt-5"
            />
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-lg mt-10 border-2 border-gray-300"
                style={{ width: '100', height: '80px' }}
                />
                
        </div>
    )
}