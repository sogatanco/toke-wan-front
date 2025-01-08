import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../hooks/useAxios';
import { Container, Row, Col, Card, CardBody, CardTitle, CardImg, Button, ListGroup, ListGroupItem, Input } from 'reactstrap';
import { AiOutlineDelete } from 'react-icons/ai';

const Kasir = () => {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [payment, setPayment] = useState('');
    const [change, setChange] = useState(null);

    const api = useAxios();

    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/products_active');
            return response.data.data;
        },
        retry: 2,
    });

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

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const decreaseQuantity = (productId) => {
        setCart((prevCart) => {
            return prevCart.map((item) => {
                if (item.id === productId) {
                    if (item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        return null;
                    }
                }
                return item;
            }).filter(Boolean);
        });
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.harga_jual * item.quantity, 0);
    };

    const filteredProducts = products?.filter((product) =>
        product.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const simpanTransaksi = async () => {
        try {
            if (cart.length === 0) {
                alert('Keranjang belanja kosong! Tambahkan produk terlebih dahulu.');
                return;
            }

            const transactionData = {
                products: cart.map((item) => ({
                    id: item.id,
                    harga_jual: item.harga_jual,
                    quantity: item.quantity,
                })),
            };

            const response = await api.post('/transactions', transactionData);

            alert(`Transaksi berhasil disimpan dengan ID: ${response.data.transaction_id}`);
            setCart([]);
            setPayment('');
            setChange(null);
        } catch (error) {
            console.error('Error saat menyimpan transaksi:', error);
            alert('Gagal menyimpan transaksi. Silakan coba lagi.');
        }
    };

    React.useEffect(() => {
        const total = calculateTotal();
        if (payment && payment >= total) {
            setChange(payment - total);
        }
    }, [payment]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching products!</div>;
    }

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
                                <Col key={product.id} md="3" lg="3" sm="4" xs="6" className="mb-4">
                                    <Card style={styles.card}  onClick={() => addToCart(product)}>
                                        <CardImg
                                            top
                                            width="100%"
                                            src={`${process.env.REACT_APP_BASE_URL}storage/${product.gambar}`}
                                            alt={product.nama}
                                            style={styles.cardImage}
                                        />
                                        <CardBody style={styles.cardBody}>
                                            <CardTitle tag="h5" style={styles.cardTitle}>
                                                {product.nama}
                                            </CardTitle>
                                            <Button
                                                style={styles.priceButton}
                                                size='sm'
                                                block
                                               
                                            >
                                                Rp {Number(product.harga_jual).toLocaleString()}
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
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div style={{ flex: 1 }}>
                                            <span>{item.nama} (x{item.quantity})</span>
                                            <span>Rp {(item.harga_jual * item.quantity).toLocaleString()}</span>
                                        </div>
                                        <div className="d-flex">
                                            <Button
                                                color="warning"
                                                size="sm"
                                                onClick={() => decreaseQuantity(item.id)}
                                                style={styles.removeButton}
                                            >
                                                -
                                            </Button>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => removeFromCart(item.id)}
                                                style={styles.removeButton}
                                            >
                                                <AiOutlineDelete size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                        <hr />
                        <div style={styles.total}>
                            <h5>Total Harga: Rp {calculateTotal().toLocaleString()}</h5>
                        </div>
                        <Button color="success" block onClick={() => simpanTransaksi()}>
                            Bayar
                        </Button>
                    </div>
                </Col>
            </Row>
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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardImage: {
        height: '110px',
        objectFit: 'cover',
    },
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
    },
    cardTitle: {
        fontSize: '14px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        marginBottom: '10px',
    },
    priceButton: {
        marginTop: 'auto',
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
    removeButton: {
        marginLeft: '5px',
    },
    total: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
    productListWrapper: {
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 160px)',
    },
};

export default Kasir;
