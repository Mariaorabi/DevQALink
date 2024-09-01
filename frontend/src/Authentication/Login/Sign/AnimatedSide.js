import React, { useState } from 'react'


import '../LoginCss/Login.css'
const AnimatedSide = (props) => {

  return (
    <div id='rightSide' className={props.sign ? 'SignInSlideLeft' : 'SignupSlideRIGHT'}>
        <div>

        <p id='helloPargraph'>Hello, Stranger!</p>
        <p id='pargraph'>Enter your personal details</p>
        </div>
     <button id='signButton1' style={{width : 250, height : 50, borderRadius : 50, borderWidth : 0, cursor : "pointer"}} onClick={()=>{props.setsign(!props.sign)}}>
      {props.sign ? 'Signin' : 'Signup'}
     </button>
      </div>
  )
}

export default AnimatedSide
