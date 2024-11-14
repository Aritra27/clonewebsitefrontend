import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';



const Post = ({ post }) => {
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        }
        else {
            setText('')
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            console.log(res);
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1
                setPostLike(updatedLikes)
                setLiked(!liked);
                const updatedPostData = posts.map(p => p._id === post._id ? {
                    ...p, likes: liked ? p.likes.filter(id => id !== user._id)
                        : [...p.likes, user._id]
                } : p
                )
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }

    const commentHandler = async () => {
        try {
            console.log(text)
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, { text },
                { headers: { "Content-Type": "application/json" }, withCredentials: true })
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p => p._id === post._id ? { ...p, comments: updatedCommentData } : p);
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText('');
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const deletePostHandler = async () => {
        try {
            console.log(post._id)
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, { withCredentials: true })
            if (res.data.sucess) {
                const updatedPostData = posts.filter((postItem) => postItem._id !== post?._id)
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar >
                        <AvatarImage src={post.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex gap-3 items-center'>
                    <h1>{post.author?.username}</h1>
                    { user?._id === post?.author._id &&  <Badge>Author 🎤</Badge> }
                    </div>
                </div>

                {/* 3 dot button working */}
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button varient='ghost' className='cursor-pointer w-fit '>unfollow</Button>
                        <Button varient='ghost' className='cursor-pointer w-fit '>Add to favorite</Button>
                        {
                            user && user?._id === post?.author._id &&
                            <Button varient='ghost' onClick={deletePostHandler} className='cursor-pointer w-fit bg-red-600'>delete</Button>
                        }
                    </DialogContent>
                </Dialog>

            </div>

            {/* image of the post  */}
            <img src={post.image} />

            {/* under the posts working buttons */}
            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-3">
                    {
                        liked ? 
                        <FaHeart size={'22px'} onClick={likeOrDislikeHandler} className='cursor-pointer hover:text-gray-600 text-red-700' /> : 
                        <FaRegHeart size={'22px'} onClick={likeOrDislikeHandler} className='cursor-pointer hover:text-gray-600' />
                    }

                    <MessageCircle className='cursor-pointer  hover:text-gray-600 ' onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                        console.log("set selected post")
                    }} />
                    <Send className='cursor-pointer  hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer  hover:text-gray-600 ' />
            </div>

            {/* likes and caption */}

            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium  mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment.length>0 && <span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true)
                    console.log("set selected post")
                }}
                className='cursor-pointer text-sm text-gray-500'>view all {comment.length} comments</span>
            }
            

            {/* open part of comments */}
            <CommentDialog open={open} setOpen={setOpen} />

            {/* comment places */}
            <div className='flex items-center justify-between '>
                <input type="text"
                    placeholder='Add a comment..'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full' />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }
            </div>
        </div>
    )
}

export default Post