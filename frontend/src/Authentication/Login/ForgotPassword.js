import React, { useEffect, useState } from 'react';
import { MdEmail } from "react-icons/md";
import useForgotPasswordHook from '../Hooks/useForgotPasswordHook';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Components/Spinner';
import { useSelector } from 'react-redux';
import { getUser } from '../../Utility/Redux/Slices/AuthSlice';

const ForgotPassword = () => {




  const [formData, setFormData] = useState({
  });

  const user = useSelector(getUser)

  console.log(user)


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

  
  }, [data])
  


  // פונקציה לניווט לדף Reset Password
  const handleGoToResetPassword = () => {
    navigate('/reset-password');  // ניתוב לדף Reset Password
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


      <Spinner isLoading={isLoading}/>
      {msg && 
      <div id={id}>{msg}</div>
      }
 





 <div style={{display : "flex", justifyContent : "center" ,}}>

{status ===200 && (
        <button type='button' id='button' onClick={()=>{}}>
          Go to Reset Password Page
        </button>
      )}

</div>
    </form>
  );
}

export default ForgotPassword;
