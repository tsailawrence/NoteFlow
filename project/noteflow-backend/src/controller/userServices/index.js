import googleLogin from './googleLogin.js';
import login from './login.js';
import logout from './logout.js';
import register from './register.js';
import updateUserInfo from './updateUserInfo.js';
import whoAmI from './whoAmI.js';
import verifyToken from './verifyToken.js';
import {
  forgotPassword,
  forgotPasswordAuth,
  forgotPasswordRenew,
} from './forgotPassword.js';
import getUserPhoto from './getUserPhoto.js';
import setUserPhoto from './setUserPhoto.js';

const service = {
  googleLogin,
  verifyToken,
  login,
  logout,
  register,
  updateUserInfo,
  whoAmI,
  forgotPassword,
  forgotPasswordAuth,
  forgotPasswordRenew,
  getUserPhoto,
  setUserPhoto,
};

export default service;
