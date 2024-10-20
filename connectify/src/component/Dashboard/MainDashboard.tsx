import { IconUserSearch,IconArrowRight,IconX,IconVideo  } from '@tabler/icons-react';
import {Input,Button} from "@nextui-org/react";
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {websocketstate,callerid} from "../../recoil/atom";
import { useSetRecoilState,useRecoilState } from 'recoil';



export default function MainDashboard() {

    const emil = useRef<HTMLInputElement>(null);

    const [contact, setContact] = useState<any>(null);

    const [flag, setFlag] = useState(false);

    const setWebSocket = useSetRecoilState(websocketstate);
    const toast = useToast();

    useEffect(()=>{
        
        let ws: WebSocket
        const connect = () => {
            ws = new WebSocket("ws://localhost:3000");

            ws.onopen = () => {
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
                setTimeout(() => {
                    connect();
                }, 3000);
            };

            setWebSocket(ws);
        };

    connect();

    return () => {
        if (ws) {
            ws.close();
        }
    };
    },[])

    function ontype(){
        if(emil.current?.value === "")return;
        axios.post("http://localhost:3000/api/finduser",{email:emil.current?.value},{withCredentials:true})
        .then((res)=>{
            setFlag(true);
            setContact(res.data.user);
        }).catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{},[flag])

    return(<>
        <div className="h-max w-max flex justify-center items-center flex-col m-4">
            <div className='flex'>
                {flag === false ?<IconUserSearch className='h-8 w-8'/> : <IconX onClick={()=>setFlag(false)} className='h-8 w-8 cursor-pointer'/>}
                <Input ref={emil} placeholder='Search User' className='w-96'/>
                <IconArrowRight onClick={ontype} className='h-10 w-10 cursor-pointer'/>
            </div>
            {flag === false ? <Contacts/> : <UserProfile contact={contact}/>}
            
        </div>
    </>)
}



function Contacts(){
    
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(()=>{
        axios.get("http://localhost:3000/api/getcontacts",{withCredentials:true}).then((res)=>{
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
        <div className="h-full w-max flex flex-col justify-center items-center">
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
    function call(id:String){
        console.log(id);
        setCallerId(null);
        setTimeout(() => setCallerId(id), 0);
    }

    return(<>
        <div className="h-20 w-96 flex justify-between items-center bg-gray-200 dark:bg-gray-800 rounded-lg p-4 m-2">
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

    function onAdd(){
        axios.post("http://localhost:3000/api/adduser",{ email: contact.email },{withCredentials:true}).then((res)=>{
            console.log(res.data.message);
        }).catch((err)=>{
            console.log(err);
        })
    }

    return(
        <div className="h-full w-full flex flex-row justify-between items-center border-2 rounded p-2 hover:bg-slate-200">
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