import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from './useApp';

const PageTabContext = createContext({
  tabList: [],
  tabToFlowSetting: {},
  addTab: () => {},
  closeTab: () => {},
  deleteTab: () => {}, //Use when deleting a flow
  toTab: () => {},
  renameTab: () => {},
});

const PageTabProvider = (props) => {
  const [tabList, setTabList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [tabToFlowSetting, setTabToFlowSetting] = useState(null);
  const { user } = useApp();
  const [flowWebSocket, setFlowWebSocket] = useState(null);

  useEffect(() => {
    const tabListCache = JSON.parse(localStorage.getItem('tabList'));
    if (tabListCache !== null) setTabList(tabListCache);
    else setTabList([]);
  }, [user]);

  const navigateTo = useNavigate();

  const renewFlowWebSocket = useCallback(
    (ws) => {
      if (flowWebSocket) {
        flowWebSocket.close();
      }
      setFlowWebSocket(ws);
    },
    [flowWebSocket],
  );

  const addTab = (payload) => {
    const exist = tabList.filter((tab) => tab.objectId == payload.objectId);

    if (exist.length === 0)
      setTabList((prevTabList) => {
        let maxId = 0;
        prevTabList.forEach((item) => {
          if (item.tabId > maxId) maxId = item.tabId;
        });
        const newTab = { ...payload, tabId: maxId + 1 };
        localStorage.setItem(
          'tabList',
          JSON.stringify([...prevTabList, newTab]),
        );
        setActiveTab(maxId + 1);
        return [...prevTabList, newTab];
      });
    else setActiveTab(exist[0].tabId);
  };

  const closeTab = (tabId) => {
    const lastTab = tabList.length === 1;
    if (lastTab) {
      setTabList([]);
      setActiveTab(0);
      localStorage.setItem('tabList', null);
      navigateTo('/home');
    } else {
      const tabListUpdated = tabList.filter((tab) => tab.tabId !== tabId);
      localStorage.setItem('tabList', JSON.stringify(tabListUpdated));
      setTabList(tabListUpdated);
      if (activeTab !== 0 && location.pathname !== '/home') {
        toTab(tabListUpdated[tabListUpdated.length - 1].tabId);
      }
    }
  };

  const deleteTab = (id) => {
    const lastTab = tabList.length === 1;
    if (lastTab) {
      setTabList([]);
      localStorage.setItem('tabList', null);
    } else {
      const tabListUpdated = tabList.filter((tab) => tab.objectId !== id);
      localStorage.setItem('tabList', JSON.stringify(tabListUpdated));
      setTabList(tabListUpdated);
    }
    navigateTo('/home');
  };

  const toTab = (tabId) => {
    const tabObject = tabList.find((tab) => tab.tabId == tabId);
    const type = tabObject.type;
    const objectId = tabObject.objectId;
    setActiveTab(tabId);
    navigateTo(`/${type}?id=${objectId}`);
  };

  const renameTab = (tabId, newName) => {
    setTabList((state) => {
      const newState = [...state];
      for (let i = 0; i < newState.length; i += 1) {
        if (newState[i].objectId === tabId) {
          newState[i].name = newName;
          break;
        }
      }
      localStorage.setItem('tabList', JSON.stringify(newState));
      return newState;
    });
  };

  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith('/flow')) {
      setActiveTab(0);
    }
  }, [location]);

  useEffect(() => {
    const get = localStorage.getItem('noteflow-activeTab', activeTab);
    if (get) {
      setActiveTab(get);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('noteflow-activeTab', activeTab);
  }, [activeTab]);

  return (
    <PageTabContext.Provider
      value={{
        tabList,
        addTab,
        closeTab,
        toTab,
        deleteTab,
        renameTab,
        activeTab,
        tabToFlowSetting,
        setActiveTab,
        setTabList,
        flowWebSocket,
        renewFlowWebSocket,
      }}
      {...props}
    />
  );
};

const usePageTab = () => {
  const usePageContext = useContext(PageTabContext);
  return { ...usePageContext };
};

export { usePageTab, PageTabProvider };
