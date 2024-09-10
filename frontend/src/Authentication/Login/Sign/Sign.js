import React, { useState } from 'react'
import '../LoginCss/Login.css'
import AnimatedSide from './AnimatedSide'
import SignForm from './SignForm'
import Spinner from '../../../Components/Spinner'
const Sign = () => {

  const [sign, setsign] = useState(false)
  const [visble, setvisble] = useState(true)
  return (
    visble &&
    <div id='login'>
     
     <SignForm sign={sign} setvisble={setvisble} />

      <AnimatedSide sign={sign} setsign={setsign}/>

      
    </div>
  )
}

export default Sign
