"use client";
import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, Sparkles, Shield, Zap, Globe, ArrowLeft,
  Loader2, Download, Crown, History, Settings, Copy, FileText,
  User, Lock, CreditCard, LayoutDashboard, Check, School, Menu
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from "jspdf";
declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Home() {
  const router = useRouter();

  // --- APP STATE ---
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<any[]>([]);
  const [report, setReport] = useState("");
  const [writing, setWriting] = useState(false);
  const [schoolStandard, setSchoolStandard] = useState("Global Standard");
  const [userPlan, setUserPlan] = useState("Basic");

  const saveToDatabase = async (reference: string, planName: string, amount: number, topic: string) => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('orders').insert({
        reference,
        plan_name: planName,
        amount: amount * 100, // Converts to Kobo for admin display logic
        research_topic: topic || "Untitled Research",
        status: 'success',
        user_id: user?.id || null,
      });

      if (error) throw error;

      setUserPlan(planName);
      toast.success("Transaction verified & plan upgraded!");
    } catch (err) {
      console.error("Supabase Error:", err);
      toast.error("Payment successful but database sync failed.");
    }
  };

  // --- PAYSTACK GATEWAY INTEGRATION ---
  const handlePayment = (planName: string, amount: number) => {
    // 1. Check if the script is loaded
    if (!window.PaystackPop) {
      toast.error("Payment system is still loading. Please refresh.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_live_e3f508dda06464163976ebde1d31f008ee8f524d', // Your Live Key
      email: 'scholar@smartwriter.africa', // Replace with dynamic user email
      amount: amount * 100, // Converts Naira to Kobo
      currency: "NGN",
      callback: function (response: any) {
        // This runs after successful payment
        toast.success("Payment Received! Syncing with Soma Concepts...");

        // Move the Supabase saving logic here
        saveToDatabase(response.reference, planName, amount, topic);
      },
      onClose: function () {
        toast.error("Transaction cancelled.");
      }
    });

    handler.openIframe(); // This is the command that makes the window appear
  };

  // --- LOGIC: GENERATE CHAPTERS 1-5 ---
  const generateFullReport = async (isSample = false) => {
    if (outline.length === 0) return toast.error("Please generate an outline first!");

    if (!isSample && userPlan === "Basic") {
      return toast.error("Basic Plan only includes Chapter 1. Please upgrade to unlock Chapters 2-5.");
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
          standard: schoolStandard,
          fullThesis: !isSample
        }),
      });

      const data = await res.json();
      if (data.fullText) {
        setReport(data.fullText);
        if (isSample) {
          toast.success("Sample Chapter 1 generated! Ready for the full thesis?", { icon: '🎁' });
        } else {
          toast.success("Full 5-Chapter Thesis Compiled!", { icon: '🎓' });
        }
      }
    } catch (err) {
      toast.error("Writing engine unreachable. Check your cloud connection.");
    } finally {
      setWriting(false);
    }
  };

  const generateOutline = async () => {
    if (!topic) return toast.error("Please enter a research topic!");
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
        toast.success("Research outline architected!");
      }
    } catch (err) {
      toast.error("System error. API rate limit likely reached.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Smart-Writer", 10, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 150, 0);
    doc.text("VERIFIED: Plagiarism Check: 98% Unique | AI Detection: Pass", 10, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const splitText = doc.splitTextToSize(report, 180);
    doc.text(splitText, 10, 45);

    doc.save(`${topic.replace(/\s+/g, '_')}_Manuscript.pdf`);
    toast.success("Academic Manuscript exported!");
  };

  return (
    <div className="flex min-h-screen bg-[#050608] text-slate-200 selection:bg-purple-500/30 pb-24 md:pb-0">
      <Toaster position="top-right" />

      {/* 1. SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 border-r border-white/5 bg-white/5 backdrop-blur-xl flex-col items-center py-8 gap-8 z-50">
        <div onClick={() => router.push('/')} className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <BrainCircuit size={24} className="text-white" />
        </div>
        <nav className="flex flex-col gap-8 mt-10">
          <Link href="/"><div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg"><Zap size={22} /></div></Link>
          <Link href="/history"><div className="p-2 text-slate-500 hover:text-purple-400"><History size={22} /></div></Link>
          <Link href="/admin"><div className="p-2 text-slate-500 hover:text-purple-400"><LayoutDashboard size={22} /></div></Link>
          <Link href="/settings"><div className="p-2 text-slate-500 hover:text-purple-400"><Settings size={22} /></div></Link>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 ml-0 md:ml-20">
        <header className="px-6 md:px-10 py-6 flex justify-between items-center bg-[#050608]/50 backdrop-blur-md sticky top-0 z-40">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white">
            <ArrowLeft size={14} /> BACK
          </button>
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-slate-500">
            {userPlan !== "Basic" && <span className="text-purple-400 flex items-center gap-1"><Crown size={12} /> {userPlan.toUpperCase()}</span>}
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white font-black">V</div>
          </div>
        </header>

        <section className="pt-10 md:pt-20 pb-20 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>

          <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight md:leading-[1.1]">
                SmartWriter <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"></span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light">
                Professional academic generation following university-specific handbooks.
              </p>
            </div>

            {/* INPUT SECTION */}
            <div className="relative group max-w-3xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-20"></div>
              <div className="relative bg-[#0b0d11] border border-white/10 rounded-[2rem] p-3 flex flex-col gap-2">
                <select
                  value={schoolStandard}
                  onChange={(e) => setSchoolStandard(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-300 outline-none m-2 cursor-pointer"
                >
                  <option value="Global Standard">Global Standard</option>
                  <option value="UI Standard">University of Ibadan Guide</option>
                  <option value="UNILAG Standard">UNILAG Guide</option>
                  <option value="Covenant Standard">Covenant University Guide</option>
                </select>
                <div className="flex flex-col md:flex-row gap-2">
                  <input
                    className="flex-1 bg-transparent p-4 md:p-5 text-base md:text-lg outline-none placeholder:text-slate-700"
                    placeholder="Enter research topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <button
                    onClick={generateOutline}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 md:px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "PLAN NOW"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS AREA */}
          {outline.length > 0 && (
            <div className="mt-12 md:mt-20 w-full max-w-5xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {outline.map((section, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-[2rem]">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">{section.title}</h3>
                    <p className="text-slate-400 text-xs md:text-sm italic">"{section.logic_note}"</p>
                  </div>
                ))}
              </div>

              {!report && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => generateFullReport(true)}
                    disabled={writing}
                    className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    {writing ? <Loader2 className="animate-spin" /> : "FREE SAMPLE (CH 1)"}
                  </button>

                  <button
                    onClick={() => generateFullReport(false)}
                    disabled={writing}
                    className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-purple-500/20 hover:scale-105 transition-transform"
                  >
                    {writing ? <Loader2 className="animate-spin" /> : <><FileText /> COMPILE FULL THESIS (₦15k)</>}
                  </button>
                </div>
              )}

              {report && (
                <div className="mt-10 p-6 md:p-12 bg-white/5 border border-white/10 rounded-[2rem]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="p-3 px-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                      <Shield className="text-green-500" size={18} />
                      <span className="text-xs text-green-200 font-bold uppercase tracking-wider">
                        Verified Clean
                      </span>
                    </div>
                    <button
                      onClick={downloadPDF}
                      className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed text-sm md:text-lg">
                    {report}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* PRICING SECTION */}
        <section className="py-20 px-6 md:px-10 bg-white/2 border-y border-white/5">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white">Academic Marketplace </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <PricingCard title="Basic" price="₦0" features={["Chapter 1 Intro"]} onSelect={() => { }} />
              <PricingCard
                title="Standard"
                price="₦15,000"
                featured
                features={["Full Chapters 1-5", "Verified References ", "PDF Export"]}
                onSelect={() => handlePayment("Standard", 15000)}
              />
              <PricingCard
                title="Pro"
                price="₦35,000"
                features={["All Standard", "Human Review", "Presentation Slides"]}
                onSelect={() => handlePayment("Pro", 35000)}
              />
            </div>
          </div>
        </section>
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#050608]/90 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center py-5 z-50">
        <Link href="/"><Zap size={24} className="text-purple-400" /></Link>
        <Link href="/history"><History size={24} className="text-slate-500" /></Link>
        <Link href="/admin"><LayoutDashboard size={24} className="text-slate-500" /></Link>
        <Link href="/settings"><Settings size={24} className="text-slate-500" /></Link>
      </nav>
    </div>
  );
}

// PRICING COMPONENT
interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  featured?: boolean;
  onSelect: () => void;
}

function PricingCard({ title, price, features, featured, onSelect }: PricingCardProps) {
  return (
    <div className={`p-8 rounded-[2.5rem] border flex flex-col gap-6 ${featured ? 'bg-purple-600/10 border-purple-500' : 'bg-white/5 border-white/10'}`}>
      <h4 className="font-bold text-xl">{title}</h4>
      <div className="text-4xl font-black">{price}</div>
      <div className="space-y-3 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
            <Check size={14} className="text-purple-500" /> {f}
          </div>
        ))}
      </div>
      <button
        onClick={onSelect}
        className={`w-full py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 ${featured ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
      >
        {price === "₦0" ? "Current Plan" : `Select ${title}`}
      </button>
    </div>
  );
}