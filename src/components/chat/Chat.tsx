import React, { useEffect, useState } from 'react'
import "./Chat.scss"
import ChatHeader from './ChatHeader'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import GifIcon from '@mui/icons-material/Gif';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ChatMessage from './ChatMessage';
import { useAppSelector } from '../../app/hooks';
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentReference, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Message } from '@mui/icons-material';
import useSubCollection from '../../hooks/useSubCollection';


const Chat = () => {

  const [inputText, setInputText] = useState<string>("");
  const channelId = useAppSelector((state) => state.channel.channelId);
  const channelName = useAppSelector((state) => state.channel.channelName);
  const user = useAppSelector((state) => state.user.user);
  const { SubDocuments: messages } = useSubCollection("channels", "messages");



  const sendMessage = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const collectionRef: CollectionReference<DocumentData> = collection(
      db, 
      "channels", 
      String(channelId), 
      "messages"
    );

    const docRef: DocumentReference<DocumentData> =  await addDoc(collectionRef, {
      message: inputText,
      timestamp: serverTimestamp(),
      user: user,
      reactions: {},
    });
    setInputText("");
  };

  return (
    <div className='chat'>
      <ChatHeader channelName={channelName} />
      <div className='chatMessage'>
        {messages.map((message) => (
          <ChatMessage 
            key={message.id}
            messageId={message.id}
            channelId={channelId} 
            message={message.message} 
            timestamp={message.timestamp} 
            user={message.user}
            reactions={message.reactions}
          />
        ))}
      </div>

      <div className='chatInput'>
        <AddCircleOutlineIcon />
        <form>
          <input 
            type="text" 
            placeholder='#Udemyへメッセージを送信' 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputText(e.target.value)
            }
            value={inputText}
          />
          <button 
            type='submit' 
            className='chatInputButton' 
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => 
              sendMessage(e)}
          >
            送信
          </button>
        </form>

        <div className='chatInputIcons'>
            <CardGiftcardIcon />
            <GifIcon />
            <EmojiEmotionsIcon />
        </div>
      </div>
    </div>
  )
}

export default Chat