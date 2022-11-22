import React, { useState } from 'react'
import './Register.css';
import axios from 'axios'
import { Link } from 'react-router-dom';
const Register = () => {

  let obj = { userName: "" , email: "" , mobile : "" , password :"" ,confirmPassword: "" ,gender: ""  }
  const [value, setvalue] = useState({...obj})

  const getOnchangevalue = (e) => {
      setvalue({ ...value, [e.target.name]: e.target.value})
  }
  const saveData = () => {
        axios.post('https://chat-backend-node-app.herokuapp.com/api/user/register' , value ).then(res => {
        })
        

        setvalue({...obj})
  }
  return (
    <>
        <div className='regitserPage'>
            <div className='registerDiv p-4 py-5'>
                <h3 className='mb-4 text-white'>Regitster</h3>
                <input type="text" name='userName' value={value.userName} className='input' placeholder='User name' onChange={getOnchangevalue} />
                <input type="email" name='email' value={value.email} className='input' placeholder='Email address' onChange={getOnchangevalue} />
                <input type="number" name='mobile' value={value.mobile} className='input' placeholder='Mobile number' onChange={getOnchangevalue} />
                <input type="password" name='password' value={value.password} className='input' placeholder='Password' onChange={getOnchangevalue} />
                <input type="password" name='confirmPassword' value={value.confirmPassword} className='input' placeholder='Confirm Password' onChange={getOnchangevalue} />
                <label htmlFor="" className='d-block text-muted'>Gender</label>
                <input type="radio" name='gender' value='male' className='me-2' onChange={getOnchangevalue} /><span className='text-muted'>Male</span>
                <input type="radio" name='gender' value='female' className='me-2 ms-3' onChange={getOnchangevalue} /><span className='text-muted'>Female</span> 

                <div>
                <button className=' mt-5 add-btn' onClick={() => saveData()}>Save</button>
                <button className='cancle-btn mt-4'>cancle</button>
                </div>
                <div className='mt-2 text-muted'>I have an <Link to='/'>Account</Link></div>
            </div>
        </div>
    </>
  )
}

export default Register