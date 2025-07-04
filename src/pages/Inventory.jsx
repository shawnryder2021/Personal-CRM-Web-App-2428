import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiSearch, FiTruck, FiDollarSign, FiCalendar, FiTag } = FiIcons;

function Inventory() {
  const { state, dispatch } = useCustomers();
  const { vehicles, vehicleTypes } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.year?.toString().includes(searchTerm) ||
      vehicle.vin?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = [
    {
      name: 'Total Vehicles',
      value: vehicles.length,
      icon: FiTruck,
      color: 'bg-blue-500',
    },
    {
      name: 'Available',
      value: vehicles.filter(v => v.status === 'available').length,
      icon: FiTag,
      color: 'bg-green-500',
    },
    {
      name: 'Sold',
      value: vehicles.filter(v => v.status === 'sold').length,
      icon: FiDollarSign,
      color: 'bg-purple-500',
    },
    {
      name: 'Average Price',
      value: vehicles.length > 0 ? 
        `$${Math.round(vehicles.reduce((total, v) => total + (v.price || 0), 0) / vehicles.length).toLocaleString()}` : 
        '$0',
      icon: FiCalendar,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'sold': return 'bg-purple-100 text-purple-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Add Vehicle</span>
        </motion.button>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {vehicle.image ? (
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <SafeIcon icon={FiTruck} className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {vehicle.mileage && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} miles
                    </p>
                  )}
                  {vehicle.color && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Color:</span> {vehicle.color}
                    </p>
                  )}
                  {vehicle.vin && (
                    <p className="text-sm text-gray-600 font-mono">
                      <span className="font-medium">VIN:</span> {vehicle.vin}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ${vehicle.price?.toLocaleString() || 'Price TBD'}
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-primary-50 text-primary-600 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors"
                    >
                      View Details
                    </motion.button>
                    {vehicle.status === 'available' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-sm font-medium hover:bg-green-100 transition-colors"
                      >
                        Mark Sold
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SafeIcon icon={FiTruck} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start building your inventory by adding your first vehicle'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Add Your First Vehicle
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}

export default Inventory;