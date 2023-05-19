import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { SHA256 } from 'crypto-js';
import instance from '../../API/api';
import './ResetPage.scss';
import { useNavigate } from 'react-router-dom';

function ResetPage() {
  const [count, setCount] = useState(0);

  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [alarms, setAlarms] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== checkPassword) return;
    const passwordHashed = SHA256(password).toString();
    const request = {
      password: passwordHashed,
    };
    instance.post('/user/reset-password-renew', { request }).then((res) => {
      if (res.status === 200) navigate('/');
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
          <h2>Reset Password</h2>
          <div className="infoContainer">
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              style={{ margin: '10px 15px' }}
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
                  sx={{ mt: 2, mb: 2, width: '45%' }}
                  style={{ backgroundColor: 'white', color: 'black' }}
                  // onClick={() => navigateTo("/")}
                >
                  {'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, mb: 2, width: '45%' }}
                  style={{ backgroundColor: '#0e1111', color: 'white' }}
                >
                  {'Register'}
                </Button>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPage;
