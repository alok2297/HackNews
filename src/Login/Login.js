import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    console.log(credentials);
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", credentials);
      console.log(res);
      const data = await res.json();
      if (res.status === 201) { // Check for the correct status code
        console.log("logged Successfully");
        localStorage.setItem("isAuthenticated","true");
        localStorage.setItem("userId", data.userId);
        navigate("/");
      }
    } catch (err) {
      console.log("not Success");
    }
  };

  return (
    <div>
      <h3>Signup</h3>
      <form method='post'>
        <input 
          type='text' 
          name='username' 
          placeholder='Enter your Email' 
          value={credentials.username} 
          onChange={handleChange} 
        />
        <input 
          type='password' 
          name='password' 
          placeholder='Password' 
          value={credentials.password} 
          onChange={handleChange} 
        />

        <button type='submit' onClick={handleClick}>Signup</button>
      </form>
    </div>
  );
};

export default Login;
