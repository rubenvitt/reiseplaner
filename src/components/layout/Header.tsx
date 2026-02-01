import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sidebar } from './Sidebar'
import { ThemeToggle } from '@/components/ui'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/settings': 'Einstellungen',
}

function getPageTitle(pathname: string): string {
  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  // Check for trip detail pages
  if (pathname.startsWith('/trip/')) {
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
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
          {/* Mobile: Logo and Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-accent"
              aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Reiseplaner</span>
            </div>
          </div>

          {/* Page Title - Desktop only */}
          <h1 className="hidden lg:block text-lg font-semibold text-foreground">
            {pageTitle}
          </h1>

          {/* Theme Toggle */}
          <ThemeToggle className="hidden lg:flex" />
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
