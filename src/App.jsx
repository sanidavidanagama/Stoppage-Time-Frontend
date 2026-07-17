import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home'
import Stats from './pages/Stats'
import Fixture from './pages/Fixture'
import History from './pages/History'
import HistoryDetail from './pages/HistoryDetail'
import TeamSheet from './pages/TeamSheet'
import Login from './pages/Login'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/fixture" element={<Fixture />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:sessionId" element={<HistoryDetail />} />
          <Route path="/team-sheet" element={<TeamSheet />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
