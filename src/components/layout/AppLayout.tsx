import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
export function AppLayout() {
  const isMobile = useIsMobile();
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div
        className={cn(
          'flex flex-col sm:gap-4 sm:py-4 sm:pl-14 md:ml-72 transition-[margin-left] sm:transition-none duration-300 ease-in-out',
          isSidebarOpen && isMobile && 'ml-72',
        )}
      >
        <Header />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}