import React, { useState } from 'react'

import dell from '../../../images/dell.webp'
import Login from './Login'
import Signup from './Signup'
const SignForm = (props) => {
  const [loginInput, setloginInput] = useState({})
  return (
    <div id='leftSide' className={props.sign ? 'SignInSlideRIGHT' : 'SignupSlideLeft'}>

    <img src={dell}  alt='' id='dellLogo'/>



{props.sign ? <Signup/> : <Login/>}

   


  </div>
  )
}

export default SignForm
