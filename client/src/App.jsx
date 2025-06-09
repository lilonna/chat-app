// client/src/App.jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001');

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/messages').then(res => setMessages(res.data));
    socket.on('message', msg => setMessages(prev => [...prev, msg]));
    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (!text || !username) return;
    socket.emit('message', { username, text });
    setText('');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Chat App</h1>
      <input
        placeholder='Username'
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.username}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        placeholder='Message'
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '100%', marginTop: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
