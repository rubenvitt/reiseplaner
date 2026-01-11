import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/trips': 'Reisen',
  '/settings': 'Einstellungen',
}

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  // Check for trip detail pages
  if (pathname.startsWith('/trips/')) {
    return 'Reise Details'
  }

  return 'Reiseplaner'
}

export function Header() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pageTitle = getPageTitle(location.pathname)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
          {/* Mobile: Logo and Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? 'Menu schliessen' : 'Menu oeffnen'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Reiseplaner</span>
            </div>
          </div>

          {/* Page Title */}
          <h1 className="hidden lg:block text-lg font-semibold text-gray-900">
            {pageTitle}
          </h1>

          {/* Mobile: Page Title (centered) */}
          <h1 className="lg:hidden text-lg font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
            {pageTitle}
          </h1>

          {/* Placeholder for right side actions */}
          <div className="w-10 lg:w-auto" />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:hidden',
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <Sidebar />
          </div>
        </>
      )}
    </>
  )
}
