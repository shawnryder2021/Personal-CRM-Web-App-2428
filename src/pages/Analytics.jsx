import React from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '../context/ContactContext';
import ReactECharts from 'echarts-for-react';
import { format, subDays, isAfter, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTrendingUp, FiUsers, FiCalendar, FiTarget } = FiIcons;

function Analytics() {
  const { state } = useContacts();
  const { contacts, interactions } = state;

  // Calculate stats
  const totalContacts = contacts.length;
  const activeContacts = contacts.filter(c => 
    c.lastContact && isAfter(new Date(c.lastContact), subDays(new Date(), 30))
  ).length;
  
  const thisWeekInteractions = interactions.filter(i => 
    isAfter(new Date(i.timestamp), subDays(new Date(), 7))
  ).length;

  // Prepare chart data
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weeklyData = weekDays.map(day => {
    const dayInteractions = interactions.filter(i => 
      format(new Date(i.timestamp), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).length;
    
    return {
      date: format(day, 'EEE'),
      interactions: dayInteractions,
    };
  });

  // Contact distribution by tags
  const tagDistribution = {};
  contacts.forEach(contact => {
    if (contact.tags) {
      contact.tags.forEach(tag => {
        tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
      });
    }
  });

  // Interaction types distribution
  const interactionTypes = {};
  interactions.forEach(interaction => {
    interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;
  });

  // Chart options
  const weeklyChartOption = {
    title: {
      text: 'Weekly Interactions',
      left: 'center',
      textStyle: {
        color: '#374151',
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#374151',
      },
    },
    xAxis: {
      type: 'category',
      data: weeklyData.map(d => d.date),
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
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6',
        },
      },
    },
    series: [
      {
        data: weeklyData.map(d => d.interactions),
        type: 'bar',
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: '#2563eb',
          },
        },
      },
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
  };

  const tagChartOption = {
    title: {
      text: 'Contact Categories',
      left: 'center',
      textStyle: {
        color: '#374151',
        fontSize: 16,
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e5e7eb',
      textStyle: {
        color: '#374151',
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: Object.entries(tagDistribution).map(([name, value]) => ({
          name,
          value,
        })),
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}: {c}',
          color: '#374151',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const stats = [
    {
      name: 'Total Contacts',
      value: totalContacts,
      icon: FiUsers,
      color: 'bg-blue-500',
      description: 'People in your network',
    },
    {
      name: 'Active This Month',
      value: activeContacts,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      description: 'Contacts you\'ve interacted with',
    },
    {
      name: 'This Week',
      value: thisWeekInteractions,
      icon: FiCalendar,
      color: 'bg-purple-500',
      description: 'Interactions this week',
    },
    {
      name: 'Engagement Rate',
      value: totalContacts > 0 ? Math.round((activeContacts / totalContacts) * 100) + '%' : '0%',
      icon: FiTarget,
      color: 'bg-orange-500',
      description: 'Active vs total contacts',
    },
  ];

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
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Interactions Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <ReactECharts option={weeklyChartOption} style={{ height: '300px' }} />
        </motion.div>

        {/* Contact Categories Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          {Object.keys(tagDistribution).length > 0 ? (
            <ReactECharts option={tagChartOption} style={{ height: '300px' }} />
          ) : (
            <div className="flex items-center justify-center h-72">
              <div className="text-center">
                <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No contact categories yet</p>
                <p className="text-sm text-gray-400 mt-1">Add tags to your contacts to see distribution</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Network Growth</h4>
                <p className="text-sm text-gray-600 mt-1">
                  You have {totalContacts} contacts in your network. 
                  {totalContacts < 50 && " Consider expanding your professional network."}
                  {totalContacts >= 50 && " Great network size! Focus on maintaining relationships."}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Interaction Frequency</h4>
                <p className="text-sm text-gray-600 mt-1">
                  You had {thisWeekInteractions} interactions this week.
                  {thisWeekInteractions < 5 && " Try to reach out to more contacts this week."}
                  {thisWeekInteractions >= 5 && " Great job staying connected!"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <SafeIcon icon={FiTarget} className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Engagement Rate</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {activeContacts} of your {totalContacts} contacts are active this month.
                  {activeContacts / totalContacts < 0.3 && " Consider reaching out to dormant contacts."}
                  {activeContacts / totalContacts >= 0.3 && " Good engagement with your network!"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <SafeIcon icon={FiUsers} className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Contact Organization</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {Object.keys(tagDistribution).length > 0 
                    ? `Your contacts are organized into ${Object.keys(tagDistribution).length} categories.`
                    : "Add tags to organize your contacts better."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Analytics;