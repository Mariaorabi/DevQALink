import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');



  const [formData, setFormData] = useState({
  });





  const handleChange = (e) => {
  setFormData({...formData, [e.target.name] : e.target.value})
  };

  
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      try {
        const response = await fetch('http://localhost:3000/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }), // שלח את כתובת הדוא"ל בלבד
        });
    
        const responseData = await response.json();
        
        if (response.ok) {
          alert(responseData.message || "Password reset link sent successfully!");
        } else {
          alert(`Error: ${responseData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to send reset link. Please try again. Error details: ' + error.message);
      }
    };
  

  return (
    <form id='forgotPasswordForm' onSubmit={handleSubmit}>
      <div id='formContainer'>
        <h2>Forgot Password</h2>
        <div id='inputContainer'>
          <label>Email</label>
          <MdEmail className="inputIcon" />
          <input 
            type='email' 
            placeholder='Enter your email' 
            id='input' 
            name='email'
           
            onChange={handleChange}
            required 
          />
        </div>
        <input type='submit' value='Send Reset Link' id='submit' />
      </div>
    </form>
  );
}

export default ForgotPassword;