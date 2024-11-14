import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts')

  const { userProfile,user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id=== userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const display = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className="h-32 w-32" >
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (<>
                    <Link to='/account/edit'><Button varient='secondary' className='hover:bg-gray-400 h-8'>Edit Profile</Button></Link>
                    <Button varient='secondary' className='hover:bg-gray-400 h-8'>view archive</Button>
                    <Button varient='secondary' className='hover:bg-gray-400 h-8'>Ad tool</Button>
                  </>) : (
                    isFollowing ? (<>
                      <Button className=' bg-blue-300 hover:bg-blue-400 h-8'>Unfollow</Button>
                      <Button className=' bg-blue-300 hover:bg-blue-400 h-8'>message</Button>
                    </>) :
                      (<Button className=' bg-blue-300 hover:bg-blue-400 h-8'>Follow</Button>)
                  )
                }
              </div>
              <div className=' flex items-center gap-4'>
                <p ><span className='font-semibold'>{userProfile?.posts.length}</span>posts</p>
                <p ><span className='font-semibold'>{userProfile?.followers.length}</span>followers</p>
                <p ><span className='font-semibold'>{userProfile?.following.length}</span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span>{userProfile?.bio || "bio here"}</span>
                <Badge className="w-fit" variant='secondary'><AtSign /> <span className='pl-1 font-medium'>{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items center justify-center gap-10 text-sm'>
            <span className={` py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange("posts")}>POSTS</span>
            <span className={` py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange("saved")}>SAVED</span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              display?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt="post_image" className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <Button className="flex items-center gap-2 hover:text-gray-300 bg-transparent">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </Button>
                        <Button className="flex items-center gap-2 hover:text-gray-300 bg-transparent">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile