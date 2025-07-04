import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ContactContext = createContext();

const initialState = {
  contacts: [],
  interactions: [],
  tags: ['Family', 'Work', 'Friend', 'Client', 'Networking'],
  filter: 'all',
  searchTerm: '',
};

function contactReducer(state, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'ADD_CONTACT':
      const newContact = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastContact: null,
      };
      const updatedContacts = [...state.contacts, newContact];
      localStorage.setItem('crm-contacts', JSON.stringify(updatedContacts));
      return { ...state, contacts: updatedContacts };
    case 'UPDATE_CONTACT':
      const updated = state.contacts.map(contact =>
        contact.id === action.payload.id ? { ...contact, ...action.payload } : contact
      );
      localStorage.setItem('crm-contacts', JSON.stringify(updated));
      return { ...state, contacts: updated };
    case 'DELETE_CONTACT':
      const filtered = state.contacts.filter(contact => contact.id !== action.payload);
      localStorage.setItem('crm-contacts', JSON.stringify(filtered));
      return { ...state, contacts: filtered };
    case 'ADD_INTERACTION':
      const interaction = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updatedInteractions = [...state.interactions, interaction];
      localStorage.setItem('crm-interactions', JSON.stringify(updatedInteractions));
      
      // Update last contact date
      const contactsWithLastContact = state.contacts.map(contact =>
        contact.id === action.payload.contactId
          ? { ...contact, lastContact: new Date().toISOString() }
          : contact
      );
      localStorage.setItem('crm-contacts', JSON.stringify(contactsWithLastContact));
      
      return {
        ...state,
        interactions: updatedInteractions,
        contacts: contactsWithLastContact,
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'LOAD_DATA':
      return {
        ...state,
        contacts: action.payload.contacts || [],
        interactions: action.payload.interactions || [],
      };
    default:
      return state;
  }
}

export function ContactProvider({ children }) {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  useEffect(() => {
    const savedContacts = localStorage.getItem('crm-contacts');
    const savedInteractions = localStorage.getItem('crm-interactions');
    
    dispatch({
      type: 'LOAD_DATA',
      payload: {
        contacts: savedContacts ? JSON.parse(savedContacts) : [],
        interactions: savedInteractions ? JSON.parse(savedInteractions) : [],
      },
    });
  }, []);

  return (
    <ContactContext.Provider value={{ state, dispatch }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}