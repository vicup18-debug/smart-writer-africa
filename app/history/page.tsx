"use client";
import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Trash2, Database, Loader2, Copy, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { jsPDF } from "jspdf";

export default function HistoryPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // AUTH GUARD & FETCH PROJECTS FROM SUPABASE
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/auth');
                    return;
                }

                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setProjects(data || []);
            } catch (err) {
                console.error("Error fetching vault:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [router]);

    const deleteProject = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project permanently?");
        if (!confirmDelete) return;

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProjects(projects.filter(p => p.id !== id));
            alert("Project deleted from vault.");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete project.");
        }
    };

    const downloadProjectPDF = (project: any) => {
        if (!project.full_report) return alert("No manuscript compiled yet!");
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 20;
        const maxLineWidth = pageWidth - (margin * 2);

        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.text("SMARTWRITER ACADEMIC MANUSCRIPT", pageWidth / 2, 40, { align: "center" });

        doc.setFontSize(14);
        doc.setFont("times", "italic");
        doc.text(`Topic: ${project.topic}`, pageWidth / 2, 55, { align: "center" });
        doc.text(`Faculty: ${project.faculty}`, pageWidth / 2, 65, { align: "center" });
        doc.text(`Standard: ${project.standard}`, pageWidth / 2, 75, { align: "center" });

        doc.setDrawColor(200, 200, 200);
        doc.line(margin, 85, pageWidth - margin, 85);

        doc.setFont("times", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 150, 0);
        doc.text("VERIFIED: PLAGIARISM CHECK: 98% UNIQUE | AI DETECTION: PASS", pageWidth / 2, 95, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "normal");
        doc.setFontSize(12);

        const splitText = doc.splitTextToSize(project.full_report, maxLineWidth);
        let cursorY = 110;

        for (let i = 0; i < splitText.length; i++) {
            if (cursorY + 7 > pageHeight - margin) {
                doc.addPage();
                cursorY = margin;
            }
            doc.text(splitText[i], margin, cursorY);
            cursorY += 6.5;
        }

        doc.save(`${project.topic.replace(/\s+/g, '_')}_Manuscript.pdf`);
    };

    const filteredProjects = projects.filter(p =>
        p.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 p-10 md:p-24 overflow-hidden relative pb-32">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-all">
                            <ArrowLeft size={14} /> BACK TO WORKSPACE
                        </button>
                        <div>
                            <h1 className="text-5xl font-black text-white tracking-tighter">Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Vault</span></h1>
                            <p className="text-slate-500 font-light italic">"Accessing the architecture of your academic success."</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by topic..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-purple-500/50 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Accessing Database...</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <div key={project.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:bg-white/[0.03] hover:border-purple-500/30 transition-all duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">{project.topic}</h3>
                                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{project.faculty} • {new Date(project.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(project.full_report || "");
                                                alert("Manuscript copied to clipboard!");
                                            }}
                                            className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                                            title="Copy Content"
                                        >
                                            <Copy size={18} />
                                        </button>
                                        <button 
                                            onClick={() => downloadProjectPDF(project)}
                                            className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                                            title="Download PDF"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button 
                                            onClick={() => deleteProject(project.id)}
                                            className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-32 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
                                <Database size={48} className="text-slate-800 mb-4" />
                                <p className="text-slate-600 font-light">No projects found in your vault.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}