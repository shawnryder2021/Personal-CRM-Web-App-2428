import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiCar,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiLoader,
  FiMapPin,
  FiFileText,
  FiUser,
  FiActivity
} = FiIcons;

function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, deleteCustomer, addInteraction } = useCustomers();
  const { customers, interactions, sales, loading } = state;
  const customer = customers.find(c => c.id === id);
  const customerInteractions = interactions.filter(i => i.customerId === id);
  const customerSales = sales.filter(s => s.customerId === id);

  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    notes: '',
  });

  const [activeTab, setActiveTab] = useState('interactions');

  if (!customer && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  if (loading || !customer) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiLoader} className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">Loading customer details...</p>
      </div>
    );
  }

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    if (!newInteraction.notes.trim()) return;
    try {
      await addInteraction({
        customerId: id,
        type: newInteraction.type,
        notes: newInteraction.notes,
      });
      setNewInteraction({
        type: 'call',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        navigate('/customers');
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const formatAddress = () => {
    const parts = [];
    if (customer.address) parts.push(customer.address);
    if (customer.city) parts.push(customer.city);
    if (customer.state) parts.push(customer.state);
    if (customer.zipCode) parts.push(customer.zipCode);
    
    return parts.join(', ');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back to Customers
        </button>
        <div className="flex items-center space-x-3">
          <button
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiEdit3} className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteCustomer}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? (
              <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
            ) : (
              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-bold text-2xl">
              {customer.firstName?.charAt(0).toUpperCase()}{customer.lastName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                customer.status === 'active' ? 'bg-green-100 text-green-700' :
                customer.status === 'prospect' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {customer.status}
              </span>
              {customer.leadSource && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {customer.leadSource}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <SafeIcon icon={FiMail} className="w-5 h-5 mr-3" />
                <a href={`mailto:${customer.email}`} className="hover:text-primary-600 transition-colors">
                  {customer.email}
                </a>
              </div>
              {customer.phone && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiPhone} className="w-5 h-5 mr-3" />
                  <a href={`tel:${customer.phone}`} className="hover:text-primary-600 transition-colors">
                    {customer.phone}
                  </a>
                </div>
              )}
              {formatAddress() && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiMapPin} className="w-5 h-5 mr-3" />
                  <span>{formatAddress()}</span>
                </div>
              )}
              {customer.interestedVehicle && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiCar} className="w-5 h-5 mr-3" />
                  <span>{customer.interestedVehicle}</span>
                </div>
              )}
              {customer.budget && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiDollarSign} className="w-5 h-5 mr-3" />
                  <span>Budget: ${customer.budget.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-3" />
                <span>Customer since {format(new Date(customer.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            {customer.tags && customer.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {customer.tags.map(tag => (
                  <span key={tag} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {customer.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'interactions'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiActivity} className="w-4 h-4 inline mr-2" />
            Interactions
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'purchases'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiDollarSign} className="w-4 h-4 inline mr-2" />
            Purchases
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-2" />
            Details
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'interactions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Interaction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Interaction</h3>
                <form onSubmit={handleAddInteraction} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newInteraction.type}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="call">Phone Call</option>
                      <option value="email">Email</option>
                      <option value="meeting">Meeting</option>
                      <option value="text">Text Message</option>
                      <option value="showroom_visit">Showroom Visit</option>
                      <option value="test_drive">Test Drive</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="service">Service Appointment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={newInteraction.notes}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="What was discussed? Any follow-up actions needed?"
                      required
                      disabled={loading}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
                    ) : (
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Logging...' : 'Log Interaction'}</span>
                  </motion.button>
                </form>
              </motion.div>

              {/* Interaction History */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction History</h3>
                {customerInteractions.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {customerInteractions
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((interaction) => (
                        <div key={interaction.id} className="border-l-4 border-primary-200 pl-4 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900 capitalize">
                              {interaction.type.replace('_', ' ')}
                            </span>
                            <div className="flex items-center text-gray-500 text-sm">
                              <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                              {format(new Date(interaction.timestamp), 'MMM d, h:mm a')}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{interaction.notes}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No interactions yet</p>
                    <p className="text-sm text-gray-400 mt-1">Log your first interaction above</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase History</h3>
              {customerSales.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sale Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sale Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerSales
                        .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
                        .map((sale) => (
                          <tr key={sale.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <SafeIcon icon={FiCar} className="w-5 h-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">{sale.vehicleDetails}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-green-600">
                                ${sale.salePrice.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                {sale.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                              {sale.notes || '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <SafeIcon icon={FiDollarSign} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No purchases yet</p>
                  <Link to="/sales">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      Record a Sale
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                      Personal Information
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">First Name:</p>
                        <p className="text-sm text-gray-900">{customer.firstName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Last Name:</p>
                        <p className="text-sm text-gray-900">{customer.lastName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="text-sm text-gray-900">{customer.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Phone:</p>
                        <p className="text-sm text-gray-900">{customer.phone || '-'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                      Address
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Street:</p>
                        <p className="text-sm text-gray-900">{customer.address || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">City:</p>
                        <p className="text-sm text-gray-900">{customer.city || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">State:</p>
                        <p className="text-sm text-gray-900">{customer.state || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">ZIP Code:</p>
                        <p className="text-sm text-gray-900">{customer.zipCode || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiCar} className="w-4 h-4 mr-2" />
                      Vehicle Interest
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Interested In:</p>
                        <p className="text-sm text-gray-900">{customer.interestedVehicle || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Budget:</p>
                        <p className="text-sm text-gray-900">
                          {customer.budget ? `$${customer.budget.toLocaleString()}` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <SafeIcon icon={FiFileText} className="w-4 h-4 mr-2" />
                      Additional Information
                    </h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Status:</p>
                        <p className="text-sm text-gray-900 capitalize">{customer.status || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Lead Source:</p>
                        <p className="text-sm text-gray-900">{customer.leadSource || '-'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Customer Since:</p>
                        <p className="text-sm text-gray-900">
                          {customer.createdAt ? format(new Date(customer.createdAt), 'MMM d, yyyy') : '-'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-500">Last Contact:</p>
                        <p className="text-sm text-gray-900">
                          {customer.lastContact ? format(new Date(customer.lastContact), 'MMM d, yyyy') : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDetail;