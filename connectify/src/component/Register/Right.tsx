import {Input} from "@nextui-org/react";
import { useNavigate} from "react-router-dom";
import {useRef} from "react";
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { apiURL } from "../../recoil/atom";
import { useRecoilValue } from "recoil";
import logo from "../../assets/logo.png";

export default function Right() {  

    const Navigate = useNavigate();
    const toast = useToast();
    const url = useRecoilValue(apiURL);

    const name = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    function registerUser() {
        const user = {
            name: name.current?.value,
            email: email.current?.value,
            password: password.current?.value
        }
        if(user.name && user.email && user.password ){axios.post(`${url}/api/register`, user)
        .then(() => {
            toast({
                title: 'Account created.',
                description: "We've created your account for you.",
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
              setTimeout(() => {
                Navigate('/')
              }, 2010)
        }).catch((err) => {
            toast({
                title: 'Error',
                description: err.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        })}
        else{
            toast({
                title: 'Error',
                description: "Please fill all the fields",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
    }

    return(<div className="sm:w-2/5 h-full sm:bg-white sm:pb-14 sm:pr-6">
        <div className="pt-6 sm:pt-0 sm:w-full h-full flex sm:justify-center items-center flex-col gap-4 ">
            <div className="flex items-center h-20 ">
                <img src={logo} alt="logo" className="w-12" />
                <h1 className="text-4xl font-logo text-white sm:text-slate-600">Connectify</h1>
            </div>
            <div className="text-3xl font-bold text-white sm:text-slate-600">
                Register with us
            </div>
            <div className="w-4/5 sm:w-3/5 flex justify-center items-center flex-col gap-3">
                <Input type="text" label="Name" ref={name} />
                <Input type="email" label="Email" ref={email} />
                <Input type="password" label="Password" ref={password} />
            </div>
                <button onClick={registerUser} className="p-[3px] relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                    <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                        Register
                    </div>
                </button>
            <div className="text-white sm:text-slate-600">
                Have an Account? <span className="text-blue-500 cursor-pointer" onClick={() => Navigate('/')}>Login </span>
            </div>
        </div>
    </div>)
}