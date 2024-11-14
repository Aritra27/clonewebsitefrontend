import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Signup = () => {

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({
      ...input, [e.target.name]: e.target.value
    })
  }
  const SignupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredential: true
      })
      console.log(res)
      if (res.data.sucess) {
        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={SignupHandler} className='shadow-lg  flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Sign up to see photos and video for your friend</p>
        </div>
        <div>
          <span className='font-medium'>Username</span>
          <Input type='text'
            className=" focus-visible:ring-transparent my-2"
            name='username'
            value={input.username}
            onChange={changeEventHandler} />
        </div>
        <div>
          <span className='font-medium'>Email</span>
          <Input type='email'
            className=" focus-visible:ring-transparent my-2"
            name='email'
            value={input.email}
            onChange={changeEventHandler} />
        </div>
        <div>
          <span className='font-medium'>Password</span>
          <Input type='password'
            className=" focus-visible:ring-transparent my-2"
            name='password'
            value={input.password}
            onChange={changeEventHandler} />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              please wait
            </Button>
          ) : (
            <Button type="submit">Signup</Button>
          )
        }
        <span className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></span>
      </form>
    </div>
  )
}

export default Signup