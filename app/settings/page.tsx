"use client";
import React, { useState } from 'react';
import {
    User, Lock, CreditCard, ArrowLeft, BrainCircuit,
    Check, ShieldCheck, Globe, Trash2, LogOut, Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedAvatar, setSelectedAvatar] = useState(1);

    // Avatar Library (Tech/Cyberpunk Theme)
    const avatars = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-purple-500/30">
            {/* 1. HEADER */}
            <header className="px-10 py-6 flex justify-between items-center border-b border-white/5 bg-[#050608]/50 backdrop-blur-md sticky top-0 z-40">
                <div
                    onClick={() => router.push('/')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                        <BrainCircuit size={20} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white">SmartWriter</span>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-all"
                >
                    <ArrowLeft size={14} /> BACK
                </button>
            </header>

            <main className="max-w-6xl mx-auto py-20 px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* 2. SETTINGS NAVIGATION */}
                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-slate-500 hover:bg-white/5'}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-slate-500 hover:bg-white/5'}`}
                    >
                        <Lock size={18} /> Security
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-slate-500 hover:bg-white/5'}`}
                    >
                        <CreditCard size={18} /> Billing
                    </button>
                </nav>

                {/* 3. CONTENT AREA */}
                <section className="md:col-span-3 space-y-12">

                    {/* PROFILE & AVATAR LIBRARY */}
                    {activeTab === 'profile' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white">Profile Identity</h2>
                                <p className="text-slate-500 text-sm">Manage your digital persona across the platform.</p>
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black text-slate-600 uppercase tracking-widest">Avatar Library</label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                    {avatars.map((id) => (
                                        <div
                                            key={id}
                                            onClick={() => setSelectedAvatar(id)}
                                            className={`relative aspect-square rounded-2xl cursor-pointer overflow-hidden border-2 transition-all ${selectedAvatar === id ? 'border-purple-500 scale-105' : 'border-white/5 hover:border-white/20'}`}
                                        >
                                            <img
                                                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${id}`}
                                                alt="Avatar"
                                                className="bg-white/5"
                                            />
                                            {selectedAvatar === id && (
                                                <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                                                    <Check size={20} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Full Name</label>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500" placeholder="Your Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Institution</label>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-purple-500" placeholder="e.g. University of Ibadan" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white">Security & Access</h2>
                                <p className="text-slate-500 text-sm">Ensure your research data remains encrypted and private.</p>
                            </div>

                            <div className="grid gap-4">
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group hover:border-purple-500/30 transition-all">
                                    <div className="flex gap-4">
                                        <ShieldCheck className="text-purple-500" />
                                        <div>
                                            <h4 className="font-bold">Two-Factor Authentication</h4>
                                            <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-purple-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                                </div>

                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group hover:border-red-500/30 transition-all">
                                    <div className="flex gap-4">
                                        <Trash2 className="text-red-500" />
                                        <div>
                                            <h4 className="font-bold">Wipe Vault Data</h4>
                                            <p className="text-xs text-slate-500">Permanently delete all generated project reports.</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-red-500 hover:underline">ERASE ALL</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BILLING TAB */}
                    {activeTab === 'billing' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white">Billing & Subscriptions</h2>
                                <p className="text-slate-500 text-sm">Manage your academic plan and view your receipts.</p>
                            </div>

                            <div className="p-8 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-[3rem] flex justify-between items-center">
                                <div>
                                    <span className="text-[10px] font-black bg-purple-600 text-white px-3 py-1 rounded-full uppercase tracking-tighter">Current Plan</span>
                                    <h3 className="text-4xl font-black mt-4">Standard</h3>
                                    <p className="text-slate-400 mt-1">₦15,000 / month</p>
                                </div>
                                <button className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all">MANAGE</button>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Payment History</label>
                                <div className="border border-white/5 rounded-3xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white/5 text-slate-500">
                                            <tr>
                                                <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Date</th>
                                                <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Project</th>
                                                <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            <tr>
                                                <td className="p-4">Feb 14, 2026</td>
                                                <td className="p-4">5G Edge Security Architecture</td>
                                                <td className="p-4 font-bold text-purple-400">₦15,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}