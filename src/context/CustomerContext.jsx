import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { customersService, leadsService, vehiclesService, salesService, interactionsService } from '../services/database';

const CustomerContext = createContext();

const initialState = {
  customers: [],
  leads: [],
  sales: [],
  vehicles: [],
  interactions: [],
  tags: ['Hot Lead', 'Cold Lead', 'Existing Customer', 'Service Customer', 'Referral', 'Walk-in', 'High Value', 'Financing', 'Cash Buyer', 'First-time Buyer', 'Return Customer'],
  leadSources: ['Website', 'Phone Call', 'Walk-in', 'Referral', 'Social Media', 'Advertisement', 'Trade Show', 'Email Campaign', 'Online Review', 'Direct Mail'],
  vehicleTypes: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 'Minivan', 'Electric', 'Hybrid', 'Luxury'],
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
      return { ...state, customers: [action.payload, ...state.customers], modalLoading: false };
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
      return { ...state, leads: [action.payload, ...state.leads], modalLoading: false };
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
      return { ...state, vehicles: [action.payload, ...state.vehicles], modalLoading: false };
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
      return { ...state, sales: [action.payload, ...state.sales], modalLoading: false };
    case 'SET_INTERACTIONS':
      return { ...state, interactions: action.payload, loading: false };
    case 'ADD_INTERACTION':
      return { ...state, interactions: [action.payload, ...state.interactions], modalLoading: false };
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
      // Load sample data if no backend is connected
      // In a real application, this would be replaced with actual API calls
      const sampleCustomers = [
        {
          id: 'cust-1',
          firstName: 'Michael',
          lastName: 'Davis',
          email: 'michael.davis@example.com',
          phone: '(555) 123-4567',
          address: '123 Main St',
          city: 'Riverdale',
          state: 'CA',
          zipCode: '91234',
          interestedVehicle: '2023 Honda CR-V',
          budget: 32000,
          status: 'active',
          leadSource: 'Website',
          notes: 'Looking for a family SUV with good fuel economy',
          tags: ['Financing', 'First-time Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        },
        {
          id: 'cust-2',
          firstName: 'Jennifer',
          lastName: 'Lopez',
          email: 'jennifer@example.com',
          phone: '(555) 987-6543',
          address: '456 Oak Ave',
          city: 'Beverly Hills',
          state: 'CA',
          zipCode: '90210',
          interestedVehicle: '2023 BMW X5',
          budget: 65000,
          status: 'prospect',
          leadSource: 'Referral',
          notes: 'Interested in luxury SUV with premium features',
          tags: ['High Value', 'Return Customer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
        },
        {
          id: 'cust-3',
          firstName: 'Robert',
          lastName: 'Wilson',
          email: 'rwilson@example.com',
          phone: '(555) 456-7890',
          address: '789 Pine Rd',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          interestedVehicle: '2022 Ford F-150',
          budget: 48000,
          status: 'active',
          leadSource: 'Walk-in',
          notes: 'Needs a truck for work and weekend activities',
          tags: ['Cash Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        },
        {
          id: 'cust-4',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sjohnson@example.com',
          phone: '(555) 234-5678',
          address: '321 Elm St',
          city: 'Portland',
          state: 'OR',
          zipCode: '97205',
          interestedVehicle: '2023 Tesla Model Y',
          budget: 55000,
          status: 'prospect',
          leadSource: 'Website',
          notes: 'Environmentally conscious, interested in electric vehicles',
          tags: ['High Value', 'Financing'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          lastContact: new Date().toISOString()
        },
        {
          id: 'cust-5',
          firstName: 'David',
          lastName: 'Thompson',
          email: 'dthompson@example.com',
          phone: '(555) 876-5432',
          address: '654 Maple Dr',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          interestedVehicle: '2023 Toyota RAV4',
          budget: 36000,
          status: 'active',
          leadSource: 'Phone Call',
          notes: 'Looking for a reliable SUV with good resale value',
          tags: ['Existing Customer', 'Financing'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        },
        {
          id: 'cust-6',
          firstName: 'Emily',
          lastName: 'Garcia',
          email: 'egarcia@example.com',
          phone: '(555) 345-6789',
          address: '987 Cedar Ln',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          interestedVehicle: '2023 Subaru Outback',
          budget: 38000,
          status: 'active',
          leadSource: 'Social Media',
          notes: 'Outdoor enthusiast looking for a versatile vehicle',
          tags: ['First-time Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
        },
        {
          id: 'cust-7',
          firstName: 'James',
          lastName: 'Williams',
          email: 'jwilliams@example.com',
          phone: '(555) 567-8901',
          address: '135 Birch St',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          interestedVehicle: '2023 Audi Q5',
          budget: 52000,
          status: 'prospect',
          leadSource: 'Trade Show',
          notes: 'Tech-savvy buyer interested in advanced features',
          tags: ['High Value', 'Return Customer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        },
        {
          id: 'cust-8',
          firstName: 'Linda',
          lastName: 'Brown',
          email: 'lbrown@example.com',
          phone: '(555) 678-9012',
          address: '246 Walnut Ave',
          city: 'Denver',
          state: 'CO',
          zipCode: '80202',
          interestedVehicle: '2023 Honda Accord',
          budget: 30000,
          status: 'active',
          leadSource: 'Email Campaign',
          notes: 'Commuter looking for fuel efficiency and reliability',
          tags: ['Financing'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
          lastContact: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        }
      ];

      const sampleLeads = [
        {
          id: 'lead-1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sjohnson@example.com',
          phone: '(555) 234-5678',
          interestedVehicle: '2023 Tesla Model Y',
          budget: 55000,
          status: 'new',
          priority: 'high',
          source: 'Website',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
          notes: 'Interested in test driving the Model Y this weekend',
          tags: ['High Value'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        },
        {
          id: 'lead-2',
          firstName: 'James',
          lastName: 'Miller',
          email: 'jmiller@example.com',
          phone: '(555) 345-6789',
          interestedVehicle: '2023 Lexus RX',
          budget: 58000,
          status: 'contacted',
          priority: 'medium',
          source: 'Phone Call',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
          notes: 'Called to inquire about Lexus RX models, schedule test drive',
          tags: ['High Value', 'Financing'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
        },
        {
          id: 'lead-3',
          firstName: 'Emma',
          lastName: 'Garcia',
          email: 'egarcia@example.com',
          phone: '(555) 567-8901',
          interestedVehicle: '2023 Hyundai Tucson',
          budget: 32000,
          status: 'qualified',
          priority: 'high',
          source: 'Referral',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
          notes: 'Pre-approved for financing, ready to make a decision',
          tags: ['Financing', 'First-time Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        },
        {
          id: 'lead-4',
          firstName: 'Daniel',
          lastName: 'Martinez',
          email: 'dmartinez@example.com',
          phone: '(555) 678-9012',
          interestedVehicle: '2023 Chevrolet Silverado',
          budget: 45000,
          status: 'new',
          priority: 'low',
          source: 'Walk-in',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
          notes: 'Stopped by to look at trucks, early in research phase',
          tags: ['Cash Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        },
        {
          id: 'lead-5',
          firstName: 'Olivia',
          lastName: 'Rodriguez',
          email: 'orodriguez@example.com',
          phone: '(555) 789-0123',
          interestedVehicle: '2023 Subaru Outback',
          budget: 35000,
          status: 'contacted',
          priority: 'medium',
          source: 'Social Media',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
          notes: 'Responded to Instagram ad, interested in outdoor capability',
          tags: ['First-time Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
        },
        {
          id: 'lead-6',
          firstName: 'William',
          lastName: 'Taylor',
          email: 'wtaylor@example.com',
          phone: '(555) 890-1234',
          interestedVehicle: '2023 Audi A4',
          budget: 48000,
          status: 'qualified',
          priority: 'high',
          source: 'Website',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
          notes: 'Ready to purchase, comparing final options',
          tags: ['High Value', 'Return Customer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString()
        },
        {
          id: 'lead-7',
          firstName: 'Sophia',
          lastName: 'Anderson',
          email: 'sanderson@example.com',
          phone: '(555) 901-2345',
          interestedVehicle: '2023 Toyota Camry',
          budget: 30000,
          status: 'new',
          priority: 'medium',
          source: 'Email Campaign',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
          notes: 'Clicked through from email about new Camry incentives',
          tags: ['Financing'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        },
        {
          id: 'lead-8',
          firstName: 'Benjamin',
          lastName: 'Thomas',
          email: 'bthomas@example.com',
          phone: '(555) 012-3456',
          interestedVehicle: '2023 Ford Mustang',
          budget: 42000,
          status: 'contacted',
          priority: 'medium',
          source: 'Trade Show',
          followUpDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
          notes: 'Met at auto show, very interested in performance models',
          tags: ['Cash Buyer'],
          createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString()
        }
      ];

      const sampleVehicles = [
        {
          id: 'veh-1',
          make: 'Honda',
          model: 'CR-V',
          year: 2023,
          type: 'SUV',
          vin: 'JH4KA7660MC012345',
          color: 'Silver',
          mileage: 15,
          price: 32500,
          status: 'available',
          description: 'Brand new Honda CR-V with advanced safety features',
          imageUrl: 'https://images.unsplash.com/photo-1568844293986-ca9c5c1bc2e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
        },
        {
          id: 'veh-2',
          make: 'Toyota',
          model: 'RAV4',
          year: 2023,
          type: 'SUV',
          vin: '4T1BF1FK5EU347291',
          color: 'White',
          mileage: 12,
          price: 34800,
          status: 'available',
          description: 'Toyota RAV4 with hybrid powertrain and premium package',
          imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString()
        },
        {
          id: 'veh-3',
          make: 'Ford',
          model: 'F-150',
          year: 2022,
          type: 'Truck',
          vin: '1FTEW1EP7MFA12345',
          color: 'Blue',
          mileage: 5500,
          price: 45500,
          status: 'sold',
          description: 'Lightly used F-150 with towing package and leather interior',
          imageUrl: 'https://images.unsplash.com/photo-1605893477799-b99e3b8b93fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
        },
        {
          id: 'veh-4',
          make: 'Tesla',
          model: 'Model Y',
          year: 2023,
          type: 'SUV',
          vin: '5YJYGDEE4MF123456',
          color: 'Red',
          mileage: 8,
          price: 58900,
          status: 'available',
          description: 'Tesla Model Y Long Range with enhanced autopilot',
          imageUrl: 'https://images.unsplash.com/photo-1619867125640-b8c18d38b6d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
        },
        {
          id: 'veh-5',
          make: 'BMW',
          model: 'X5',
          year: 2023,
          type: 'SUV',
          vin: 'WBAKJ4C50KLS12345',
          color: 'Black',
          mileage: 18,
          price: 68500,
          status: 'available',
          description: 'BMW X5 with M Sport package and executive options',
          imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString()
        },
        {
          id: 'veh-6',
          make: 'Honda',
          model: 'Accord',
          year: 2022,
          type: 'Sedan',
          vin: '1HGCV2F34NA123456',
          color: 'Gray',
          mileage: 8500,
          price: 29800,
          status: 'sold',
          description: 'Honda Accord Touring with leather seats and sunroof',
          imageUrl: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString()
        },
        {
          id: 'veh-7',
          make: 'Chevrolet',
          model: 'Silverado',
          year: 2023,
          type: 'Truck',
          vin: '3GCUYEET8PG123456',
          color: 'Silver',
          mileage: 12,
          price: 48500,
          status: 'available',
          description: 'Chevy Silverado with Z71 off-road package and crew cab',
          imageUrl: 'https://images.unsplash.com/photo-1595758228888-68ab4efaf148?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString()
        },
        {
          id: 'veh-8',
          make: 'Audi',
          model: 'Q5',
          year: 2023,
          type: 'SUV',
          vin: 'WAUZZZF53NA123456',
          color: 'White',
          mileage: 25,
          price: 52800,
          status: 'available',
          description: 'Audi Q5 Premium Plus with technology package',
          imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString()
        },
        {
          id: 'veh-9',
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          type: 'Sedan',
          vin: '4T1BF1FK6EU123456',
          color: 'Blue',
          mileage: 18,
          price: 29500,
          status: 'available',
          description: 'Toyota Camry XSE with navigation and panoramic roof',
          imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString()
        },
        {
          id: 'veh-10',
          make: 'Subaru',
          model: 'Outback',
          year: 2023,
          type: 'Wagon',
          vin: '4S4BTGPD2P3123456',
          color: 'Green',
          mileage: 15,
          price: 36800,
          status: 'available',
          description: 'Subaru Outback Wilderness with off-road capability',
          imageUrl: 'https://images.unsplash.com/photo-1626668893632-6f3a4466d109?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString()
        },
        {
          id: 'veh-11',
          make: 'Lexus',
          model: 'RX',
          year: 2023,
          type: 'SUV',
          vin: 'JTJBZMCA2P2123456',
          color: 'Silver',
          mileage: 10,
          price: 57800,
          status: 'pending',
          description: 'Lexus RX 350 F Sport with luxury package',
          imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
        },
        {
          id: 'veh-12',
          make: 'Ford',
          model: 'Mustang',
          year: 2023,
          type: 'Coupe',
          vin: '1FA6P8CF2P5123456',
          color: 'Red',
          mileage: 20,
          price: 42500,
          status: 'available',
          description: 'Ford Mustang GT with performance package',
          imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f452d1f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString()
        }
      ];

      const sampleSales = [
        {
          id: 'sale-1',
          customerId: 'cust-3',
          vehicleId: 'veh-3',
          customerName: 'Robert Wilson',
          vehicleDetails: '2022 Ford F-150 XLT',
          salePrice: 45500,
          saleDate: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
          status: 'completed',
          notes: 'Customer traded in 2018 Toyota Tundra',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString()
        },
        {
          id: 'sale-2',
          customerId: 'cust-5',
          vehicleId: 'veh-6',
          customerName: 'David Thompson',
          vehicleDetails: '2022 Honda Accord Touring',
          salePrice: 29800,
          saleDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
          status: 'completed',
          notes: 'Financed through dealership with 3.9% APR',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
        },
        {
          id: 'sale-3',
          customerId: 'cust-8',
          vehicleId: 'veh-9',
          customerName: 'Linda Brown',
          vehicleDetails: '2023 Toyota Camry XSE',
          salePrice: 31200,
          saleDate: new Date(new Date().setDate(new Date().getDate() - 22)).toISOString(),
          status: 'completed',
          notes: 'Customer purchased extended warranty',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 22)).toISOString()
        },
        {
          id: 'sale-4',
          customerId: 'cust-6',
          vehicleId: 'veh-10',
          customerName: 'Emily Garcia',
          vehicleDetails: '2023 Subaru Outback Wilderness',
          salePrice: 38200,
          saleDate: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString(),
          status: 'completed',
          notes: 'First-time buyer, referred by existing customer',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString()
        },
        {
          id: 'sale-5',
          customerId: 'cust-7',
          vehicleId: 'veh-5',
          customerName: 'James Williams',
          vehicleDetails: '2023 BMW X5 M Sport',
          salePrice: 69800,
          saleDate: new Date(new Date().setDate(new Date().getDate() - 35)).toISOString(),
          status: 'completed',
          notes: 'Return customer, paid cash',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 35)).toISOString()
        }
      ];

      const sampleInteractions = [
        {
          id: 'int-1',
          customerId: 'cust-1',
          type: 'call',
          notes: 'Discussed Honda CR-V features and financing options',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        },
        {
          id: 'int-2',
          customerId: 'cust-4',
          type: 'email',
          notes: 'Sent information about Tesla Model Y availability and pricing',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: 'int-3',
          leadId: 'lead-1',
          type: 'call',
          notes: 'Scheduled test drive for Saturday at 2pm',
          timestamp: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString(),
          createdAt: new Date(new Date().setHours(new Date().getHours() - 4)).toISOString()
        },
        {
          id: 'int-4',
          customerId: 'cust-3',
          type: 'meeting',
          notes: 'Finalized purchase of F-150, completed paperwork',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString()
        },
        {
          id: 'int-5',
          leadId: 'lead-3',
          type: 'email',
          notes: 'Sent financing pre-approval information',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        },
        {
          id: 'int-6',
          customerId: 'cust-2',
          type: 'test_drive',
          notes: 'Test drove BMW X5, very interested in the M Sport package',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString()
        },
        {
          id: 'int-7',
          leadId: 'lead-6',
          type: 'meeting',
          notes: 'Discussed Audi A4 features and compared with competitors',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        },
        {
          id: 'int-8',
          customerId: 'cust-5',
          type: 'follow_up',
          notes: 'Called to check satisfaction with new Toyota RAV4',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        },
        {
          id: 'int-9',
          leadId: 'lead-4',
          type: 'showroom_visit',
          notes: 'Showed various truck models, particularly interested in Silverado',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        },
        {
          id: 'int-10',
          customerId: 'cust-7',
          type: 'call',
          notes: 'Discussed trade-in value for current vehicle',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
        },
        {
          id: 'int-11',
          leadId: 'lead-5',
          type: 'email',
          notes: 'Sent brochure on Subaru Outback off-road capabilities',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        },
        {
          id: 'int-12',
          customerId: 'cust-8',
          type: 'service',
          notes: 'First maintenance appointment scheduled',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
          createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
        }
      ];

      // Try to load data from supabase, but fall back to sample data
      try {
        const [customers, leads, vehicles, sales, interactions] = await Promise.all([
          customersService.getAll(),
          leadsService.getAll(),
          vehiclesService.getAll(),
          salesService.getAll(),
          interactionsService.getAll()
        ]);
        
        dispatch({ type: 'SET_CUSTOMERS', payload: customers.length > 0 ? customers.map(customersService.transformCustomer) : sampleCustomers });
        dispatch({ type: 'SET_LEADS', payload: leads.length > 0 ? leads : sampleLeads });
        dispatch({ type: 'SET_VEHICLES', payload: vehicles.length > 0 ? vehicles : sampleVehicles });
        dispatch({ type: 'SET_SALES', payload: sales.length > 0 ? sales : sampleSales });
        dispatch({ type: 'SET_INTERACTIONS', payload: interactions.length > 0 ? interactions : sampleInteractions });
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Fall back to sample data
        dispatch({ type: 'SET_CUSTOMERS', payload: sampleCustomers });
        dispatch({ type: 'SET_LEADS', payload: sampleLeads });
        dispatch({ type: 'SET_VEHICLES', payload: sampleVehicles });
        dispatch({ type: 'SET_SALES', payload: sampleSales });
        dispatch({ type: 'SET_INTERACTIONS', payload: sampleInteractions });
      }
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
          const updatedCustomer = {
            ...customer,
            lastContact: new Date().toISOString()
          };
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