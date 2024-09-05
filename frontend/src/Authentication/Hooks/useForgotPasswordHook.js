import React, { useState } from 'react'

const useForgotPasswordHook = (props) => {
 


  const [data, setdata] = useState(null)
  const [status, setstatus] = useState(null)
  const [error, seterror] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  const forgotPassword = async () => {
    setisLoading(true)
       await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: props.formData.email }), // שלח את כתובת הדוא"ל בלבד
      })
      .then(async (res) => {
        setstatus(res.status);
        if(!res.ok){
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
        setstatus(404);
        seterror(err.message);
      })
      .finally(() => {
        setisLoading(false)
      })
  }

  return {data, status, error,isLoading, forgotPassword}
}

export default useForgotPasswordHook
