import React from 'react';
import UserList from './components/UserList';
import PurchaseList from './components/PurchaseList';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Customer Purchase Verification</h1>
      <UserList />
      <hr />
      <PurchaseList />
    </div>
  );
}

export default App;
