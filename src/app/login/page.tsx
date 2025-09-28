"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Không check gì hết, nhấn nút là chuyển sang admin panel
    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            I See You Admin
          </h1>
          <p className="text-gray-500 mt-1">Đăng nhập để quản trị hệ thống</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
