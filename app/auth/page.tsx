"use client";
import React, { useState } from 'react';
import { BrainCircuit, ArrowLeft, Mail, Lock, Loader2, User, School, BookOpen, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [institution, setInstitution] = useState("");
    const [department, setDepartment] = useState("");
    const [program, setProgram] = useState("Undergraduate");
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { 
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            full_name: fullName,
                            institution: institution,
                            department: department,
                            program: program,
                            avatar_id: 1
                        }
                    }
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
        <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 selection:bg-purple-500/30 py-20">
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
                    {isSignUp && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="text" required={isSignUp}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="Obafemi Awolowo"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Institution</label>
                                <div className="relative group">
                                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        type="text" required={isSignUp}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="e.g. University of Ibadan"
                                        value={institution}
                                        onChange={(e) => setInstitution(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Department / Faculty</label>
                                <div className="relative group">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <select
                                        required={isSignUp}
                                        className="w-full bg-[#0b0d11] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all appearance-none"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    >
                                        <option value="" disabled>Select Department / Faculty...</option>
                                        <option value="Computer Science & IT">Computer Science & IT</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Business & Finance">Business & Finance</option>
                                        <option value="Geology & Earth Sciences">Geology & Earth Sciences</option>
                                        <option value="Law & Legal Studies">Law & Legal Studies</option>
                                        <option value="Health & Medical Sciences">Health & Medical Sciences</option>
                                        <option value="Sociology & Humanities">Sociology & Humanities</option>
                                        <option value="Education">Education</option>
                                        <option value="General/Other">Other...</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Academic Program</label>
                                <div className="relative group">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <select
                                        required={isSignUp}
                                        className="w-full bg-[#0b0d11] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 transition-all appearance-none"
                                        value={program}
                                        onChange={(e) => setProgram(e.target.value)}
                                    >
                                        <option value="Undergraduate">Undergraduate (Final Year)</option>
                                        <option value="Masters">Masters Student</option>
                                        <option value="PhD">PhD Scholar</option>
                                        <option value="Researcher">Academic Researcher / Other</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

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
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
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
                            onClick={() => supabase.auth.signInWithOAuth({ 
                                provider: 'google',
                                options: {
                                    redirectTo: `${window.location.origin}/auth/callback`
                                }
                            })}
                            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        {isSignUp ? "Already have an account?" : "New to SmartWriter?"}{" "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-500 font-bold hover:underline cursor-pointer"
                        >
                            {isSignUp ? "Sign In" : "Create one now"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
