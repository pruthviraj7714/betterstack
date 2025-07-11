'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from "next/link"
import axios from 'axios'
import { BACKEND_URL } from '@/lib/config'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const res = await axios.post(`${BACKEND_URL}/user/signin`, {
            username,
            password,
          });
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.jwt);
          router.push("/dashboard");
        } catch (error: any) {
          toast.error(error.message);
        }
      };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex-col justify-center">
        <div className="max-w-md">
          <Link href="/" className="flex items-center mb-8">
            <Shield className="h-8 w-8 text-white" />
            <span className="ml-2 text-2xl font-bold">BetterStack</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-6">
            Welcome back to the future of website monitoring
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Monitor your websites globally with real-time alerts and comprehensive analytics.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-300">3-minute monitoring intervals</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-300">Global monitoring from 12+ regions</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-300">Real-time alerts and notifications</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-gray-300">99.9% uptime SLA guarantee</span>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 italic">
              "BetterStack has been instrumental in maintaining our 99.99% uptime. The global monitoring and instant alerts have saved us countless hours."
            </p>
            <div className="mt-4 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                JS
              </div>
              <div className="ml-3">
                <p className="font-semibold">John Smith</p>
                <p className="text-sm text-gray-400">CTO, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <div className="flex lg:hidden items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-2xl font-bold text-white">BetterStack</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">Welcome back</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Sign in to your account to continue monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className='text-white' htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className='text-white' htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-white hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Sign In
              </Button>
            </form>
      
            <p className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-white hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
