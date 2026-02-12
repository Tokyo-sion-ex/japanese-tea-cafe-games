import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

function TeaField() {
  const [fields, setFields] = useState([]);
  const [money, setMoney] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setFields(docSnap.data().teaFields || []);
      setMoney(docSnap.data().money || 0);
    }
  };

  const purchaseField = async () => {
    if (money >= 1000) {
      const newField = {
        id: Date.now(),
        name: `茶畑 ${fields.length + 1}`,
        growth: 0,
        harvestTime: 3,
        planted: new Date()
      };

      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, {
        teaFields: arrayUnion(newField),
        money: money - 1000
      });
      
      loadUserData();
    }
  };

  const harvestField = async (field) => {
    if (field.growth >= 100) {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const currentData = docSnap.data();
      
      const updatedFields = currentData.teaFields.map(f => {
        if (f.id === field.id) {
          return { ...f, growth: 0, planted: new Date() };
        }
        return f;
      });

      await updateDoc(docRef, {
        teaFields: updatedFields,
        money: (currentData.money || 0) + 500,
        teaLeaves: (currentData.teaLeaves || 0) + 10
      });

      loadUserData();
      alert('茶葉を収穫しました！ +500円, +10茶葉');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#6b8e4c' }}>🌱 茶畑管理</h1>
        <button className="button" onClick={purchaseField}>
          茶畑を購入 (¥1,000)
        </button>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>現在の茶畑</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {fields.map(field => (
            <div key={field.id} className="tea-field" style={{ padding: '20px' }}>
              <h3>{field.name}</h3>
              <img 
                src="/assets/images/tea-plant.png" 
                alt="茶の木" 
                style={{ width: '80px', margin: '10px 0' }}
              />
              <p>成長度: {field.growth}%</p>
              <div style={{ 
                width: '100%', 
                height: '10px', 
                background: '#e0e0e0', 
                borderRadius: '5px',
                margin: '10px 0'
              }}>
                <div style={{ 
                  width: `${field.growth}%`, 
                  height: '100%', 
                  background: '#6b8e4c', 
                  borderRadius: '5px',
                  transition: 'width 0.3s'
                }} />
              </div>
              <button 
                className="button" 
                onClick={() => harvestField(field)}
                disabled={field.growth < 100}
                style={{ 
                  width: '100%',
                  opacity: field.growth < 100 ? 0.5 : 1
                }}
              >
                収穫する
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeaField;
