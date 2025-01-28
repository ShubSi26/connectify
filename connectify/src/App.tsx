import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NextUIProvider } from "@nextui-org/react";
import { RecoilRoot } from 'recoil';
import { ChakraProvider } from "@chakra-ui/react";

const Login = lazy(() => import('./component/LoginPage/Login'));
const Register = lazy(() => import('./component/Register/register'));
const Auth = lazy(() => import('./component/Auth/Auth'));
const Dashboard = lazy(() => import('./component/Dashboard/Dashboard'));
const Videocall = lazy(() => import('./component/VideoCall/videocall'));
const Logout = lazy(() => import('./component/Logout/Logout'));
const NotFound = lazy(() => import('./component/Notfound/Notfound'));

function App() {
  return (
    <RecoilRoot>
      <NextUIProvider>
        <BrowserRouter>
          <ChakraProvider>
            <Suspense fallback={<div className='h-screen w-screen flex justify-center items-center'>Loading...</div>}>
              <Routes>

                <Route element={<Auth />}>
                  <Route path='/dashboard/*' element={<Dashboard />} />
                  <Route path='/meeting' element={<Videocall />} />
                  <Route path='/logout' element={<Logout />} />
                </Route>
                
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          </ChakraProvider>
        </BrowserRouter>
      </NextUIProvider>
    </RecoilRoot>
  );
}

export default App;
