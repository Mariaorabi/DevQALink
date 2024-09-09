import React from 'react'

import FaceIcon from '../../../images/faceRecognition.svg'
import { useSelector } from 'react-redux';
import { getFaceIo } from '../../../Utility/Redux/Slices/FaceIoSlice';
import { getUser } from '../../../Utility/Redux/Slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
const FaceRecognitionSignup = () => {

  const faceIo = useSelector(getFaceIo)



  const user = useSelector(getUser)


  const navigate = useNavigate()


  const handleSignup = async (e) => {

    try {
      let response = await faceIo.enroll({
        locale: "auto",
        payload: {

           user : user
          
          // email: "example@gmail.com",
          // pin: "12345",
        },
      });


      console.log(` Unique Facial ID: ${response.facialId}
      Enrollment Date: ${response.timestamp}
      Gender: ${response.details.gender}
      Age Approximation: ${response.details.age}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div id='forgotPasswordForm' style={{justifyContent : "center", alignItems : "center", display : "flex", height : "50%"}}>


    <div style={{display : "flex", justifyContent : "center", padding : 10, flexDirection : "column", alignItems : "center", width : "65%", height : "100%"}}>
      <img src={FaceIcon} alt='face recognition' id='faceIcon' style={{height : 150, width : 150,}}/>

        <h3>Register Your Face for Secure Sign-In</h3>


<div style={{display : "flex",flexDirection :"column", width : "100%", height : "100%", justifyContent  : "space-between"}}>

        <button  style={{backgroundColor : "#26a0da", borderWidth : 0, height : "40%", cursor : "pointer"}} onClick={handleSignup}>Capture Face</button>
        <button style={{ borderWidth : 0, height : "40%", cursor : "pointer"}} onClick={()=>navigate("/forgot-password")}>Complete to your account</button>
</div>
    </div>
    </div>
  )
}

export default FaceRecognitionSignup
