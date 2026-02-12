import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          level: 1,
          money: 5000,
          teaFields: [],
          teas: [],
          menu: [],
          createdAt: new Date()
        });
      }
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6b8e4c 0%, #8fbc8f 100%)'
    }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <img 
          src="/assets/images/tea-cup.png" 
          alt="和紅茶カフェ" 
          style={{ width: '120px', marginBottom: '20px' }}
        />
        <h2 style={{ marginBottom: '30px', color: '#6b8e4c' }}>
          和紅茶・日本茶カフェ
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #d4c8a9',
              borderRadius: '8px'
            }}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              border: '1px solid #d4c8a9',
              borderRadius: '8px'
            }}
            required
          />
          <button type="submit" className="button" style={{ width: '100%' }}>
            {isLogin ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>
        <p style={{ marginTop: '20px', color: '#6b8e4c' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b4513',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {isLogin ? '新規アカウント作成' : 'ログイン画面へ'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
