import Navbar from "./components/Navbar";
import Main from "./components/Main";
import ImpactStats from "./components/ImpactStats";
import Capabilities from "./components/Capabilities";
import LiveWork from "./components/LiveWork";
import Principles from "./components/Principles";
import CaseStudies from "./components/CaseStudies";
import Testimonials from "./components/Testimonials";
import Work from "./components/Work";
import Skills from "./components/Skills";
import OtherWork from "./components/OtherWork";
import AskAI from "./components/AskAI";
import Contact from "./components/Contact";
import ScrollProgress from "./components/ScrollProgress";
import CommandPalette from "./components/CommandPalette";

function App() {
  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <Main />
      <ImpactStats />
      <Capabilities />
      <LiveWork />
      <Principles />
      <CaseStudies />
      <Testimonials />
      <Work />
      <Skills />
      <OtherWork />
      <AskAI />
      <Contact />
    </div>
  );
}

export default App;
