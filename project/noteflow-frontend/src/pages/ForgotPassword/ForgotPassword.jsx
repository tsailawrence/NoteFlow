import React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import instance from '../../API/api';
import { useParams } from '../../hooks/useParams';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({}); // user 是 google 回傳的 object, 可以拿去 render profile 頁面
  const [email, setEmail] = useState('');
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    instance.post('/user/reset-password-send-email', { email }).then((res) => {
      console.log(res.status, res.data);
    });
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="logo">
          <img src="assets/logo.png" alt="" width="190" height="190" />
          <h1>NoteFlow</h1>
        </div>
        <div className="info">
          <h2>{t('Forgot password')}</h2>
          <div className="infoContainer">
            {Object.keys(user).length === 0 && (
              <>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ margin: '10px 15px', width: '80%' }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t('Email Address')}
                    name="email"
                    autoComplete="email"
                    autoFocus
                    size="small"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: '100%',
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ mt: 4, width: '45%' }}
                      style={{ backgroundColor: 'white', color: 'black' }}
                      onClick={() => navigateTo('/')}
                    >
                      {t('Cancel')}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 4, width: '45%' }}
                      style={{ backgroundColor: '#0e1111', color: 'white' }}
                    >
                      {t('Send me an email')}
                    </Button>
                  </div>
                </Box>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ForgotPassword };
