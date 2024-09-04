import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

 const ResetPassword = () => {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetCode, newPassword }),
      });

      if (response.ok) {
        setMessage('Password has been reset successfully!');
        // הפניה לעמוד ההתחברות
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div id="resetPasswordFormStyle">
      <form id='resetPasswordFormStyle' onSubmit={handleSubmit}>
        <div id='formContainer'>
          <h2>Reset Password</h2>
          <div id='inputContainer'>
            <label>Reset Code</label>
            <input
              type='text'
              placeholder='Enter the reset code'
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              id='input'
              required
            />
          </div>
          <div id='inputContainer'>
            <label>New Password</label>
            <input
              type='password'
              placeholder='Enter your new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id='input'
              required
            />
          </div>
          <input type='submit' value='Reset Password' id='submit' />
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
