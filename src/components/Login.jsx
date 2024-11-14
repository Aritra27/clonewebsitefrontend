import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({
            ...input, [e.target.name]: e.target.value
        })
    }
    const loginHandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`, input, {
                headers: {
                  'Content-Type': 'application/json'
                },
                withCredentials: true
              })
            console.log(res)
            if (res.data.sucess) {
                dispatch(setAuthUser(res.data.user))
                navigate('/')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={loginHandler} className='shadow-lg  flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Sign up to see photos and video for your friend</p>
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
                        </Button>
                    ) : (
                        <Button type="submit">Signup</Button>
                    )
                }
                <span className='text-center'>don't have an account? <Link to='/signup' className='text-blue-600'>register</Link></span>
            </form>
        </div>
    )
}

export default Login;