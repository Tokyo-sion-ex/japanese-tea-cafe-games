import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function Sales() {
  const [menu, setMenu] = useState([]);
  const [money, setMoney] = useState(0);
  const [sales, setSales] = useState(0);
  const [customers, setCustomers] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMenu(docSnap.data().menu || []);
      setMoney(docSnap.data().money || 0);
    }
  };

  const startSales = async () => {
    if (menu.length > 0) {
      const todaySales = menu.reduce((total, item) => total + item.price, 0) * 5;
      const todayCustomers = menu.length * 3;
      
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      await updateDoc(docRef, {
        money: (docSnap.data().money || 0) + todaySales,
        experience: (docSnap.data().experience || 0) + 100
      });

      setSales(todaySales);
      setCustomers(todayCustomers);
      loadUserData();
    }
  };

  return (
    <div className="container">
      <h1 style={{ color: '#6b8e4c' }}>💰 販売管理</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <div className="card">
            <h2>本日の営業</h2>
            <img 
              src="/assets/images/counter.png" 
              alt="カウンター" 
              style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
            />
            
            <div style={{ marginBottom: '20px' }}>
              <p>現在のメニュー数: {menu.length}品</p>
              <p>現在の所持金: ¥{money.toLocaleString()}</p>
            </div>

            <button 
              className="button" 
              onClick={startSales}
              style={{ width: '100%' }}
              disabled={menu.length === 0}
            >
              営業を開始する
            </button>
          </div>

          {sales > 0 && (
            <div className="card" style={{ marginTop: '20px', background: '#e8f5e8' }}>
              <h2>本日の売上結果</h2>
              <p>👥 来店客数: {customers}人</p>
              <p>💰 売上: ¥{sales.toLocaleString()}</p>
              <p>✨ 獲得経験値: 100</p>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <h2>販売中のメニュー</h2>
            <div style={{ marginTop: '20px' }}>
              {menu.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #d4c8a9',
                  borderRadius: '8px'
                }}>
                  <div>
                    <h3>{item.tea.name}</h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>{item.tea.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#6b8e4c', fontWeight: 'bold' }}>
                      ¥{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sales;
