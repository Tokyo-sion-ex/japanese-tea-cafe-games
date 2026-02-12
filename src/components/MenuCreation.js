import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function MenuCreation() {
  const [teas, setTeas] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedTea, setSelectedTea] = useState(null);
  const [price, setPrice] = useState(500);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTeas(docSnap.data().teas || []);
      setMenu(docSnap.data().menu || []);
    }
  };

  const addToMenu = async () => {
    if (selectedTea) {
      const menuItem = {
        id: Date.now(),
        tea: selectedTea,
        price: price,
        createdAt: new Date()
      };

      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, {
        menu: [...menu, menuItem]
      });

      loadUserData();
      alert('メニューに追加しました！');
    }
  };

  const removeFromMenu = async (itemId) => {
    const updatedMenu = menu.filter(item => item.id !== itemId);
    const docRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(docRef, { menu: updatedMenu });
    loadUserData();
  };

  return (
    <div className="container">
      <h1 style={{ color: '#6b8e4c' }}>📋 メニュー表作成</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <div className="card">
            <h2>開発済みのお茶</h2>
            {teas.map(tea => (
              <div 
                key={tea.id}
                onClick={() => setSelectedTea(tea)}
                style={{
                  padding: '15px',
                  margin: '10px 0',
                  border: selectedTea?.id === tea.id ? '2px solid #6b8e4c' : '1px solid #d4c8a9',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: selectedTea?.id === tea.id ? '#f0f7e9' : 'white'
                }}
              >
                <h3>{tea.name}</h3>
                <p>{tea.description}</p>
                <small>レベル: {tea.level}</small>
              </div>
            ))}
          </div>

          {selectedTea && (
            <div className="card">
              <h2>価格設定</h2>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="100"
                step="100"
                style={{
                  width: '100%',
                  padding: '12px',
                  margin: '10px 0',
                  border: '1px solid #d4c8a9',
                  borderRadius: '8px'
                }}
              />
              <button className="button" onClick={addToMenu} style={{ width: '100%' }}>
                メニューに追加
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <h2>現在のメニュー表</h2>
            {menu.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                メニューがありません
              </p>
            ) : (
              menu.map(item => (
                <div key={item.id} style={{
                  padding: '15px',
                  margin: '10px 0',
                  border: '1px solid #d4c8a9',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3>{item.tea.name}</h3>
                      <p>¥{item.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => removeFromMenu(item.id)}
                      style={{
                        background: '#c0392b',
                        color: 'white',
                        border: 'none',
                        padding: '5px 15px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCreation;
