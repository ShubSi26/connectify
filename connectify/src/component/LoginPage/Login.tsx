import LoginLeft from './LoginLeft';
import LoginRight from './LoginRight';

export default function Login() {
    return(<div className='flex flex-col sm:flex-row h-screen min-w-full overflow-hidden bg-blue-950'> 
        <LoginLeft/>
        <LoginRight/>
    </div>)
}