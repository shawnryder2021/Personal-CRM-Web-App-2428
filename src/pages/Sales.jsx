import React from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { format, startOfMonth, subMonths } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDollarSign, FiTrendingUp, FiCalendar, FiUser, FiCar } = FiIcons;

function Sales() {
  const { state } = useCustomers();
  const { sales } = state;

  const thisMonth = startOfMonth(new Date());
  const lastMonth = startOfMonth(subMonths(new Date(), 1));

  const thisMonthSales = sales.filter(sale => 
    new Date(sale.saleDate) >= thisMonth
  );

  const lastMonthSales = sales.filter(sale => 
    new Date(sale.saleDate) >= lastMonth && new Date(sale.saleDate) < thisMonth
  );

  const thisMonthRevenue = thisMonthSales.reduce((total, sale) => total + (sale.salePrice || 0), 0);
  const lastMonthRevenue = lastMonthSales.reduce((total, sale) => total + (sale.salePrice || 0), 0);
  const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  const stats = [
    {
      name: 'Total Sales',
      value: sales.length,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: `${thisMonthSales.length - lastMonthSales.length} this month`,
    },
    {
      name: 'Monthly Revenue',
      value: `$${thisMonthRevenue.toLocaleString()}`,
      icon: FiTrendingUp,
      color: 'bg-blue-500',
      change: `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}% vs last month`,
    },
    {
      name: 'Average Sale',
      value: sales.length > 0 ? `$${Math.round(sales.reduce((total, sale) => total + (sale.salePrice || 0), 0) / sales.length).toLocaleString()}` : '$0',
      icon: FiCalendar,
      color: 'bg-purple-500',
      change: 'Per transaction',
    },
    {
      name: 'This Month',
      value: thisMonthSales.length,
      icon: FiUser,
      color: 'bg-orange-500',
      change: 'Vehicles sold',
    },
  ];

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
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
        </div>
        
        {sales.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sale Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales
                  .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
                  .map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">
                              {sale.customerName?.split(' ').map(n => n.charAt(0)).join('') || 'N/A'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {sale.customerName || 'Unknown Customer'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <SafeIcon icon={FiCar} className="w-5 h-5 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{sale.vehicleDetails || 'Vehicle details not available'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          ${sale.salePrice?.toLocaleString() || '0'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {sale.status || 'Completed'}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <SafeIcon icon={FiDollarSign} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales recorded</h3>
            <p className="text-gray-500 mb-6">
              Start tracking your sales transactions to monitor revenue and performance
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Record First Sale
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sales;