import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Home from './components/Home';
import TeaField from './components/TeaField';
import Development from './components/Development';
import MenuCreation from './components/MenuCreation';
import Sales from './components/Sales';
import Layout from './components/Layout';
import { Howl } from 'howler';

const bgm = new Howl({
  src: ['/assets/audio/bgm-main.mp3'],
  loop: true,
  volume: 0.3
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    bgm.play();
    return () => {
      unsubscribe();
      bgm.stop();
    };
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>読み込み中...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="field" element={<TeaField />} />
          <Route path="development" element={<Development />} />
          <Route path="menu" element={<MenuCreation />} />
          <Route path="sales" element={<Sales />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
