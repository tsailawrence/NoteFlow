import { useContext, createContext, useState, useEffect } from 'react';
import crc32 from 'crc-32';
import instance from '../API/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserContext = createContext({
  user: {},
  cssValue: '',
  logout: () => {},
  setCssValue: () => {},
  refetchFromLocalStorage: () => {},
});

const MediaContext = createContext({
  isMobile: false,
});

const getRandomPicture = (name) => {
  const hash = Math.abs(crc32.str(name) + Number(Date.now() / 3600000));
  return `/assets/avatar/${Math.ceil(hash % 7)}.png`;
};

let { VITE_AVAI_CSS } = import.meta.env;
VITE_AVAI_CSS = JSON.parse(VITE_AVAI_CSS);

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const { i18n } = useTranslation();
  const [rerender, setRerender] = useState(false);
  const [cssValue, setCssValue] = useState(VITE_AVAI_CSS[0]);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('tabList');
    setUser('');
    navigate('/');
  };
  const location = useLocation();

  useEffect(() => {
    instance
      .get('/user/who-am-i')
      .then((res) => {
        const user = res.data;

        // if (!user.logined && location.pathname !== '/resetPassword') {
        //   navigate('/');
        // }
        const picture = user.picture
          ? user.picture.startsWith('http')
            ? user.picture
            : `/api/fs/image/${user.picture}`
          : getRandomPicture(user.email);
        setUser({
          ...user,
          picture,
        });
      })
      .catch((e) => {
        navigate('/');
      });
  }, [rerender]);

  useEffect(() => {
    let key = localStorage.getItem('noteflow-quill-css');
    if (!VITE_AVAI_CSS.includes(key)) {
      localStorage.setItem('noteflow-quill-css', VITE_AVAI_CSS[0]);
      key = VITE_AVAI_CSS[0];
    }
    setCssValue(key);

    const lang = localStorage.getItem('noteflow-lang');
    if (!lang) {
      i18n.changeLanguage(i18n.languages[0]);
      localStorage.setItem('noteflow-lang', i18n.languages[0]);
    } else {
      i18n.changeLanguage(lang);
    }
  }, []);

  useEffect(() => {
    if (!cssValue) return;
    console.log(`Change css style to ${cssValue}`);
    import(`../../node_modules/highlight.js/styles/${cssValue}.css`);
    localStorage.setItem('noteflow-quill-css', cssValue);
  }, [cssValue]);

  const refetchFromLocalStorage = () => {
    setRerender((prev) => !prev);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        refetchFromLocalStorage,
        logout,
        cssValue,
        setCssValue,
      }}
      {...props}
    />
  );
};

const MediaProvider = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // const [isMobile, setIsMobile] = useState(false);
  // console.log(isMobile);

  // function isMobileBrowser() {
  //   console.log(navigator.userAgent);
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //     navigator.userAgent,
  //   );
  // }

  // useEffect(() => {
  //   if (isMobileBrowser()) {
  //     setIsMobile(true);
  //     console.log(isMobile);
  //   }
  // }, []);

  return (
    <MediaContext.Provider value={{ isMobile }}>
      {children}
    </MediaContext.Provider>
  );
};

// const useApp = () => useContext(UserContext);
const useApp = () => {
  const userContext = useContext(UserContext);
  const mediaContext = useContext(MediaContext);
  return { ...userContext, ...mediaContext };
};

export { useApp, UserProvider, MediaProvider, getRandomPicture, VITE_AVAI_CSS };
