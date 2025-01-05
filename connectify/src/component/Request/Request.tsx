import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiURL } from "../../recoil/atom";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { IconClock } from '@tabler/icons-react';

export default function Request() {
  const [active, setActive] = useState("incoming");

  return (
    <div className="bg-white h-full rounded-lg shadow-lg ">
        <div className="relative h-20 border-b-4 border-b-cyan-500">
        <div className=" flex justify-between items-center h-20">
            <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-cyan-500 z-10"
            initial={false}
            animate={
                active === "incoming"
                ? { x: 0 } 
                : { x: "100%" }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <div className="relative z-10 w-full flex justify-between">
            <Button
                onClick={() => setActive("incoming")}
                className={`bg-transparent rounded-none p-10 pl-20 pr-20 text-xl font-bold ${
                active === "incoming" ? "text-white" : "text-gray-200"
                }`}
            >
                Incoming
            </Button>
            <Button
                onClick={() => setActive("outgoing")}
                className={`bg-transparent rounded-none p-10 pl-20 pr-20 text-xl font-bold ${
                active === "outgoing" ? "text-white" : "text-gray-200"
                }`}
            >
                Outgoing
            </Button>
            </div>
        </div>
        </div>
        {active === "incoming" ? <Incoming /> : <Outgoing />}
    </div>
  );
}

function Incoming() {
    const url = useRecoilValue(apiURL);
    const [contacts, setContacts] = useState([]);
    useEffect(()=>{
        axios.get(`${url}/api/request/incoming`,{withCredentials:true}).then((res)=>{
            console.log(res.data.contacts);
            setContacts(res.data.contacts);
        }).catch((err)=>{
            console.log(err);
        })
    },[])

    function Accept(contact_id:String){
        axios.post(`${url}/api/request/accept`,{contact_id},{withCredentials:true}).then((res)=>{
            console.log(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }

    function Reject(contact_id:String){
        axios.post(`${url}/api/request/reject`,{contact_id},{withCredentials:true}).then((res)=>{
            console.log(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }

  return (
    <div className="h-full w-full flex flex-col">
      {contacts.length === 0 ? (
        <div className="flex justify-center items-center pt-5 font-bold text-3xl text-gray-600 font-mono">
          <div className="text-center">No Incoming Request</div>
        </div>
      ) : (
        <div>
            {contacts.map((contact:any) => (
                <div
                key={contact._id}
                className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 rounded-lg p-4 m-2"
                >
                <div className="flex items-center">
                    <h1 className="ml-4">{contact.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                <Button
                    onClick={() => Reject(contact.id)}
                    className="h-8 w-8 hover:scale-125 cursor-pointer transition-all text-white" color="danger"
                    >
                    Reject
                    </Button>
                    <Button
                    onClick={() => Accept(contact.id)}
                    className="h-8 w-8 hover:scale-125 cursor-pointer transition-all text-white" color="success"
                    >
                    Accept
                    </Button>
                </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}

function Outgoing() {
    const url = useRecoilValue(apiURL);
    const [contacts, setContacts] = useState<any>([]);
    useEffect(()=>{
        axios.get(`${url}/api/request/outgoing`,{withCredentials:true}).then((res)=>{
            console.log(res.data.contacts);
            setContacts(res.data.contacts);
        }).catch((err)=>{
            console.log(err);
        })
    },[])

    function Cancle(contact_id:String){
        axios.post(`${url}/api/request/cancle`,{contact_id},{withCredentials:true}).then((res)=>{
            console.log(res.data);
        }).catch((err)=>{
            console.log(err);
        })
    }

  return (
    <div className="h-full w-full flex flex-col">
      {contacts.length === 0 ? (
        <div className="flex justify-center items-center pt-5 font-bold text-3xl text-gray-600 font-mono">
          <div className="text-center">No Outgoing Request</div>
        </div>
      ) : (
        <div>
            {contacts.map((contact:any) => (
                <div
                key={contact._id}
                className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 rounded-lg p-4 m-2"
                >
                <div className="flex items-center">
                    <h1 className="ml-4">{contact.name}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <IconClock stroke={2} />
                <Button
                    className="h-8 w-8 cursor-pointer transition-all text-white" disabled={true} color="warning"
                    >
                    Pending 
                    </Button>
                    <Button
                    onClick={() => Cancle(contact.id)}
                    className="h-8 w-8 hover:scale-150 cursor-pointer transition-all"
                    >
                    Cancle
                    </Button>
                </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}