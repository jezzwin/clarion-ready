import { Switch, Route, Redirect } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Analyzer from "./pages/analyzer";
import History from "./pages/history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/analyzer" />} />
      <Route path="/analyzer" component={Analyzer} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}

export default App;
