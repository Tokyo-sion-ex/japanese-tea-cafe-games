import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Howl } from 'howler';

function Layout() {
  const location = useLocation();
  const [bgm] = useState(new Howl({
    src: ['/assets/audio/bgm-cafe.mp3'],
    loop: true,
    volume: 0.2
  }));

  useEffect(() => {
    bgm.play();
    return () => bgm.stop();
  }, [bgm]);

  const navItems = [
    { path: '/', label: 'ホーム', icon: '🏠' },
    { path: '/field', label: '茶畑', icon: '🌱' },
    { path: '/development', label: '開発', icon: '⚗️' },
    { path: '/menu', label: 'メニュー表', icon: '📋' },
    { path: '/sales', label: '販売', icon: '💰' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: '250px',
        background: '#2c4a3b',
        padding: '30px 20px',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img 
            src="/assets/images/character1.png" 
            alt="キャラクター" 
            style={{ width: '100px', borderRadius: '50%' }}
          />
          <h3 style={{ marginTop: '15px' }}>和紅茶カフェ</h3>
        </div>
        
        <nav>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: '12px 15px',
                marginBottom: '10px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                background: location.pathname === item.path ? '#6b8e4c' : 'transparent',
                transition: 'background 0.3s'
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => signOut(auth)}
          className="button"
          style={{
            position: 'absolute',
            bottom: '30px',
            width: '210px',
            background: '#8b4513'
          }}
        >
          ログアウト
        </button>
      </div>

      <div style={{
        flex: 1,
        padding: '30px',
        background: '#f5f0e1'
      }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
