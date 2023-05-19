import { useContext, createContext, useState, useEffect } from 'react';
import crc32 from 'crc-32';
import instance from '../API/api';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserContext = createContext({
  user: {},
  logout: () => {},
  refetchFromLocalStorage: () => {},
});

const MediaContext = createContext({
  isMobile: false,
});

const getRandomPicture = (name) => {
  const hash = Math.abs(crc32.str(name) + Number(Date.now() / 3600000));
  return `/assets/avatar/${Math.ceil(hash % 7)}.png`;
};

const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('zh');
  const { i18n } = useTranslation();

  // console.log(user);
  const [rerender, setRerender] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    setUser('');
    navigate('/');
  };
  useEffect(() => {
    instance
      .get('/user/who-am-i')
      .then((res) => {
        const user = res.data;
        if (!user.picture) {
          user.picture = getRandomPicture(user.name);
        }
        setUser(user);
      })
      .catch((e) => {
        navigate('/');
      });
  }, [rerender]);

  const refetchFromLocalStorage = () => {
    setRerender((prev) => !prev);
  };
  const changeLang = () => {
    i18n.changeLanguage(lang);
    if (lang === 'zh') {
      setLang('en');
    } else {
      setLang('zh');
    }
  };
  return (
    <UserContext.Provider
      value={{ user, refetchFromLocalStorage, logout, changeLang }}
      {...props}
    />
  );
};

const MediaProvider = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // console.log(isMobile);

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

export { useApp, UserProvider, MediaProvider, getRandomPicture };
