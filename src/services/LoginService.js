import { login,getSalt,logout } from '../models/Login';
import CryptoJS from 'crypto-js';

const LoginService = {
  async login(password) {
    try {
        const salt = await getSalt();
        const hashed_password = hash(password,salt);
        return await login(hashed_password);
    } catch (error) {
      console.error('LoginService Error:', error);
      throw error; // Re-throw the error to handle it in the component
    }
  },

  async logout(session){
    try{
      const success = await logout(session)
      return success;
    }
    catch(e)
    {
      return false;
    }
  }
};

function hash(password,salt)
{
  const hashedPassword = CryptoJS.SHA256(password + salt).toString();
  // const hashedPassword = crypto.createHash('sha256').update(password + salt).digest('hex');
  // console.log("hpwd : "+hashedPassword);
  return hashedPassword;
}


export default LoginService;