import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMail, FiPhone, FiBuilding, FiCalendar, FiMoreHorizontal } = FiIcons;

function ContactCard({ contact, viewMode = 'grid' }) {
  const isGridMode = viewMode === 'grid';

  return (
    <motion.div
      whileHover={{ y: isGridMode ? -2 : 0, scale: isGridMode ? 1.02 : 1 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all ${
        isGridMode ? 'p-6' : 'p-4 flex items-center space-x-4'
      }`}
    >
      <Link to={`/contacts/${contact.id}`} className={isGridMode ? 'block' : 'flex-1 flex items-center space-x-4'}>
        {/* Avatar */}
        <div className={`${isGridMode ? 'w-16 h-16 mx-auto mb-4' : 'w-12 h-12'} bg-primary-100 rounded-full flex items-center justify-center`}>
          <span className="text-primary-600 font-semibold text-lg">
            {contact.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className={isGridMode ? 'text-center' : 'flex-1'}>
          {/* Name */}
          <h3 className={`font-semibold text-gray-900 ${isGridMode ? 'text-lg mb-2' : 'text-base'}`}>
            {contact.name}
          </h3>

          {/* Company */}
          {contact.company && (
            <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-600 mb-2`}>
              <SafeIcon icon={FiBuilding} className="w-4 h-4 mr-2" />
              <span className="text-sm">{contact.company}</span>
            </div>
          )}

          {/* Contact Info */}
          <div className={`space-y-1 ${isGridMode ? 'mb-4' : ''}`}>
            {contact.email && (
              <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-600`}>
                <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                <span className="text-sm truncate">{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-600`}>
                <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                <span className="text-sm">{contact.phone}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className={`flex ${isGridMode ? 'justify-center' : ''} flex-wrap gap-1 mb-3`}>
              {contact.tags.slice(0, isGridMode ? 3 : 2).map(tag => (
                <span
                  key={tag}
                  className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
              {contact.tags.length > (isGridMode ? 3 : 2) && (
                <span className="text-gray-400 text-xs">
                  +{contact.tags.length - (isGridMode ? 3 : 2)}
                </span>
              )}
            </div>
          )}

          {/* Last Contact */}
          {contact.lastContact && (
            <div className={`flex items-center ${isGridMode ? 'justify-center' : ''} text-gray-500 text-xs`}>
              <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
              <span>Last: {format(new Date(contact.lastContact), 'MMM d')}</span>
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

export default ContactCard;