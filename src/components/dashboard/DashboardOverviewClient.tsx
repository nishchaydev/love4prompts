import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Menu, Bookmark } from 'lucide-react';

export interface ToolUsageRow {
  id: string;
  user_id: string;
  tool_name: string;
  client_ip?: string | null;
  created_at: string;
}

export interface SavedPromptRow {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  target_tool: string;
  created_at: string;
}

export const DashboardOverviewClient: React.FC = () => {
  const [generationsCount, setGenerationsCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [recentGenerations, setRecentGenerations] = useState<ToolUsageRow[]>([]);
  const [recentSaves, setRecentSaves] = useState<SavedPromptRow[]>([]);
  const [userEmail, setUserEmail] = useState('ANONYMOUS');
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setDashboardError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) return;
        
        const userId = session.user.id;
        setUserEmail(session.user.email?.split('@')[0].toUpperCase() || 'USER');

        // Generations Count
        const { count: genCount, error: genCountError } = await supabase
          .from('tool_usage')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (genCountError) {
          console.error("Generations Count Error:", genCountError);
          setDashboardError("Failed to load generations count.");
        } else if (genCount !== null) {
          setGenerationsCount(genCount);
        }

        // Saves Count
        const { count: sCount, error: sCountError } = await supabase
          .from('saved_prompts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (sCountError) {
          console.error("Saves Count Error:", sCountError);
          setDashboardError("Failed to load saves count.");
        } else if (sCount !== null) {
          setSavesCount(sCount);
        }

        // Recent Activity (from tool_usage)
        const { data: recentGens, error: recentGensError } = await supabase
          .from('tool_usage')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5)
          .returns<ToolUsageRow[]>();

        if (recentGensError) {
          console.error("Recent Activity Error:", recentGensError);
          setDashboardError("Failed to load recent activity.");
        } else if (recentGens) {
          setRecentGenerations(recentGens);
        }

        // Saved Requisitions (from saved_prompts)
        const { data: recentSaved, error: recentSavedError } = await supabase
          .from('saved_prompts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(3)
          .returns<SavedPromptRow[]>();

        if (recentSavedError) {
          console.error("Saved Requisitions Error:", recentSavedError);
          setDashboardError("Failed to load saved requisitions.");
        } else if (recentSaved) {
          setRecentSaves(recentSaved);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
        setDashboardError("An unexpected error occurred while loading dashboard data.");
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-['Inter'] antialiased flex flex-col selection:bg-black selection:text-white">
      {/* Top Navigation */}
      <header className="w-full border-b border-black bg-[#f9f9f9] px-[40px] py-[24px] flex justify-between items-center z-50 sticky top-0">
        <div className="font-bold text-black uppercase tracking-tighter" style={{ fontSize: '24px', lineHeight: 1 }}>
          love<span className="text-[#FF6D87]">4</span>prompts
        </div>
        <div className="hidden md:flex gap-[40px] items-center">
          <a href="#" className="ed-label-caps text-[12px] font-bold tracking-widest text-[#4c4546] hover:text-black transition-colors">ARCHIVE</a>
          <a href="#" className="ed-label-caps text-[12px] font-bold tracking-widest text-black border-b-2 border-black pb-1">LAB</a>
          <a href="#" className="ed-label-caps text-[12px] font-bold tracking-widest text-[#4c4546] hover:text-black transition-colors">LIBRARY</a>
          <a href="#" className="ed-label-caps text-[12px] font-bold tracking-widest text-[#4c4546] hover:text-black transition-colors">ABOUT</a>
        </div>
        <button className="text-black hover:opacity-70 transition-opacity">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-[300px] border-r border-black flex flex-col shrink-0 bg-[#f9f9f9]">
          <div className="p-[40px] flex flex-col gap-[8px]">
            <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">USER IDENTIFICATION</span>
            <span className="font-bold text-[16px] tracking-wider uppercase">{userEmail}</span>
            <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#FF6D87]">STATUS: AUTHORIZED</span>
          </div>
          
          <div className="h-[60px] bg-black w-full"></div>

          <nav className="flex flex-col">
            <a href="#" className="p-[24px] px-[40px] border-b border-black font-bold text-[14px] tracking-widest uppercase hover:bg-[#eeeeee] transition-colors">VAULT</a>
            <a href="#" className="p-[24px] px-[40px] border-b border-black font-bold text-[14px] tracking-widest uppercase hover:bg-[#eeeeee] transition-colors">COLLECTIONS</a>
            <a href="#" className="p-[24px] px-[40px] border-b border-black font-bold text-[14px] tracking-widest uppercase hover:bg-[#eeeeee] transition-colors">SETTINGS</a>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-grow flex flex-col">
          {/* Header Section */}
          <div className="flex flex-col xl:flex-row border-b border-black">
            <div className="p-[40px] flex-grow flex flex-col justify-center">
              <h1 className="font-bold tracking-tighter uppercase mb-[16px]" style={{ fontSize: 'clamp(64px, 8vw, 120px)', lineHeight: 0.8 }}>
                DASHBOARD
              </h1>
              <div className="flex items-center gap-[8px]">
                <div className="w-3 h-3 bg-[#FF6D87]"></div>
                <span className="ed-label-caps text-[10px] tracking-widest font-bold uppercase">SYSTEM STATUS: NOMINAL</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex shrink-0 border-t xl:border-t-0 border-black">
              <div className="p-[32px] border-r border-black flex flex-col justify-center items-center min-w-[160px] bg-white">
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] mb-[8px]">SUBMISSIONS</span>
                <span className="font-bold text-[24px] tracking-tighter">{generationsCount.toLocaleString()}</span>
              </div>
              <div className="p-[32px] border-r border-black flex flex-col justify-center items-center min-w-[160px] bg-[#f9f9f9]">
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] mb-[8px]">SAVES</span>
                <span className="font-bold text-[24px] tracking-tighter">{savesCount.toLocaleString()}</span>
              </div>
              <div className="p-[32px] flex flex-col justify-center items-center min-w-[160px] bg-[#f9f9f9]">
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#FF6D87] mb-[8px]">TECH CREDITS</span>
                <span className="font-bold text-[24px] tracking-tighter">4,200</span>
              </div>
            </div>
          </div>

          {/* Split Content */}
          <div className="flex-grow flex flex-col lg:flex-row">
            
            {/* Recent Activity */}
            <div className="flex-grow border-r border-black flex flex-col">
              <div className="p-[24px] px-[40px] border-b border-black flex justify-between items-center bg-[#f9f9f9]">
                <h2 className="font-bold text-[14px] tracking-widest uppercase">RECENT ACTIVITY</h2>
                <button className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] hover:text-black transition-colors">VIEW ALL</button>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-12 p-[24px] px-[40px] border-b border-black ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] bg-[#eeeeee]">
                <div className="col-span-2">ID</div>
                <div className="col-span-6">REQUISITION TITLE</div>
                <div className="col-span-2">DATE</div>
                <div className="col-span-2 text-right">STATUS</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {recentGenerations.length === 0 ? (
                  <div className="p-[24px] px-[40px] border-b border-black text-[12px] text-[#7e7576]">No recent activity</div>
                ) : (
                  recentGenerations.map((gen, idx) => (
                    <div key={gen.id} className={`grid grid-cols-12 p-[24px] px-[40px] border-b border-black items-center hover:bg-[#f3f3f3] transition-colors group cursor-pointer ${idx % 2 === 0 ? 'bg-[#f9f9f9]' : 'bg-white'}`}>
                      <div className="col-span-2 font-mono text-[12px] text-[#7e7576]">{(idx + 1).toString().padStart(3, '0')}</div>
                      <div className="col-span-6 font-bold text-[12px] tracking-widest uppercase">{gen.tool_name}</div>
                      <div className="col-span-2 font-mono text-[12px] text-[#4c4546]">{new Date(gen.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</div>
                      <div className="col-span-2 flex justify-end">
                        <span className="px-3 py-1 bg-[#00174a] text-white ed-label-caps text-[10px] font-bold tracking-widest">PROCESSED</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Saved Requisitions */}
            <div className="w-full lg:w-[450px] shrink-0 bg-[#f9f9f9] flex flex-col">
              <div className="p-[24px] px-[40px] border-b border-black bg-[#f9f9f9]">
                <h2 className="font-bold text-[14px] tracking-widest uppercase">SAVED REQUISITIONS</h2>
              </div>
              
              <div className="p-[40px] flex flex-col gap-[40px] bg-white flex-grow">
                {/* Cards */}
                {recentSaves.length === 0 ? (
                  <div className="text-[12px] text-[#7e7576]">No saved requisitions</div>
                ) : (
                  recentSaves.map((save) => (
                    <div key={save.id} className="border border-black bg-white group cursor-pointer hover:shadow-[8px_8px_0_#cfc4c5] transition-all">
                      <div className="aspect-[16/9] bg-[#eeeeee] relative overflow-hidden border-b border-black p-6">
                        <div className="absolute inset-0 bg-[#cfc4c5] mix-blend-multiply opacity-20 group-hover:opacity-0 transition-opacity"></div>
                        <p className="font-mono text-sm line-clamp-6">{save.prompt}</p>
                      </div>
                      <div className="p-[24px] flex justify-between items-start bg-white">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-bold text-[12px] tracking-widest uppercase line-clamp-1">{save.title || 'UNTITLED'}</h3>
                          <p className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] uppercase">{save.target_tool || 'GENERAL'}</p>
                        </div>
                        <button className="text-[#FF6D87] hover:opacity-70 transition-opacity">
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-black bg-[#f9f9f9] flex justify-between items-center px-[40px] py-[24px]">
        <div className="ed-label-caps text-[10px] tracking-widest font-bold">
          ©2024 LOVE4PROMPTS. ALL RIGHTS RESERVED.
        </div>
        <div className="hidden md:flex gap-[24px] ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">
          <a href="#" className="hover:text-black transition-colors">TERMS</a>
          <a href="#" className="hover:text-black transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-black transition-colors">COLOPHON</a>
          <a href="#" className="hover:text-black transition-colors">CONTACT</a>
        </div>
      </footer>
    </div>
  );
};
