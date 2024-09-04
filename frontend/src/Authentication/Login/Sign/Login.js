// Login.js
import React, { useState, useEffect } from 'react';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import useLoginHook from '../../Hooks/useLoginHook';
import { useDispatch } from 'react-redux';
import '../LoginCss/Login.css';
const Login = () => {
  const [input, setInput] = useState({});
  const { data, status, error, login } = useLoginHook({ data: input });
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setMsg(null);
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    login(); 
  };

  useEffect(() => {
    if (status === 200) {
      console.log(data)
      dispatch({ type: "SET_USER", payload: data })
      navigate('/forgot-password')
      
    } else if (status && status !== 200) {
      setMsg("Login Failed");
    }
    if (error) {
      setMsg(`${error}`);
    }

  }, [data]);
  

  return (
    
    <form id='loginFormStyle' onSubmit={handleSubmit}>
      <div id='formContainer'>
        <div id='inputContainer'>
          <label>Username</label>
          <MdEmail className="inputIcon" />
          <input type='text' placeholder='Username' id='input' required name='username' onChange={handleChange} />
        </div>

        <div id='inputContainer'>
          <label>Password</label>
          <RiLockPasswordFill className='inputIcon' />
          <input type='password' placeholder='Password' id='input' required name='password' onChange={handleChange} />
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
      



      <div id='ErrorMsgContainer'>

        {msg &&

            <h3 id='errorMsg' >{msg}</h3>
        }

      </div>
    
    </form>
  );
}

export default Login;