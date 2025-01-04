import React, { useState, useEffect, use } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { FaUserCircle, FaClock } from 'react-icons/fa';  // Menambahkan icon user
import moment from 'moment';
import useAxios from '../hooks/useAxios';

const NavbarComponent = ({ userName }) => {
  const [dateTime, setDateTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval saat komponen dibersihkan
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const api=useAxios();

  const keluar = async() => {
    await api.post('logout').then((response) => {
      if (response.status === 200) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }).catch((error) => {
      alert(error.response.data.message);
    });
  }

  return (
    <Navbar color="dark" dark expand="md" className="p-3">
      {/* NavbarBrand dengan gambar dan tulisan */}
      <NavbarBrand href="/" className="text-white d-flex align-items-center d-none d-md-block">
        {/* Gambar Logo Warkop */}
        <img src="https://i.pinimg.com/originals/74/26/cf/7426cf05ffe331b889b1459cd0005054.png" alt="Warkop Seramoe" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
        {/* Teks Warkop Seramoe */}
        <span style={{ fontSize: '20px', fontWeight: '600' }}>Warkop Seramoe</span>
      </NavbarBrand>
      
      <Nav className="ml-auto" navbar>
        {/* Waktu dan jam disembunyikan pada perangkat smartphone */}
        <NavItem className="me-3 d-none d-md-block">
          <Button style={styles.dropdownToggle} className="d-flex align-items-center">
            <FaClock size={30} style={{ marginRight: '10px' }} />
            {dateTime}
          </Button>
        </NavItem>
        
        <NavItem className="ml-auto">
          {/* User Dropdown */}
          <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle style={styles.dropdownToggle} className="d-flex align-items-center">
              <FaUserCircle size={30} style={{ marginRight: '10px' }} />
              {userName}
            </DropdownToggle>
            <DropdownMenu style={{ marginTop: '50px' }}>
              <DropdownItem onClick={() => keluar()}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

const styles = {
  dropdownToggle: {
    backgroundColor: '#333',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '20px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};

export default NavbarComponent;
