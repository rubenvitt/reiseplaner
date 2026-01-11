import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNav } from './MobileNav'

export function AppLayout() {
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
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Header />
        <main className="p-4 pb-20">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
