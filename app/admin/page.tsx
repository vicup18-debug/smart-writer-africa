"use client";
import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, CreditCard, BarChart3,
    ArrowLeft, BrainCircuit, TrendingUp, Search,
    Download, Filter, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, revenue: 0, projects: 0 });
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    // FETCH REAL-TIME ADMIN DATA FROM SUPABASE
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { supabase } = await import('@/lib/supabase');

                // 1. Fetch all successful orders to calculate revenue
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('status', 'success')
                    .order('created_at', { ascending: false });

                if (orderError) throw orderError;

                // 2. Fetch total unique scholars (users who have made an order)
                const { data: userData } = await supabase
                    .from('orders')
                    .select('user_id')
                    .eq('status', 'success');

                const uniqueUsers = new Set(userData?.map(u => u.user_id)).size;

                // 3. Calculate total revenue (converting Kobo back to Naira)
                const totalRevenue = orderData?.reduce((acc, curr) => acc + (Number(curr.amount) / 100), 0) || 0;

                setStats({
                    users: uniqueUsers,
                    revenue: totalRevenue,
                    projects: orderData?.length || 0
                });

                setRecentTransactions(orderData || []);
            } catch (err: any) {
                console.error("Admin Access Error:", err);
                toast.error("Failed to sync live marketplace data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();

        // REFRESH DATA EVERY 30 SECONDS FOR "LIVE" FEEL
        const interval = setInterval(fetchAdminData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-blue-500/30">
            <Toaster position="top-right" />

            {/* HEADER */}
            <header className="px-10 py-6 flex justify-between items-center border-b border-white/5 bg-[#050608]/50 backdrop-blur-md sticky top-0 z-40">
                <div onClick={() => router.push('/')} className="flex items-center gap-3 cursor-pointer group">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                        <BrainCircuit size={20} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white uppercase">
                        SmartWriter <span className="text-blue-500 text-xs font-mono ml-2 border border-blue-500/30 px-2 py-0.5 rounded-full">ADMIN</span>
                    </span>
                </div>
                <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-all">
                    <ArrowLeft size={14} /> EXIT PANEL
                </button>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-10 space-y-12">
                {/* 1. KEY PERFORMANCE INDICATORS (KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`₦${stats.revenue.toLocaleString()}`}
                        icon={<CreditCard className="text-green-400" />}
                        trend="Live Payouts"
                    />
                    <StatCard
                        title="Active Scholars"
                        value={stats.users.toString()}
                        icon={<Users className="text-blue-400" />}
                        trend="Verified Users"
                    />
                    <StatCard
                        title="Total Manuscripts"
                        value={stats.projects.toString()}
                        icon={<BarChart3 className="text-purple-400" />}
                        trend="Completed Chapters"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* 2. REAL-TIME ARCHITECTURE FEED */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-2xl font-black text-white tracking-tight">Real-time Architecture Feed</h2>
                            {loading ? <Loader2 size={14} className="animate-spin text-blue-500" /> : <span className="text-[10px] text-slate-500 font-mono italic">SYNCED WITH PAYSTACK</span>}
                        </div>
                        <div className="border border-white/5 rounded-[2.5rem] bg-white/[0.01] overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-6">Research Topic</th>
                                        <th className="p-6">Plan</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6 text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentTransactions.length > 0 ? recentTransactions.map((tx, idx) => (
                                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6 text-sm font-bold text-white max-w-[300px] truncate">{tx.research_topic || "Untitled Research"}</td>
                                            <td className="p-6 text-xs text-slate-500 font-mono uppercase">{tx.plan_name}</td>
                                            <td className="p-6">
                                                <span className="flex items-center gap-2 text-[10px] font-black text-green-400 bg-green-400/5 px-3 py-1 rounded-full border border-green-400/10 w-fit">
                                                    <CheckCircle2 size={10} /> {tx.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right font-black text-white">₦{(tx.amount / 100).toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-20 text-center text-slate-600 text-sm">
                                                Waiting for first scholar transaction...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 3. MARKET INTELLIGENCE */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-white tracking-tight">Trending Tech</h2>
                        <div className="p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5 rounded-[2.5rem] space-y-6">
                            <TrendItem label="5G Security" percentage={85} />
                            <TrendItem label="Edge Computing" percentage={64} />
                            <TrendItem label="Hybrid Cloud" percentage={42} />
                            <TrendItem label="Blockchain Logistics" percentage={31} />
                            <div className="pt-4 mt-6 border-t border-white/10">
                                <p className="text-xs text-slate-500 italic">"Scholars are 40% more likely to choose Pro plans for Networking topics."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// SUB-COMPONENTS
function StatCard({ title, value, icon, trend }: any) {
    return (
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:border-blue-500/30 transition-all group">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-[10px] text-green-400 font-bold bg-green-400/5 px-2 py-1 rounded-lg border border-green-400/10">{trend}</span>
            </div>
            <div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{title}</p>
                <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{value}</h3>
            </div>
        </div>
    );
}

function TrendItem({ label, percentage }: { label: string, percentage: number }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{label}</span>
                <span className="text-blue-400">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}