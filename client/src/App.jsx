import { useState } from 'react';
import LoginForm from './components/LoginForm';
import ChatBox from './components/ChatBox';

function App() {
  const [username, setUsername] = useState('');

  return (
    <div style={{ padding: 20 }}>
      {!username ? (
        <LoginForm setUsername={setUsername} onLogin={() => {}} />
      ) : (
        <ChatBox username={username} />
      )}
    </div>
  );
}

export default App;
