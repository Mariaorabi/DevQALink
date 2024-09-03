import { useState } from 'react';

const useLoginHook = (props) => {
  
  const [data, setData] = useState(null); // Set initial state to null
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null); // To handle and display errors
  
  const login = () => {
    setStatus(null);
    setData(null);
    setError(null);
    fetch('http://localhost:3000/auth/getuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props.data)
    })
      .then((res) => {
        setStatus(res.status); 
        if (!res.ok) {
          throw new Error('Username or password is incorrect');
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        // console.log(data);
      })
      .catch((err) => {
        setData(111);
        setError(err.message); 
      });
  };

  return { data, status, error, login };
};

export default useLoginHook;