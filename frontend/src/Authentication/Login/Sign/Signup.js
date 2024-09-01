import { MdEmail } from "react-icons/md";
import { FaUser, FaPhone, FaIdCard } from "react-icons/fa";
import React, { useState , useEffect } from 'react';
import { RiLockPasswordFill, RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



    return (
      <form id='signUpFormStyle'>
         <div id='formContainer'>
        <div id='inputContainer'>
          <label>Full Name</label>
          <FaUser className="inputIcon" />
          <input type='text' placeholder='Full Name' id='input' required />
        </div>




        <div id='inputContainer'>
        <label>Email</label>
        <MdEmail className="inputIcon" />
        <input type='Email' placeholder='Email' id='input'  required/>
      </div>

  



        <div id='inputContainer'>
          <label>Username</label>
          <FaUser className="inputIcon" />
          <input type='text' placeholder='Username' id='input' required />

          
        </div>




        <div id='inputContainer'>
        <label>Phone Number</label>
       <FaPhone className="inputIcon" />
       <input
         type='tel'
         placeholder='Phone Number'
         id='input'
         pattern='[0-9]{10}'
         title='Please enter a 10-digit phone number'
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
          />
          <span onClick={togglePasswordVisibility} id='togglePassword'>

            {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
          </span>
        </div>
      </div>
  


        <div id='inputContainer'>
          <label>Role</label>
          <select id='roleSelect' required>
          <option value="  " >Select a role</option>
            <option value="softwareTester">Quality  Assurance</option>
            <option value="softwareDeveloper">Software Developer</option  >
          </select >
        </div>
  
        <input type='submit' value='Next' id='submit1' />
        </div>
      </form>
    )
    
  
}

export default Signup;
