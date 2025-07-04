import React from 'react';
import { useLocation } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiBell, FiCalendar } = FiIcons;

function Header() {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Sales Dashboard';
      case '/customers':
        return 'Customer Management';
      case '/leads':
        return 'Lead Management';
      case '/sales':
        return 'Sales Tracking';
      case '/inventory':
        return 'Vehicle Inventory';
      case '/analytics':
        return 'Sales Analytics';
      default:
        return 'AutoCRM';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview of your sales performance and activities';
      case '/customers':
        return 'Manage your customer relationships and service history';
      case '/leads':
        return 'Track and convert prospects into customers';
      case '/sales':
        return 'Monitor sales transactions and revenue';
      case '/inventory':
        return 'Manage vehicle inventory and availability';
      case '/analytics':
        return 'Insights into sales trends and performance metrics';
      default:
        return 'Automotive Customer Relationship Management';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
          <p className="text-sm text-gray-500 mt-1">{getPageDescription()}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers, leads, vehicles..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <SafeIcon icon={FiCalendar} className="h-5 w-5" />
          </button>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <SafeIcon icon={FiBell} className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;