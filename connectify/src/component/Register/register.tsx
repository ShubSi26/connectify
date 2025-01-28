import Loginleft from'../LoginPage/LoginLeft';
import Right from './Right';
import { IconHeart } from '@tabler/icons-react';

export default function Login() {
    return(<div  className='flex flex-col-reverse sm:h-screen sm:flex-row bg-blue-950 hidden-scrollbar'>
        <div className='sm:w-3/5 flex flex-col'>
            <Loginleft color1=' text-white' color2='text-slate-100'/>
            <div className='flex justify-center items-center h-8 bg-white sm:bg-inherit text-slate-600 mt-auto sm:text-white'>
                We <IconHeart stroke={2} color='red' /> Open Source
            </div>
        </div>
        
        <Right/>
        
    </div>
    )
}   