import { NavLink } from 'react-router-dom'
import { Home, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/settings', icon: Settings, label: 'Einstellungen' },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'h-5 w-5 mb-1',
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  )}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </nav>
  )
}
