import React, { useState } from 'react'

const useSignupHook = (props) => {


  const [data, setdata] = useState(null)
  const [status, setstatus] = useState(null)
  const [error, seterror] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  
  const signup = async ()=> {

    setisLoading(true)
    console.log(props.data)
       await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.data),
      }).then(async (res) => {
        setstatus(res.status)
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.data);
        }
        return res.json();
      })
      .then((data) => {
        setdata(data);
      })
      .catch((err) => {
        setdata(err);
        setstatus(400);
        seterror(err.message);
      })
      .finally(()=>{
        setisLoading(false)
      })

      
    
            
          }
          
      return {data, status, error,isLoading, signup}
}

export default useSignupHook
