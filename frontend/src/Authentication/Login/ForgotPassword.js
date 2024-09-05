import React, { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import useForgotPasswordHook from '../Hooks/useForgotPasswordHook';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');



  const [formData, setFormData] = useState({
  });


  const {data,status,error,isLoading,forgotPassword} = useForgotPasswordHook({formData : formData});

  const [msg, setmsg] = useState(null)


  const [id, setid] = useState("")



  const navigate = useNavigate();



  const handleChange = (e) => {
  setFormData({...formData, [e.target.name] : e.target.value})
  setmsg(null)
  };

  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setmsg(null)
      forgotPassword();
      
  }

  useEffect(() => {
    
  
   if(status===200){
    console.log(1231231)
    setmsg(data.data)
    setid("Successmsg")
    // navigate("/")
   }

   else if(status && status !== 200){
    setmsg(`${error}`);
    setid("errorMsg")
   }

  //  else {
  //   setmsg(`${error}`);
  //   setid("errorMsg")
  // }
  }, [data])
  

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


      <Spinner isLoading={isLoading}/>
      {msg && 
      <div id={id}>{msg}</div>
      }
    </form>
  );
}

export default ForgotPassword;