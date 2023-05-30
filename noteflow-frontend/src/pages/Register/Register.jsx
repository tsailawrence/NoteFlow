import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Box from '@mui/material/Box';
import instance from '../../API/api';
import { SHA256 } from 'crypto-js';
import { useParams } from '../../hooks/useParams';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TryMe from '../../Components/TryMe/tryMe';
import './Register.scss';
import { useApp } from '../../hooks/useApp';

const Register = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({}); // user 是 google 回傳的 object, 可以拿去 render profile 頁面
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [alarms, setAlarms] = useState('');
  const navigateTo = useNavigate();
  const { isMobile } = useApp();

  const [showLogo, setShowLogo] = useState(false);
  const [showTryMe, setShowTryMe] = useState(false); //切換 logo 以及 tryme

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordHashed = SHA256(password).toString();
    const checkPasswordHashed = SHA256(checkPassword).toString();
    const request = {
      user: {
        name: name,
        email: email,
        password: passwordHashed,
      },
    };
    if (passwordHashed !== checkPasswordHashed) {
      alert('Wrong password');
    }
    instance
      .post('/user/register', request)
      .then((res) => {
        navigateTo('/');
      })
      .catch((e) => {
        console.log(e);
        switch (e.response.status) {
          case 400:
            return setAlarms('Some forms are left unfilled.');
          case 401:
            return setAlarms('This email has already taken.');
          default:
            return setAlarms('Internal server error.');
        }
      });

    //
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLogo(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      setShowTryMe(true);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={`${isMobile ? 'register-mobile' : 'register'}`}>
      <div className={`${isMobile ? 'logo-mobile' : 'logo'}`}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={showLogo ? 'logo' : 'tryme'}
            classNames="fade"
            timeout={500}
          >
            {showLogo ? (
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={showTryMe ? 'tryme' : 'h1'}
                  classNames="fade"
                  timeout={500}
                >
                  {showTryMe ? <TryMe /> : <h1>Try Me</h1>}
                </CSSTransition>
              </SwitchTransition>
            ) : (
              <div>
                <img
                  loading="lazy"
                  src="assets/logo.png"
                  width={isMobile ? '120' : '200'}
                  height={isMobile ? '120' : '200'}
                />
                <h1 className="noteflow-title">NoteFlow</h1>
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>

      <div className={`${isMobile ? 'info-mobile' : 'info'}`}>
        <h2>{t('Register')}</h2>
        <div className="infoContainer">
          {Object.keys(user).length === 0 && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              style={{ margin: '1vh 1vw', width: '  80%' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label={t('Name')}
                name="name"
                autoComplete="name"
                autoFocus
                size="small"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('Email Address')}
                name="email"
                autoComplete="email"
                size="small"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('Password')}
                type="password"
                id="password"
                autoComplete="current-password"
                size="small"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('Check Password')}
                type="password"
                id="check-password"
                autoComplete="current-password"
                size="small"
                onChange={(e) => {
                  setCheckPassword(e.target.value);
                }}
              />
              <div
                style={{
                  color: 'red',
                  height: '18px',
                  textAlign: 'left',
                  padding: '0 10px 0 10px',
                }}
              >
                {alarms}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Button
                  variant="contained"
                  sx={{ mt: 2, mb: 2, width: '45%' }}
                  style={{ backgroundColor: 'white', color: 'black' }}
                  onClick={() => navigateTo('/')}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, mb: 2, width: '45%' }}
                  style={{ backgroundColor: '#0e1111', color: 'white' }}
                >
                  {t('Register')}
                </Button>
              </div>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
