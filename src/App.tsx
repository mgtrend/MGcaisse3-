import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"
import { Toaster } from "sonner"

// Import des composants avec lazy loading pour optimiser le chargement
const LandingPage = lazy(() => import("./pages/LandingPage"))
const MainPage = lazy(() => import("./pages/MainPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))

// Composant de chargement
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
  </div>
)

function App() {
  // Récupérer le basename depuis Vite
  const basename = import.meta.env.BASE_URL

  return (
    <Router basename={basename}>
      <Toaster position="top-center" richColors closeButton />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<MainPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
