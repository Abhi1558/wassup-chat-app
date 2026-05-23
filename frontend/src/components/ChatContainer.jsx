import React from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatContainerSkeleton from './skeleton/ChatContainerSkeleton.jsx'
import ChatHeader from "./ChatHeader"
import MessageInput from "../components/MessageInput.jsx"
import ChatMessages from "./ChatMessages"

const ChatContainer = () => {
    const {isMessagesLoading} = useChatStore()
    

  return (
  <div className="flex flex-1 flex-col overflow-auto">

   <ChatHeader />

   <div className="relative flex-1 overflow-y-auto">

      <ChatMessages />

      {isMessagesLoading && (
         <div className="absolute inset-0 bg-base-100 z-10">
            <ChatContainerSkeleton />
         </div>
      )}

   </div>

   <MessageInput />

</div>
)
}

export default ChatContainer
