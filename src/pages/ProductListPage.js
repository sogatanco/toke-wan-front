import React, { useState } from "react";
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
import DataTable from "react-data-table-component";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import Switch from "react-switch";

// Fetch products from API
const BASE_URL = process.env.REACT_APP_BASE_URL;
const fetchProducts = async (api) => {
  const response = await api.get("/products");
  if (!response.data || !response.data.success) {
    throw new Error("Failed to fetch products");
  }
  return response.data.data;
};

// Update product via API
const updateProduct = async (api, productId, productData) => {
  const response = await api.put(`/product/${productId}`, productData);
  if (!response.data || !response.data.success) {
    throw new Error("Failed to update product");
  }
  return response.data.data;
};

// Update product status via API
const updateProductStatus = async (api, productId, status) => {
  const response = await api.put(`/product/${productId}/status`, { status });
  if (!response.data || !response.data.success) {
    throw new Error("Failed to update product status");
  }
  return response.data.data;
};

// Delete product via API
const deleteProduct = async (api, productId) => {
  const response = await api.delete(`/product/${productId}`);
  if (!response.data || !response.data.success) {
    throw new Error("Failed to delete product");
  }
  return response.data.message;
};

// Add stock via API
const addStock = async (api, productId, stockToAdd) => {
  const response = await api.put(`/product/${productId}/add-stock`, { stok: stockToAdd });
  if (!response.data || !response.data.success) {
    throw new Error("Failed to add stock");
  }
  return response.data.data;
};

const ProductListPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false); // Modal untuk tambah stok
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null,
  });
  const [stockToAdd, setStockToAdd] = useState(0); // State untuk stok yang ditambahkan
  const [currentProduct, setCurrentProduct] = useState(null); // Product for update modal

  const api = useAxios();

  // Fetch products data using React Query
  const {
    data: products,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(api),
  });

  // Mutation for updating product
  const { mutate: updateProductById } = useMutation({
    mutationFn: ({ id, productData }) => updateProduct(api, id, productData),
    onSuccess: () => {
      alert("Produk berhasil diperbarui.");
      setIsUpdateModalOpen(false);
      refetch(); // Refresh data
    },
    onError: (error) => {
      alert(error.message || "Gagal memperbarui produk.");
    },
  });

  // Mutation for updating product status
  const { mutate: updateStatus } = useMutation({
    mutationFn: (product) =>
      updateProductStatus(api, product.id, product.status),
    onSuccess: () => {
      refetch(); // Refresh data
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  // Mutation for deleting product
  const { mutate: deleteProductById } = useMutation({
    mutationFn: (productId) => deleteProduct(api, productId),
    onSuccess: (message) => {
      alert(message);
      refetch(); // Refresh data
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  // Handle adding a new product
  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.quantity && newProduct.price) {
      const newProductData = {
        nama: newProduct.name,
        stok: parseInt(newProduct.quantity),
        harga_jual: parseFloat(newProduct.price),
        harga_modal: parseFloat(newProduct.price),
        image: newProduct.image,
      };

      await api
        .post("/product", newProductData)
        .then(() => {
          alert("Produk berhasil ditambahkan.");
          setIsAddModalOpen(false);
          refetch();
        })
        .catch((error) => {
          alert(error.response?.data?.message || "Terjadi kesalahan.");
        });
    } else {
      alert("Semua field harus diisi.");
    }
  };

  // Handle updating a product
  const handleSaveUpdatedProduct = () => {
    if (currentProduct) {
      updateProductById({
        id: currentProduct.id,
        productData: {
          nama: currentProduct.nama,
          stok: currentProduct.stok,
          harga_jual: currentProduct.harga_jual,
          harga_modal: currentProduct.harga_modal,
          image: currentProduct.image,
        },
      });
    }
  };

  // Handle adding stock to a product
  const handleAddStock = async () => {
    if (stockToAdd > 0 && currentProduct) {
      await addStock(api, currentProduct.id, stockToAdd)
        .then(() => {
          alert("Stok berhasil ditambahkan.");
          setIsAddStockModalOpen(false);
          refetch(); // Refresh data
        })
        .catch((error) => {
          alert(error.message || "Terjadi kesalahan saat menambah stok.");
        });
    } else {
      alert("Jumlah stok harus lebih dari 0.");
    }
  };

  // Filter products based on search query
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.nama.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Define columns for DataTable
  const columns = [
    {
      name: "Gambar",
      cell: (row) => (
        <img
          src={`${BASE_URL}storage/${row.gambar}`}
          alt={row.nama}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            borderRadius: "5px",
            padding: "5px",
          }}
        />
      ),
      sortable: false,
    },
    {
      name: "Nama Produk",
      selector: (row) => row.nama || "N/A",
      sortable: true,
    },
    {
      name: "Stok",
      selector: (row) => row.stok || 0,
      sortable: true,
    },
    {
      name: "Harga Jual",
      selector: (row) =>
        `Rp ${parseFloat(row.harga_jual).toLocaleString() || 0}`,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Switch
          checked={row.status === 1}
          onChange={() =>
            updateStatus({ ...row, status: row.status === 1 ? 0 : 1 })
          }
          offColor="#888"
          onColor="#0f6e4a"
          height={20}
          width={60}
          handleDiameter={20}
          checkedIcon={<span style={{ color: "white" }}>Aktif</span>}
          uncheckedIcon={<span style={{ color: "white" }}>Non Aktif</span>}
        />
      ),
      sortable: true,
    },
    {
      name: "Aksi",
      width: "25%",
      cell: (row) => (
        <>
          <Button
            className="me-2"
            color="success"
            size="sm"
            onClick={() => {
              setCurrentProduct(row);
              setIsAddStockModalOpen(true); // Show add stock modal
            }}
          >
            Tambah Stok
          </Button>
          <Button
            className="me-2"
            color="warning"
            size="sm"
            onClick={() => {
              setCurrentProduct(row);
              setIsUpdateModalOpen(true);
            }}
          >
            Update
          </Button>
          <Button
            color="danger"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  `Apakah Anda yakin ingin menghapus produk "${row.nama}"?`
                )
              ) {
                deleteProductById(row.id);
              }
            }}
          >
            Hapus
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Container className="p-4">
      <h3>Daftar Produk</h3>
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

      {/* Add Product Modal */}
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
                      setNewProduct({ ...newProduct, image: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
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

      {/* Update Product Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
      >
        <ModalHeader toggle={() => setIsUpdateModalOpen(!isUpdateModalOpen)}>
          Update Produk
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nama Produk</Label>
              <Input
                type="text"
                value={currentProduct?.nama || ""}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, nama: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={currentProduct?.stok || ""}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, stok: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Harga Jual</Label>
              <Input
                type="number"
                value={currentProduct?.harga_jual || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    harga_jual: e.target.value,
                  })
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
                      setCurrentProduct({
                        ...currentProduct,
                        image: reader.result,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleSaveUpdatedProduct}>
            Simpan
          </Button>
          <Button color="secondary" onClick={() => setIsUpdateModalOpen(false)}>
            Batal
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Stock Modal */}
      <Modal
        isOpen={isAddStockModalOpen}
        toggle={() => setIsAddStockModalOpen(!isAddStockModalOpen)}
      >
        <ModalHeader toggle={() => setIsAddStockModalOpen(!isAddStockModalOpen)}>
          Tambah Stok Produk
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Jumlah Stok yang Akan Ditambahkan</Label>
              <Input
                type="number"
                value={stockToAdd}
                onChange={(e) => setStockToAdd(parseInt(e.target.value))}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={handleAddStock}>
            Simpan
          </Button>
          <Button color="secondary" onClick={() => setIsAddStockModalOpen(false)}>
            Batal
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default ProductListPage;
