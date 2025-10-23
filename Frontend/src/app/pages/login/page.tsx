"use client";
import { useState } from "react";
import SummaryApi from "@/app/common/apis";
import { Button } from "@/app/components/ui/buttonlogin";
import { Input } from "@/app/components/ui/inputlogin";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/cardlogin";
import { Label } from "@/app/components/ui/labellogin";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail } from "lucide-react";
import hrHeroImage from "@/assets/hr-management-hero.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Talentnest_logo from "@/assets/Talentnest_logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process

    const dataResponse = await fetch(SummaryApi.adminLogin.url, {
      method: SummaryApi.adminLogin.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const dataApi = await dataResponse.json();
    console.log(dataApi);

    setTimeout(() => {
      setIsLoading(false);
      if (dataApi.success) {
        setIsLoading(false);
        toast.success(dataApi.message);
        router.push("/");
      }

      if (dataApi.error) {
        toast.error(dataApi.message);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex bg-gradient-to-r from-green-100 to-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-hr-primary-light relative">
        <div className="flex items-center justify-center w-full p-6">
          <Image
            src={Talentnest_logo}
            alt="HR Management Hero"
            width={550}
            height={550}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-4xl mb-4">
              <Building2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-hr-text-primary mb-2 text-black">
              TalentNest
            </h1>
            <p className="text-hr-text-secondary text-black">
              Sign in to your account
            </p>
          </div>

          <Card className="border-hr-border-light shadow-lg bg-transparent backdrop-blur-sm rounded-3xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-hr-text-primary text-black">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-hr-text-secondary text-black">
                Enter your credentials to access the HR portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2text-black">
                  <Label
                    htmlFor="email"
                    className="text-hr-text-primary font-medium text-black"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hr-text-secondary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-hr-border-light focus:border-primarytext-black focus:ring-primary bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-hr-text-primary font-medium text-black"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-hr-text-secondary" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 border-hr-border-light text-black focus:border-primary focus:ring-primary bg-white/50 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 text-primary bg-background border-hr-border-light rounded focus:ring-primary focus:ring-2"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-hr-text-secondary text-black"
                    >
                      Remember me
                    </Label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-primary hover:text-hr-primary-hover transition-colors text-black"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="hr"
                  size="lg"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-hr-border-light text-center">
                <p className="text-sm text-hr-text-secondary text-black">
                  Need help? Contact{" "}
                  <a
                    href="#"
                    className="text-primary hover:text-hr-primary-hover transition-colors text-black"
                  >
                    IT Support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-hr-text-secondary">
              This is a secure HR system. Your session will expire after 30
              minutes of inactivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
