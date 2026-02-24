import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import Home from "./pages/Home";
import CharacterCreation from "./pages/CharacterCreation";
import OrbsMap from "./pages/OrbsMap";
import OrbDetail from "./pages/OrbDetail";
import ChallengePage from "./pages/ChallengePage";
import Profile from "./pages/Profile";
import Inventory from "./pages/Inventory";
import Grimoire from "./pages/Grimoire";
import Medals from "./pages/Medals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CharacterCreation />} />
            <Route path="/orbs" element={<OrbsMap />} />
            <Route path="/orb/:orbId" element={<OrbDetail />} />
            <Route path="/challenge/:challengeId" element={<ChallengePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/grimoire" element={<Grimoire />} />
            <Route path="/medals" element={<Medals />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
