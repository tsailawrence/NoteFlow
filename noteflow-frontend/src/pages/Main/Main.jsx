<<<<<<< HEAD
import { useRef } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
=======
import Sidebar from "../../Components/Sidebar/Sidebar.jsx";

>>>>>>> d4565c7ba24bf9691dfe018dbd8ceec99be8b693
import "./Main.scss";
import FlowGrid from "../../Components/FlowGrid/FlowGrid.jsx";
import PageTab from "../../Components/PageTab/PageTab.jsx";
import Library from "../../Components/Library/Library.jsx";
import { useFlowStorage } from "../../storage/Storage";
import Calendar from "../../Components/Calendar/Calendar.jsx";
import Settings from "../../Components/Settings/Settings.jsx";
<<<<<<< HEAD
import BackToTopButton from "../../Components/BacktoTopButton/BackToTopButton.jsx";
=======
>>>>>>> d4565c7ba24bf9691dfe018dbd8ceec99be8b693

export default function Main() {
  const mode = useFlowStorage((state) => state.mode);
  const containerRef = useRef(null);
  return (
    <div className="App">
      <div className="App-container">
        <Sidebar />
        <div className="App-tab">
          <PageTab />
<<<<<<< HEAD
          <div className="Flow-grid" ref={containerRef}>
=======
          <div className="Flow-grid">
>>>>>>> d4565c7ba24bf9691dfe018dbd8ceec99be8b693
            {mode === 0 ? (
              <FlowGrid />
            ) : mode === 1 ? (
              <Library />
            ) : mode === 2 ? (
              <Calendar />
            ) : (
              <Settings />
            )}
            {containerRef.current && (
              <BackToTopButton containerRef={containerRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
