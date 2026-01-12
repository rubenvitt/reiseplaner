import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { PageTransition } from '@/components/ui/motion'

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar - Fixed on left */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          <Header />
          <main className="p-6">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Header />
        <main className="p-4 pb-20">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
