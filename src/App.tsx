import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { TripPage } from '@/pages/TripPage'
import { TripOverview } from '@/pages/TripOverview'
import { ItineraryPage } from '@/pages/ItineraryPage'
import { AccommodationsPage } from '@/pages/AccommodationsPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { PackingPage } from '@/pages/PackingPage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="trip/:tripId" element={<TripPage />}>
            <Route index element={<TripOverview />} />
            <Route path="itinerary" element={<ItineraryPage />} />
            <Route path="accommodations" element={<AccommodationsPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="packing" element={<PackingPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
