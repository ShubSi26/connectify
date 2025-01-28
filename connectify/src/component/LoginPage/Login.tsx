import { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { IconHeart } from '@tabler/icons-react';
import LoginLeft from './LoginLeft';
import LoginRight from './LoginRight';
import logo from '../../assets/logo.png';

export default function Login() {
    const [currentTime, setCurrentTime] = useState<string>(() => {
        // Initial time in desired format
        return new Date().toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'short',
            day: '2-digit',
            month: 'short',
        });
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Update the time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                weekday: 'short',
                day: '2-digit',
                month: 'short',
            }));
        }, 1000); // Updates every second

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-screen hidden-scrollbar flex flex-col">
            <div className="flex justify-between items-center pl-8 pr-8">
                <div className="flex items-center h-20 bg-white">
                    <img src={logo} alt="logo" className="w-12" />
                    <h1 className="text-4xl font-logo text-slate-600">Connectify</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className='text-xl font-logo hidden sm:block'>{currentTime}</div>
                    <button onClick={()=>navigate("/register")} className="bg-cyan-500 hover:bg-cyan-700 transition-all text-white px-4 py-2 rounded-md">
                        Sign Up
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full h-full items-center flex-grow">
                <LoginLeft />
                <LoginRight />
            </div>

            <div className='flex flex-col sm:flex-row justify-center item-center sm:gap-36 gap-2'>
                <div className="flex justify-center items-center sm:h-16 bg-white text-slate-600">
                    <Link to="https://github.com/ShubSi26/connectify" className="text-blue-500">Source Code</Link>
                </div>
                <div className="flex justify-center items-center sm:h-16 bg-white text-slate-600">
                    <Link to="" className="text-blue-500">View More Projects</Link>
                </div>
                <div className="flex justify-center items-center sm:h-16 bg-white text-slate-600">
                    <Link to="https://devshubh.live/" className="text-blue-500">Visit My Portfolio</Link>
                </div>
            </div>

            <div className='flex justify-center items-center h-8 bg-white text-slate-600 mt-auto'>
                We <IconHeart stroke={2} color='red' /> Open Source
            </div>
        </div>
    );
}
