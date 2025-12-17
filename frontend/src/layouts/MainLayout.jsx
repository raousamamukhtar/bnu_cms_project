import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';

export function MainLayout() {
  const location = useLocation();
  const mainRef = useRef(null);

  // Scroll to top when route changes - comprehensive scroll reset
  useEffect(() => {
    // Reset scroll on main container
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    // Also reset window scroll (in case of any window-level scrolling)
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Reset scroll on document element
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main 
          ref={mainRef}
          className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 overflow-y-auto overflow-x-hidden w-full max-w-full scroll-smooth"
          style={{ scrollBehavior: 'auto' }}
        >
          <div key={location.pathname} className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}


