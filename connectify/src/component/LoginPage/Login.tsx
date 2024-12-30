import LoginLeft from './LoginLeft';
import LoginRight from './LoginRight';

export default function Login() {
    return(<div className='flex flex-col sm:flex-row'>
        <LoginLeft/>
        <LoginRight/>
    </div>)
}