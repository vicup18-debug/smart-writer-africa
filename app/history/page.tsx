"use client";
import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, Trash2, Database, Loader2, Copy } from 'lucide-react';

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // FETCH PROJECTS FROM SUPABASE
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { supabase } = await import('@/lib/supabase');
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
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
    }, []);

    const filteredProjects = projects.filter(p =>
        p.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 p-10 md:p-24 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-white tracking-tighter">Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Vault</span></h1>
                        <p className="text-slate-500 font-light italic">"Accessing the architecture of your academic success."</p>
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
                                        <button className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Download size={18} /></button>
                                        <button className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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