import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardImg, Button, ListGroup, ListGroupItem, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const productsData = [
    { id: 1, name: 'Produk A', price: 5000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 2, name: 'Produk B', price: 10000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 3, name: 'Produk C', price: 15000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 4, name: 'Produk D', price: 20000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 5, name: 'Produk E', price: 25000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 6, name: 'Produk F', price: 30000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 7, name: 'Produk G', price: 35000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 8, name: 'Produk H', price: 40000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 9, name: 'Produk F', price: 30000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 10, name: 'Produk G', price: 35000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 11, name: 'Produk H', price: 40000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 12, name: 'Produk G', price: 35000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 13, name: 'Produk H', price: 40000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 14, name: 'Produk G', price: 35000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 15, name: 'Produk H', price: 40000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 16, name: 'Produk G', price: 35000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
    { id: 17, name: 'Produk H', price: 40000, image: 'https://ketahananpangan.semarangkota.go.id/v3/content/images/kopi%20%281%29.jpg' },
];

const Kasir = () => {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [payment, setPayment] = useState('');
    const [change, setChange] = useState(null);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const filteredProducts = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    

    const handleNumberClick = (num) => {
        setPayment((prevPayment) => prevPayment * 10 + num);
    };

    const handleDelete = () => {
        setPayment(Math.floor(payment / 10));
    };


    useEffect(() => {
        
        const total = calculateTotal();
        if (payment && payment >= total) {
            setChange(payment - total);
        } 
    },[payment]);

    return (
        <Container fluid className="d-flex flex-column p-5" style={{ minHeight: '80vh' }}>
            <Row className="w-100">
                <Col md="8" className="d-flex flex-column">
                    <Row className="w-100 mb-4">
                        <Col md="12">
                            <Input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </Col>
                    </Row>

                    <div style={styles.productListWrapper}>
                        <Row className="w-100">
                            {filteredProducts.map((product) => (
                                <Col key={product.id} md="3" lg="2" sm="4" xs="6" className="mb-4">
                                    <Card style={styles.card} onClick={() => addToCart(product)}>
                                        <CardImg top width="100%" src={product.image} alt={product.name} />
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name}</CardTitle>
                                            <p>Rp {product.price.toLocaleString()}</p>
                                            <Button style={styles.button} block>
                                                Tambah
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Col>

                <Col md="4" className="d-flex flex-column">
                    <div style={styles.cart}>
                        <h4>Keranjang Belanja</h4>
                        <ListGroup>
                            {cart.map((item) => (
                                <ListGroupItem key={item.id} style={styles.cartItem}>
                                    <div className="d-flex justify-content-between">
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                        <hr />
                        <div style={styles.total}>
                            <h5>Total Harga: Rp {calculateTotal().toLocaleString()}</h5>
                        </div>
                        <Button color="success" block onClick={() => setModalOpen(true)}>
                            Bayar
                        </Button>
                    </div>
                </Col>
            </Row>

            <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)} className='calculator-font'>Pembayaran</ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        value={payment.toLocaleString()}
                        onChange={(e) => setPayment(Number(e.target.value.replace(/[^0-9]/g, '')))}
                        style={styles.paymentInput}
                    />
                    {change !== null && (
                        <div style={styles.changeWrapper}>
                            <h5>Kembalian: Rp {change.toLocaleString()}</h5>
                        </div>
                    )}

                    <div style={styles.calculator}>
                        {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                            <Button
                                key={num}
                                onClick={() => handleNumberClick(num)}
                                style={num === 0 ? styles.numButtonLarge : styles.numButton}
                                color="primary"
                            >
                                {num}
                            </Button>
                        ))}
                        <Button onClick={handleDelete} style={styles.numButton} color="danger">
                            Del
                        </Button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" >
                        Proses Pembayaran
                    </Button>
                    <Button color="secondary" onClick={() => setModalOpen(false)}>
                        Batal
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

const styles = {
    searchInput: {
        borderRadius: '20px',
        padding: '10px',
        fontSize: '16px',
        borderColor: '#007bff',
    },
    card: {
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        backgroundColor: '#fff',
        cursor: 'pointer',
    },
    button: {
        marginTop: '10px',
        borderRadius: '20px',
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        fontWeight: '600',
    },
    cart: {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f8f9fa',
    },
    cartItem: {
        padding: '10px',
    },
    total: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
    productListWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 160px)',
    },
    changeWrapper: {
        marginTop: '10px',
        fontWeight: 'bold',
        color: '#28a745',
    },
    calculator: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridGap: '10px',
        marginTop: '20px',
    },
    numButton: {
        fontSize: '20px',
        padding: '20px',
        borderRadius: '5px',
        height: '60px',
        minWidth: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numButtonLarge: {
        fontSize: '20px',
        padding: '20px',
        borderRadius: '5px',
        height: '60px',
        minWidth: '130px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentInput: {
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#f1f1f1',
        borderRadius: '10px',
        border: '1px solid #ccc',
    },
};

export default Kasir;
