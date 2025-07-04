import React from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { format, subDays, isAfter, startOfMonth } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiUserPlus, FiDollarSign, FiTruck, FiTrendingUp, FiPhone, FiMail, FiCalendar } = FiIcons;

function Dashboard() {
  const { state } = useCustomers();
  const { customers, leads, sales, vehicles, interactions } = state;

  const thisMonth = startOfMonth(new Date());
  const thisWeekInteractions = interactions.filter(i =>
    isAfter(new Date(i.timestamp), subDays(new Date(), 7))
  ).length;

  const monthlyRevenue = sales
    .filter(sale => isAfter(new Date(sale.saleDate), thisMonth))
    .reduce((total, sale) => total + (sale.salePrice || 0), 0);

  const hotLeads = leads.filter(lead => lead.priority === 'high').length;
  const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'available').length;

  const stats = [
    {
      name: 'Total Customers',
      value: customers.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
      description: 'Active customers',
    },
    {
      name: 'Hot Leads',
      value: hotLeads,
      icon: FiUserPlus,
      color: 'bg-orange-500',
      change: '+8%',
      description: 'High priority leads',
    },
    {
      name: 'Monthly Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: '+15%',
      description: 'This month\'s sales',
    },
    {
      name: 'Available Vehicles',
      value: availableVehicles,
      icon: FiTruck,
      color: 'bg-purple-500',
      change: '-5%',
      description: 'Ready for sale',
    },
  ];

  const recentCustomers = customers
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const upcomingFollowUps = leads
    .filter(lead => lead.followUpDate && isAfter(new Date(lead.followUpDate), new Date()))
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
    .slice(0, 5);

  const recentSales = sales
    .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Customers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {recentCustomers.length > 0 ? recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {customer.firstName.charAt(0).toUpperCase()}{customer.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                  <p className="text-xs text-gray-400">
                    {customer.interestedVehicle && `Interested in: ${customer.interestedVehicle}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiPhone} className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No customers yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Follow-ups */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Follow-ups</h3>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {upcomingFollowUps.length} scheduled
            </span>
          </div>
          
          <div className="space-y-4">
            {upcomingFollowUps.length > 0 ? upcomingFollowUps.map((lead) => (
              <div key={lead.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-medium">
                    {lead.firstName.charAt(0).toUpperCase()}{lead.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                    Follow up: {format(new Date(lead.followUpDate), 'MMM d, h:mm a')}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Contact
                </motion.button>
              </div>
            )) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No follow-ups scheduled</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Sales */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {recentSales.length > 0 ? recentSales.map((sale) => (
              <div key={sale.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">{sale.customerName}</p>
                  <span className="text-green-600 font-semibold">${sale.salePrice?.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600">{sale.vehicleDetails}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                </p>
              </div>
            )) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiDollarSign} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sales yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ready to boost your sales?</h3>
            <p className="text-primary-100 mt-1">Add new leads, track customers, and manage your inventory</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
              <span>Add Lead</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiTruck} className="w-4 h-4" />
              <span>Add Vehicle</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;