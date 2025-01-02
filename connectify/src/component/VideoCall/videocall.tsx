import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { websocketstate, callerid } from '../../recoil/atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Calling from './Calling';
import LiveCall from './LiveCall';
import { useLocation, useNavigate } from 'react-router-dom';

const Videocall: React.FC = () => {

  const configuration = {
    iceServers: [
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }, 
   ],
  };
  const [peerConnection,setperrConnection] = useState<RTCPeerConnection | null>(null);

  const [flag,setFlag] = useState(false);

  function iceconnectionstate(){
    if(peerConnection === null) return;
    const state = peerConnection?.iceConnectionState;

    if(state === "disconnected" || state === "failed" || state === "closed"){
      toast({
        title: 'Call ended',
        description: 'The call has ended',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      navigate("/dashboard");
    }
  }

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(configuration);

    return peerConnection;
  }

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const intervalRef = useRef<number | null>(null);
  const location = useLocation();
  const dataa = location.state;
  const websocket = useRecoilValue(websocketstate);

  const [state,setState] = useState(0);

  // Consider using a public STUN server list (e.g., from Xirsys or Coturn)

  const toast = useToast();
  const navigate = useNavigate();

  async function connection() {

    if (dataa.type === "call" && websocket && peerConnection) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      websocket.send(JSON.stringify({ type: "offer", offer: offer, userId: dataa.id }));

      setState(1);
      intervalRef.current = setTimeout(() => {
        toast({
          title: 'Call ended',
          description: 'The user did not answer the call',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = null;
        navigate("/dashboard");
      },30000);
    }
    if(dataa.type === "offer" && peerConnection){
      await acceptCall(dataa,peerConnection);
      setState(1);
    }
  }

  useEffect(() => {
    if(peerConnection && mediaStream){
      mediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, mediaStream);
      });
      connection();
    }
  }, [peerConnection]);

  
  async function acceptCall(data: any,peerConnection1:RTCPeerConnection | null) {
    console.log("Accepting call:", data);

      console.log("Setting remote description:", data.offer);

      console.log("Setting remote peerConnection:", peerConnection1);

      if(peerConnection1){
        await peerConnection1.setRemoteDescription(data.offer);
        const answer = await peerConnection1.createAnswer();
        await peerConnection1.setLocalDescription(answer);
        websocket?.send(JSON.stringify({ type: "answer", answer: answer, userId: data.userId }));
        
    }
  }

  async function answerCall(data:any,peerConnection:RTCPeerConnection | null){ 

    if( peerConnection ){
      await peerConnection.setRemoteDescription(data.answer);
    }
  }


  useEffect(() => {
    const getUserMedia = async () => {
      try {
        setMediaStream( await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        }))
        
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

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(()=>{
    if(mediaStream){
       setperrConnection(createPeerConnection());
    }
  },[mediaStream]);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        // Handle incoming answer
        if (data.type === "answer") {
          intervalRef.current && clearInterval(intervalRef.current);
          console.log("Call accepted:", data);
          await answerCall(data,peerConnection);
          setState(1);
        }

        // Handle incoming ICE candidates
        if (data.type === "ICEcandidate") {
          await peerConnection?.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        // Handle call rejection
        if (data.type === "call-rejected") {
          intervalRef.current && clearInterval(intervalRef.current);
          peerConnection?.close();
          setperrConnection(null);
          navigate("/dashboard");
          toast({
            title: 'Call rejected',
            description: data.message || 'The user rejected the call',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };
    }
  }, [websocket,peerConnection]);


  useEffect(() => {
    if(peerConnection){
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          websocket?.send(JSON.stringify({ type: "ICEcandidate", candidate: event.candidate, userId: dataa.id || dataa.userId }));
        }
      };
      peerConnection.oniceconnectionstatechange = iceconnectionstate;
    }

  }, [peerConnection]);


  return (
    <div>
      {state === 0 && <Calling name={dataa.id || "e"} mediaStream={mediaStream}/>}
      {state === 1 && <LiveCall peerConnectionRef={peerConnection} mediaStream={mediaStream}/>}
    </div>
  )
};

export default Videocall; 