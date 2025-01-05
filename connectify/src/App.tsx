import { BrowserRouter, Route, Routes} from 'react-router-dom'
import {NextUIProvider} from "@nextui-org/react";
import { RecoilRoot } from 'recoil';
import Login from './component/LoginPage/Login'
import Register from './component/Register/register'
import Auth from './component/Auth/Auth'
import Dashboard from './component/Dashboard/Dashboard';
import Videocall from './component/VideoCall/videocall';
import {ChakraProvider} from "@chakra-ui/react";
function App() {

  return (
    <>
    <RecoilRoot>
      <NextUIProvider>
        <BrowserRouter><ChakraProvider>
          <Routes>
            <Route element={<Auth/>}>
              <Route path='/dashboard/*' element={<Dashboard/>}/>
              <Route path='/meeting' element={<Videocall/>}/>
            </Route>
            <Route>
              <Route path='/' element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
            </Route>
          </Routes>
          </ChakraProvider>
        </BrowserRouter>
      </NextUIProvider>
    </RecoilRoot>
    </>
  )
}

export default App
