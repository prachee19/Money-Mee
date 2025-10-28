import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "./Input.jsx";
import { validateEmail } from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";  
import {AppContext } from "../context/AppContext.jsx";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profileImageUrl ="";
    setIsLoading(true);

    // ✅ Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }
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

    //sign up api call
    try {

      if(profilePhoto){
        const imageUrl = await uploadProfileImage(profilePhoto);
        profileImageUrl = imageUrl || "";

      }


      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Profile created successfully");
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      <img
        src={assets.login_bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm -z-10"
      />
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Create An Account
          </h3>
          <p className="text-sm text-slate-700 text-center mb-8">
            Start tracking your spendings by joining with us.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
               <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />
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

            <button
              disabled={isLoading}
              className={`btn-primary w-full py-3 text-lg font-medium flex items-center justify-center gap-2 bg-blue-200 rounded-lg hover:bg-blue-300 transition  ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
               type="submit"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Signing Up...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>

            <p className="text-m text-slate-800 text-center mt-6">
              Already have an account?
              <Link
                to="/login"
                className="font-medium text-primary underline hover:text-primary-dark transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
