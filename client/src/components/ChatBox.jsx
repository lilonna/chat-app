import { useEffect, useState } from 'react';
import { fetchMessages } from '../services/api';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function ChatBox({ username }) {
  const [text, setText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('login', username);
    fetchMessages().then(res => setMessages(res.data));

    socket.on('message', msg => setMessages(prev => [...prev, msg]));

    return () => socket.off('message');
  }, [username]);

  const sendMessage = () => {
    if (!text || !recipient) return;
    socket.emit('message', { username, recipient, text });
    setText('');
  };

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <input
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <div style={{ border: '1px solid #ccc', height: 200, overflowY: 'scroll' }}>
        {messages
          .filter(m => m.username === username || m.recipient === username)
          .map((msg, idx) => (
            <div key={idx}><b>{msg.username}</b>: {msg.text}</div>
          ))}
      </div>
      <input
        placeholder="Message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;
