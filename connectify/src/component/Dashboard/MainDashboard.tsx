import { IconUserSearch,IconArrowRight,IconX,IconVideo  } from '@tabler/icons-react';
import {Input,Button} from "@nextui-org/react";
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {websocketstate,callerid,apiURL,wsURL} from "../../recoil/atom";
import { useSetRecoilState,useRecoilState,useRecoilValue} from 'recoil';
import { useNavigate } from 'react-router-dom';



export default function MainDashboard() {

    const emil = useRef<HTMLInputElement>(null);
    const timeout = useRef<any>(null);

    const [contact, setContact] = useState<any>(null);
    const url = useRecoilValue(apiURL);
    const wsurl = useRecoilValue(wsURL);

    const [flag, setFlag] = useState(false);

    const [webs,setWebSocket] = useRecoilState(websocketstate);
    const toast = useToast();
    const navigate = useNavigate();

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

    useEffect(()=>{
        if(webs){
            webs.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                // Handle incoming offer
                if (data.type === "offer") {
                  navigate('/meeting',{state:data});
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
    const [caller,setCallerId] = useRecoilState(callerid);
    const navigate = useNavigate();
    function call(id:String){
        navigate('/meeting',{state:{type:'call',id:id}});
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