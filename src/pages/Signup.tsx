
import { Link, useNavigate } from "react-router-dom";
import { SignUp, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";


const Signup = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  console.log(userId , isLoaded)
  useEffect(() => {
    if (isLoaded && userId){
      navigate("/dashboard")
    }
  } , [userId , isLoaded , navigate])
  
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Link to="/" className="absolute top-8 left-8 text-primary hover:text-primary-dark transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span className="sr-only">Back to Home</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Es3af</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sign up to continue to your medical AI assistant
          </p>
        </div>
        


          
        <div className="h-full w-full flex items-center justify-center">
        <SignUp path="/signup" signInUrl="login"/>
    </div>


          

      </div>
    </div>
  );
};





// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const { toast } = useToast();
  
//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!email.trim() || !password.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter both email and password",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     // For demo purposes, simulate successful login
//     toast({
//       title: "Success",
//       description: "You've been logged in successfully!",
//     });
    
//     // In a real app, you would authenticate and then redirect
//     setTimeout(() => {
//       window.location.href = "/dashboard";
//     }, 1500);
//   };
  
//   const handleSocialLogin = (provider: string) => {
//     toast({
//       title: "Social Login",
//       description: `${provider} login is not implemented in this demo`,
//     });
//   };
  
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
//       <Link to="/" className="absolute top-8 left-8 text-primary hover:text-primary-dark transition-colors">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="m12 19-7-7 7-7" />
//           <path d="M19 12H5" />
//         </svg>
//         <span className="sr-only">Back to Home</span>
//       </Link>
      
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold">Welcome to Es3af</h1>
//           <p className="text-gray-600 dark:text-gray-300 mt-2">
//             Sign in to continue to your medical AI assistant
//           </p>
//         </div>
        
//         <Card className="shadow-lg border-0">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center">Sign in</CardTitle>
//             <CardDescription className="text-center">
//               Enter your email and password to access your account
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent>
//             <Tabs defaultValue="email" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="email">Email</TabsTrigger>
//                 <TabsTrigger value="social">Social</TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="email">
//                 <form onSubmit={handleLogin} className="space-y-4 mt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="name@example.com"
//                         className="pl-10"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="password">Password</Label>
//                       <Link to="/forgot-password" className="text-sm text-primary hover:underline">
//                         Forgot password?
//                       </Link>
//                     </div>
//                     <div className="relative">
//                       <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="password"
//                         type="password"
//                         placeholder="••••••••"
//                         className="pl-10"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="remember"
//                       checked={rememberMe}
//                       onCheckedChange={() => setRememberMe(!rememberMe)}
//                     />
//                     <Label htmlFor="remember" className="text-sm">Remember me</Label>
//                   </div>
                  
//                   <Button type="submit" className="w-full">
//                     Sign in
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </form>
//               </TabsContent>
              
//               <TabsContent value="social" className="space-y-4">
//                 <Button 
//                   variant="outline" 
//                   className="w-full flex items-center justify-center"
//                   onClick={() => handleSocialLogin("Google")}
//                 >
//                   <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
//                     <path
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                       fill="#4285F4"
//                     />
//                     <path
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                       fill="#34A853"
//                     />
//                     <path
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                       fill="#FBBC05"
//                     />
//                     <path
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                       fill="#EA4335"
//                     />
//                   </svg>
//                   Sign in with Google
//                 </Button>
                
//                 <Button 
//                   variant="outline" 
//                   className="w-full flex items-center justify-center"
//                   onClick={() => handleSocialLogin("Apple")}
//                 >
//                   <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
//                     <path
//                       d="M16.52 7.17c1.19 0 2.5.77 3.21 1.79-.09.07-1.9 1.11-1.88 3.32.03 2.64 2.33 3.52 2.35 3.53-.02.06-.39 1.36-1.28 2.7-.77 1.13-1.57 2.25-2.83 2.27-1.24.02-1.64-.73-3.05-.73-1.41 0-1.86.73-3.03.78-1.22.05-2.14-1.22-2.92-2.35-1.58-2.29-2.8-6.47-1.17-9.3.81-1.41 2.25-2.3 3.82-2.32 1.19-.02 2.32.8 3.05.8.73 0 2.11-.99 3.55-.85z"
//                       fill="black"
//                     />
//                     <path
//                       d="M14.32 3.45c.64-.78 1.07-1.86.95-2.95-.92.04-2.03.61-2.69 1.39-.59.68-1.11 1.78-.97 2.83 1.02.08 2.07-.53 2.71-1.27z"
//                       fill="black"
//                     />
//                   </svg>
//                   Sign in with Apple
//                 </Button>
                
//                 <Button 
//                   variant="outline" 
//                   className="w-full flex items-center justify-center"
//                   onClick={() => handleSocialLogin("GitHub")}
//                 >
//                   <Github className="h-5 w-5 mr-2" />
//                   Sign in with GitHub
//                 </Button>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
          
//           <CardFooter className="justify-center">
//             <p className="text-sm text-center text-gray-600 dark:text-gray-300">
//               Don't have an account?{" "}
//               <Link to="/register" className="text-primary hover:underline">
//                 Sign up
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };






export default Signup;
