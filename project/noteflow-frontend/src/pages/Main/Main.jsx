import { useRef, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar.jsx';
import './Main.scss';
import FlowGrid from '../../Components/FlowGrid/FlowGrid.jsx';
import PageTab from '../../Components/PageTab/PageTab.jsx';
import Library from '../Library/Library.jsx';
import { useFlowStorage } from '../../storage/Storage';
import Calendar from '../Calendar/Calendar.jsx';
import Settings from '../../Components/Settings/Settings.jsx';
import { useApp } from '../../hooks/useApp.jsx';
import { usePageTab } from '../../hooks/usePageTab.jsx';

export default function Main() {
  const mode = useFlowStorage((state) => state.mode);
  const { setActiveTab } = usePageTab();
  const containerRef = useRef(null);

  //rwd
  const { isMobile } = useApp();
  useEffect(() => {
    setActiveTab(null);
  }, []);

  return (
    // <div className="App">
    <div className={`${isMobile ? 'App-container-mobile' : 'App-container'}`}>
      <Sidebar />
      <div className="App-tab">
        <PageTab />
        <div className="Flow-grid" ref={containerRef}>
          {mode === 0 ? (
            <FlowGrid containerRef={containerRef} />
          ) : mode === 1 ? (
            <Library />
          ) : mode === 2 ? (
            <Calendar />
          ) : (
            <Settings />
          )}
        </div>
      </div>
    </div>
  );
}
