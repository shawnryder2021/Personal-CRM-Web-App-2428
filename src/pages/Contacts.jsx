import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContacts } from '../context/ContactContext';
import ContactCard from '../components/ContactCard';
import ContactModal from '../components/ContactModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiSearch, FiFilter, FiGrid, FiList } = FiIcons;

function Contacts() {
  const { state, dispatch } = useContacts();
  const { contacts, filter, searchTerm, tags } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTag, setSelectedTag] = useState('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === 'all' || contact.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleAddContact = (contactData) => {
    dispatch({ type: 'ADD_CONTACT', payload: contactData });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search contacts..."
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
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Add Contact</span>
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredContacts.length} contacts</span>
          <span>{contacts.length} total</span>
        </div>
      </div>

      {/* Contacts Grid/List */}
      <AnimatePresence mode="wait">
        {filteredContacts.length > 0 ? (
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
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ContactCard contact={contact} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SafeIcon icon={FiSearch} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedTag !== 'all' ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedTag !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start building your network by adding your first contact'
              }
            </p>
            {!searchTerm && selectedTag === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Add Your First Contact
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddContact}
      />
    </div>
  );
}

export default Contacts;