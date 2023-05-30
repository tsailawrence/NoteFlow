import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Backdrop, Box, Fade, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { SHA256 } from 'crypto-js';
import './ResetModal.scss';
import instance from '../../API/api';

export default function ResetModal({ show, setShow, handleClose, flowId }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState({
    original: '',
    new: '',
    check: '',
  });
  const [alarms, setAlarms] = useState('');

  useEffect(() => {
    if (show) {
      setPassword({
        original: '',
        new: '',
        check: '',
      });
      setAlarms('');
    }
  }, [show]);

  const handleSubmit = async () => {
    if (password.new !== password.check) {
      setAlarms('New password does not match.');
      return;
    }
    const oldPassword = (password.original).toString();
    const newPassword = SHA256(password.new).toString();

    instance
      .post('/user/reset-password-renew', {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          alert('The password has changed. :)');
          setShow(false);
        }
      })
      .catch((e) => {
        switch (e.response.status) {
          case 401: // 沒有登入
            return setAlarms('Old password is invalid.');
          case 402: // 提供不充分的資料
            return setAlarms('Error. Reopen the window and try again.');
          case 403: // 沒有權限使用
            return setAlarms('You are not authorized to edit this.');
          default:
            return setAlarms('Internal server error.');
        }
      });
  };

  return (
    <Modal
      className="styled-modal"
      open={show}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={show}>
        <Box
          className="modal-content"
          component="form"
          onSubmit={handleSubmit}
          noValidate
          style={{ margin: '10px 15px' }}
        >
          <h2>{t('Reset Password')}</h2>
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label={t('Password')}
            name="password"
            type="password"
            autoComplete="name"
            autoFocus
            size="small"
            onChange={(e) => {
              setPassword({ ...password, original: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="new-password"
            label={t('New Password')}
            type="password"
            id="new-password"
            autoComplete="new-password"
            size="small"
            onChange={(e) => {
              setPassword({ ...password, new: e.target.value });
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="check-password"
            label={t('Check Password')}
            type="password"
            id="check-password"
            autoComplete="current-password"
            size="small"
            onChange={(e) => {
              setPassword({ ...password, check: e.target.value });
            }}
          />
          <div
            style={{
              color: 'red',
              height: '18px',
              // border: '1px solid black',
              textAlign: 'left',
              padding: '0 5px 0 5px',
            }}
          >
            {alarms}
          </div>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
            style={{
              backgroundColor: '#0e1111',
              color: 'white',
              paddingTop: '2%',
              textTransform: 'none',
            }}
          >
            {t('Update')}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
