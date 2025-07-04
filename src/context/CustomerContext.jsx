import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { customersService, leadsService, vehiclesService, salesService, interactionsService } from '../services/database';

const CustomerContext = createContext();

const initialState = {
  customers: [],
  leads: [],
  sales: [],
  vehicles: [],
  interactions: [],
  tags: ['Hot Lead', 'Cold Lead', 'Existing Customer', 'Service Customer', 'Referral', 'Walk-in'],
  leadSources: ['Website', 'Phone Call', 'Walk-in', 'Referral', 'Social Media', 'Advertisement', 'Trade Show'],
  vehicleTypes: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 'Minivan'],
  filter: 'all',
  searchTerm: '',
  loading: false,
  modalLoading: false, // Separate loading state for modals
  error: null,
};

function customerReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_MODAL_LOADING':
      return { ...state, modalLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, modalLoading: false };
    
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload, loading: false };
    
    case 'ADD_CUSTOMER':
      return { 
        ...state, 
        customers: [action.payload, ...state.customers], 
        modalLoading: false 
      };
    
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
        modalLoading: false
      };
    
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
        loading: false
      };
    
    case 'SET_LEADS':
      return { ...state, leads: action.payload, loading: false };
    
    case 'ADD_LEAD':
      return { 
        ...state, 
        leads: [action.payload, ...state.leads], 
        modalLoading: false 
      };
    
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        ),
        modalLoading: false
      };
    
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload),
        loading: false
      };
    
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload, loading: false };
    
    case 'ADD_VEHICLE':
      return { 
        ...state, 
        vehicles: [action.payload, ...state.vehicles], 
        modalLoading: false 
      };
    
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        ),
        modalLoading: false
      };
    
    case 'DELETE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== action.payload),
        loading: false
      };
    
    case 'SET_SALES':
      return { ...state, sales: action.payload, loading: false };
    
    case 'ADD_SALE':
      return { 
        ...state, 
        sales: [action.payload, ...state.sales], 
        modalLoading: false 
      };
    
    case 'SET_INTERACTIONS':
      return { ...state, interactions: action.payload, loading: false };
    
    case 'ADD_INTERACTION':
      return { 
        ...state, 
        interactions: [action.payload, ...state.interactions], 
        modalLoading: false 
      };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    
    default:
      return state;
  }
}

export function CustomerProvider({ children }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [customers, leads, vehicles, sales, interactions] = await Promise.all([
        customersService.getAll(),
        leadsService.getAll(),
        vehiclesService.getAll(),
        salesService.getAll(),
        interactionsService.getAll()
      ]);

      dispatch({ type: 'SET_CUSTOMERS', payload: customers.map(customersService.transformCustomer) });
      dispatch({ type: 'SET_LEADS', payload: leads });
      dispatch({ type: 'SET_VEHICLES', payload: vehicles });
      dispatch({ type: 'SET_SALES', payload: sales });
      dispatch({ type: 'SET_INTERACTIONS', payload: interactions });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Customer actions
  const addCustomer = async (customerData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const newCustomer = await customersService.create(customerData);
      dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateCustomer = async (id, customerData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const updatedCustomer = await customersService.update(id, customerData);
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await customersService.delete(id);
      dispatch({ type: 'DELETE_CUSTOMER', payload: id });
    } catch (error) {
      console.error('Error deleting customer:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Lead actions
  const addLead = async (leadData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const newLead = await leadsService.create(leadData);
      dispatch({ type: 'ADD_LEAD', payload: newLead });
      return newLead;
    } catch (error) {
      console.error('Error adding lead:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateLead = async (id, leadData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const updatedLead = await leadsService.update(id, leadData);
      dispatch({ type: 'UPDATE_LEAD', payload: updatedLead });
      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Vehicle actions
  const addVehicle = async (vehicleData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const newVehicle = await vehiclesService.create(vehicleData);
      dispatch({ type: 'ADD_VEHICLE', payload: newVehicle });
      return newVehicle;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const updatedVehicle = await vehiclesService.update(id, vehicleData);
      dispatch({ type: 'UPDATE_VEHICLE', payload: updatedVehicle });
      return updatedVehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Sale actions
  const addSale = async (saleData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const newSale = await salesService.create(saleData);
      dispatch({ type: 'ADD_SALE', payload: newSale });
      return newSale;
    } catch (error) {
      console.error('Error adding sale:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Interaction actions
  const addInteraction = async (interactionData) => {
    dispatch({ type: 'SET_MODAL_LOADING', payload: true });
    try {
      const newInteraction = await interactionsService.create({
        ...interactionData,
        timestamp: new Date().toISOString()
      });
      
      dispatch({ type: 'ADD_INTERACTION', payload: newInteraction });

      // Update customer's last contact if it's a customer interaction
      if (interactionData.customerId) {
        const customer = state.customers.find(c => c.id === interactionData.customerId);
        if (customer) {
          const updatedCustomer = { ...customer, lastContact: new Date().toISOString() };
          dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
        }
      }
      
      return newInteraction;
    } catch (error) {
      console.error('Error adding interaction:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const contextValue = {
    state,
    dispatch,
    // Actions
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addLead,
    updateLead,
    addVehicle,
    updateVehicle,
    addSale,
    addInteraction,
    loadAllData
  };

  return (
    <CustomerContext.Provider value={contextValue}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
}