import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataUrl } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const {user} = useSelector(store=>store.auth)
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataUrl(file)
      setImagePreview(dataUrl);
    }
  }


  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption",caption);
    if(imagePreview) formData.append('image',file);
    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/addpost`,formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      });
      console.log(res)
      if(res.data.success){
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message);
        setCaption('');
        setImagePreview('');
        setFile(null);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader >
          <DialogTitle className={"text-clip font-semibold"}>Create new post</DialogTitle>
        </DialogHeader>
        <div className='flex  gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>Bio Here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="write a caption..." />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center '>
              <img src={imagePreview} className="object-contain h-full w-full rounded-md" alt="preview" />
            </div>
          )
        }
        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto hover:bg-[#0f5483]">
          Select from computer
        </Button>
        { 
          imagePreview && (
          loading ? (
            <Button>
              <Loader2 className='animate-spin mr-2 h-4'/>
              <span>please wait</span>
            </Button>
          ):(
            <Button onClick={createPostHandler} type="submit">Post</Button>
          )
        )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost