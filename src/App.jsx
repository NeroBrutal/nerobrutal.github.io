import Sidenav from "./components/Sidenav";
import Main from "./components/Main";
import Work from "./components/Work";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Technologies from "./components/Technologies";
import FollowCursor from "./components/FollowCursor";
import MotionCursor from "./components/MotionCursor";

function App() {
  return (
    <div>
      <Sidenav />
      {/* <FollowCursor /> */}
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
