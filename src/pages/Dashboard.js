import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap';
import { FaCashRegister, FaFileAlt, FaBoxes} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate=useNavigate()
  return (
    <>
      <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>

        {/* Tombol-Tombol Dashboard */}
        <Row className="w-100 d-flex justify-content-center align-items-center">
          {/* Kasir Button */}
          <Col md="4" sm="6" lg="3" xl="2" xs="6" className="p-4">
            <Card style={styles.card} onClick={()=>navigate('/kasir')} >
              <CardBody style={styles.cardBody}>
                <FaCashRegister size={70} style={styles.kasirIcon} />
                <CardTitle tag="h5" style={styles.cardTitle}>Cashier</CardTitle>
                <Button style={styles.kasirButton} block>Go</Button>
              </CardBody>
            </Card>
          </Col>

          {/* Laporan Button */}
          <Col md="4" sm="6" lg="3" xl="2" xs="6" className="p-4">
            <Card style={styles.card} onClick={()=>navigate('/laporan')}>
              <CardBody style={styles.cardBody}>
                <FaFileAlt size={70} style={styles.laporanIcon} />
                <CardTitle tag="h5" style={styles.cardTitle}>Reports</CardTitle>
                <Button style={styles.laporanButton} block>Go</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="w-100 d-flex justify-content-center align-items-center">
          {/* Barang Button */}
          <Col md="4" sm="6" lg="3" xl="2" xs="6" className="p-4">
            <Card style={styles.card}  onClick={()=>navigate('/tambah-produk')} >
              <CardBody style={styles.cardBody}>
                <FaBoxes size={70} style={styles.barangIcon} />
                <CardTitle tag="h5" style={styles.cardTitle}>Products</CardTitle>
                <Button style={styles.barangButton} block>Go</Button>
              </CardBody>
            </Card>
          </Col>

          {/* Setting Button */}
          {/* <Col md="4" sm="6" lg="3" xl="2" xs="6" className="p-4">
            <Card style={styles.card}  onClick={()=>navigate('/users')} >
              <CardBody style={styles.cardBody}>
                <FaCog size={70} style={styles.settingIcon} />
                <CardTitle tag="h5" style={styles.cardTitle}>User Management</CardTitle>
                <Button style={styles.settingButton} block>Go</Button>
              </CardBody>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
};

const styles = {
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#333',
  },
  card: {
    cursor: 'pointer',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    backgroundColor: '#fff',
    border: 'none',  // To remove card border
  },
  cardBody: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  button: {
    marginTop: '10px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  icon: {
    color: '#fff', // Default icon color
  },

  // Kasir Button Custom Styles
  kasirIcon: {
    color: '#28a745', // Green icon
  },
  kasirButton: {
    backgroundColor: '#28a745', // Green button
    borderColor: '#28a745',
  },

  // Laporan Button Custom Styles
  laporanIcon: {
    color: '#17a2b8', // Blue icon
  },
  laporanButton: {
    backgroundColor: '#17a2b8', // Blue button
    borderColor: '#17a2b8',
  },

  // Barang Button Custom Styles
  barangIcon: {
    color: '#ffc107', // Yellow icon
  },
  barangButton: {
    backgroundColor: '#ffc107', // Yellow button
    borderColor: '#ffc107',
  },

  // Setting Button Custom Styles
  settingIcon: {
    color: '#dc3545', // Red icon
  },
  settingButton: {
    backgroundColor: '#dc3545', // Red button
    borderColor: '#dc3545',
  },
};

export default Dashboard;
