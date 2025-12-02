import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAttendanceRecords } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_enrolled: 0,
    today_present: 0,
    today_absent: 0,
    absent_users: []
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, recordsData] = await Promise.all([
        getDashboardStats(),
        getAttendanceRecords()
      ]);

      setStats(statsData);
      setAttendanceRecords(recordsData.records || []);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && attendanceRecords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
        <p className="text-red-700 text-lg">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8">
      {/* Session Info */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Active Session</h2>
        <p className="text-lg">{today}</p>
        <p className="text-sm opacity-90 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon="👥"
          title="Total Enrolled"
          value={stats.total_enrolled}
          bgColor="bg-slate-500"
        />
        <StatCard
          icon="✅"
          title="Present Today"
          value={stats.today_present}
          bgColor="bg-green-500"
        />
        <StatCard
          icon="❌"
          title="Absent Today"
          value={stats.today_absent}
          bgColor="bg-red-500"
        />
        <StatCard
          icon="📊"
          title="Attendance Rate"
          value={stats.total_enrolled > 0 ? `${Math.round((stats.today_present / stats.total_enrolled) * 100)}%` : '0%'}
          bgColor="bg-purple-500"
        />
      </div>

      {/* Absent Users Section */}
      {stats.absent_users && stats.absent_users.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-red-800 mb-4">
            ❌ Absent Users Today ({stats.absent_users.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.absent_users.map((user, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow">
                <p className="text-gray-800 font-medium">{user}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6">
          <h3 className="text-2xl font-bold text-white">📋 Attendance Records</h3>
        </div>
        
        <div className="overflow-x-auto">
          {attendanceRecords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No attendance records yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === 'Present' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-8 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-lg p-6 text-white transform transition-all hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="text-5xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;