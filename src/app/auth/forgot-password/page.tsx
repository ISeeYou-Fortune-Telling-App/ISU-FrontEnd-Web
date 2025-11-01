'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, ArrowLeft, Lock, Eye, EyeOff, KeyRound } from "lucide-react";

import { requestPasswordReset, verifyAndResetPassword } from "@/services/auth/forgot-password.service";

type Step = 'REQUEST_EMAIL' | 'RESET_PASSWORD';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>('REQUEST_EMAIL');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await requestPasswordReset({ email });
      
      setSuccessMessage(response.message); 
      setStep('RESET_PASSWORD'); 

    } catch (err: any) {
      console.error("Request Password Reset failed:", err);
      
      const errorMessage = 
          err.message?.includes('404') 
          ? "Không tìm thấy người dùng với email này." 
          : "Gửi yêu cầu thất bại. Vui lòng thử lại sau.";

      setError(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyReset = async (otpCode: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
        setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        setIsLoading(false);
        return;
    }

    try {
        const response = await verifyAndResetPassword({ 
            email, 
            otpCode, 
            password, 
            confirmPassword 
        });

        setSuccessMessage(response.message + ". Bạn sẽ được chuyển hướng về trang đăng nhập.");
        setTimeout(() => router.push("/login"), 3000); 

    } catch (err: any) {
        console.error("Verify and Reset Password failed:", err);
        setError("Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại OTP và thử lại.");
        
    } finally {
        setIsLoading(false);
    }
  };

  const ResetPasswordForm = () => {
    const [otpCode, setOtpCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleVerifyReset(otpCode, newPassword, confirmNewPassword);
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <p className="text-gray-400 text-sm text-center">Mã OTP đã được gửi đến: <span className="font-bold text-cyan-400">{email}</span></p>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mã OTP</label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
                    <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Nhập mã OTP (6 chữ số)"
                        required
                        maxLength={6}
                        className="bg-gray-900 text-white pl-10 pr-3 py-3 w-full border border-gray-700 rounded-lg 
                            focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu mới</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                        required
                        className="bg-gray-900 text-white pl-10 pr-12 py-3 w-full border border-gray-700 rounded-lg 
                            focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400 transition"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                        required
                        className="bg-gray-900 text-white pl-10 pr-12 py-3 w-full border border-gray-700 rounded-lg 
                            focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                </div>
            </div>
        </form>
    );
  };

  return (
    <div className={`flex min-h-screen items-center justify-center bg-gray-950 p-4`}>
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8 border border-cyan-600/30">
        <button 
            onClick={() => router.push("/login")}
            className="flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition mb-6"
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại Đăng nhập
        </button>

        <div className="text-center mb-8">
          {step === 'REQUEST_EMAIL' 
            ? <Mail color={`#06B6D4`} className="h-14 w-14 mb-2 inline-block text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            : <KeyRound color={`#06B6D4`} className="h-14 w-14 mb-2 inline-block text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          }
          <h1 className="text-3xl font-extrabold text-white tracking-wider mt-2">
            {step === 'REQUEST_EMAIL' ? "Quên Mật khẩu" : "Xác nhận & Đặt lại"}
          </h1>
          <p className="text-gray-400 mt-2">
            {step === 'REQUEST_EMAIL' ? "Nhập email để nhận mã xác minh." : "Kiểm tra email và nhập mã OTP cùng mật khẩu mới."}
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center font-medium bg-red-900/40 p-3 rounded border border-red-700">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="text-green-400 text-sm text-center font-medium bg-green-900/40 p-3 rounded border border-green-700">
            {successMessage}
          </div>
        )}

        {step === 'REQUEST_EMAIL' ? (
            <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            className="bg-gray-900 text-white pl-10 pr-3 py-3 w-full border border-gray-700 rounded-lg 
                                focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                                focus:shadow-md focus:shadow-cyan-500/30 outline-none 
                                transition placeholder-gray-500"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-amber-400 text-gray-900 py-3 rounded-lg font-bold text-lg 
                        shadow-lg shadow-amber-500/50 
                        hover:bg-amber-300 
                        hover:shadow-xl hover:shadow-amber-400/60
                        transition duration-300 ease-in-out 
                        disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                    disabled={isLoading || !!successMessage}
                >
                    {isLoading ? "Đang gửi..." : "Gửi mã đặt lại mật khẩu"}
                </button>
            </form>
        ) : (
            <ResetPasswordForm />
        )}
        
        {(step === 'RESET_PASSWORD' && !successMessage) && (
            <button
                form="reset-password-form" 
                type="submit"
                className="w-full bg-amber-400 text-gray-900 py-3 rounded-lg font-bold text-lg 
                    shadow-lg shadow-amber-500/50 mt-6
                    hover:bg-amber-300 
                    hover:shadow-xl hover:shadow-amber-400/60
                    transition duration-300 ease-in-out 
                    disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Đặt lại Mật khẩu"}
            </button>
        )}

      </div>
    </div>
  );
}