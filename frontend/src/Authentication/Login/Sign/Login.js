import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from 'react-router-dom';










  const Login = () => {
    const [input, setinput] = useState({})
  
  
    const [data, setdata] = useState([])
  
    function handleChange(e){
      setinput({
        ...input,
        [e.target.name]: e.target.value
    })}
  
  
    function handleSubmit(e){
      e.preventDefault()
    }











  return (
    <form id='loginFormStyle'>
      <div id='formContainer'>
        <div id='inputContainer'>
          <label>Username</label>
          <MdEmail className="inputIcon" />
          <input type='text' placeholder='Username' id='input' required />
        </div>

        <div id='inputContainer'>
          <label>Password</label>
          <RiLockPasswordFill className='inputIcon'/>
          <input type='password' placeholder='Password' id='input' required />
        </div>

        <div id='forgotPasswordContainer'>
        <Link to="/forgot-password" id='forgotPasswordLabel'>Forgot password?</Link>
        </div>

        <input type='submit' value='Login' id='submit' />

        <div id='or'>
          <p>or</p>
        </div>

        <button id='faceRecognitionButton'>Login with Face Recognition</button>
      </div>
    </form>
  );
}

export default Login;