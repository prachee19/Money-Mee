import { useContext, useState } from "react";
import { useNavigate , Link }  from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "./Input.jsx";
import axios from "axios";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import {AppContext } from "../context/AppContext.jsx";
import { validateEmail } from "../util/validation.js";
import { LoaderCircle } from "lucide-react";



const Login = () => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading , setIsLoading] = useState(false);
  const {setUser} = useContext(AppContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    //basic validation

      if (!validateEmail(email)) {
          setError("Please enter a valid email address");
          setIsLoading(false);
          return;
        }
        if (!password.trim()) {
          setError("Please enter a valid password");
          setIsLoading(false);
          return;
        }
        setError("");

        //Login api call
        try{
          const response = await axiosConfig.post(API_ENDPOINTS.LOGIN ,{
            email,
            password,
          });
          const {token , user} = response.data;
          if(token){
            localStorage.setItem("token" , token);
            setUser(user);
            navigate("/dashboard");
          }
          }catch(error){
             if(error.response && error.response.data.message){
              setError(error.response.data.message);
             }else{
           console.error('Something went wrong' , error);
           setError(error.message);
             }
         }finally{
           setIsLoading(false);
         }
  }

  return (
   
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">

      <img
        src={assets.login_bg} alt="Background" className="absolute inset-0 w-full h-full object-cover filter blur-sm -z-10"
      />
      <div className="relative z-10 w-full max-w-lg px-6">
           <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-black text-center mb-2">
               Welcome Back!
            </h3>
            <p className="text-sm text-slate-700 text-center mb-8">
                Fill up the credentials to login into your account
            </p>
            <form onSubmit ={handleSubmit} className="space-y-4">
              
                <div className="grid grid-cols-1 md:grid-cols-1  ">
              
                 <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email Address"
                  placeholder="fullname@example.com"
                  type="text"                 
                 /> 
             
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  placeholder="Type your password here"
                  type="password"                 
                 /> 
             
                </div>
                {error && (
                   <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                       {error}
                   </p>
                )}
                    
                     <button disabled={isLoading}
              className={`btn-primary w-full py-3 text-lg font-medium flex items-center justify-center gap-2 bg-blue-200 rounded-lg hover:bg-blue-300 transition  ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
               type="submit"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Logining In...
                </>
              ) : (
                "LOGIN"
              )}
            </button>
                  
                  
                  
                  <p className=" text-m text-slate-800 text-center mt-6">
                    Don't have an account?
                   <Link to="/signup" className="font-medium text-primary underline hover:text-primary-dark transition-colors">Create Account </Link>
                  </p>
            </form>


           </div>
      </div>

      </div>
      
      


  )
};

export default Login;