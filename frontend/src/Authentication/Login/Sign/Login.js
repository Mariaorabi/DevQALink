import React, { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

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
    <div id='loginFormContainer'>


    <form id='loginFormStyle' onChange={handleChange} onSubmit={handleSubmit}> 
    <div id='inputContainer'>

    <label>Username</label>
    <MdEmail className="inputIcon" />
    <input  type='text' placeholder='Username' id='input' name='Username'/>
    </div>

    <div id='inputContainer'>
      
      <label>Password</label>
      <RiLockPasswordFill className='inputIcon'/>

    <input type='password' placeholder='Password' id='input' name='Password'/>
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
    </div>
  )
}

export default Login
