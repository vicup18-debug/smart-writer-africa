"use client";
import React, { useState } from 'react';
import { BrainCircuit, ArrowLeft, Mail, Lock, Loader2, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
                });
                if (error) throw error;
                alert("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                router.push('/'); // Redirect to home after login
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 selection:bg-purple-500/30">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                {/* Logo & Header */}
                <div className="text-center space-y-4">
                    <div
                        onClick={() => router.push('/')}
                        className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl cursor-pointer hover:scale-110 transition-transform"
                    >
                        <BrainCircuit size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">
                        {isSignUp ? "Join SmartWriter" : "Welcome Back"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isSignUp ? "Start your global academic journey today." : "Access your secure research vault."}
                    </p>
                </div>

                {/* Auth Form */}
                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="email" required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                placeholder="name@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="password" required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "CREATE ACCOUNT" : "SIGN IN")}
                    </button>
                </form>

                {/* Toggle & Social */}
                <div className="space-y-6 pt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-600"><span className="bg-[#050608] px-4 tracking-widest">Or Continue With</span></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
                            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-all"
                        >
                            <Github size={20} /> GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        {isSignUp ? "Already have an account?" : "New to SmartWriter?"}{" "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-500 font-bold hover:underline"
                        >
                            {isSignUp ? "Sign In" : "Create one now"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}