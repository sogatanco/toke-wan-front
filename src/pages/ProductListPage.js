import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Form,
    FormGroup,
    Label,
    Container,
} from "reactstrap";
import useAxios from "../hooks/useAxios";

const ProductListPage = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Produk A", quantity: 10, price: 5000, image: "" },
        { id: 2, name: "Produk B", quantity: 15, price: 10000, image: "" },
        { id: 3, name: "Produk C", quantity: 20, price: 15000, image: "" },
    ]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        quantity: "",
        price: "",
        image: null,
    });

    const api = useAxios();

    

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddProduct = async () => {
        if (newProduct.name && newProduct.quantity && newProduct.price) {
            const newProductData = {

                nama: newProduct.name,
                stok: parseInt(newProduct.quantity),
                harga_jual: parseInt(newProduct.price),
                harga_modal: parseInt(newProduct.price),
                image: newProduct.image,
            };

            console.log(newProductData);

            await api.post('product', newProductData).then((response) => {
                if (response.status === 200) {
                    alert("Produk berhasil ditambahkan.");
                    setIsAddModalOpen(false);
                }
            }).catch((error) => {
                alert(error.response.data.message);
            });

        } else {
            alert("Semua field harus diisi.");
        }
    };

    const handleEditProduct = () => {
        if (currentProduct.name && currentProduct.quantity && currentProduct.price) {
            setProducts(
                products.map((product) =>
                    product.id === currentProduct.id ? currentProduct : product
                )
            );
            setIsEditModalOpen(false);
        } else {
            alert("Semua field harus diisi.");
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            setProducts(products.filter((product) => product.id !== id));
        }
    };

    // Columns for the data table
    const columns = [
        {
            name: "Nama Produk",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Jumlah",
            selector: (row) => row.quantity,
            sortable: true,
        },
        {
            name: "Harga Satuan",
            selector: (row) => `Rp ${row.price.toLocaleString()}`,
            sortable: true,
        },
        {
            name: "Aksi",
            cell: (row) => (
                <>
                    <Button
                        color="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                            setCurrentProduct(row);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteProduct(row.id)}
                    >
                        Hapus
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Container className="p-4">
            <h3 style={{ marginBottom: -7 }}>Daftar Produk</h3>
            <hr></hr>
            <div className="d-flex justify-content-between mt-4">
                <Button color="primary" onClick={() => setIsAddModalOpen(true)}>
                    + Tambah Produk Baru
                </Button>
                <Input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: "300px" }}
                />

            </div>
            <DataTable
                columns={columns}
                data={filteredProducts}
                pagination
                highlightOnHover
                responsive
            />

            {/* Modal untuk menambahkan produk baru */}
            <Modal
                isOpen={isAddModalOpen}
                toggle={() => setIsAddModalOpen(!isAddModalOpen)}
            >
                <ModalHeader toggle={() => setIsAddModalOpen(!isAddModalOpen)}>
                    Tambah Produk Baru
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Nama Produk</Label>
                            <Input
                                type="text"
                                value={newProduct.name}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, name: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Jumlah</Label>
                            <Input
                                type="number"
                                value={newProduct.quantity}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, quantity: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Harga Satuan</Label>
                            <Input
                                type="number"
                                value={newProduct.price}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, price: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Gambar Produk</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();

                                        reader.onloadend = () => {
                                            setNewProduct({
                                                ...newProduct,
                                                image: reader.result, // Menyimpan gambar dalam format base64
                                            });
                                        };

                                        reader.readAsDataURL(file); // Membaca file gambar sebagai base64
                                    }
                                }

                                }
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleAddProduct}>
                        Simpan
                    </Button>
                    <Button color="secondary" onClick={() => setIsAddModalOpen(false)}>
                        Batal
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal untuk mengedit produk */}
            <Modal
                isOpen={isEditModalOpen}
                toggle={() => setIsEditModalOpen(!isEditModalOpen)}
            >
                <ModalHeader toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
                    Update Produk
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Nama Produk</Label>
                            <Input
                                type="text"
                                value={currentProduct?.name || ""}
                                onChange={(e) =>
                                    setCurrentProduct({
                                        ...currentProduct,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Jumlah</Label>
                            <Input
                                type="number"
                                value={currentProduct?.quantity || ""}
                                onChange={(e) =>
                                    setCurrentProduct({
                                        ...currentProduct,
                                        quantity: e.target.value,
                                    })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Harga Satuan</Label>
                            <Input
                                type="number"
                                value={currentProduct?.price || ""}
                                onChange={(e) =>
                                    setCurrentProduct({
                                        ...currentProduct,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleEditProduct}>
                        Simpan
                    </Button>
                    <Button color="secondary" onClick={() => setIsEditModalOpen(false)}>
                        Batal
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default ProductListPage;
