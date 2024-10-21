import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { websocketstate, callerid,WebRtcState } from '../../recoil/atom';
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

  // Consider using a public STUN server list (e.g., from Xirsys or Coturn)
  const configuration = {
    iceServers: [
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }, 
   ],
  };

  const toast = useToast();

  // Function to initiate the connection
  async function connection() {
    if (Caller && websocket && peerConnectionRef.current) {

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      websocket.send(JSON.stringify({ type: "offer", offer: offer, userId: Caller }));


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

      console.log("Setting remote description:", data.offer);

      if(peerConnectionRef){await peerConnectionRef.current?.setRemoteDescription(data.offer);
      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);
      websocket?.send(JSON.stringify({ type: "answer", answer: answer, userId: data.userId }));

    }
  }

  function answerCall(data:any) {

    if(peerConnectionRef && websocket){
      peerConnectionRef.current?.setRemoteDescription(data.answer);
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
          console.log("Incoming call from:", data.userId);

            await acceptCall(data);

        }

        // Handle incoming answer
        if (data.type === "answer") {
          console.log("Call accepted:", data);
          answerCall(data);
        }

        // Handle incoming ICE candidates
        if (data.type === "ICEcandidate") {
          await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
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

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = handleICECandidateEvent;
    peerConnection.ontrack = handleTrackEvent;

    return peerConnection;
  }

  const handleICECandidateEvent  = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      websocket?.send(JSON.stringify({ type: "ICEcandidate", candidate: event.candidate, userId: Caller }));
    }
  }

  const handleTrackEvent = (event: RTCTrackEvent) => {
    if (videoRef.current) {
      videoRef.current.srcObject = event.streams[0];
    }
  }

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

        peerConnectionRef.current = createPeerConnection();
        mediaStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current?.addTrack(track, mediaStreamRef.current!);
        })
        


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