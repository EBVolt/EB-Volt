import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FindCharger from "./pages/FindCharger";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import PublicCharging from "./pages/PublicCharging";
import FleetCharging from "./pages/FleetCharging";
import BusinessPartnerships from "./pages/BusinessPartnerships";
import ChargerInstallation from "./pages/ChargerInstallation";
import Support from "./pages/Support";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-charger" component={FindCharger} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/account" component={Account} />
      <Route path="/services/public-charging" component={PublicCharging} />
      <Route path="/services/fleet-charging" component={FleetCharging} />
      <Route path="/services/business-partnerships" component={BusinessPartnerships} />
      <Route path="/services/charger-installation" component={ChargerInstallation} />
      <Route path="/services/support" component={Support} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
