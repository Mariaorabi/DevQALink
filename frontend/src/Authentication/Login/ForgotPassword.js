import React from 'react';
import { MdEmail } from "react-icons/md";


const ForgotPassword = () => {
  return (
    <form id='forgotPasswordFormStyle'>
      <div id='formContainer'>
        <h2>Reset Password</h2>
        <div id='inputContainer'>
          <label>Email</label>
          <MdEmail className="inputIcon" />
          <input type='email' placeholder='Enter your email' id='input' required />
        </div>

        <input type='submit' value='Reset Password' id='submit' />
      </div>
    </form>
  );
}

export default ForgotPassword;
