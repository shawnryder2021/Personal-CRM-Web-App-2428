import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useContacts } from '../context/ContactContext';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiMail, FiPhone, FiBuilding, FiEdit3, FiTrash2, FiPlus, FiCalendar, FiClock } = FiIcons;

function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContacts();
  const { contacts, interactions } = state;
  
  const contact = contacts.find(c => c.id === id);
  const contactInteractions = interactions.filter(i => i.contactId === id);
  
  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    notes: '',
  });

  if (!contact) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Contact not found</p>
        <button
          onClick={() => navigate('/contacts')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Contacts
        </button>
      </div>
    );
  }

  const handleAddInteraction = (e) => {
    e.preventDefault();
    if (!newInteraction.notes.trim()) return;

    dispatch({
      type: 'ADD_INTERACTION',
      payload: {
        contactId: id,
        type: newInteraction.type,
        notes: newInteraction.notes,
      },
    });

    setNewInteraction({ type: 'call', notes: '' });
  };

  const handleDeleteContact = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      dispatch({ type: 'DELETE_CONTACT', payload: id });
      navigate('/contacts');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/contacts')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back to Contacts
        </button>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <SafeIcon icon={FiEdit3} className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteContact}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-bold text-2xl">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{contact.name}</h1>
            
            {contact.position && contact.company && (
              <p className="text-lg text-gray-600 mb-4">
                {contact.position} at {contact.company}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <SafeIcon icon={FiMail} className="w-5 h-5 mr-3" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary-600 transition-colors">
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiPhone} className="w-5 h-5 mr-3" />
                  <a href={`tel:${contact.phone}`} className="hover:text-primary-600 transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiBuilding} className="w-5 h-5 mr-3" />
                  <span>{contact.company}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-3" />
                <span>Added {format(new Date(contact.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
            
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {contact.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700">{contact.notes}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Interaction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Interaction</h3>
          
          <form onSubmit={handleAddInteraction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newInteraction.type}
                onChange={(e) => setNewInteraction(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="text">Text Message</option>
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
                placeholder="What did you discuss?"
                required
              />
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Interaction</span>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Interactions</h3>
          
          {contactInteractions.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contactInteractions
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((interaction) => (
                  <div key={interaction.id} className="border-l-4 border-primary-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 capitalize">
                        {interaction.type}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                        {format(new Date(interaction.timestamp), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{interaction.notes}</p>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiClock} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No interactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first interaction above</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ContactDetail;