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

const UserManagementPage = () => {
    const [users, setUsers] = useState([
        { id: 1, fullName: "John Doe", email: "john@example.com", password: "123456" },
        { id: 2, fullName: "Jane Smith", email: "jane@example.com", password: "abcdef" },
    ]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "" });
    const [currentUser, setCurrentUser] = useState(null);

    // Filter users by search query
    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle adding a new user
    const handleAddUser = () => {
        if (newUser.fullName && newUser.email && newUser.password) {
            const newUserData = {
                id: users.length + 1,
                ...newUser,
            };
            setUsers([...users, newUserData]);
            setNewUser({ fullName: "", email: "", password: "" });
            setIsAddModalOpen(false);
        } else {
            alert("Semua field harus diisi.");
        }
    };

    // Handle editing a user
    const handleEditUser = () => {
        if (currentUser.fullName && currentUser.email && currentUser.password) {
            setUsers(
                users.map((user) => (user.id === currentUser.id ? currentUser : user))
            );
            setIsEditModalOpen(false);
        } else {
            alert("Semua field harus diisi.");
        }
    };

    // Handle deleting a user
    const handleDeleteUser = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    // Columns for the data table
    const columns = [
        {
            name: "Nama Lengkap",
            selector: (row) => row.fullName,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
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
                            setCurrentUser(row);
                            setIsEditModalOpen(true);
                        }}
                    >
                        Update
                    </Button>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(row.id)}
                    >
                        Hapus
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Container className="p-4">
            <h3 style={{ marginBottom: -6 }}>Manajemen Pengguna</h3>
            <hr />
            <div className="d-flex justify-content-between mt-4">
                <Button color="primary" onClick={() => setIsAddModalOpen(true)}>
                    + Tambah Kasir
                </Button>
                <Input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: "300px" }}
                />

            </div>
            <DataTable
                columns={columns}
                data={filteredUsers}
                pagination
                highlightOnHover
                responsive
            />

            {/* Modal untuk menambahkan pengguna baru */}
            <Modal
                isOpen={isAddModalOpen}
                toggle={() => setIsAddModalOpen(!isAddModalOpen)}
            >
                <ModalHeader toggle={() => setIsAddModalOpen(!isAddModalOpen)}>
                    Tambah Pengguna Baru
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Nama Lengkap</Label>
                            <Input
                                type="text"
                                value={newUser.fullName}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, fullName: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={newUser.email}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, email: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={newUser.password}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, password: e.target.value })
                                }
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleAddUser}>
                        Simpan
                    </Button>
                    <Button color="secondary" onClick={() => setIsAddModalOpen(false)}>
                        Batal
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal untuk mengedit pengguna */}
            <Modal
                isOpen={isEditModalOpen}
                toggle={() => setIsEditModalOpen(!isEditModalOpen)}
            >
                <ModalHeader toggle={() => setIsEditModalOpen(!isEditModalOpen)}>
                    Update Pengguna
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Nama Lengkap</Label>
                            <Input
                                type="text"
                                value={currentUser?.fullName || ""}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, fullName: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={currentUser?.email || ""}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, email: e.target.value })
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={currentUser?.password || ""}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, password: e.target.value })
                                }
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleEditUser}>
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

export default UserManagementPage;
