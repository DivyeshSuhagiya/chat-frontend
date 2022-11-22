import React, { useState } from 'react'
import './Login.css';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {

  let obj = {  email: "" , password :"" }
  const [value, setvalue] = useState({...obj})

  let navigate = useNavigate()
  const getOnchangevalue = (e) => {
      setvalue({ ...value, [e.target.name]: e.target.value})
  }
  const saveData =async () => {
      
    axios.post('https://chat-backend-node-app.herokuapp.com/api/user/login' , value ).then(res => {
            if(res.data.isSuccess == true)
              {
                window.location.href = '/chat'
                localStorage.setItem('isLogin' , true)
                localStorage.setItem('userEmail' , value.email)
                setvalue({...obj})
              }
        })

        // setvalue({...obj})
  }
  return (
    <>
        <div className='loginPage'>
            <div className='loginDiv px-4 py-5'>
                <h3 className='mb-4 text-white'>Login</h3>
                <input type="email" name='email' value={value.email} className='input' placeholder='Email address' onChange={getOnchangevalue} />
                <input type="password" name='password' value={value.password} className='input' placeholder='Password' onChange={getOnchangevalue} />

                <div>
                  <button className='add-btn mt-5' onClick={() => saveData()}>Login</button>
                  <button className='cancle-btn mt-4'>cancle</button>
                </div>
                <div className='mt-2 text-muted'><Link to='/register'>Register</Link> for this app</div>
            </div>
        </div>
    </>
  )
}

export default Login