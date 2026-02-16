"use client";
import { Check, Crown, Zap } from 'lucide-react';

export default function Pricing() {
    return (
        <div className="min-h-screen bg-[#050608] pt-40 px-10 pb-20">
            <div className="max-w-4xl mx-auto text-center mb-20">
                <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Real Impact. <span className="text-purple-500">Proven Results.</span></h2>
                <p className="text-slate-500 text-lg">Explore how we've helped students alike scale and innovate.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {/* Tier 1 */}
                <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] space-y-8 hover:bg-white/[0.04] transition-all">
                    <h4 className="text-purple-500 font-bold tracking-widest text-[10px] uppercase">Entry Level</h4>
                    <h3 className="text-3xl font-bold">Research Scout</h3>
                    <div className="text-6xl font-black text-white tracking-tighter">₦0 <span className="text-lg text-slate-600">/mo</span></div>
                    <ul className="space-y-4">
                        {["3 Project Outlines", "Basic Methodology Notes"].map(f => (
                            <li key={f} className="flex items-center gap-3 text-slate-400 text-sm italic"><Check size={16} className="text-purple-500" /> {f}</li>
                        ))}
                    </ul>
                    <button className="w-full py-5 bg-white/5 rounded-2xl font-black text-[11px] tracking-widest hover:bg-white/10 transition-all">SELECT SCOUT</button>
                </div>
                {/* Tier 2: The Hero Tier */}
                <div className="p-12 bg-purple-600/10 border border-purple-500/40 rounded-[3.5rem] space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} /></div>
                    <h4 className="text-purple-400 font-bold tracking-widest text-[10px] uppercase">Most Popular</h4>
                    <h3 className="text-3xl font-bold">Final Year Scholar</h3>
                    <div className="text-6xl font-black text-white tracking-tighter">₦15,000 <span className="text-lg text-slate-500">/project</span></div>
                    <ul className="space-y-4">
                        {["Full 2,000+ Word Report", "IEEE/APA Formatting", "Implementation Code"].map(f => (
                            <li key={f} className="flex items-center gap-3 text-slate-200 text-sm font-medium"><Zap size={16} className="text-purple-400" /> {f}</li>
                        ))}
                    </ul>
                    <button className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-[11px] tracking-widest shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all">BUY NOW</button>
                </div>
            </div>
        </div>
    );
}