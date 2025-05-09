import {Input} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import { useToast } from '@chakra-ui/react';
import { useSetRecoilState ,useRecoilValue} from "recoil";
import { logined ,apiURL} from "../../recoil/atom";


export default function LoginRight() {

    const Navigate = useNavigate();
    const toast = useToast()
    const setLogined = useSetRecoilState(logined);
    const api = useRecoilValue(apiURL);

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    function loginUser() {
        const user = {
            email: email.current?.value,
            password: password.current?.value
        }
        axios.post(`${api}/api/login`, user, {withCredentials: true})
        .then(() => {
            toast({
                title: 'Login',
                description: "Login successful",
                status: 'success',
                duration: 2000,
                isClosable: true,
              })
            setLogined(true);
            Navigate('/dashboard');

        }).catch((err) => {
            console.log(err)
            toast({
                title: 'Error',
                description: err.response.data.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        })
    }

    return (<div className="sm:w-2/5 h-full bg-white sm:rounded-none">
            <div className="pt-6 sm:pt-0 sm:w-full h-full flex sm:justify-center items-center flex-col gap-3">
                <div className="text-3xl font-bold ">
                    Login
                </div>
                <div className=" sm:w-3/5 flex justify-center items-center flex-col gap-3">
                    <Input type="email" label="Email" ref={email} />
                    <Input type="password" label="Password" ref={password} />
                </div>
                    <button onClick={loginUser} className="p-[3px] relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                            Login
                        </div>
                    </button>
                <div className="text-slate-600">
                    Not a member? <span className="text-blue-500 cursor-pointer" onClick={() => Navigate('/register')}>Sign Up</span>
                </div>
            </div>
            
      </div>);
}