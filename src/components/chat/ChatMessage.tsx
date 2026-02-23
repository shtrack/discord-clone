import React, { useState } from 'react'
import "./ChatMessage.scss"
import { Avatar, Tooltip } from "@mui/material";
import { doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAppSelector } from '../../app/hooks';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

type Props = {
  messageId: string;
  channelId: string | null;
  timestamp: Timestamp;
  message: string;
  user: {
    uid: string;
    photo: string;
    email: string;
    displayName: string;
  };
  reactions?: { 
    [key: string]: { uid: string; name: string }[] 
  };
}

const ChatMessage = (props: Props) => {
  const { messageId, channelId, message, timestamp, user, reactions } = props;
  const currentUser = useAppSelector((state) => state.user.user);

  const [showPicker, setShowPicker] = useState(false);
  
  const onEmojiClick = (emojiData: EmojiClickData) => {
    handleReaction(emojiData.emoji);
    setShowPicker(false);
  };

  const handleReaction = async (emoji: string) => {
    if (!channelId || !currentUser) return;

    const messageRef = doc(db, "channels", channelId, "messages", messageId);
    const messageSnap = await getDoc(messageRef);

    if (messageSnap.exists()) {
      const data = messageSnap.data();
      const currentReactions = data.reactions || {};
      const reactionList: { uid: string, name: string }[] = currentReactions[emoji] || [];

      let newReactionList;
      const myReactionIndex = reactionList.findIndex(r => r.uid === currentUser.uid);

      if (myReactionIndex > -1) {
        newReactionList = reactionList.filter(r => r.uid !== currentUser.uid);
      } else {
        newReactionList = [
          ...reactionList,
          { uid: currentUser.uid, name: currentUser.displayName }
        ];
      }

      await updateDoc(messageRef, {
        [`reactions.${emoji}`]: newReactionList
      });
    }
  };

  return (
    <div className='message'>
      <Avatar src={user?.photo} />
      <div className='messageInfo'>
        <h4>
          {user?.displayName}
          <span className='messageTimestamp'>
            {new Date(timestamp?.toDate()).toLocaleString()}
          </span>
        </h4>
        <p>{message}</p>

        <div className="reactions-container" style={{ display: 'flex', gap: '5px', marginTop: '5px', alignItems: 'center', position: 'relative' }}>
          
        {reactions && Object.entries(reactions).map(([emoji, reactionData]) => {
          const list = reactionData; 
          if (list.length === 0) return null;

          const isMe = list.some(r => r.uid === currentUser?.uid);
          
          const namesText = list.map(r => r.uid === currentUser?.uid ? "あなた" : r.name).join(", ");
          const tooltipText = `${namesText} がリアクションしました`;

          return (
            <Tooltip key={emoji} title={tooltipText} arrow placement="top">
              <div 
                onClick={() => handleReaction(emoji)}
                style={{ 
                  cursor: 'pointer', 
                  background: isMe ? '#3b4252' : '#2f3136', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  border: isMe ? '1px solid #5865f2' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>{emoji}</span>
                <span style={{ fontSize: '12px', color: '#b9bbbe', fontWeight: 'bold' }}>
                  {list.length}
                </span>
              </div>
            </Tooltip>
          );
        })}

          <button 
            onClick={() => setShowPicker(!showPicker)} 
            style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            <EmojiEmotionsIcon style={{ fontSize: '20px' }} />
          </button>

          {showPicker && (
            <div style={{ position: 'absolute', zIndex: 10, top: '30px', left: '0' }}>
              <EmojiPicker 
                onEmojiClick={onEmojiClick} 
                theme={"dark" as any}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage