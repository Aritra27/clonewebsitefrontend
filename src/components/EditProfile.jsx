import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    })
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
        }
    }
    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }
    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio",input.bio)
        formData.append("gender",input.gender)
        if(input.profilePhoto){
            formData.append("profilePhoto",input.profilePhoto)
        }
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile/edit`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                },withCredentials:true
            })
            console.log(res)
            if(res.data.success){
                const updatedUserData ={
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData)); 
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10 '>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl'>
                    <div className='flex items-center gap-3'>
                        <Avatar >
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || "bio here..."}</span>
                        </div>
                    </div>
                    <input ref={imageRef}  onClick={fileChangeHandler}type="file" className='hidden' />
                    <Button onClick={() => imageRef.current.click()} className="bg-blue-500 h-8 hover:bg-blue-800">Change photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className="focus-visible:ring-transparent" />
                </div>
                <div>
                    <h1 className='font-bold  mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select your Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="male">male</SelectItem>
                                <SelectItem value="female">female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (<Button className='w-fit bg-blue-400 hover:bg-blue-700'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> please Wait</Button>) : <Button className='w-fit bg-blue-400 hover:bg-blue-700' onClick={editProfileHandler}>Submit</Button>
                    }

                </div>
            </section>
        </div>
    )
}

export default EditProfile