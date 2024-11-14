import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircle, MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send/${receiverId}`, { textMessage },
        {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        }
      )
      console.log(res);
      if (res.data.success) {
        console.log("first")
        dispatch(setMessages([...messages, res.data?.newMessage]));
        console.log("second")
        setTextMessage('');
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    }
  }, []);
  return (
    <div className='flex ml-[16%] h-screen'>
      <section className='w-full md:w-1/4 my-8'>
        <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
        <hr className='mb-4 border-gray-50' />
        <div className='overflow-y-auto h-[88vh]'>
          {
            suggestedUsers?.map((suggestedUser) => {
              const isOnline = onlineUsers?.includes(suggestedUser?._id);
              return (
                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-200 cursor-pointer'>
                  <Avatar className='w-14 h-14' >
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? "text-green-600" : "text-red-600"}`}>{isOnline ? "online" : "offline"}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>
      {
        selectedUser ? (
          <section className='flex-1 border-l-gray-300 flex flex-col h-full'>
            <div className=' flex gap-3 items-center px-3 border-b border-gray-300 sticky top-0 bg-white z-10 '>
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span>{selectedUser?.username}</span>
              </div>
            </div>
            <Messages selectedUser={selectedUser} />
            <div className='flex items-center p-4 border-t border-t-gray-300'>
              <Input type="text" value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)} className='flex-1 mr-2 focus-visible:ring-transparent' placeholder='messages' />
              <Button onClick={() => sendMessageHandler(selectedUser?._id)}>send</Button>
            </div>
          </section>
        ) : (
          <div className='flex flex-col items-center justify-center  mx-auto'>
            <MessageCircleCode className='w-32 h-32 my-4' />
            <h1 className='font-medium text-xl'>your messages</h1>
            <span>send a message to start a chat</span>
          </div>
        )
      }
    </div>
  )
}

export default ChatPage