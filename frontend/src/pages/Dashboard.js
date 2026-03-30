import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Tooth, Buildings, Clock } from '@phosphor-icons/react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/analytics/overview`, {
        withCredentials: true
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E5E5E2] rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-[#E5E5E2] rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Patients',
      value: analytics?.total_patients || 0,
      icon: Users,
      color: '#82A098',
      link: '/patients'
    },
    {
      label: 'Total Implants',
      value: analytics?.total_implants || 0,
      icon: Tooth,
      color: '#C27E70'
    },
    {
      label: 'Clinics',
      value: analytics?.total_clinics || 0,
      icon: Buildings,
      color: '#7B9EBB',
      link: '/clinics'
    },
    {
      label: 'Pending Osseo',
      value: analytics?.pending_osseointegration || 0,
      icon: Clock,
      color: '#E8A76C'
    }
  ];

  return (
    <div className="p-8" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-[#2A2F35] tracking-tight" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Welcome back, Dr. {user?.name?.split(' ')[user?.name?.split(' ').length - 1] || 'Doctor'}
        </h1>
        <p className="text-[#5C6773] mt-2">Here's your practice overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const StatCard = (
            <div
              key={index}
              data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, '-')}`}
              className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5C6773] font-medium mb-2">{stat.label}</p>
                  <p className="text-3xl font-semibold text-[#2A2F35]">{stat.value}</p>
                </div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon size={24} weight="fill" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={index} to={stat.link}>
              {StatCard}
            </Link>
          ) : StatCard;
        })}
      </div>

      {/* Implant Types Breakdown */}
      {analytics?.implant_types && analytics.implant_types.length > 0 && (
        <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-medium text-[#2A2F35] mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            Implant Types Distribution
          </h2>
          <div className="space-y-3">
            {analytics.implant_types.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-[#5C6773] capitalize">{type._id || 'Unknown'}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-[#F0F0EE] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#82A098] rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(type.count / analytics.total_implants) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-[#2A2F35] font-medium w-12 text-right">{type.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/patients"
          data-testid="add-patient-card"
          className="bg-white border-2 border-dashed border-[#E5E5E2] rounded-xl p-8 hover:border-[#82A098] hover:bg-[#F9F9F8] transition-all duration-200 text-center group"
        >
          <Users size={40} className="mx-auto text-[#82A098] mb-3" weight="duotone" />
          <h3 className="text-lg font-medium text-[#2A2F35] group-hover:text-[#82A098] transition-colors duration-200">
            Add New Patient
          </h3>
          <p className="text-sm text-[#5C6773] mt-1">Create a new patient record</p>
        </Link>

        <Link 
          to="/analytics"
          data-testid="view-analytics-card"
          className="bg-white border-2 border-dashed border-[#E5E5E2] rounded-xl p-8 hover:border-[#82A098] hover:bg-[#F9F9F8] transition-all duration-200 text-center group"
        >
          <Tooth size={40} className="mx-auto text-[#C27E70] mb-3" weight="duotone" />
          <h3 className="text-lg font-medium text-[#2A2F35] group-hover:text-[#82A098] transition-colors duration-200">
            View Analytics
          </h3>
          <p className="text-sm text-[#5C6773] mt-1">Detailed implant reports</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;