import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Toast, Modal } from 'react-bootstrap';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', price: '', stock: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get('http://localhost:4002/api/products');
      setProducts(res.data);
    } catch {
      showToastMsg('Failed to fetch products', 'danger');
    }
  }

  function showToastMsg(msg, variant = 'success') {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function openModal(product = null) {
    if (product) {
      setEditingProduct(product);
      setForm({
        title: product.title,
        author: product.author,
        price: product.price,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setForm({ title: '', author: '', price: '', stock: '' });
    }
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:4002/api/products/${editingProduct._id}`, form);
        showToastMsg('Product updated!');
      } else {
        await axios.post('http://localhost:4002/api/products', form);
        showToastMsg('Product added!');
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      showToastMsg('Error saving product', 'danger');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`http://localhost:4002/api/products/${id}`);
      showToastMsg('Product deleted');
      fetchProducts();
    } catch {
      showToastMsg('Error deleting product', 'danger');
    }
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

      <Button className="mb-3" onClick={() => openModal()}>
        Add New Book
      </Button>

      <Card className="p-3 shadow">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.author}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => openModal(p)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editingProduct ? 'Edit Book' : 'Add Book'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {['title', 'author', 'price', 'stock'].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="text-capitalize">{field}</Form.Label>
                <Form.Control
                  type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                  name={field}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  required
                />
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Products;
