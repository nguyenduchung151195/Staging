import React from 'react';
import './note.css';
import { useState, useEffect } from 'react';
import { Fab, Popover } from '@material-ui/core';
import { EventNoteRounded, ChatBubbleRounded } from '@material-ui/icons';
import Conversation from '../../containers/Conversation';
import { API_CONVERSATION_MESSAGE_UN_READ, API_CONVERSATION, API_CONVERSATION_MESSAGE_UNREADCONVERSASION } from '../../config/urlConfig';
import AntTab from './AntTab';
// import { fetchData } from '../../helper';
// import { API_PROFILE } from '../../config/urlConfig';
export default function Extends({ socket }) {
  const [display, setDisplay] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = useState(0);
  const [checkCount, setCheckCount] = useState(false);
  // const [profile, setProfile] = React.useState({});
  const handleClick = event => {
    if (open) {
      setOpen(null);
      return;
    }
    setOpen(event.currentTarget);
  };
  function getSocket(profile, data, curr) {
    // console.log(profile, data,curr, 'profile, data')
    if (profile && profile.code !== (data && data.data.code)) {
      setCount(count + 1);
    }
  }

  function handleDisplayChat() {
    setDisplay(!display);
  }
  useEffect(
    () => {
      const token = localStorage.getItem('token');
      fetch(`${API_CONVERSATION_MESSAGE_UN_READ}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          // console.log('data', data);
          setCount(data.count);
        });
    },
    [checkCount],
  );

  const handleChechCount = item => {
    setCheckCount(!checkCount);
    setCount(count - item);
  };
  // console.log('121212', checkCount);
  // console.log('1111', count);
  // function getProfile() {
  //   fetchData(API_PROFILE).then(response => {
  //     setProfile(response);
  //   });
  // }

  // useEffect(() => {
  //   getProfile();
  // }, []);

  return (
    <React.Fragment>
      <Conversation setDisplay={handleDisplayChat} display={display} socket={socket} handleChechCount={handleChechCount} getSocket={getSocket} />
      <div className="note-container">
        <Fab size="small" onClick={handleClick} color="primary">
          <EventNoteRounded />
        </Fab>
        <Fab style={{ position: 'relative' }} size="small" onClick={handleDisplayChat} color="primary">
          <ChatBubbleRounded />
          {count > 0 ? <span className="spchat">{count}</span> : null}
        </Fab>
        <Popover
          onClose={() => setOpen(false)}
          // anchorReference="anchorPosition"
          anchorPosition={{ top: 20 }}
          anchorEl={open}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={Boolean(open)}
        >
          <AntTab />
        </Popover>
      </div>
    </React.Fragment>
  );
}
