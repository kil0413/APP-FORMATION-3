import { BottomNav } from './BottomNav';
import { MainSidebar } from './MainSidebar';

export function PageWrapper({ children, showBottomNav = true }) {
  return (
    <div className="flex w-full min-h-screen bg-[#F2F2F7]">
      {/* Sidebar - Desktop only */}
      <MainSidebar />

      {/* Main Content Area */}
      <div className={`relative flex flex-1 flex-col hide-scrollbar ${showBottomNav ? 'pb-24 md:pb-0' : ''}`}>
        <div className="mx-auto w-full max-w-screen-xl h-full flex flex-col items-center">
           <div className="w-full h-full max-w-[390px] md:max-w-none transition-all duration-500">
             {children}
           </div>
        </div>
        
        {/* Navigation - Mobile only */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
