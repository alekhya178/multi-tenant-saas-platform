import React, { useState, useEffect, useContext } from 'react';
import { Container, Button, Table, Badge, Form, Row, Col, Alert } from 'react-bootstrap';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import UserModal from '../components/UserModal';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search State
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      if (!user?.tenantId) return;
      
      let query = `/tenants/${user.tenantId}/users?limit=100`;
      if (search) query += `&search=${search}`;
      
      const res = await api.get(query);
      setUsers(res.data.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, user]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingUser) {
        // Edit logic
        await api.put(`/users/${editingUser.id}`, data);
      } else {
        // Create logic
        await api.post(`/tenants/${user.tenantId}/users`, data);
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (user?.role !== 'tenant_admin' && user?.role !== 'super_admin') {
      return <Container className="mt-5"><Alert variant="danger">Access Denied</Alert></Container>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Team Members</h2>
        <Button onClick={() => { setEditingUser(null); setShowModal(true); }}>
          + Add User
        </Button>
      </div>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {loading ? <p>Loading...</p> : (
        <Table hover responsive className="shadow-sm bg-white">
          <thead className="bg-light">
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>
                    <Badge bg={u.role === 'tenant_admin' ? 'purple' : 'info'}>
                        {u.role}
                    </Badge>
                </td>
                <td>
                    <Badge bg={u.is_active ? 'success' : 'secondary'}>
                        {u.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => { setEditingUser(u); setShowModal(true); }}>Edit</Button>
                  {u.id !== user.id && (
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}>Delete</Button>
                  )}
                </td>
              </tr>
            ))}
             {users.length === 0 && <tr><td colSpan="5" className="text-center">No users found</td></tr>}
          </tbody>
        </Table>
      )}

      <UserModal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        onSave={handleCreateOrUpdate}
        targetUser={editingUser}
      />
    </Container>
  );
};

export default Users;