import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import CustomerCard from '../components/CustomerCard';
import CustomerModal from '../components/CustomerModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiSearch, FiGrid, FiList, FiFilter, FiLoader } = FiIcons;

function Customers() {
  const { state, dispatch } = useCustomers();
  const { customers, tags, searchTerm, loading, modalLoading, error } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTag, setSelectedTag] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.interestedVehicle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || customer.tags?.includes(selectedTag);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesTag && matchesStatus;
  });

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Customers</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Tags</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddCustomer}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
            disabled={modalLoading}
          >
            {modalLoading ? (
              <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
            ) : (
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
            )}
            <span>Add Customer</span>
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredCustomers.length} customers shown</span>
          <span>{customers.length} total customers</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && customers.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiLoader} className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading customers...</p>
        </div>
      )}

      {/* Customers Grid/List */}
      <AnimatePresence mode="wait">
        {!loading && filteredCustomers.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CustomerCard
                  customer={customer}
                  viewMode={viewMode}
                  onEdit={() => handleEditCustomer(customer)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiSearch} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedTag !== 'all' || statusFilter !== 'all'
                ? 'No customers found'
                : 'No customers yet'
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedTag !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start building your customer base by adding your first customer'
              }
            </p>
            {!searchTerm && selectedTag === 'all' && statusFilter === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddCustomer}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add Your First Customer
              </motion.button>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={editingCustomer}
      />
    </div>
  );
}

export default Customers;