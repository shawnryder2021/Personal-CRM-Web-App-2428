import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPhone, FiCar, FiCalendar, FiMoreHorizontal, FiDollarSign } = FiIcons;

function CustomerCard({ customer, viewMode = 'grid' }) {
  const isGridMode = viewMode === 'grid';

  return (
    <motion.div
      whileHover={{ y: isGridMode ? -2 : 0, scale: isGridMode ? 1.02 : 1 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all ${
        isGridMode ? 'p-6' : 'p-4 flex items-center space-x-4'
      }`}
    >
      <Link to={`/customers/${customer.id}`} className={isGridMode ? 'block' : 'flex-1 flex items-center space-x-4'}>
        {/* Avatar */}
        <div className={`${isGridMode ? 'w-16 h-16 mx-auto mb-4' : 'w-12 h-12'} bg-primary-100 rounded-full flex items-center justify-center`}>
          <span className="text-primary-600 font-semibold text-lg">
            {customer.firstName.charAt(0).toUpperCase()}{customer.lastName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className={isGridMode ? 'text-center' : 'flex-1'}>
          {/* Name */}
          <h3 className={`font-semibold text-gray-900 ${isGridMode ? 'text-lg mb-2' : 'text-base'}`}>
            {customer.firstName} {customer.lastName}
          </h3>

          {/* Contact Info */}
          <div className={`space-y-1 ${isGridMode ? 'mb-4' : ''}`}>
            <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-600`}>
              <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
              <span className="text-sm truncate">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-600`}>
                <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                <span className="text-sm">{customer.phone}</span>
              </div>
            )}
            {customer.interestedVehicle && (
              <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-600`}>
                <SafeIcon icon={FiCar} className="w-4 h-4 mr-2" />
                <span className="text-sm truncate">{customer.interestedVehicle}</span>
              </div>
            )}
          </div>

          {/* Status & Budget */}
          <div className={`flex ${isGridMode ? 'justify-center' : ''} items-center space-x-2 mb-3`}>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              customer.status === 'active' ? 'bg-green-100 text-green-700' :
              customer.status === 'prospect' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {customer.status}
            </span>
            {customer.budget && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                ${customer.budget.toLocaleString()}
              </span>
            )}
          </div>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className={`flex ${isGridMode ? 'justify-center' : ''} flex-wrap gap-1 mb-3`}>
              {customer.tags.slice(0, isGridMode ? 2 : 1).map(tag => (
                <span
                  key={tag}
                  className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
              {customer.tags.length > (isGridMode ? 2 : 1) && (
                <span className="text-gray-400 text-xs">
                  +{customer.tags.length - (isGridMode ? 2 : 1)}
                </span>
              )}
            </div>
          )}

          {/* Last Contact */}
          {customer.lastContact && (
            <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-500 text-xs`}>
              <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
              <span>Last: {format(new Date(customer.lastContact), 'MMM d')}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Actions */}
      {!isGridMode && (
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <SafeIcon icon={FiMail} className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <SafeIcon icon={FiPhone} className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default CustomerCard;