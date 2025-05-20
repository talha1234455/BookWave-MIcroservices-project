import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Table, Toast, Modal } from 'react-bootstrap';

function Users() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [users, setUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // For edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({ _id: '', name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4001/api/users');
      console.log('Fetched users:', response.data);
      setUsers([...response.data]);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email) {
      showToastMessage('Please fill in all fields.', 'danger');
      return;
    }

    try {
      await axios.post('http://localhost:4001/api/users', user);
      setUser({ name: '', email: '' });
      fetchUsers();
      showToastMessage('User added successfully!', 'success');
    } catch (err) {
      console.error('Error adding user:', err);
      showToastMessage('Error adding user.', 'danger');
    }
  };

  // --- Edit Handlers ---

  const openEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser.name || !editUser.email) {
      showToastMessage('Please fill in all fields.', 'danger');
      return;
    }
    try {
      await axios.put(`http://localhost:4001/api/users/${editUser._id}`, {
        name: editUser.name,
        email: editUser.email,
      });
      fetchUsers();
      setShowEditModal(false);
      showToastMessage('User updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating user:', err);
      showToastMessage('Error updating user.', 'danger');
    }
  };

  // --- Delete Handler ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:4001/api/users/${id}`);
        fetchUsers();
        showToastMessage('User deleted successfully!', 'success');
      } catch (err) {
        console.error('Error deleting user:', err);
        showToastMessage('Error deleting user.', 'danger');
      }
    }
  };
  

  const showToastMessage = (message, variant = 'success') => {
    setToastMsg(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Container
      className="mt-4 position-relative"
      style={{
        backgroundImage: "url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fbooks%2F&psig=AOvVaw11-7ulJZRUTrc8233aix13&ust=1747820183130000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIC7m9_fsY0DFQAAAAAdAAAAABAL')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        paddingBottom: '50px',
      }}
    >
      {/* Toast */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        bg={toastVariant}
        className="position-absolute top-0 end-0 m-3"
        autohide
        delay={3000}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMsg}</Toast.Body>
      </Toast>

      <Card className="p-4 shadow" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
        <h2 className="mb-3">Add User</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="primary" type="submit" className="w-100">
                Add
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card className="mt-4 p-4 shadow" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
        <h3>Users List</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(u)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users added yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editUser.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Users;
