"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2, UserPlus, ShieldCheck, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { authAPI } from "@/lib/api"

export default function RegisterPage() {
    const router = useRouter()
    const { register, isAuthenticated, isLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
    })
    const [otpSent, setOtpSent] = useState(false)
    const [sendingOtp, setSendingOtp] = useState(false)

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, isLoading, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSendOTP = async () => {
        if (!formData.email) {
            setError("Email is required")
            return
        }
        if (!formData.email.toLowerCase().endsWith("@gmail.com")) {
            setError("Only @gmail.com email addresses are allowed")
            return
        }

        setSendingOtp(true)
        setError(null)
        try {
            await authAPI.sendOtp(formData.email)
            setOtpSent(true)
        } catch (err: any) {
            setError(err.message || "Failed to send OTP")
        } finally {
            setSendingOtp(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!formData.otp) {
            setError("OTP is required")
            return
        }

        setLoading(true)
        setError(null)

        try {
            await register(formData.username, formData.password, formData.email, formData.otp)
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>

            <Link href="/" className="flex items-center gap-3 mb-8 group relative z-10">
                <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-white">NEWS VERIFIER</h1>
            </Link>

            <Card className="w-full max-w-md shadow-2xl border-white/5 bg-slate-900/40 backdrop-blur-xl relative z-10">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold text-center text-white">Join the Mission</CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Create an account to start tracking the truth
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email Address (@gmail.com only)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@gmail.com"
                                    className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500 flex-1"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={otpSent}
                                    required
                                />
                                {!otpSent && (
                                    <Button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={sendingOtp || !formData.email}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {sendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                                        {sendingOtp ? "" : "Send OTP"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {otpSent && (
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-slate-300">Verification Code (OTP)</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500"
                                    required
                                    value={formData.otp}
                                    onChange={handleChange}
                                    maxLength={6}
                                />
                                <p className="text-xs text-slate-400">An OTP was sent to your email.</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-slate-300">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Choose a unique username"
                                className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Min. 6 characters"
                                className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Repeat your password"
                                className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-all" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-3" />
                                    Create Account
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-white/5 mt-4 pt-6">
                    <p className="text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-purple-400 font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
