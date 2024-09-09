// Login.js
import React, { useState, useEffect } from 'react';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import useLoginHook from '../../Hooks/useLoginHook';
import { useDispatch, useSelector } from 'react-redux';
import '../LoginCss/Login.css';
import Spinner from '../../../Components/Spinner';
import { getFaceIo } from '../../../Utility/Redux/Slices/FaceIoSlice';
const Login = (props) => {
  const [input, setInput] = useState({});
  const { data, status, error,isLoading, login } = useLoginHook({ data: input });
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const faceIo = useSelector(getFaceIo)
  console.log(faceIo);


  const handleChange = (e) => {
    setMsg(null);
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    setMsg(null)
    login(); 
  };


  const handleLogIn = async () => {
    try {
      let response = await faceIo.authenticate({
        locale: "auto",
      });

      console.log(` Unique Facial ID: ${response.facialId}
          PayLoad: ${response.payload}
          `);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === 200) {
      dispatch({ type: "SET_USER", payload: data })
      navigate('/forgot-password')
      
    } else if (status && status !== 200) {
      setMsg(`${error}`);
    }
    // if (error) {
    //   setMsg(`${error}`);
    // }

  }, [data]);
  

  return (
    
    
    <form id='loginFormStyle' onSubmit={handleSubmit}>
      {/* <Spinner isLoading={true}/> */}
      <div id='LoginformContainer'>
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

        <button id='faceRecognitionButton' onClick={handleLogIn}>Login with Face Recognition</button>
      </div>
      


      <Spinner isLoading={isLoading}/>

      {msg &&
      <div id='ErrorMsgContainer'>
            
            <h3 id='errorMsg' >{msg}</h3> 

      </div>
              }



    
    </form>
  );
}

export default Login;