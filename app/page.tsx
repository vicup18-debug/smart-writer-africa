"use client";
import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, Sparkles, Shield, Zap, Globe, ArrowLeft,
  Loader2, Download, Crown, History, Settings, Copy, FileText,
  User, Lock, CreditCard, LayoutDashboard, Check, School,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {


  // ... inside the component
  useEffect(() => {
    const checkUser = async () => {
      const { supabase } = await import('@/lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        toast.success(`Welcome back, Scholar! Ready for your 5-chapter thesis?`, {
          icon: '🚀',
          duration: 5000,
        });
      }
    };
    checkUser();
  }, []);
  const router = useRouter();

  // --- APP STATE ---
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<any[]>([]);
  const [report, setReport] = useState("");
  const [writing, setWriting] = useState(false);

  // --- NEW BUSINESS STATES ---
  const [schoolStandard, setSchoolStandard] = useState("Global Standard");
  const [userPlan, setUserPlan] = useState("Basic"); // Options: Basic, Standard, Pro

  // --- LOGIC: GENERATE CHAPTERS 1-5 ---
  const generateFullReport = async () => {
    if (outline.length === 0) return alert("Please generate an outline first!");

    // Safety check for chapters 1-5 (Premium Feature)
    if (userPlan === "Basic") {
      alert("Basic Plan only includes Chapter 1. Please upgrade to Standard for Chapters 1-5.");
    }

    setWriting(true);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline,
          topic,
          faculty: "Networking and Cloud Computing",
          standard: schoolStandard, // Pass school guide to AI
          fullThesis: userPlan !== "Basic" // AI logic for all chapters
        }),
      });

      const data = await res.json();
      if (data.fullText) {
        setReport(data.fullText);
        // Database update logic here...
      }
    } catch (err) {
      console.error("Writing error:", err);
      alert("Failed to reach the Writing Engine.");
    } finally {
      setWriting(false);
    }
  };

  const generateOutline = async () => {
    if (!topic) return alert("Please enter a research topic first!");
    setLoading(true);
    try {
      const res = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          faculty: "Networking and Cloud Computing",
          level: "Undergraduate (Final Year)"
        }),
      });
      const data = await res.json();
      if (data.sections) {
        setOutline(data.sections);
      }
    } catch (err) {
      alert("System error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050608] text-slate-200 selection:bg-purple-500/30">

      {/* 1. FIXED SIDEBAR NAVIGATION */}
      <aside className="fixed left-0 top-0 h-full w-20 border-r border-white/5 bg-white/5 backdrop-blur-xl flex flex-col items-center py-8 gap-8 z-50">
        <div
          onClick={() => router.push('/')}
          className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 cursor-pointer hover:scale-110 transition-transform"
          title="SmartWriter Home"
        >
          <BrainCircuit size={24} className="text-white" />
        </div>
        <nav className="flex flex-col gap-8 mt-10">
          <Link href="/"><div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg"><Zap size={22} /></div></Link>
          <Link href="/history"><div className="p-2 text-slate-500 hover:text-purple-400 transition-colors"><History size={22} /></div></Link>
          <Link href="/admin"><div className="p-2 text-slate-500 hover:text-purple-400 transition-colors"><LayoutDashboard size={22} /></div></Link>
          <Link href="/settings"><div className="p-2 text-slate-500 hover:text-purple-400 transition-colors"><Settings size={22} /></div></Link>
        </nav>
      </aside>

      <main className="flex-1 ml-20">
        {/* TOP HEADER WITH BACK BUTTON */}
        <header className="px-10 py-6 flex justify-between items-center bg-[#050608]/50 backdrop-blur-md sticky top-0 z-40">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-all">
            <ArrowLeft size={14} /> BACK
          </button>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-slate-500">
            {userPlan === "Pro" && <span className="text-purple-400 flex items-center gap-1"><Crown size={12} /> PRO MEMBER</span>}
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">N</div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="pt-20 pb-20 px-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-7xl font-black text-white tracking-tighter leading-[1.1]">
                SmartWriter <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Global Edition</span>
              </h1>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                Autonomous academic architect generating full 5-chapter reports based on African and Global university standards.
              </p>
            </div>

            {/* INPUT FIELD */}
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20"></div>
              <div className="relative bg-[#0b0d11] border border-white/10 rounded-[2rem] p-3 flex flex-col gap-4">
                <div className="flex gap-4 p-2">
                  <select
                    value={schoolStandard}
                    onChange={(e) => setSchoolStandard(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none focus:border-purple-500"
                  >
                    <option value="Global Standard">Global Standard</option>
                    <option value="UI Standard">University of Ibadan Guide</option>
                    <option value="UNILAG Standard">UNILAG Guide</option>
                    <option value="Covenant Standard">Covenant University Guide</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <input
                    className="flex-1 bg-transparent p-5 text-lg outline-none placeholder:text-slate-700"
                    placeholder="Describe your research topic (e.g. 5G Edge Security)..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <button
                    onClick={generateOutline}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 rounded-[1.5rem] font-black transition-all active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "PLAN NOW"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DISPLAY: RESEARCH OUTLINE CARDS */}
          {outline.length > 0 && (
            <div className="mt-20 w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outline.map((section, idx) => (
                  <div key={idx} className="group bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] hover:border-purple-500/30 transition-all">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{section.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 italic opacity-80">"{section.logic_note}"</p>
                  </div>
                ))}
              </div>

              {/* GENERATE MANUSCRIPT BUTTON */}
              {!report && (
                <div className="flex flex-col items-center gap-4 pt-10">
                  <button
                    onClick={generateFullReport}
                    disabled={writing}
                    className="relative group px-12 py-5 bg-white text-black rounded-2xl font-black text-xl overflow-hidden transition-all hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 group-hover:text-white flex items-center gap-3">
                      {writing ? <Loader2 className="animate-spin" /> : <><FileText /> COMPILE FULL THESIS (CH 1-5)</>}
                    </span>
                  </button>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Applying {schoolStandard} Formatting</p>
                </div>
              )}

              {/* FINAL REPORT DISPLAY */}
              {report && (
                <div className="mt-20 p-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-3xl">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Project Manuscript</h2>
                    <div className="flex gap-4">
                      <button onClick={() => { navigator.clipboard.writeText(report); alert("Copied!"); }} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Copy size={20} /></button>
                      <button onClick={() => window.print()} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Download size={20} /></button>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-loose text-lg font-light">
                    {report}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* PRICING MARKETPLACE SECTION */}
        <section className="py-20 px-10 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center">
              <h2 className="text-4xl font-black text-white">Academic Marketplace</h2>
              <p className="text-slate-500">Professional documentation tailored for serious scholars.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price="₦0"
                desc="Ideal for topic scouts."
                features={["Outline Generation", "Chapter 1 Intro", "Global Formatting"]}
                onSelect={() => setUserPlan("Basic")}
              />
              <PricingCard
                title="Standard"
                price="₦15,000"
                featured
                desc="The perfect undergraduate kit."
                features={["Full Chapters 1-5", "Specific School Standards", "References List", "PDF Export"]}
                onSelect={() => setUserPlan("Standard")}
              />
              <PricingCard
                title="Pro"
                price="₦35,000"
                desc="Thesis-level research depth."
                features={["All Standard Features", "Source Code Implementation", "Defense PPT Slides", "Priority AI Support"]}
                onSelect={() => setUserPlan("Pro")}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// PRICING COMPONENT
function PricingCard({ title, price, desc, features, featured, onSelect }: any) {
  return (
    <div className={`p-10 rounded-[2.5rem] border flex flex-col gap-6 transition-all hover:-translate-y-2 ${featured ? 'bg-purple-600/10 border-purple-500 shadow-2xl shadow-purple-500/20' : 'bg-white/5 border-white/10'}`}>
      <div className="space-y-2">
        <h4 className="font-bold text-xl">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <div className="text-5xl font-black">{price}</div>
      <div className="space-y-4 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 text-sm text-slate-400">
            <Check size={14} className="text-purple-500" /> {f}
          </div>
        ))}
      </div>
      <button onClick={onSelect} className={`w-full py-4 rounded-2xl font-black transition-all ${featured ? 'bg-purple-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
        {price === "₦0" ? "Current Plan" : "Upgrade Now"}
      </button>
    </div>
  );
}

// FEATURE CARD COMPONENT
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-4 hover:bg-white/10 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}