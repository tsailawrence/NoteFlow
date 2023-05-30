import { useEffect, useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { SHA256 } from 'crypto-js';
import instance from '../../API/api';
import './ResetPage.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import TryMe from '../../Components/TryMe/tryMe';

function ResetPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const { isMobile } = useApp();

  const [showLogo, setShowLogo] = useState(false);
  const [showTryMe, setShowTryMe] = useState(false); //切換 logo 以及 tryme

  if (!email || !token) {
    navigate('/');
  }

  useEffect(() => {
    // 想辦法先阻斷 useApp() 的 navigation->送請求過去
    instance
      .post('/user/reset-password-auth', { token, email })
      .then((res) => {
        if (res.status !== 200) {
          alert('The token has broken. Please resend email to us again.');
          navigate('/');
        }
      })
      .catch((e) => {
        alert('Request Timeout. Please resend email to us again.');
        navigate('/');
      });
  }, []);

  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [alarms, setAlarms] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== checkPassword) return;
    const passwordHashed = SHA256(password).toString();
    const request = {
      newPassword: passwordHashed,
    };
    instance.post('/user/reset-password-renew', request).then((res) => {
      if (res.status === 200) {
        alert('Success! You can log in with your new password!');
        navigate('/');
      }
    });
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

  return email && token ? (
    <div className={`${isMobile ? 'resetPage-mobile' : 'resetPage'}`}>
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
        <h2>Reset Password</h2>
        <div className="infoContainer">
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            style={{ margin: '1vh 1vw', width: '80%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={'Password'}
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
              label={'Check Password'}
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
                // border: '1px solid black',
                textAlign: 'left',
                padding: '0 10px 0 10px',
              }}
            >
              {alarms}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              style={{
                backgroundColor: '#0e1111',
                color: 'white',
                paddingTop: '1vh',
                textTransform: 'none',
              }}
            >
              {'Reset'}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ResetPage;
