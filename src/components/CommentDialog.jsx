import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from "react-router-dom";
import { DialogTrigger } from '@radix-ui/react-dialog';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';


const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState('');
    const { selectedPost , posts } = useSelector(store => store.post);
    const dispatch = useDispatch();
    const [comment, setComment] = useState([]);


    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments || []); // Make sure to reset comments to an empty array if none exist
        } else {
            setComment([]); // Clear comments when there is no selectedPost
        }
    }, [selectedPost]);  // Dependency should be `selectedPost`
    
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText(''); 
        }
    }

    const sendMessageHandler = async () => {
        try {
            console.log(text)
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${selectedPost?._id}/comment`, { text },
                { headers: { "Content-Type": "application/json" }, withCredentials: true })
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p => 
                p._id === selectedPost._id ?
                { ...p, comments: updatedCommentData } : p);
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText('');
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl max-h-[900px] p-0 flex flex-col">
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img src={selectedPost?.image}
                            alt="none"
                            className='w-full h-full object-cover rounded-l-lg'
                        />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center">
                                <Link >
                                    <Avatar >
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs"> {selectedPost?.author?.username}</Link>
                                    {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center text-sm text-center">
                                    <div className="cursor-pointer w-full text-red-600 font-bold">unfollow</div>
                                    <div className="cursor-pointer w-full">add to favorite</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment?.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input type="text" placeholder='add comment...' className=' w-full outline-none border border-gray-300 p-2 rounded' value={text} onChange={changeEventHandler} />
                                <Button disabled={!text.trim()} varient="outline" onClick={sendMessageHandler}> Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog