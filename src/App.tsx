import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastContainer } from '@/components/ui/toast'
import { OnboardingProvider } from '@/components/onboarding'
import { AchievementPopup } from '@/features/gamification/components/AchievementPopup'
import { Dashboard } from '@/pages/Dashboard'
import { TripPage } from '@/pages/TripPage'
import { TripOverview } from '@/pages/TripOverview'
import { TasksPage } from '@/pages/TasksPage'
import { ItineraryPage } from '@/pages/ItineraryPage'
import { TransportPage } from '@/pages/TransportPage'
import { AccommodationsPage } from '@/pages/AccommodationsPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { BudgetPage } from '@/pages/BudgetPage'
import { PackingPage } from '@/pages/PackingPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { StatisticsPage } from '@/pages/StatisticsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MapPage } from '@/pages/MapPage'

function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider defaultTour="dashboard">
        <ToastContainer />
        <AchievementPopup />
        <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="trip/:tripId" element={<TripPage />}>
            <Route index element={<TripOverview />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="itinerary" element={<ItineraryPage />} />
            <Route path="transport" element={<TransportPage />} />
            <Route path="accommodations" element={<AccommodationsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="packing" element={<PackingPage />} />
            <Route path="map" element={<MapPage />} />
          </Route>
        </Route>
        </Routes>
      </OnboardingProvider>
    </BrowserRouter>
  )
}

export default App
