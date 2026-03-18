import { BottomNav } from './BottomNav';

export function PageWrapper({ children, showBottomNav = true }) {
  return (
    <div className={`relative flex min-h-screen w-full flex-col bg-[#F2F2F7] hide-scrollbar ${showBottomNav ? 'pb-24' : ''}`}>
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
