import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Notfound() {
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000); 

        if (countdown === 0) {
            clearInterval(timer); 
            navigate("/"); 
        }

        return () => clearInterval(timer); 
    }, [countdown, navigate]);

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold">404</h1>
                <p className="text-xl mt-4">Oops! The page you’re looking for doesn’t exist.</p>
                <p className="text-md mt-2 text-gray-500">
                    It might have been moved or deleted.
                </p>
                <p className="text-md mt-4">
                    Redirecting to <Link to="/" className="text-blue-500 underline">Home</Link> in{" "}
                    <span className="font-bold">{countdown}</span> seconds...
                </p>
            </div>
            <div className="flex items-center h-20 mt-6">
                <img src={logo} alt="logo" className="w-12" />
                <h1 className="text-4xl font-logo text-slate-600">Connectify</h1>
            </div>
        </div>
    );
}
