import { useState } from 'react';

const useLoginHook = (props) => {
  
  const [data, setData] = useState(null); 
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null); 


  const [isLoading, setisLoading] = useState(false)
  
  const login = async () => {
    setisLoading(true)
    await fetch('http://localhost:3000/auth/getuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props.data)
    })
      .then(async (res) => {
        setStatus(res.status); 
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message);
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
        setData(err);
      })
      .finally(()=> {

        setisLoading(false)
      })
  };

  return { data, status, error,isLoading, login };
};

export default useLoginHook;