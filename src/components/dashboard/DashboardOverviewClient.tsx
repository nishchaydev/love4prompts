import React from 'react';
import { Menu, Bookmark } from 'lucide-react';

export const DashboardOverviewClient: React.FC = () => {
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
            <span className="font-bold text-[16px] tracking-wider uppercase">ARCHIVIST_094</span>
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
                <span className="font-bold text-[24px] tracking-tighter">1,042</span>
              </div>
              <div className="p-[32px] border-r border-black flex flex-col justify-center items-center min-w-[160px] bg-[#f9f9f9]">
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] mb-[8px]">SAVES</span>
                <span className="font-bold text-[24px] tracking-tighter">89</span>
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
                <div className="grid grid-cols-12 p-[24px] px-[40px] border-b border-black items-center hover:bg-[#f3f3f3] transition-colors group cursor-pointer bg-[#f9f9f9]">
                  <div className="col-span-2 font-mono text-[12px] text-[#7e7576]">001</div>
                  <div className="col-span-6 font-bold text-[12px] tracking-widest uppercase">CYBERNETIC_FLORA_09</div>
                  <div className="col-span-2 font-mono text-[12px] text-[#4c4546]">OCT 24, 2024</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="px-3 py-1 bg-[#00174a] text-white ed-label-caps text-[10px] font-bold tracking-widest">PROCESSED</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 p-[24px] px-[40px] border-b border-black items-center hover:bg-[#f3f3f3] transition-colors group cursor-pointer bg-white">
                  <div className="col-span-2 font-mono text-[12px] text-[#7e7576]">002</div>
                  <div className="col-span-6 font-bold text-[12px] tracking-widest uppercase">NEO_TOKYO_ARCH_STUDY</div>
                  <div className="col-span-2 font-mono text-[12px] text-[#4c4546]">OCT 23, 2024</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="px-3 py-1 bg-[#eeeeee] border border-[#7e7576] text-black ed-label-caps text-[10px] font-bold tracking-widest">QUEUED</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 p-[24px] px-[40px] border-b border-black items-center hover:bg-[#f3f3f3] transition-colors group cursor-pointer bg-[#f9f9f9]">
                  <div className="col-span-2 font-mono text-[12px] text-[#7e7576]">003</div>
                  <div className="col-span-6 font-bold text-[12px] tracking-widest uppercase">BRUTALIST_UI_ASSETS</div>
                  <div className="col-span-2 font-mono text-[12px] text-[#4c4546]">OCT 21, 2024</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="px-3 py-1 bg-[#00174a] text-white ed-label-caps text-[10px] font-bold tracking-widest">PROCESSED</span>
                  </div>
                </div>

                <div className="grid grid-cols-12 p-[24px] px-[40px] border-b border-black items-center hover:bg-[#f3f3f3] transition-colors group cursor-pointer bg-white">
                  <div className="col-span-2 font-mono text-[12px] text-[#7e7576]">004</div>
                  <div className="col-span-6 font-bold text-[12px] tracking-widest uppercase">VOID_ENVIRONMENT_TEST</div>
                  <div className="col-span-2 font-mono text-[12px] text-[#4c4546]">OCT 19, 2024</div>
                  <div className="col-span-2 flex justify-end">
                    <span className="px-3 py-1 bg-[#ffdad6] border border-[#FF6D87] text-[#FF6D87] ed-label-caps text-[10px] font-bold tracking-widest">FAILED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Requisitions */}
            <div className="w-full lg:w-[450px] shrink-0 bg-[#f9f9f9] flex flex-col">
              <div className="p-[24px] px-[40px] border-b border-black bg-[#f9f9f9]">
                <h2 className="font-bold text-[14px] tracking-widest uppercase">SAVED REQUISITIONS</h2>
              </div>
              
              <div className="p-[40px] flex flex-col gap-[40px] bg-white flex-grow">
                {/* Card 1 */}
                <div className="border border-black bg-white group cursor-pointer hover:shadow-[8px_8px_0_#cfc4c5] transition-all">
                  <div className="aspect-[16/9] bg-[#eeeeee] relative overflow-hidden border-b border-black">
                    <div className="absolute inset-0 bg-[#cfc4c5] mix-blend-multiply opacity-20 group-hover:opacity-0 transition-opacity"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
                      alt="Structural Grid"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <div className="p-[24px] flex justify-between items-start bg-white">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-[12px] tracking-widest uppercase">STRUCTURAL_GRID_01</h3>
                      <p className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">ARCHITECTURAL / WIREFRAME</p>
                    </div>
                    <button className="text-[#FF6D87] hover:opacity-70 transition-opacity">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="border border-black bg-white group cursor-pointer hover:shadow-[8px_8px_0_#cfc4c5] transition-all">
                  <div className="aspect-[16/9] bg-[#eeeeee] relative overflow-hidden border-b border-black">
                    <div className="absolute inset-0 bg-[#cfc4c5] mix-blend-multiply opacity-20 group-hover:opacity-0 transition-opacity"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1558442074-3c19857bc1dc?auto=format&fit=crop&w=800&q=80" 
                      alt="Neo Brutal Abstract"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <div className="p-[24px] flex justify-between items-start bg-white">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold text-[12px] tracking-widest uppercase">NEO_BRUTAL_ABSTRACT</h3>
                      <p className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">UI ASSETS / GRADIENTS</p>
                    </div>
                    <button className="text-[#FF6D87] hover:opacity-70 transition-opacity">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
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
