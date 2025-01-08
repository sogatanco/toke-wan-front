import React, { useState} from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Spinner, Container, Row, Col } from 'reactstrap';
import axios from 'axios';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Menambahkan navigate
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    try {
        const response = await axios.post(`${ process.env.REACT_APP_BASE_URL}api/login`, {
            email,
            password,
        });
        console.log(response);
        // Jika login berhasil, simpan token di localStorage
        localStorage.setItem('token', response.data.access_token);
        window.location.href = '/';
        // Redirect ke halaman yang dilindungi atau dashboard
        // console.log(response.data.token);
        setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
        // Menangani kesalahan login
        // setErrorMessage('Invalid credentials');
        setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f5f5f7' }}>
      <Row className="w-100">
        <Col xs="12" md="5" lg="4" xl="3" className="mx-auto">
          <div className="text-center mb-4">
            <img 
              src="https://i.pinimg.com/originals/74/26/cf/7426cf05ffe331b889b1459cd0005054.png" 
              alt="Coffee Logo" 
              style={{ width: '120px', marginBottom: '20px' }} 
            />
            <h2 className="mb-3" style={{ fontWeight: '600', color: '#333' }}>Warkop Seuramoe</h2>
          </div>

          {error && <Alert color="danger" style={{ borderRadius: '12px' }}>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="email" style={{ fontSize: '1rem', fontWeight: '500' }}>Akun ID</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your ID"
                required
                style={{
                  borderRadius: '20px',
                  padding: '15px',
                  borderColor: '#e1e1e1',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password" style={{ fontSize: '1rem', fontWeight: '500' }}>Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  borderRadius: '20px',
                  padding: '15px',
                  borderColor: '#e1e1e1',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              />
            </FormGroup>
            <Button
              color="primary"
              type="submit"
              block
              disabled={loading}
              style={{
                borderRadius: '20px',
                backgroundColor: '#007aff',
                borderColor: '#007aff',
                padding: '15px',
                fontWeight: '600',
              }}
            >
              {loading ? <Spinner size="sm" color="light" /> : 'Sign In'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
