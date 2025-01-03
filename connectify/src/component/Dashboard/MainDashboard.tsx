import { IconUserSearch,IconArrowRight,IconX,IconVideo,IconPhoneOff } from '@tabler/icons-react';
import {Input,Button} from "@nextui-org/react";
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {websocketstate,apiURL,wsURL,user} from "../../recoil/atom";
import { useRecoilState,useRecoilValue} from 'recoil';
import { useNavigate } from 'react-router-dom';
import sampleimage from "../../assets/sample.png";

export default function MainDashboard() {

    const emil = useRef<HTMLInputElement>(null);
    const timeout = useRef<any>(null);

    const [contact, setContact] = useState<any>(null);
    const url = useRecoilValue(apiURL);
    const wsurl = useRecoilValue(wsURL);

    const [flag, setFlag] = useState(false);

    const [webs,setWebSocket] = useRecoilState(websocketstate);
    const toast = useToast();
    const [incoming, setIncoming] = useState<any>(null);

    useEffect(()=>{
        
        let ws: WebSocket
        const connect = () => {
            ws = new WebSocket(`${wsurl}`);

            ws.onopen = () => {
                clearTimeout(timeout.current);
                toast({
                    title: 'Connected',
                    description: "Connected to server",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            };

            ws.onclose = () => {
                toast({
                    title: 'Disconnected',
                    description: "Disconnected from server. Attempting to reconnect...",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
                clearTimeout(timeout.current);
                timeout.current = setTimeout(() => {
                    connect();
                }, 3000);
            };

            setWebSocket(ws);
        };

    if(webs === null)connect();

    },[])
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

    return(<>
        <div className="h-full w-full sm:w-max flex justify-center items-center flex-col p-2 bg-white">
            <div className='flex '>
                {flag === false ?<IconUserSearch className='h-8 w-8'/> : <IconX onClick={()=>setFlag(false)} className='h-8 w-8 cursor-pointer'/>}
                <Input ref={emil} placeholder='Search User' className='sm:w-96'/>
                <IconArrowRight onClick={ontype} className='h-10 w-10 cursor-pointer'/>
            </div>
            {flag === false ? <Contacts/> : <UserProfile contact={contact}/>}
            
        </div>
        <div className="w-full">
            {incoming && <Incomingbox data={incoming} setIncoming={setIncoming} webs={webs} icecandidate={icecandidatebuffer}/>}
            {incoming === null && <Rightbox/>}
        </div>
    </>)
}



function Contacts(){
    
    const [contacts, setContacts] = useState<Contact[]>([]);
    const url = useRecoilValue(apiURL);

    useEffect(()=>{
        axios.get(`${url}/api/getcontacts`,{withCredentials:true}).then((res)=>{
            console.log(res.data.contacts);
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
        <div className="h-full w-full flex flex-col">
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
    function call(id:String){
        navigate('/meeting',{state:{type:'call',id:id,name:contact.name}});
    }

    return(<>
        <div className="h-20 w-full sm:w-96 flex justify-between items-center bg-gray-200 dark:bg-gray-800 rounded-lg sm:p-4 m-2">
            <div className="flex items-center">
                <h1 className="ml-4">{contact.name}</h1>
            </div>
            <div className="flex items-center">
                <IconVideo onClick={()=>call(contact.userId)} className="h-8 w-8 hover:scale-150 cursor-pointer transition-all"/>
            </div>
        </div>
    </>)
}


function UserProfile({contact} :{contact:any}){
    const url = useRecoilValue(apiURL);

    function onAdd(){
        axios.post(`${url}/api/adduser`,{ email: contact.email },{withCredentials:true}).then((res)=>{
            console.log(res.data.message);
        }).catch((err)=>{
            console.log(err);
        })
    }

    return(
        <div className="h-full w-full flex flex-row justify-between items-center border-2 rounded sm:p-2 hover:bg-slate-200">
            <div>
                <h1 className='text-2xl'>{contact.name}</h1>
                <h1>{contact.email}</h1>
            </div>
            <div>
                <Button onClick={onAdd} color="primary">Add</Button>
            </div>
        </div>
    )

}

function Rightbox(){
    const userState= useRecoilValue(user);
    return(
      <div className="h-full w-full flex justify-center items-center">
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
    
    useEffect(()=>{
        const audio = new Audio('public/ringtone.mp3');
        audio.loop = true;
        audio.play().catch((error) => {
        console.error("Error playing audio: ", error);
        });

        return () => {
        audio.pause();
        };
    },[])

    return(
        <div className='h-full w-full bg-gray-200 dark:bg-gray-800 flex justify-center items-center'>
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
                    }}
                        className='bg-red-500 hover:bg-red-600 rounded-circle shadow-2xl'
                    ><IconPhoneOff stroke={2} size={80} /></Button>  
                </div> 
            </div>
            
            
        </div>
    )

}