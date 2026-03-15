import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { fetchAllTemplates } from '../services/template.service';
import { fetchEmailLogs } from '../services/email.service';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="card flex items-center gap-4 sm:gap-5">
    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-gray-500 text-sm truncate">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5 truncate">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [templateCount, setTemplateCount] = useState(0);
  const [emailCount, setEmailCount] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [templateRes, emailRes] = await Promise.all([
          fetchAllTemplates().catch(() => null),
          fetchEmailLogs().catch(() => null),
        ]);
        setTemplateCount(templateRes?.data?.Count || templateRes?.data?.templates?.length || 0);
        setEmailCount(emailRes?.data?.Count ?? null);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6 pb-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden card bg-gradient-to-r from-blue-600/20 to-blue-900/10 border-blue-500/20">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-500/5 to-transparent" />
        <h2 className="text-lg sm:text-xl font-bold text-white flex flex-wrap items-center gap-2 relative z-10">
          Welcome back, {user?.name || 'User'} 👋
          {user?.role && (
            <span className="text-xs font-medium uppercase tracking-wider bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20 whitespace-nowrap">
              {user.role}
            </span>
          )}
        </h2>
        <p className="text-gray-400 text-sm mt-1 relative z-10">
          Here's an overview of your EMS activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Emails Sent"
          value={emailCount !== null ? emailCount.toLocaleString() : '—'}
          sub="All time"
          color="bg-blue-600/20"
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Templates"
          value={templateCount}
          sub="Available templates"
          color="bg-purple-600/20"
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatCard
          label="Status"
          value="Online"
          sub="Backend connected"
          color="bg-green-600/20"
          icon={
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Link
            to="/emails/compose"
            className="card group hover:border-blue-500/40 hover:bg-gray-800/50 transition-all duration-200 flex items-center gap-4 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm">Compose Email</p>
              <p className="text-gray-500 text-xs truncate">Use a template to Compose Email</p>
            </div>
          </Link>

          <Link
            to="/templates"
            className="card group hover:border-purple-500/40 hover:bg-gray-800/50 transition-all duration-200 flex items-center gap-4 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors flex-shrink-0">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm">View Templates</p>
              <p className="text-gray-500 text-xs truncate">Browse & manage email templates</p>
            </div>
          </Link>

          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Link
              to="/upload-template"
              className="card group hover:border-green-500/40 hover:bg-gray-800/50 transition-all duration-200 flex items-center gap-4 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center group-hover:bg-green-600/30 transition-colors flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm">Upload Template</p>
                <p className="text-gray-500 text-xs truncate">Add new HTML email templates</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
