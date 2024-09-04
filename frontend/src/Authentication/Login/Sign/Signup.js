import { MdEmail } from "react-icons/md";
import { FaUser, FaPhone } from "react-icons/fa";
import React, { useState } from 'react';
import { RiLockPasswordFill, RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json();
      
      if (response.ok) {
        alert(responseData.data || "Signup successful!");
      } else {
        alert(`Error: ${responseData.data}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to sign up. Please try again. Error details: ' + error.message);
    }
  };
  
 
  
  return (
    <form id='signUpFormStyle' onSubmit={handleSubmit}>
      <div id='formContainer'>
        <div id='inputContainer'>
          <label>Full Name</label>
          <FaUser className="inputIcon" />
          <input
            type='text'
            placeholder='Full Name'
            id='input'
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div id='inputContainer'>
          <label>Email</label>
          <MdEmail className="inputIcon" />
          <input
            type='email'
            placeholder='Email'
            id='input'
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div id='inputContainer'>
          <label>Username</label>
          <FaUser className="inputIcon" />
          <input
            type='text'
            placeholder='Username'
            id='input'
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div id='inputContainer'>
          <label>Phone Number</label>
          <FaPhone className="inputIcon" />
          <input
            type='tel'
            placeholder='Phone Number'
            id='input'
            name="phone"
            pattern='[0-9]{10}'
            title='Please enter a 10-digit phone number'
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div id='inputContainer'>
          <label>Password</label>
          <div className='passwordContainer'>
            <RiLockPasswordFill className='inputIcon'/>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              id='input'
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span onClick={togglePasswordVisibility} id='togglePassword'>
              {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
            </span>
          </div>
        </div>

        <div id='inputContainer'>
          <label>Role</label>
          <select
            id='roleSelect'
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select a role</option>
            <option value="Software Tester">Quality Assurance</option>
            <option value="Software Developer">Software Developer</option>
          </select>
        </div>

        <input type='submit' value='Sign Up' id='submit1' />
      </div>
    </form>
  );
}

export default Signup;
