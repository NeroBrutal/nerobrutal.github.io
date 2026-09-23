import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Work from "./components/Work";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Technologies from "./components/Technologies";
import MotionCursor from "./components/MotionCursor";
import CosmicBackground from "./components/CosmicBackground";
import LoadingOverlay from "./components/LoadingOverlay";
import ScrollProgress from "./components/ScrollProgress";
import CommandPalette from "./components/CommandPalette";

function App() {
  return (
    <div className="relative">
      <LoadingOverlay />
      <CosmicBackground />
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <Main />
      <Work />
      <Technologies />
      <MotionCursor />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;
