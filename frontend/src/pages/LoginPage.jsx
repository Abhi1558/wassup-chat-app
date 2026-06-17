import { MessageSquare , Mail, Lock, EyeOff, Eye, Loader2} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
import toast from "react-hot-toast"

const Login = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [formData ,setFormData] = useState({
    email:"",
    password:""
  })
  const {login, isLoggingIn} = useAuthStore()
  const validateForm = () => {
    if(!formData.email.trim())return toast.error("Email is required")
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))return toast.error("Invalid email format")
    if(!formData.password)return toast.error("password is required")
    if(formData.password.length<6 )return toast.error("Password must be atleast 6 characters")

    return true

    

  }

  const handleSubmit =(e) => {
    e.preventDefault();
    const success = validateForm()
    if(success === true )login(formData)
    
  }
  return (
    <div>
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <div className='flex flex-col justify-center items-center '>
          <div className="flex justify-center items-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <MessageSquare className="size-6 text-primary"/>

          </div>
          <h1 className="font-bold mt-2 text-2xl">Welcome Back</h1>
          <p className="text-base-content/60">Sign in to your account</p>
                
        

        </div>
        <form  onSubmit={handleSubmit} className="space-y-2">

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <Mail className="size-5 text-base-content/40"/>
              </div>
              <input type="text"
              className={`input input-bordered w-full pl-10`}
              placeholder="youremail@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <Lock className="size-5 text-base-content/40"/>
              </div>
             <input type={showPassword? "text" : "password"}
              className={`input input-bordered w-full pl-10 `}
              placeholder="●●●●●●●"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? (<EyeOff className="size-5 text-base-content/40"/>): 
                <Eye className="size-5 text-base-content/40"/>}
              </button>

            </div>
            


          </div>
          <button type="submit" className="btn btn-primary w-full"  disabled={isLoggingIn}>
              {isLoggingIn? 
                <>
                  (<Loader2 className="size-5 animate-spin"/>)
                  loading...

                </>:("Sign In")}
            </button>

        </form>
        <div className="text-center">
          <p className="text-base-content/60">
            Create a new account?{" "}
            <Link to="/Signup" className="link link-primary">Sign up</Link>  
          </p>

        </div>
        <div className="mt-3 text-center">
          <p className="text-base-content/60">
            
            <Link to="/forgot-password" className="link link-primary">Forgot password?</Link>  
          </p>

        </div>


      </div>
      


      
    </div>
  )
}

export default Login
