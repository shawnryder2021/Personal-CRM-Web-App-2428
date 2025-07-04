import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiUsers, FiUserPlus, FiDollarSign, FiTruck, FiBarChart3, FiSettings } = FiIcons;

const navigation = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Customers', href: '/customers', icon: FiUsers },
  { name: 'Leads', href: '/leads', icon: FiUserPlus },
  { name: 'Sales', href: '/sales', icon: FiDollarSign },
  { name: 'Inventory', href: '/inventory', icon: FiTruck },
  { name: 'Analytics', href: '/analytics', icon: FiBarChart3 },
];

function Sidebar() {
  return (
    <div className="bg-white w-64 shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-600 p-2 rounded-lg">
            <SafeIcon icon={FiTruck} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AutoCRM</h1>
            <p className="text-sm text-gray-500">Automotive Sales</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center w-full"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SafeIcon
                  icon={item.icon}
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">Sales Rep</p>
            <p className="text-xs text-gray-500">Auto Dealership</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;