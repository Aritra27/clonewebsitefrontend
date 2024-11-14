import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Item } from '@radix-ui/react-select'
import { Popover, PopoverContent } from './ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'


const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth)
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            console.log(res)
            if (res.data.sucess) {
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate('/login');
                toast.success(res.data.message)

            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const sidebarHandler = (textType) => {
        if (textType === "logout") {
            logoutHandler();
        }
        else if (textType === "create") {
            setOpen(true)
        } 
        else if (textType === "Profile"){
            navigate(`/profile/${user?._id}`);
        }
        else if (textType === "Home"){
            navigate('/')
        }
        else if (textType === "Messages"){
            navigate('/chat')
        }
    }
    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notification" },
        { icon: <PlusSquare />, text: "create" },
        {
            icon: <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>,
            text: "Profile"

        },
        { icon: <LogOut />, text: "logout" },
    ]
    return (
        <div className='fixed top-0 z-10 left-0  px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className="flex flex-col">
                <h1 className='my-8 font-bold pl-3 text-xl'>LOGO</h1>
                <div>
                {
                    sidebarItems.map((items, index) => {
                        return (
                            <div onClick={() => sidebarHandler(items.text)} key={index}
                                className=' flex flex-row items-center gap-3 relative
                                hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-2'>
                                {items.icon}
                                <span>{items.text}</span>
                                {
                                    items.text === "Notification" && likeNotification.length>0 && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button size='icon' className='rounded-full h-5 w-5 absolute bottom-6 left-6'>{likeNotification.length}</Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div>
                                                    {
                                                        likeNotification.length === 0 ? (<p>No new Notification</p>):(
                                                            likeNotification.map((notification)=>{
                                                                return (
                                                                    <div key={notification.userId}>
                                                                        <Avatar>
                                                                            <AvatarImage src ={notification.userDetails?.profilePicture}/>
                                                                        </Avatar>
                                                                        <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                    </div>
                                                                )
                                                            })
                                                        )
                                                    }
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }
                            </div>
                        )
                    })
                }
                </div>
            </div>
                <CreatePost open={open} setOpen={setOpen}/>
        </div>
    )
}

export default LeftSidebar