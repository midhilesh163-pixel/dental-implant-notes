import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { CalendarDots, User, Clock } from '@phosphor-icons/react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, patientsRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/overview`, { withCredentials: true }),
        axios.get(`${API_URL}/api/patients`, { withCredentials: true })
      ]);
      setAnalytics(analyticsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStageColor = (index) => {
    const colors = ['#7DD3FC', '#A5F3FC', '#93C5FD'];
    return colors[index % colors.length];
  };

  const stages = ['IMPLANT PLACEMENT', 'POST-OP REVIEW', 'PROSTHETIC FITTING', 'HEALING PHASE', 'FINAL RESTORATION'];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E5E5E2] rounded w-1/4"></div>
          <div className="h-48 bg-[#E5E5E2] rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E2] px-6 py-4">
        <h1 className="text-2xl font-semibold text-[#2A2F35]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Clinical Cases
        </h1>
      </div>

      <div className="p-6">
        {/* Clinic Status Card */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-xs text-white/80 uppercase tracking-wider mb-2">Daily Summary</p>
          <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            Clinic Status
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-4xl font-bold text-white mb-1">{analytics?.total_patients || 0}</p>
              <p className="text-sm text-white/80">Active Cases</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-4xl font-bold text-white mb-1">{analytics?.pending_osseointegration || 0}</p>
              <p className="text-sm text-white/80">Surgeries Today</p>
            </div>
          </div>
        </div>

        {/* Active Patient Queue */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#2A2F35]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
              Active Patient Queue
            </h3>
            <Link 
              to="/patients"
              className="text-[#3B82F6] text-sm font-medium hover:text-[#2563EB] transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 5).map((patient, index) => (
              <Link
                key={patient._id}
                to={`/patients/${patient._id}`}
                data-testid={`patient-queue-${patient._id}`}
                className="bg-white rounded-xl p-4 border border-[#E5E5E2] hover:border-[#3B82F6] hover:shadow-md transition-all duration-200 block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-[#1E40AF] font-bold text-lg"
                      style={{ backgroundColor: getStageColor(index) }}
                    >
                      {getInitials(patient.name)}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-[#2A2F35]">{patient.name}</h4>
                      <p className="text-xs text-[#5C6773]">ID: #{patient._id.slice(-8).toUpperCase()}</p>
                      
                      {/* Stage Badge */}
                      <div className="mt-2">
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${getStageColor(index)}40`,
                            color: '#1E40AF'
                          }}
                        >
                          STAGE: {stages[index % stages.length]}
                        </span>
                      </div>

                      {/* Date/Time */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-[#5C6773]">
                        <CalendarDots size={14} />
                        <span>
                          {new Date(patient.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}, {new Date(patient.created_at).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right Icons */}
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" weight="fill" />
                      </div>
                      <div className="w-8 h-8 bg-[#1E40AF] rounded-full flex items-center justify-center">
                        <Clock size={16} className="text-white" weight="fill" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E2]">
            <p className="text-2xl font-bold text-[#2A2F35]">{analytics?.total_implants || 0}</p>
            <p className="text-sm text-[#5C6773]">Total Implants</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E2]">
            <p className="text-2xl font-bold text-[#2A2F35]">{analytics?.total_clinics || 0}</p>
            <p className="text-sm text-[#5C6773]">Clinics</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E5E5E2]">
            <p className="text-2xl font-bold text-[#2A2F35]">{analytics?.pending_osseointegration || 0}</p>
            <p className="text-sm text-[#5C6773]">Healing Phase</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
