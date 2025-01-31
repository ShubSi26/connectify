import { IconUserSearch,IconArrowRight,IconX,IconVideo,IconPhoneOff } from '@tabler/icons-react';
import {Input,Button} from "@nextui-org/react";
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {websocketstate,apiURL,wsURL,user} from "../../recoil/atom";
import { useRecoilState,useRecoilValue} from 'recoil';
import { useNavigate,Route,Routes } from 'react-router-dom';
import sampleimage from "../../assets/sample.png";
import Request from "../Request/Request"

export default function MainDashboard() {

    const timeout = useRef<any>(null);
    const wsurl = useRecoilValue(wsURL);
    const [webs,setWebSocket] = useRecoilState(websocketstate);
    const toast = useToast();
    const [incoming, setIncoming] = useState<any>(null);

    useEffect(()=>{
        
        let ws: WebSocket
        const connect = () => {
            ws = new WebSocket(`${wsurl}`);

            ws.onopen = () => {
                setWebSocket(ws);
                clearTimeout(timeout.current);
                toast({
                    title: 'Connected',
                    description: "Connected to server",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            };

            ws.onclose = (event) => {
                console.log(event);
                toast({
                    title: 'Disconnected',
                    description: "Disconnected from server. Attempting to reconnect...",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
                setWebSocket(null);
                clearTimeout(timeout.current);
                
            };

            ws.onerror = (error) => {
                connect();
                console.log(error);
            };

        };

    if(webs === null)connect();

    },[webs])

    const icecandidatebuffer = useRef<any[]>([]);
    useEffect(()=>{
        if(webs){
            webs.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                // Handle incoming offer
                if (data.type === "offer") {
                    setIncoming(data);
                }
                if(data.type === "ICEcandidate"){
                    icecandidatebuffer.current.push(data.candidate);
                }
                if(data.type === "call-ended"){
                    setIncoming(null);
                }
            }
        }
    },[webs])

    return(<>
        <Routes>
              <Route path='/' element={<Contactboard/>}/>
              <Route path='/request' element={<Request/>}/>
        </Routes>

        <div className="w-full">
            {incoming && <Incomingbox data={incoming} setIncoming={setIncoming} webs={webs} icecandidate={icecandidatebuffer}/>}
            {incoming === null && <Rightbox/>}
        </div>
    </>)
}

function Contactboard(){
    const [flag, setFlag] = useState(false);
    const [contact, setContact] = useState<any>(null);
    const url = useRecoilValue(apiURL);
    const emil = useRef<HTMLInputElement>(null);
    function ontype(){
        if(emil.current?.value === "")return;
        axios.post(`${url}/api/finduser`,{email:emil.current?.value},{withCredentials:true})
        .then((res)=>{
            setFlag(true);
            setContact(res.data.user);
        }).catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{},[flag])
    return(
        <div className="h-full w-full sm:w-max flex items-center flex-col p-2 bg-white">
            <div className='flex '>
                {flag === false ?<IconUserSearch className='h-8 w-8'/> : <IconX onClick={()=>setFlag(false)} className='h-8 w-8 cursor-pointer'/>}
                <Input ref={emil} placeholder='Search User' className='sm:w-96 w-full'/>
                <IconArrowRight onClick={ontype} className='h-10 w-10 cursor-pointer'/>
            </div>
            {flag === false ? <Contacts/> : <UserProfile contact={contact}/>}
            
        </div>
    )
}

function Contacts(){
    
    const [contacts, setContacts] = useState<Contact[]>([]);
    const url = useRecoilValue(apiURL);

    useEffect(()=>{
        axios.get(`${url}/api/getcontacts`,{withCredentials:true}).then((res)=>{
            setContacts(res.data.contacts);
        }).catch((err)=>{
            console.log(err);
        })
    },[])

    if(contacts.length === 0)return (<>
        <div className="h-full w-max flex justify-center items-center">
            <h1>No contacts found</h1>
        </div>
    </>)
    else return (<>
        <div className="h-full w-full flex flex-col items-center p-2 sm:p-0">
            {contacts.map((contact)=>{
                return <ContactCard key={contact._id} contact={contact}/>
            })}
        </div>
    </>)
}

interface Contact {
    _id: string;
    name: string;
    userId: string;
}

function ContactCard({contact}: { contact: Contact }){

    const navigate = useNavigate();
    function call(id:string){
        navigate('/meeting',{state:{type:'call',id:id,name:contact.name}});
    }

    return(<>
        <div className="h-20 w-11/12 sm:w-96 flex justify-between items-center bg-gray-200 dark:bg-gray-800 rounded-lg sm:p-4 m-2 ">
            <div className="flex items-center">
                <h1 className="ml-4">{contact.name}</h1>
            </div>
            <div className="flex items-center">
                <IconVideo onClick={()=>call(contact.userId)} className="h-8 w-8 sm:m-0 m-2 hover:scale-150 cursor-pointer transition-all"/>
            </div>
        </div>
    </>)
}


function UserProfile({contact} :{contact:any}){
    const url = useRecoilValue(apiURL);
    const toast = useToast();

    function onAdd(){
        axios.post(`${url}/api/request/send`,{ contact_id: contact._id },{withCredentials:true}).then(()=>{
            toast({
                title: 'Request Sent',
                description: "the request has been sent",
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }).catch((err)=>{
            console.log(err);
        })
    }

    return(
        <div className=" w-full mt-4 flex flex-row justify-between items-center border-2 rounded sm:p-2 hover:bg-slate-200">
            <div>
                <h1 className='text-2xl'>{contact.name}</h1>
                <h1>{contact.email}</h1>
            </div>
            <div>
                <Button onClick={onAdd} color="primary">Send Request</Button>
            </div>
        </div>
    )

}

function Rightbox(){
    const userState= useRecoilValue(user);
    return(
      <div className="h-full w-full hidden sm:flex justify-center items-center">
         <div className="flex justify-center items-center flex-col">
          <img src={sampleimage} alt="video call" className="h-96 w-110"/>
          <div>Welcome, {userState.name}! Ready to connect with your team or loved ones?</div>
          <div>Start or join a call now!</div>
         </div>
      </div>
    )
  }

function Incomingbox({data,setIncoming,webs,icecandidate}:{data:any,setIncoming:React.Dispatch<any>,webs:WebSocket | null,icecandidate:any}){

    const navigate = useNavigate();
    const icecandidatebuffer = icecandidate.current;
    const toast = useToast();
    useEffect(()=>{
        const audio = new Audio('ringtone.mp3');
        audio.loop = true;
        audio.play().catch((error) => {
        console.error("Error playing audio: ", error);
        });

        return () => {
        audio.pause();
        };
    },[])

    return(
        <div className='absolute z-5 top-0 sm:static left-0 h-full w-full sm:bg-gray-200 dark:bg-gray-800 flex justify-center items-center'>
            <div className='flex justify-center items-center flex-col gap-4 bg-blue-500 p-10 rounded-2xl text-white shadow-2xl'>
               <h1 className='text-3xl '>{data.name} is calling...</h1>
                <div className='flex gap-4'>
                <Button onClick={()=>{
                    setIncoming(null);
                    navigate('/meeting',{state:{...data,icecandidate:icecandidatebuffer}});
                    }}
                        className='bg-green-500 hover:bg-green-600 rounded-circle animate-bounce shadow-2xl' 
                    ><IconVideo stroke={2} size={80} color='black'/></Button>
                    <Button onClick={()=>{
                        setIncoming(null);
                        webs?.send(JSON.stringify({type:"call-rejected",userId:data.userId}));
                        toast({
                            title: 'Call Rejected',
                            description: "Call Rejected",
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                        });
                    }}
                        className='bg-red-500 hover:bg-red-600 rounded-circle shadow-2xl'
                    ><IconPhoneOff stroke={2} size={80} /></Button>  
                </div> 
            </div>
            
            
        </div>
    )

}