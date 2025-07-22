import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCustomers } from '../context/CustomerContext';
import { format, subDays, isAfter, startOfMonth, parseISO } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ReactECharts from 'echarts-for-react';

const { FiUsers, FiUserPlus, FiDollarSign, FiTruck, FiTrendingUp, FiPhone, FiMail, FiCalendar, FiClock, FiRefreshCw, FiAlertCircle } = FiIcons;

// Sample recent activities if none exist in the system
const sampleActivities = [
  { 
    id: 'act-1', 
    type: 'lead', 
    title: 'New Lead Created', 
    description: 'Sarah Johnson showed interest in 2023 Tesla Model Y', 
    timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
    icon: FiUserPlus,
    color: 'bg-blue-500'
  },
  { 
    id: 'act-2', 
    type: 'customer', 
    title: 'Customer Follow-up', 
    description: 'Called Michael Davis about Honda CR-V financing options', 
    timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
    icon: FiPhone,
    color: 'bg-green-500'
  },
  { 
    id: 'act-3', 
    type: 'sale', 
    title: 'Vehicle Sale Completed', 
    description: 'Robert Wilson purchased 2022 Ford F-150 for $45,500', 
    timestamp: new Date(new Date().setHours(new Date().getHours() - 8)),
    icon: FiDollarSign,
    color: 'bg-purple-500'
  },
  { 
    id: 'act-4', 
    type: 'customer', 
    title: 'Customer Appointment', 
    description: 'Test drive scheduled with Jennifer Lopez for BMW X5', 
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    icon: FiCalendar,
    color: 'bg-orange-500'
  },
  { 
    id: 'act-5', 
    type: 'inventory', 
    title: 'New Inventory Added', 
    description: '2023 Audi Q7 added to available vehicles', 
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    icon: FiTruck,
    color: 'bg-indigo-500'
  },
];

// Sample customers if none exist in the system
const sampleCustomers = [
  {
    id: 'cust-1',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'michael.davis@example.com',
    phone: '(555) 123-4567',
    interestedVehicle: '2023 Honda CR-V',
    status: 'active',
    lastContact: new Date(new Date().setDate(new Date().getDate() - 2)),
    budget: 32000
  },
  {
    id: 'cust-2',
    firstName: 'Jennifer',
    lastName: 'Lopez',
    email: 'jennifer@example.com',
    phone: '(555) 987-6543',
    interestedVehicle: '2023 BMW X5',
    status: 'prospect',
    lastContact: new Date(new Date().setDate(new Date().getDate() - 4)),
    budget: 65000
  },
  {
    id: 'cust-3',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'rwilson@example.com',
    phone: '(555) 456-7890',
    interestedVehicle: '2022 Ford F-150',
    status: 'active',
    lastContact: new Date(new Date().setDate(new Date().getDate() - 1)),
    budget: 48000
  },
  {
    id: 'cust-4',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sjohnson@example.com',
    phone: '(555) 234-5678',
    interestedVehicle: '2023 Tesla Model Y',
    status: 'prospect',
    lastContact: new Date(),
    budget: 55000
  },
  {
    id: 'cust-5',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'dthompson@example.com',
    phone: '(555) 876-5432',
    interestedVehicle: '2023 Toyota RAV4',
    status: 'active',
    lastContact: new Date(new Date().setDate(new Date().getDate() - 3)),
    budget: 36000
  }
];

// Sample leads with follow-ups
const sampleLeads = [
  {
    id: 'lead-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sjohnson@example.com',
    phone: '(555) 234-5678',
    interestedVehicle: '2023 Tesla Model Y',
    status: 'new',
    priority: 'high',
    followUpDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    source: 'Website'
  },
  {
    id: 'lead-2',
    firstName: 'James',
    lastName: 'Miller',
    email: 'jmiller@example.com',
    phone: '(555) 345-6789',
    interestedVehicle: '2023 Lexus RX',
    status: 'contacted',
    priority: 'medium',
    followUpDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    source: 'Phone Call'
  },
  {
    id: 'lead-3',
    firstName: 'Emma',
    lastName: 'Garcia',
    email: 'egarcia@example.com',
    phone: '(555) 567-8901',
    interestedVehicle: '2023 Hyundai Tucson',
    status: 'qualified',
    priority: 'high',
    followUpDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    source: 'Referral'
  },
  {
    id: 'lead-4',
    firstName: 'Daniel',
    lastName: 'Martinez',
    email: 'dmartinez@example.com',
    phone: '(555) 678-9012',
    interestedVehicle: '2023 Chevrolet Silverado',
    status: 'new',
    priority: 'low',
    followUpDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    source: 'Walk-in'
  },
  {
    id: 'lead-5',
    firstName: 'Olivia',
    lastName: 'Rodriguez',
    email: 'orodriguez@example.com',
    phone: '(555) 789-0123',
    interestedVehicle: '2023 Subaru Outback',
    status: 'contacted',
    priority: 'medium',
    followUpDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    source: 'Social Media'
  }
];

// Sample sales data
const sampleSales = [
  {
    id: 'sale-1',
    customerId: 'cust-3',
    customerName: 'Robert Wilson',
    vehicleDetails: '2022 Ford F-150 XLT',
    salePrice: 45500,
    saleDate: new Date(new Date().setDate(new Date().getDate() - 8)),
    status: 'completed'
  },
  {
    id: 'sale-2',
    customerId: 'cust-5',
    customerName: 'David Thompson',
    vehicleDetails: '2023 Toyota RAV4 Limited',
    salePrice: 36700,
    saleDate: new Date(new Date().setDate(new Date().getDate() - 15)),
    status: 'completed'
  },
  {
    id: 'sale-3',
    customerId: 'cust-1',
    customerName: 'Michael Davis',
    vehicleDetails: '2022 Honda Accord Sport',
    salePrice: 32100,
    saleDate: new Date(new Date().setDate(new Date().getDate() - 22)),
    status: 'completed'
  }
];

function Dashboard() {
  const { state } = useCustomers();
  const { customers, leads, sales, vehicles, interactions, loading } = state;

  // Use actual data if available, otherwise use sample data
  const displayCustomers = customers.length > 0 ? customers : sampleCustomers;
  const displayLeads = leads.length > 0 ? leads : sampleLeads;
  const displaySales = sales.length > 0 ? sales : sampleSales;
  
  // Calculate statistics
  const thisMonth = startOfMonth(new Date());
  const thisWeekInteractions = interactions.filter(i => 
    isAfter(new Date(i.timestamp), subDays(new Date(), 7))
  ).length;

  const monthlyRevenue = displaySales
    .filter(sale => isAfter(new Date(sale.saleDate), thisMonth))
    .reduce((total, sale) => total + (sale.salePrice || 0), 0);

  const hotLeads = displayLeads.filter(lead => lead.priority === 'high').length;
  const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'available').length;

  // Prepare chart data
  const monthlySalesData = [
    { month: 'Jan', value: 125000 },
    { month: 'Feb', value: 132000 },
    { month: 'Mar', value: 141000 },
    { month: 'Apr', value: 152000 },
    { month: 'May', value: 165000 },
    { month: 'Jun', value: 172000 },
    { month: 'Jul', value: 168000 },
    { month: 'Aug', value: 175000 },
    { month: 'Sep', value: 182000 },
    { month: 'Oct', value: 195000 },
    { month: 'Nov', value: 188000 },
    { month: 'Dec', value: 209000 },
  ];

  const salesChartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#374151',
      },
    },
    xAxis: {
      type: 'category',
      data: monthlySalesData.map(d => d.month),
      axisLine: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisTick: {
        lineStyle: {
          color: '#e5e7eb',
        },
      },
      axisLabel: {
        color: '#6b7280',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#6b7280',
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
    },
    series: [
      {
        data: monthlySalesData.map(d => d.value),
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#3b82f6',
        },
        lineStyle: {
          width: 3,
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(59, 130, 246, 0.2)'
            }, {
              offset: 1,
              color: 'rgba(59, 130, 246, 0.01)'
            }]
          }
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
  };

  // Vehicle distribution by type
  const vehicleTypeData = [
    { value: 35, name: 'SUV' },
    { value: 25, name: 'Sedan' },
    { value: 20, name: 'Truck' },
    { value: 10, name: 'Hatchback' },
    { value: 10, name: 'Other' }
  ];

  const vehicleChartOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#374151',
      },
    },
    legend: {
      top: '0%',
      left: 'center',
      textStyle: {
        color: '#6b7280',
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: vehicleTypeData
      }
    ]
  };

  const stats = [
    {
      name: 'Total Customers',
      value: displayCustomers.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%',
      description: 'Active customers',
    },
    {
      name: 'Hot Leads',
      value: hotLeads,
      icon: FiUserPlus,
      color: 'bg-orange-500',
      change: '+8%',
      description: 'High priority leads',
    },
    {
      name: 'Monthly Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: '+15%',
      description: 'This month\'s sales',
    },
    {
      name: 'Available Vehicles',
      value: availableVehicles || 12, // Fallback value if no real data
      icon: FiTruck,
      color: 'bg-purple-500',
      change: '-5%',
      description: 'Ready for sale',
    },
  ];

  const recentCustomers = displayCustomers
    .sort((a, b) => {
      // Sort by createdAt if available, otherwise use lastContact
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.lastContact);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.lastContact);
      return dateB - dateA;
    })
    .slice(0, 5);

  const upcomingFollowUps = displayLeads
    .filter(lead => lead.followUpDate && isAfter(new Date(lead.followUpDate), new Date()))
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
    .slice(0, 5);

  const recentSales = displaySales
    .sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
    .slice(0, 3);

  // Get recent activities (interactions or sample activities)
  const recentActivities = interactions.length > 5 
    ? interactions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(interaction => ({
          id: interaction.id,
          type: interaction.customerId ? 'customer' : 'lead',
          title: `${interaction.type.replace('_', ' ').charAt(0).toUpperCase() + interaction.type.slice(1)}`,
          description: interaction.notes,
          timestamp: new Date(interaction.timestamp),
          icon: interaction.type.includes('call') ? FiPhone : 
                interaction.type.includes('email') ? FiMail : 
                interaction.type.includes('meeting') ? FiCalendar : FiClock,
          color: 'bg-blue-500'
        }))
    : sampleActivities;

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
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2/3 of the space */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Sales Performance</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">YTD Total: $1.84M</span>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ReactECharts option={salesChartOption} style={{ height: '300px' }} />
        </motion.div>

        {/* Vehicle Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory by Type</h3>
            <span className="text-sm font-medium text-gray-500">100 vehicles</span>
          </div>
          <ReactECharts option={vehicleChartOption} style={{ height: '300px' }} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all
            </motion.button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex space-x-4">
                <div className={`${activity.color} p-2 rounded-full flex-shrink-0 mt-1`}>
                  <SafeIcon icon={activity.icon} className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                  <p className="text-xs text-gray-400">
                    {format(activity.timestamp, 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
            <Link to="/customers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View all
              </motion.button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentCustomers.length > 0 ? recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {customer.firstName.charAt(0).toUpperCase()}{customer.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                  <p className="text-xs text-gray-400">
                    {customer.interestedVehicle && `Interested in: ${customer.interestedVehicle}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiPhone} className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                    <SafeIcon icon={FiMail} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No customers yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Follow-ups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Follow-ups</h3>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {upcomingFollowUps.length} scheduled
            </span>
          </div>
          <div className="space-y-4">
            {upcomingFollowUps.length > 0 ? upcomingFollowUps.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-medium">
                    {lead.firstName.charAt(0).toUpperCase()}{lead.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                    Follow up: {format(new Date(lead.followUpDate), 'MMM d, h:mm a')}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Contact
                </motion.button>
              </div>
            )) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No follow-ups scheduled</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 rounded-xl text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold">Ready to boost your sales?</h3>
            <p className="text-primary-100 mt-1">Add new leads, track customers, and manage your inventory</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/leads">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                <span>Add Lead</span>
              </motion.button>
            </Link>
            <Link to="/customers">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiUsers} className="w-4 h-4" />
                <span>View Customers</span>
              </motion.button>
            </Link>
            <Link to="/inventory">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <SafeIcon icon={FiTruck} className="w-4 h-4" />
                <span>Inventory</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Alerts and Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            3 new
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex space-x-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
              <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Inventory Alert</p>
              <p className="text-sm text-gray-600">Low stock on Honda CR-V models - only 2 vehicles remaining</p>
              <p className="text-xs text-gray-400 mt-1">Today, 10:23 AM</p>
            </div>
          </div>
          
          <div className="flex space-x-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
              <SafeIcon icon={FiUserPlus} className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Lead Follow-up</p>
              <p className="text-sm text-gray-600">5 leads haven't been contacted in the past 7 days</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 4:45 PM</p>
            </div>
          </div>
          
          <div className="flex space-x-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Sales Goal Achieved</p>
              <p className="text-sm text-gray-600">Monthly sales target of $150,000 has been reached!</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;