import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEmailLogs } from '../services/email.service';
import { fetchAllTemplates } from '../services/template.service';
import EmailQuotaBar from '../components/EmailQuotaBar';

const TOTAL_QUOTA = 100;

const EmailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [quota, setQuota] = useState({ used: 0, remaining: TOTAL_QUOTA });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch logs, templates, and users in parallel
      const [logsResponse, templatesResponse, usersResponse] = await Promise.all([
        fetchEmailLogs(),
        fetchAllTemplates().catch(() => ({ data: { templates: [] } })), // Fallback if templates fail
        import('../services/user.service').then(m => m.fetchAllUsers()).catch(() => ({ data: { users: [] } })) // Fallback if users fail
      ]);

      const emailLogs = logsResponse?.data?.logs || [];
      // reaminingQuota = emails left today; Count = all-time total (not used for quota)
      const remaining = logsResponse?.data?.reaminingQuota ?? TOTAL_QUOTA;
      const usedToday = TOTAL_QUOTA - remaining;
      setQuota({ used: usedToday, remaining });
      const templates = templatesResponse?.data?.templates || templatesResponse?.templates || [];
      const usersData = usersResponse?.data?.users || usersResponse?.data || usersResponse?.users || [];
      const usersList = Array.isArray(usersData) ? usersData : [];

      // Create maps for quick lookup
      const templateMap = templates.reduce((acc, t) => {
        acc[t._id || t.id] = t.name || t.title || 'Unknown Template';
        return acc;
      }, {});

      const userMap = usersList.reduce((acc, u) => {
        acc[u._id || u.id] = u.name || u.email || 'Unknown User';
        return acc;
      }, {});

      // Enrich logs with template and sender names
      const enrichedLogs = emailLogs.map(log => ({
        ...log,
        templateName: templateMap[log.templateId] || 'Unknown Template',
        senderName: log.sentBy ? (userMap[log.sentBy] || log.sentBy.substring(log.sentBy.length - 6)) : 'Unknown User'
      }));

      // Sort by newest first just in case
      enrichedLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLogs(enrichedLogs);
    } catch (err) {
      setError('Failed to fetch email logs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Email Logs</h2>
          <p className="text-gray-500 text-sm mt-0.5">Track and view all emails sent from your account.</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 text-gray-300 text-sm transition-colors cursor-pointer"
            title="Refresh Logs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/emails/compose"
            className="btn-primary flex items-center gap-2 px-3 sm:px-4 py-2 text-sm flex-shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Compose Email</span>
          </Link>
        </div>
      </div>

      {/* Daily Quota */}
      <EmailQuotaBar usedEmails={quota.used} totalQuota={TOTAL_QUOTA} />

      {/* Content */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading email logs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <svg className="w-10 h-10 text-red-500/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button onClick={loadLogs} className="btn-primary text-sm px-6 py-2 cursor-pointer">
              Retry
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">No Emails Sent Yet</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              You haven't sent any emails yet. Click "Compose Email" to send your first message using a template.
            </p>
            <Link to="/emails/compose" className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2 cursor-pointer">
              Send First Email
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Recipient (To)</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Template Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Sent By</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap text-right">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {logs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="px-4 py-3.5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-xs uppercase">
                          {log.to?.[0] || '?'}
                        </div>
                        <span className="text-sm font-medium text-gray-200">{log.to}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <p className="text-sm text-gray-300 max-w-[200px] truncate" title={log.subject}>
                        {log.subject || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs truncate max-w-[150px]">
                        {log.templateName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider border ${log.status === 'sent' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        log.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'sent' ? 'bg-green-400' :
                          log.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <p className="text-sm text-gray-300 font-medium truncate max-w-[150px]" title={log.senderName}>
                        {log.senderName}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 align-middle text-right">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogs;
