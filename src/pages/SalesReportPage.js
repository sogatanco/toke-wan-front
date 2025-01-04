import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Container,
} from "reactstrap";
import { Bar } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Importing necessary components from chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesReportPage = () => {
  // State for data
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [startDateTransactions, setStartDateTransactions] = useState(new Date());
  const [endDateTransactions, setEndDateTransactions] = useState(new Date());
  const [startDateItems, setStartDateItems] = useState(new Date());
  const [endDateItems, setEndDateItems] = useState(new Date());

  // Data Dummy for Transactions
  const transactionsDummyData = [
    { id: 1, date: "2025-01-01", total: 50000 },
    { id: 2, date: "2025-01-02", total: 35000 },
    { id: 3, date: "2025-01-03", total: 120000 },
    { id: 4, date: "2025-01-04", total: 45000 },
    { id: 5, date: "2025-01-05", total: 60000 },
    { id: 6, date: "2025-01-06", total: 95000 },
    { id: 7, date: "2025-01-07", total: 70000 },
    { id: 8, date: "2025-01-08", total: 55000 },
    { id: 9, date: "2025-01-09", total: 30000 },
    { id: 10, date: "2025-01-10", total: 85000 },
  ];

  const itemTransactionsDummyData = [
    { itemName: "Laptop", quantity: 10, total: 1000000 },
    { itemName: "Smartphone", quantity: 20, total: 400000 },
    { itemName: "Headphone", quantity: 15, total: 225000 },
    { itemName: "Keyboard", quantity: 25, total: 125000 },
    { itemName: "Mouse", quantity: 30, total: 90000 },
    { itemName: "Monitor", quantity: 5, total: 750000 },
    { itemName: "Charger", quantity: 50, total: 50000 },
    { itemName: "Webcam", quantity: 10, total: 200000 },
    { itemName: "Tablet", quantity: 8, total: 1600000 },
    { itemName: "Speaker", quantity: 12, total: 60000 },
  ];

  // State for storing transaction data
  const [transactions, setTransactions] = useState(transactionsDummyData);
  const [itemTransactions, setItemTransactions] = useState(itemTransactionsDummyData);

  // Dummy data for sales summary
  const salesSummary = {
    today: 150,
    yesterday: 120,
    thisWeek: 800,
    thisMonth: 3000,
  };

  const salesPerHourData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Penjualan per Jam",
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50)),
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const salesPerDayData = {
    labels: Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`),
    datasets: [
      {
        label: "Penjualan per Hari",
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200)),
        backgroundColor: "#2196F3",
      },
    ],
  };

  // Columns for transactions table
  const columns = [
    { name: "ID Transaksi", selector: (row) => row.id, sortable: true },
    { name: "Tanggal", selector: (row) => row.date, sortable: true },
    { name: "Total", selector: (row) => row.total, sortable: true },
  ];

  const itemColumns = [
    { name: "Nama Barang", selector: (row) => row.itemName, sortable: true },
    { name: "Jumlah Terjual", selector: (row) => row.quantity, sortable: true },
    { name: "Total", selector: (row) => row.total, sortable: true },
  ];

  // Custom DatePicker Component
  const CustomDatePicker = ({ selected, onChange, placeholder, isMonthPicker }) => (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={isMonthPicker ? "MM/yyyy" : "yyyy-MM-dd"}
      showMonthYearPicker={isMonthPicker}
      placeholderText={placeholder}
      className="ms-2"
    />
  );

  useEffect(() => {
    // Ensure to destroy chart instances before creating a new one
    const ctxHour = document.getElementById('salesPerHourChart').getContext('2d');
    const ctxDay = document.getElementById('salesPerDayChart').getContext('2d');

    const chartHour = new ChartJS(ctxHour, {
      type: 'bar',
      data: salesPerHourData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Penjualan Per Jam',
          },
        },
      },
    });

    const chartDay = new ChartJS(ctxDay, {
      type: 'bar',
      data: salesPerDayData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Penjualan Per Hari',
          },
        },
      },
    });

    // Cleanup charts on unmount
    return () => {
      chartHour.destroy();
      chartDay.destroy();
    };
  }, [salesPerHourData, salesPerDayData]);

  return (
    <Container className="p-4">
      <h3>Laporan Penjualan</h3>

      {/* Sales Summary Cards */}
      <Row className="mb-4">
        {Object.entries(salesSummary).map(([key, value], index) => (
          <Col md={3} key={index}>
            <Card className="text-center shadow">
              <CardBody>
                <CardTitle tag="h5">{key.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
                <h3>{value}</h3>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart Per Jam */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Penjualan Per Jam</h5>
          <CustomDatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            placeholder="Pilih Tanggal"
          />
        </div>
        <canvas id="salesPerHourChart"></canvas>
      </div>

      {/* Chart Per Hari */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Penjualan Per Hari</h5>
          <CustomDatePicker
            selected={selectedMonth}
            onChange={setSelectedMonth}
            placeholder="Pilih Bulan"
            isMonthPicker
          />
        </div>
        <canvas id="salesPerDayChart"></canvas>
      </div>

      {/* Transactions Per Hari */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Daftar Transaksi</h5>
          <div>
            <CustomDatePicker
              selected={startDateTransactions}
              onChange={setStartDateTransactions}
              placeholder="Start Date"
            />
            <CustomDatePicker
              selected={endDateTransactions}
              onChange={setEndDateTransactions}
              placeholder="End Date"
            />
          </div>
        </div>
        <DataTable columns={columns} data={transactions} pagination noDataComponent="Tidak ada transaksi" />
      </div>

      {/* Transactions Per Barang */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Daftar Transaksi per Barang</h5>
          <div>
            <CustomDatePicker
              selected={startDateItems}
              onChange={setStartDateItems}
              placeholder="Start Date"
            />
            <CustomDatePicker
              selected={endDateItems}
              onChange={setEndDateItems}
              placeholder="End Date"
            />
          </div>
        </div>
        <DataTable columns={itemColumns} data={itemTransactions} pagination noDataComponent="Tidak ada transaksi per barang" />
      </div>
    </Container>
  );
};

export default SalesReportPage;
