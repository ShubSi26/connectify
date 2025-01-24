import banner from '../../assets/banner.png';
import logo from '../../assets/Connectify.png';

export default function LoginLeft() {
    return(<>
        <div className="sm:w-3/5 bg-white sm:rounded-tr-[120px] rounded-tr-[50px] rounded-tl-[50px] sm:mt-6 sm:ml-8">
            <div className='flex flex-col justify-center items-center gap-4'>
                <img src={logo} alt="logo" className="w-1/2"/>
                <img src={banner} alt="login" className="hidden sm:flex"/>
            </div>
            
        </div>
   </>)
}