"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, CheckCircle, LogIn } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get("username");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!username) {
      toast.error("Invalid verification link");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        setIsLoading(false);
        return;
      }

      setIsVerified(true);
      setPassword(data.password);
      setWorkEmail(data.workEmail);
      toast.success("Credentials unlocked successfully!");

      // Auto-redirect to login after 2 minutes
      setTimeout(() => {
        toast("Redirecting to login page...", { icon: "🔒" });
        router.push("/login");
      }, 2 * 60 * 1000);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isVerified ? "Credentials Ready!" : "Verify Identity"}
          </h1>
          <p className="text-gray-600">
            {isVerified
              ? "Your access credentials are below"
              : `Enter OTP sent to ${username}`}
          </p>
        </div>

        {!isVerified ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter OTP from SMS"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
              className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Unlock Credentials"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Check your phone for the OTP sent via SMS
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Verification Successful!</span>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Email (Username)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={workEmail}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(workEmail)}
                  className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Password
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => copyToClipboard(password)}
                  className="px-3 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 text-center">
                ⚠️ Save these credentials securely. You won&#39;t be able to see
                them again.
              </p>
            </div>

            <button
              onClick={handleLoginRedirect}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Proceed to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading verification...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
