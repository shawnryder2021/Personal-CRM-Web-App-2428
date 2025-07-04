import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomerProvider } from './context/CustomerContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Leads from './pages/Leads';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <CustomerProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </CustomerProvider>
  );
}

export default App;