import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, type ReactNode } from 'react';
import { GameProvider, useGame } from "@/context/GameContext";
import { EmberField } from "@/components/rpg/EmberField";
import HomeSocial from "./pages/HomeSocial";
import CharacterCreation from "./pages/CharacterCreation";
import Atlas from "./pages/Atlas";
import World from "./pages/World";
import OrbDetail from "./pages/OrbDetail";
import ChallengePage from "./pages/ChallengePage";
import Profile from "./pages/Profile";
import Inventory from "./pages/Inventory";
import Grimoire from "./pages/Grimoire";
import Medals from "./pages/Medals";
import Community from "./pages/Community";
import CharacterStories from "./pages/CharacterStories";
import Collections from "./pages/Collections";
import OrbPortfolio from "./pages/OrbPortfolio";
import NotFound from "./pages/NotFound";
import { MotionConfig } from 'framer-motion';

const queryClient = new QueryClient();

// The Claude Artifact build has no server to rewrite paths, so it routes through the URL hash
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function HeroJourney({ children }: { children: ReactNode }) {
  const { state } = useGame();
  return state.character ? children : <Navigate to="/create" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <GameProvider>
          <EmberField />
          <Toaster />
          <Sonner />
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomeSocial />} />
              <Route path="/create" element={<CharacterCreation />} />
              <Route path="/atlas" element={<Atlas />} />
              <Route path="/journeys" element={<Navigate to="/atlas" replace />} />
              <Route path="/world" element={<HeroJourney><World /></HeroJourney>} />
              <Route path="/orbs" element={<Navigate to="/world" replace />} />
              <Route path="/orb/:orbId" element={<HeroJourney><OrbDetail /></HeroJourney>} />
              <Route path="/challenge/:challengeId" element={<HeroJourney><ChallengePage /></HeroJourney>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/grimoire" element={<Grimoire />} />
              <Route path="/medals" element={<Medals />} />
              <Route path="/community" element={<Community />} />
              <Route path="/stories" element={<CharacterStories />} />
              <Route path="/portfolio/:orbId" element={<OrbPortfolio />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </GameProvider>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
