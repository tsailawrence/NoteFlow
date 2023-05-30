import googleLogin from './googleLogin.js';
import login from './login.js';
import logout from './logout.js';
import register from './register.js';
import whoAmI from './whoAmI.js';
import {
  forgotPassword,
  forgotPasswordAuth,
  forgotPasswordRenew,
} from './forgotPassword.js';
import getUserPhoto from './getUserPhoto.js';
import setUserPhoto from './setUserPhoto.js';

const service = {
  googleLogin,
  login,
  logout,
  register,
  whoAmI,
  forgotPassword,
  forgotPasswordAuth,
  forgotPasswordRenew,
  getUserPhoto,
  setUserPhoto,
};

export default service;
