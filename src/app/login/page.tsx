'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, Eye } from "lucide-react";

import { login } from "../../services/auth/auth.service"

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/dashboard");

    // setIsLoading(true);
    // setError(null);
    
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <Eye color="blue" className="h-12 w-12 mb-2 inline-block" /> 
          <h1 className="text-3xl font-extrabold text-gray-800">I See You</h1>
          <p className="text-gray-500 mt-1">Đăng nhập để quản trị hệ thống</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-white w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-indigo-400 text-white pl-10 pr-3 py-2 w-full border-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition placeholder-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-white w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-indigo-400 text-white pl-10 pr-3 py-2 w-full border-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition placeholder-indigo-100"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-1"> 
            <button
              type="button" 
              onClick={handleForgotPassword}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out"
            >
              Quên Mật khẩu?
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}