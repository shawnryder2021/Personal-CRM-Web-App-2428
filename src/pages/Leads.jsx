import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import LeadModal from '../components/LeadModal';
import { format, isAfter, subDays } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiSearch, FiFilter, FiPhone, FiMail, FiCalendar, FiTrendingUp, FiClock, FiDollarSign, FiLoader } = FiIcons;

function Leads() {
  const { state, dispatch } = useCustomers();
  const { leads, searchTerm, loading, modalLoading, error } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const stats = [
    {
      name: 'Total Leads',
      value: leads.length,
      icon: FiTrendingUp,
      color: 'bg-blue-500',
    },
    {
      name: 'Hot Leads',
      value: leads.filter(lead => lead.priority === 'high').length,
      icon: FiDollarSign,
      color: 'bg-red-500',
    },
    {
      name: 'This Week',
      value: leads.filter(lead => 
        isAfter(new Date(lead.createdAt), subDays(new Date(), 7))
      ).length,
      icon: FiCalendar,
      color: 'bg-green-500',
    },
    {
      name: 'Need Follow-up',
      value: leads.filter(lead => 
        lead.followUpDate && isAfter(new Date(), new Date(lead.followUpDate))
      ).length,
      icon: FiClock,
      color: 'bg-orange-500',
    },
  ];

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-yellow-100 text-yellow-700';
      case 'qualified': return 'bg-green-100 text-green-700';
      case 'converted': return 'bg-purple-100 text-purple-700';
      case 'lost': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Leads</h3>
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
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddLead}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
          disabled={modalLoading}
        >
          {modalLoading ? (
            <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
          ) : (
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
          )}
          <span>Add Lead</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && leads.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiLoader} className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading leads...</p>
        </div>
      )}

      {/* Leads List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!loading && filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-up
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEditLead(lead)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {lead.firstName.charAt(0).toUpperCase()}{lead.lastName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.source && `Source: ${lead.source}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.interestedVehicle || 'Not specified'}</div>
                      {lead.budget && (
                        <div className="text-sm text-gray-500">${lead.budget.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.followUpDate 
                        ? format(new Date(lead.followUpDate), 'MMM d, yyyy')
                        : 'Not scheduled'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${lead.phone}`, '_self');
                          }}
                        >
                          <SafeIcon icon={FiPhone} className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`mailto:${lead.email}`, '_blank');
                          }}
                        >
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiTrendingUp} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start generating leads to grow your sales pipeline'
              }
            </p>
            {!searchTerm && priorityFilter === 'all' && statusFilter === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddLead}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add Your First Lead
              </motion.button>
            )}
          </div>
        ) : null}
      </div>

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lead={editingLead}
      />
    </div>
  );
}

export default Leads;