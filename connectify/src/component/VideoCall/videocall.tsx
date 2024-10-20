import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { websocketstate, callerid } from '../../recoil/atom';
import { useRecoilState, useRecoilValue } from 'recoil';

const Videocall: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const [Caller, setCaller] = useRecoilState(callerid);
    const websocket = useRecoilValue(websocketstate);

    const [flag, setFlag] = useState(false);
    const [someoneCalling, setSomeoneCalling] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
        ]
    };

    const toast = useToast();

    // Function to initiate the connection
    async function connection() {
        if (Caller && websocket) {

            peerConnectionRef.current = new RTCPeerConnection(configuration);

            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer); // Set local description first

            websocket.send(JSON.stringify({ type: "offer", offer: offer, userId: Caller }));

            // ICE candidate handling
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    websocket.send(JSON.stringify({ type: "ice", candidate: event.candidate, userId: Caller }));
                }
            };

            peerConnectionRef.current.ontrack = (event) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                }
            };
        }
    }

    // Function to accept the incoming call
    async function acceptCall(data: any) {  
        console.log("Accepting call:", data);
        setCallAccepted(false);
        if (websocket) {
            if(!peerConnectionRef.current)peerConnectionRef.current = new RTCPeerConnection(configuration);

            await peerConnectionRef.current.setRemoteDescription(data.offer);
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            websocket.send(JSON.stringify({ type: "answer", answer: answer, userId: data.userId }));

            // ICE candidate handling for the answerer
            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    websocket.send(JSON.stringify({ type: "ICEcandidate", candidate: event.candidate, userId: data.userId }));
                }
            };

            // Set up the media tracks
            mediaStreamRef.current?.getTracks().forEach(track => {
                peerConnectionRef.current?.addTrack(track, mediaStreamRef.current!);
            });
        }
    }

    function answerCall(data:any) {

        if(peerConnectionRef.current && websocket){
                peerConnectionRef.current.setRemoteDescription(data.answer);

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    websocket.send(JSON.stringify({ type: "ICEcandidate", candidate: event.candidate, userId: data.userId }));
                }
            };

            mediaStreamRef.current?.getTracks().forEach(track => {
                peerConnectionRef.current?.addTrack(track, mediaStreamRef.current!);
            });
        }
    }

    useEffect(() => {
        connection();
    }, [Caller, websocket]);

    useEffect(() => {
        if (websocket) {
            websocket.onmessage = async (event) => {
                const data = JSON.parse(event.data);

                // Handle incoming offer
                if (data.type === "offer") {
                    setSomeoneCalling(true);
                    console.log("Incoming call from:", data.userId);

                    const timer = setTimeout(() => {
                        setSomeoneCalling(false);
                        websocket.send(JSON.stringify({ type: "call-rejected", userId: data.userId }));
                    }, 30000);

                    // Accept the call only when the user clicks accept
                    if (callAccepted) {
                        clearTimeout(timer); // Clear the timer if the call is accepted
                        await acceptCall(data);
                    }
                }

                // Handle incoming answer
                if (data.type === "answer") {
                    console.log("Call accepted:", data);
                    answerCall(data);
                }

                // Handle incoming ICE candidates
                if (data.type === "ice") {
                    await peerConnectionRef.current?.addIceCandidate(data.candidate);
                }

                // Handle call rejection
                if (data.type === "call-rejected") {
                    setFlag(false);
                    toast({
                        title: 'Call rejected',
                        description: 'The user rejected the call',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            };
        }
    }, [websocket, callAccepted]);

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    },
                    audio: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStreamRef.current;
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to access camera',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        getUserMedia();

        // Cleanup function to stop the video stream
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="w-full h-screen bg-slate-300 flex justify-center items-center p-10 relative">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="object-cover rounded-lg"
                style={{ width: '1280px', height: '720px' }} // Adjust these values as needed
            />
            {flag && (
                <div className="absolute inset-0 flex justify-center items-center opacity-100 backdrop-blur-lg">
                    <h1 className="text-white text-3xl">Calling...</h1>
                </div>
            )}
            {someoneCalling && (
                <div className="absolute bottom-20 flex gap-4">
                    <button onClick={() => {
                        setCallAccepted(true); // User accepts the call
                        setSomeoneCalling(false); // Hide calling UI
                    }} className="bg-green-500 text-white p-3 rounded">
                        Accept
                    </button>
                    <button onClick={() => {
                        setCallAccepted(false); // User rejects the call
                        websocket?.send(JSON.stringify({ type: "call-rejected", userId: Caller }));
                        setSomeoneCalling(false); // Hide calling UI
                    }} className="bg-red-500 text-white p-3 rounded">
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default Videocall;
