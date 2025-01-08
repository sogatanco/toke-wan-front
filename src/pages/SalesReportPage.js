import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Row, Col, Input, Card, CardBody } from "reactstrap";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAxios from "../hooks/useAxios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesReportPage = () => {
  const [data, setData] = useState({
    total_transaksi_all: 0,
    total_transaksi_this_week: 0,
    total_transaksi_today: 0,
    total_transactions_today_count: 0,
  });

  const [totalBulan, setTotalBulan] = useState(0);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());

  const api = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('total-all');
        const { total_transaksi_all, total_transaksi_this_week, total_transaksi_today, total_transactions_today_count } = response.data;

        setData({
          total_transaksi_all: total_transaksi_all,
          total_transaksi_this_week: total_transaksi_this_week,
          total_transaksi_today: total_transaksi_today,
          total_transactions_today_count: total_transactions_today_count,
        });

        const fetchChartData = await api.get(
          `total-transaksi/${selectedMonth}/${selectedYear}`
        );
        const { days, total_transaksi } = fetchChartData.data;
        const totalTransaksiBulanIni = total_transaksi
          .map((item) => parseFloat(item))
          .reduce((total, currentValue) => total + currentValue, 0);

        const formattedTotal = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(totalTransaksiBulanIni);
        setTotalBulan(formattedTotal);

        setBarChartData({
          labels: days,
          datasets: [
            {
              label: "Total Transaksi Per Hari",
              data: total_transaksi,
              borderColor: "#4CAF50",
              backgroundColor: "#4CAF50",
              borderWidth: 1,
              hoverBackgroundColor: "#388E3C",
              barThickness: 15,
            },
          ],
        });

        const tableDataResponse = await api.get(`/transactions?date=${new Date(selectedDate).toISOString().split("T")[0]}`);
        setTransactions(tableDataResponse.data.data);
        setFilteredTransactions(tableDataResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, selectedDate]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = transactions.filter((item) =>
      item.product_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const styles = {
    container: {
      padding: "20px",
    },
    cardContainer: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "20px",
    },
    card: {
      position: "relative",
      backgroundColor: "#fff",
      color: "#fff",
      padding: "20px",
      borderRadius: "10px",
      flex: 1,
      margin: "10px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      overflow: "visible",
    },
    cardIcon: {
      position: "absolute",
      top: "-35px",
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "3rem",
      zIndex: 10,
      backgroundColor: "#fff",
      borderRadius: "50%",
      border: "6px solid",
      padding: "15px",
    },
    cardTitle: {
      fontSize: "1.5rem",
      margin: "10px 0",
    },
    cardValue: {
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
    chartContainer: {
      display: "flex",
      marginTop: "40px",
      height: "500px",
    },
    chartWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    barChartContainer: {
      flex: 1,
      padding: "10px",
      marginRight: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
    },
    barChartFilter: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
      padding: "0 10px",
    },
    select: {
      padding: "8px 15px",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const tableColumns = [
    {
      name: "Waktu Transaksi", selector: (row) =>(
      
        `${new Date(row.created_at).toLocaleDateString("id-ID", {
        weekday: 'long',  // Menampilkan nama hari (Senin, Selasa, dst)
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })} ${new Date(row.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`
        
      ) , sortable: true
    },
    { name: "Nama Produk", selector: (row) => row.product_name, sortable: true },
    { name: "Quantity", selector: (row) => row.jumlah_produk, sortable: true },
    { name: "Harga / Produk", selector: (row) => `Rp ${row.harga_per_item.toLocaleString("id-ID")}`, sortable: true },
    { name: "Total Harga", selector: (row) => `Rp ${row.total_harga.toLocaleString("id-ID")}`, sortable: true },
  ];

  return (
    <>
      <div style={styles.container} className="container">
        <div style={styles.cardContainer}>
          <div style={{ ...styles.card, backgroundColor: "red" }}>
            <i
              className="fas fa-wallet"
              style={{ ...styles.cardIcon, borderColor: "red", color: "red" }}
            ></i>
            <h3 style={styles.cardTitle} className="mt-5">Semua</h3>
            <p style={styles.cardValue}>Rp {data.total_transaksi_all}</p>
          </div>
          <div style={{ ...styles.card, backgroundColor: "black" }}>
            <i
              className="fas fa-shopping-cart"
              style={{ ...styles.cardIcon, borderColor: "black", color: "black" }}
            ></i>
            <h3 style={styles.cardTitle} className="mt-5">Minggu Ini</h3>
            <p style={styles.cardValue}>Rp {data.total_transaksi_this_week}</p>
          </div>
          <div style={{ ...styles.card, backgroundColor: "#ffcc00" }}>
            <i
              className="fas fa-sync-alt"
              style={{ ...styles.cardIcon, borderColor: "#ffcc00", color: "#ffcc00" }}
            ></i>
            <h3 style={styles.cardTitle} className="mt-5">Hari ini</h3>
            <p style={styles.cardValue}>Rp {data.total_transaksi_today}</p>
          </div>
          <div style={{ ...styles.card, backgroundColor: "green" }}>
            <i
              className="fas fa-calendar-alt"
              style={{ ...styles.cardIcon, borderColor: "green", color: "green" }}
            ></i>
            <h3 style={styles.cardTitle} className="mt-5">Jumlah</h3>
            <p style={styles.cardValue}>{data.total_transactions_today_count}</p>
          </div>
        </div>

      </div>

      <div className="container mt-5">
        <Card>
          <CardBody>
            <Row>
              <Col md="12">
                <h5>Laporan Penjualan Per Bulan</h5>
                <div style={styles.barChartFilter}>
                  <div>
                    <select style={styles.select} value={selectedMonth} onChange={handleMonthChange}>
                      <option value={1}>Januari</option>
                      <option value={2}>Februari</option>
                      <option value={3}>Maret</option>
                      <option value={4}>April</option>
                      <option value={5}>Mei</option>
                      <option value={6}>Juni</option>
                      <option value={7}>Juli</option>
                      <option value={8}>Agustus</option>
                      <option value={9}>September</option>
                      <option value={10}>Oktober</option>
                      <option value={11}>November</option>
                      <option value={12}>Desember</option>
                    </select>
                  </div>
                  <div>
                    <select style={styles.select} value={selectedYear} onChange={handleYearChange}>
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: `Total Transaksi Per Hari Dalam Bulan ke ${selectedMonth} tahun ${selectedYear} : ${totalBulan}`,
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Tanggal',
                        },
                      },
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Total Transaksi',
                        },
                      },
                    },
                  }}
                />

              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>

      <div className="container mt-4">
        <Card>
          <CardBody>
            <DataTable
              title="Data Transaksi Per Hari"
              columns={tableColumns}
              data={filteredTransactions}
              pagination
              highlightOnHover
              striped
              subHeader
              subHeaderComponent={

                <div className="d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
                  <div>
                    <Input
                      type="text"
                      placeholder="Cari . . . . . "
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  <div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date.toISOString().split("T")[0])}
                    />
                  </div>
                </div>
              }
            />
          </CardBody>
        </Card>

      </div>
    </>
  );
};

export default SalesReportPage;
