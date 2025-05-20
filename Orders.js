import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Toast } from 'react-bootstrap';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOrder, setNewOrder] = useState({ userId: '', items: [] });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    await Promise.all([fetchOrders(), fetchProducts(), fetchUsers()]);
  }

  async function fetchOrders() {
    try {
      const res = await axios.get('http://localhost:4003/api/orders');
      setOrders(res.data);
    } catch {
      showToastMsg('Failed to load orders', 'danger');
    }
  }

  async function fetchProducts() {
    try {
      const res = await axios.get('http://localhost:4003/api/products');
      setProducts(res.data);
    } catch {
      showToastMsg('Failed to load products', 'danger');
    }
  }

  async function fetchUsers() {
    try {
      const res = await axios.get('http://localhost:4003/api/users');
      setUsers(res.data);
    } catch {
      showToastMsg('Failed to load users', 'danger');
    }
  }

  function showToastMsg(msg, variant = 'success') {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function calculateTotal() {
    return newOrder.items.reduce((sum, itm) => {
      const product = products.find((p) => p._id === itm.productId);
      return sum + (product?.price || 0) * itm.quantity;
    }, 0);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    try {
      const payload = {
        userId: newOrder.userId,
        items: newOrder.items,
        totalAmount: calculateTotal(),
        status: 'Pending',
      };
      await axios.post('http://localhost:4003/api/orders', payload);
      showToastMsg('Order placed!');
      setNewOrder({ userId: '', items: [] });
      fetchOrders();
    } catch {
      showToastMsg('Error placing order', 'danger');
    }
  }

  function handleItemChange(productId, qty) {
    setNewOrder((o) => {
      const items = [...o.items.filter((i) => i.productId !== productId), { productId, quantity: qty }];
      return { ...o, items };
    });
  }

  return (
    <Container className="mt-4 position-relative">
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        className="position-fixed top-0 end-0 m-3"
        bg={toastMsg.includes('Error') ? 'danger' : 'success'}
      >
        <Toast.Body className="text-white">{toastMsg}</Toast.Body>
      </Toast>

      <Card className="p-4 mb-4 shadow">
        <h2>Create New Order</h2>
        <Form onSubmit={handlePlaceOrder}>
          <Form.Group className="mb-3">
            <Form.Label>Customer</Form.Label>
            <Form.Select
              value={newOrder.userId}
              onChange={(e) => setNewOrder({ ...newOrder, userId: e.target.value })}
              required
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Books & Quantity</Form.Label>
            {products.map((p) => (
              <div className="d-flex align-items-center mb-2" key={p._id}>
                <span className="flex-fill">{p.title}</span>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="0"
                  style={{ width: '80px' }}
                  onChange={(e) => handleItemChange(p._id, Number(e.target.value))}
                  value={
                    newOrder.items.find((i) => i.productId === p._id)?.quantity || 0
                  }
                />
              </div>
            ))}
          </Form.Group>

          <div className="mb-3">
            <strong>Total: ${calculateTotal().toFixed(2)}</strong>
          </div>

          <Button type="submit" variant="primary">Place Order</Button>
        </Form>
      </Card>

      <Card className="p-4 shadow">
        <h2>Order History</h2>
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-6)}</td>
                <td>{users.find((u) => u._id === o.userId)?.name || '—'}</td>
                <td>{o.items.length}</td>
                <td>${o.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={`badge ${o.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default Orders;
S