import React from 'react'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
const Login = () => {
  return (
    <form id='loginFormStyle'>
    <div id='inputContainer'>

    <label>Username</label>
    <MdEmail className="inputIcon" />
    <input  type='text' placeholder='Username' id='input' />
    </div>

    <div id='inputContainer'>
      
      <label>Password</label>
      <RiLockPasswordFill className='inputIcon'/>

    <input type='password' placeholder='Password' id='input' />
    </div>

<div id='forgotPasswordContainer'>

    <label id='forgotPasswordLabel'>Forgot password?</label>
</div>
    <input type='submit' value='Login' id='submit' />
    <div id='or'>
    <p>or</p>

    </div>
  <button id='faceRecognitionButton'>Login with face recognition</button>
  </form>
  )
}

export default Login
