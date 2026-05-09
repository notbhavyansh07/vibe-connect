"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Zap, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const registered = searchParams.get('registered');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            setLoading(false);
            return;
        }

        try {
            const result = await signIn("credentials", {
                email: email.trim().toLowerCase(),
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please check your credentials and try again.");
            } else if (result?.ok) {
                router.push("/");
                router.refresh();
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = () => {
        setEmail("demo@vibeconnect.com");
        setPassword("vibemaster99");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }} />
            </div>

            <div className="w-full max-w-md">
                <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative mt-16">
                    {/* Decorative Icon */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-surface border border-white/10 rounded-full flex items-center justify-center shadow-xl">
                        <Zap className="w-10 h-10 text-accent animate-pulse" />
                    </div>

                    <div className="text-center mt-8 mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Log in to reconnect with your vibe.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {registered && (
                            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-3 rounded-xl text-center">
                                ✅ Account created! Please log in.
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    autoComplete="email"
                                    inputMode="email"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all text-base"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full justify-center py-3.5 mt-6 text-base font-bold bg-gradient-to-r from-accent to-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : (<>Log In <LogIn className="w-5 h-5 ml-2" /></>)}
                        </button>

                        <button
                            type="button"
                            onClick={fillDemo}
                            className="w-full text-xs text-center text-gray-500 hover:text-accent transition-colors mt-2 py-2"
                        >
                            (Demo: Auto-fill Credentials)
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            New to VibeConnect?{' '}
                            <Link href="/signup" className="text-accent hover:text-white font-medium transition-colors">
                                Sign Up Free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
