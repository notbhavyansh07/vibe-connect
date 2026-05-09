"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Zap, Eye, EyeOff } from "lucide-react";

export default function Signup() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        handle: "",
        password: ""
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    handle: formData.handle.replace('@', '').trim(),
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            router.push('/login?registered=true');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-md">
                <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl relative mt-16">
                    {/* Icon */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-surface border border-white/10 rounded-full flex items-center justify-center shadow-xl">
                        <Zap className="w-10 h-10 text-primary animate-pulse" />
                    </div>

                    <div className="text-center mt-8 mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-white">Join VibeConnect</h1>
                        <p className="text-gray-400 text-sm">Find your tribe based on what truly matters.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={set('name')}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Vibe Handle */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Vibe Handle</label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 flex items-center justify-center font-bold text-sm">@</div>
                                <input
                                    type="text"
                                    value={formData.handle}
                                    onChange={set('handle')}
                                    placeholder="vibemaster"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={set('email')}
                                    placeholder="john@example.com"
                                    autoComplete="email"
                                    inputMode="email"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password <span className="text-gray-600 text-xs">(min. 6 chars)</span></label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={set('password')}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-surface/50 border border-white/10 rounded-xl px-10 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-base"
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
                            className="btn btn-primary w-full justify-center py-3.5 mt-6 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : (<>Create Account <ArrowRight className="w-5 h-5" /></>)}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:text-white font-medium transition-colors">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
