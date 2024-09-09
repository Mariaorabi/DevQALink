import React, { useState } from 'react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: ''
  });
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setStatusMessage("Resetting password...");

      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          newPassword: formData.newPassword
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setStatusMessage("Password has been reset successfully!");
      } else {
        setStatusMessage(`Error: ${responseData.data}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <form id='resetPasswordForm' onSubmit={handleSubmit}>
      <div id='formContainer'>
        <h2>Reset Password</h2>

        

        <div id='inputContainer'>
          <label>Reset Token</label>
          <input 
            type='text' 
            placeholder='Enter the reset token' 
            name='token'
            value={formData.token}
            onChange={handleChange}
            required 
          />
        </div>

        <div id='inputContainer'>
          <label>New Password</label>
          <input 
            type='password' 
            placeholder='Enter your new password' 
            name='newPassword'
            value={formData.newPassword}
            onChange={handleChange}
            required 
          />
        </div>

        <input type='submit' value='Reset Password' id='submit' />

        {/* הצגת הודעת סטטוס */}
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </form>
  );
}

export default ResetPassword;
