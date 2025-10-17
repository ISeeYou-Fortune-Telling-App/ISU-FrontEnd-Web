'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react"; 

import { login } from "../../services/auth/auth.service"

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    router.push("/admin/dashboard"); 
    // try {
    //   await login({ email, password }); 
    //   router.push("/admin/dashboard"); 
    // } catch (err: any) {
    //   console.error("Login failed:", err);
    //   setError("Đăng nhập thất bại. Vui lòng kiểm tra lại Email và Mật khẩu."); 
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password"); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 relative overflow-hidden">
      
      {/* ẢNH NỀN*/}
      <div 
        className="absolute inset-0 md:left-1/3 bg-cover bg-center z-0 transition-all duration-300 animate-rotate-once"
        style={{ backgroundImage: `url('/background_login.jpeg')`, backgroundSize: '80%', backgroundRepeat: 'no-repeat' }}
      >
        <div className="w-full h-full bg-black/50"></div>
      </div>
      
      {/*FORM LOGIN */}
      <div className={`relative w-full max-w-md md:w-1/3 p-4 z-10 
                       flex flex-col items-center justify-center`}>
        
        {/* Card Form */}
        <div className="w-full bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 border border-cyan-600/30 
                        md:mr-16"> 
          <div className="text-center mb-8">
            <Eye color={`#06B6D4`} className="h-14 w-14 mb-2 inline-block text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" /> 
            <h1 className="text-4xl font-extrabold text-white tracking-wider mt-2">I See You</h1>
            <p className="text-gray-400 mt-2">Đăng nhập để quản trị hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-4 text-cyan-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="bg-gray-900 text-white pl-10 pr-3 py-3 w-full border border-gray-700 rounded-lg 
                    focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                    focus:shadow-md focus:shadow-cyan-500/30 outline-none 
                    transition placeholder-gray-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 text-cyan-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-900 text-white pl-10 pr-12 py-3 w-full border border-gray-700 rounded-lg 
                    focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                    focus:shadow-md focus:shadow-cyan-500/30 outline-none 
                    transition placeholder-gray-500"
                  required
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-400 hover:text-cyan-400 transition"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end pt-1"> 
              <button
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition duration-150 ease-in-out"
              >
                Quên Mật khẩu?
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center font-medium bg-red-900/40 p-2 rounded border border-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-400 text-gray-900 py-2 rounded-lg font-bold text-md 
                shadow-lg shadow-amber-500/50 
                hover:bg-amber-300 
                hover:shadow-xl hover:shadow-amber-400/60
                transition duration-300 ease-in-out 
                disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed
                flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý...</span>
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}