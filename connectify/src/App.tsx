import { BrowserRouter, Route, Routes} from 'react-router-dom'
import {NextUIProvider} from "@nextui-org/react";
import { RecoilRoot } from 'recoil';
import Login from './component/LoginPage/Login'
import Register from './component/Register/register'
import Auth from './component/Auth/Auth'
import Dashboard from './component/Dashboard/Dashboard';

function App() {

  return (
    <>
    <RecoilRoot>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Auth/>}>
              <Route path='/dashboard' element={<Dashboard/>}/>
            </Route>
            <Route>
              <Route path='/' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </RecoilRoot>
    </>
  )
}

export default App
