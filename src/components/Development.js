import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

function Development() {
  const [teaLeaves, setTeaL eaves] = useState(0);
  const [teas, setTeas] = useState([]);
  const [level, setLevel] = useState(1);
  const [developmentName, setDevelopmentName] = useState('');
  const [developmentDesc, setDevelopmentDesc] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTeaLeaves(docSnap.data().teaLeaves || 0);
      setTeas(docSnap.data().teas || []);
      setLevel(docSnap.data().level || 1);
    }
  };

  const developTea = async () => {
    const requiredLeaves = 50 - (level * 2);
    
    if (teaLeaves >= requiredLeaves && developmentName && developmentDesc) {
      const newTea = {
        id: Date.now(),
        name: developmentName,
        description: developmentDesc,
        level: level,
        developedAt: new Date()
      };

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      await updateDoc(docRef, {
        teas: arrayUnion(newTea),
        teaLeaves: teaLeaves - requiredLeaves,
        level: level + 1
      });

      setDevelopmentName('');
      setDevelopmentDesc('');
      loadUserData();
      alert(`${newTea.name}を開発しました！`);
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#6b8e4c' }}>⚗️ オリジナルお茶開発</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          <div className="card">
            <h2>新商品の開発</h2>
            <p style={{ marginBottom: '20px' }}>
              必要茶葉: {50 - (level * 2)}枚 (現在: {teaLeaves}枚)
            </p>
            
            <input
              type="text"
              placeholder="お茶の名前"
              value={developmentName}
              onChange={(e) => setDevelopmentName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                border: '1px solid #d4c8a9',
                borderRadius: '8px'
              }}
            />
            
            <textarea
              placeholder="お茶の説明"
              value={developmentDesc}
              onChange={(e) => setDevelopmentDesc(e.target.value)}
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '20px',
                border: '1px solid #d4c8a9',
                borderRadius: '8px',
                resize: 'vertical'
              }}
            />
            
            <button 
              className="button" 
              onClick={developTea}
              style={{ width: '100%' }}
            >
              開発する
            </button>
          </div>
        </div>

        <div>
          <div className="card">
            <h2>開発済みお茶一覧</h2>
            <div style={{ marginTop: '20px' }}>
              {teas.map(tea => (
                <div key={tea.id} style={{
                  padding: '15px',
                  marginBottom: '10px',
                  background: '#f9f6f0',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ color: '#6b8e4c' }}>{tea.name}</h3>
                  <p style={{ fontSize: '14px' }}>{tea.description}</p>
                  <small>レベル: {tea.level}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Development;
