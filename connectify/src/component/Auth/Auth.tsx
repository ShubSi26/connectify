import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { logined } from '../../recoil/atom';

export default function Auth() {
    const isLogined = useRecoilValue(logined);
    console.log(isLogined);
    if (!isLogined) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
}
