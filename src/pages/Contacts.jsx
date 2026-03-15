import { useState, useEffect, useCallback } from 'react';
import { fetchContacts } from '../services/contact.service';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchContacts();
      const data = response?.data || [];
      // Sort by newest first
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setContacts(sorted);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contact submissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
          <h2 className="text-xl font-bold text-white">Contact Submissions</h2>
          <p className="text-gray-500 text-sm mt-0.5">View messages received from your website contact form.</p>
        </div>

        <button
          onClick={loadContacts}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 text-gray-300 text-sm transition-colors cursor-pointer"
          title="Refresh Contacts"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Content */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading contact submissions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <svg className="w-10 h-10 text-red-500/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button onClick={loadContacts} className="btn-primary text-sm px-6 py-2 cursor-pointer">
              Retry
            </button>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">No Submissions Yet</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-sm mx-auto">
              You haven't received any contact form submissions yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Service</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap text-right">Received Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id || contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-gray-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-xs">
                          {contact.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium text-gray-200">{contact.name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-gray-800 text-gray-300 text-xs font-medium">
                        {contact.service || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle text-right">
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(contact.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedContact(null)} />
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">
                    {selectedContact.name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{selectedContact.name || 'Anonymous'}</h3>
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-400 hover:text-blue-300 text-sm mt-0.5 inline-block transition-colors">
                    {selectedContact.email || 'No email provided'}
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors self-start"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Service Required</p>
                  <p className="text-gray-200 font-medium">{selectedContact.service || 'Not specified'}</p>
                </div>
                <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Budget</p>
                  <p className="text-green-400 font-medium">
                    {selectedContact.budget ? `$${selectedContact.budget}` : 'Not specified'}
                  </p>
                </div>
                <div className="col-span-2 bg-gray-800/40 rounded-xl p-3 border border-gray-800">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Received At</p>
                  <p className="text-gray-300 text-sm">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Message</p>
                <div className="bg-gray-950 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedContact.message || <span className="text-gray-600 italic">No message content.</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/50 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
