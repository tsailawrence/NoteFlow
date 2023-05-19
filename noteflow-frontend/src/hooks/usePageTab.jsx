import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageTabContext = createContext({
  tabList: [],
  addTab: () => {},
  closeTab: () => {},
  toTab: () => {},
});

const PageTabProvider = (props) => {
  const [tabList, setTabList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const tabListCache = JSON.parse(localStorage.getItem('tabList'));
    if (tabListCache !== null) setTabList(tabListCache);
  }, []);

  console.log('tablist', tabList, activeTab);

  const navigateTo = useNavigate();

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
        return [...prevTabList, newTab];
      });
    else setActiveTab(exist[0].tabId);
  };

  const closeTab = (tabId) => {
    const lastTab = tabList.length == 1;
    if (lastTab) {
      setTabList([]);
      navigateTo('/home');
    } else {
      const tabListUpdated = tabList.filter((tab) => tab.tabId !== tabId);
      localStorage.setItem('tabList', JSON.stringify(tabListUpdated));
      setTabList(tabListUpdated);
      toTab(tabList[0].tabId);
    }
  };

  const toTab = (tabId) => {
    const tabObject = tabList.find((tab) => tab.tabId == tabId);
    const type = tabObject.type;
    const objectId = tabObject.objectId;
    setActiveTab(tabId);
    navigateTo(`/${type}?id=${objectId}`);
  };

  return (
    <PageTabContext.Provider
      value={{ tabList, addTab, closeTab, toTab, activeTab, setActiveTab }}
      {...props}
    />
  );
};

const usePageTab = () => {
  const usePageContext = useContext(PageTabContext);
  return { ...usePageContext };
};

export { usePageTab, PageTabProvider };
