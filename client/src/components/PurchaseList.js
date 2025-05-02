import React, { useEffect, useState } from 'react';
import {
    getPurchases,
    createPurchase,
    deletePurchase,
    updatePurchase,
    getUsers,
} from '../api';


function PurchaseList() {
    //Stateful objects for dynamic updating
    const [purchases, setPurchases] = useState([]);
    const [users, setUsers] = useState([]);

    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const [userId, setUserId] = useState('');

    const [editId, setEditId] = useState(null);
    const [editItem, setEditItem] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editUserId, setEditUserId] = useState('');

    const [filterUserEmail, setFilterUserEmail] = useState('');
    const [filterUserId, setFilterUserId] = useState('');
    const [filterError, setFilterError] = useState('');

    const [userIdEmailInput, setUserIdEmailInput] = useState('');
    const [addUserError, setAddUserError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [purchaseRes, userRes] = await Promise.all([
            getPurchases(),
            getUsers(),
        ]);
        setPurchases(purchaseRes.data);
        setUsers(userRes.data);
    };

    const handleAdd = async () => {
        if (!item || !amount || !userId) {
            alert('Please fill in all fields.');
            return;
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            alert('Amount must be a non-negative number.');
            return;
        }

        try {
            const newPurchase = { item, amount: numericAmount, user: userId };
            await createPurchase(newPurchase);
            await fetchData();
            setItem('');
            setAmount('');
            setUserId('');
        } catch (err) {
            console.error(err);
            alert('Failed to create purchase.');
        }
    };

    const handleDelete = async (id) => {
        await deletePurchase(id);
        await fetchData();
    };

    const handleEditClick = (p) => {
        setEditId(p._id);
        setEditItem(p.item);
        setEditAmount(p.amount);
        setEditUserId(p.user?._id || '');
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditItem('');
        setEditAmount('');
        setEditUserId('');
    };

    const handleSaveEdit = async (id) => {
        if (!editItem || !editAmount || !editUserId) {
            alert('Please fill in all fields.');
            return;
        }

        const numericAmount = Number(editAmount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            alert('Amount must be a non-negative number.');
            return;
        }

        try {
            await updatePurchase(id, {
                item: editItem,
                amount: numericAmount,
                user: editUserId,
            });
            await fetchData();
            handleCancelEdit();
        } catch (err) {
            console.error(err);
            alert('Failed to update purchase.');
        }
    };

    const handleFilterByEmail = (email) => {
        setFilterUserEmail(email);
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            setFilterUserId(user._id);
            setFilterError('');
        } else {
            setFilterUserId('');
            setFilterError('No user found with that email.');
        }
    };

    const handleUserIdEmailInput = (email) => {
        setUserIdEmailInput(email);
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          setUserId(user._id);
          setAddUserError('');
        } else {
          setUserId('');
          setAddUserError('No user found with that email.');
        }
      };
      
    const filteredPurchases = filterUserId
        ? purchases.filter((p) => p.user?._id === filterUserId)
        : purchases;

    return (
        <div>
            <h2>Purchases</h2>

            <h4>Add Purchase</h4>
            <input value={item} onChange={(e) => setItem(e.target.value)} placeholder="Item" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" />
            <input
                value={userIdEmailInput}
                onChange={(e) => handleUserIdEmailInput(e.target.value)}
                placeholder="Type user email"
            />
            

            <select value={userId} onChange={(e) => setUserId(e.target.value)}>
                <option value="">Select User</option>
                {users.map((u) => (
                    <option key={u._id} value={u._id}>
                        {u.name}
                    </option>
                ))}
            </select>
            <button onClick={handleAdd}>Add Purchase</button>
            {addUserError && <p style={{ color: 'red' }}>{addUserError}</p>}
            <h4>Filter Purchases by User</h4>
            <input
                value={filterUserEmail}
                onChange={(e) => handleFilterByEmail(e.target.value)}
                placeholder="Type user email"
            />
            {filterError && <p style={{ color: 'red' }}>{filterError}</p>}
            <ul>
                {filteredPurchases.map((p) => (
                    <li key={p._id}>
                        {editId === p._id ? (
                            <>
                                <input
                                    value={editItem}
                                    onChange={(e) => setEditItem(e.target.value)}
                                    placeholder="Item"
                                />
                                <input
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(e.target.value)}
                                    placeholder="Amount"
                                    type="number"
                                />
                                <select
                                    value={editUserId}
                                    onChange={(e) => setEditUserId(e.target.value)}
                                >
                                    <option value="">Select User</option>
                                    {users.map((u) => (
                                        <option key={u._id} value={u._id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select> 
                                <button onClick={() => handleSaveEdit(p._id)}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {p.item} (${p.amount}) – {p.user?.name || 'Unknown'} ({p.user?.email || 'No Email'})
                                <button onClick={() => handleEditClick(p)}>Edit</button>
                                <button onClick={() => handleDelete(p._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PurchaseList;
