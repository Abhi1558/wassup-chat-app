import {X} from 'lucide-react';
import {useAuthStore} from "../store/useAuthStore"
import {useChatStore} from "../store/useChatStore"
import avatar from "../../public/avatar.jpg";

const ChatHeader = () => {
    const {SelectedUser, setSelectedUser} = useChatStore()
    
  return (
    <div className='p-2.5 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div className='avatar'>
                    <div className='size-10 rounded-full relative'>
                        <img  src={SelectedUser?.profilePic || avatar} alt={SelectedUser?.fullName} />
                        

                    </div>
                </div>
                <div>
                    <h3 className='font-bold text-lg'>{SelectedUser?.fullName}</h3>
                </div>
            
            </div>
            <button 
            onClick={() => setSelectedUser(null)}>
                <X className='size-7 hover:bg-primary/30 hover:text-primary/65 rounded-lg '/>
            </button>
        </div>
      
    </div>
  )
}

export default ChatHeader
