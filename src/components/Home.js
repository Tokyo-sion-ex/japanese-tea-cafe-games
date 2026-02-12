import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Home() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#6b8e4c', fontSize: '2.5em', marginBottom: '20px' }}>
          ようこそ、和紅茶カフェへ
        </h1>
        <img 
          src="/assets/images/character2.png" 
          alt="カフェマスター" 
          style={{ width: '150px', borderRadius: '15px' }}
        />
      </div>

      <div className="card">
        <h2>📊 今日のカフェ状況</h2>
        {userData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
              <p>👤 レベル: {userData.level}</p>
              <p>💰 所持金: ¥{userData.money?.toLocaleString()}</p>
            </div>
            <div>
              <p>🌱 茶畑数: {userData.teaFields?.length || 0}区画</p>
              <p>🍵 開発済みお茶: {userData.teas?.length || 0}種類</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div className="card">
          <h3>🌱 茶畑を育てよう</h3>
          <p>茶葉を収穫して、オリジナルのお茶を開発しましょう</p>
          <button className="button" style={{ marginTop: '15px' }}>
            茶畑へ行く
          </button>
        </div>
        <div className="card">
          <h3>📋 メニュー表</h3>
          <p>あなただけの特別なメニューを作成できます</p>
          <button className="button" style={{ marginTop: '15px' }}>
            メニュー作成
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
