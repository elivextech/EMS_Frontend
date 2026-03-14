import { useState, useEffect } from 'react';
import { fetchAllTemplates } from '../services/template.service';
import { sendEmail } from '../services/email.service';

const EmailSender = () => {
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetchAllTemplates();
        const templateArray = response?.data?.templates || response?.templates || [];
        setTemplates(Array.isArray(templateArray) ? templateArray : []);
      } catch {
        setError('Failed to load templates. Make sure the backend is running at localhost:5000.');
      } finally {
        setLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []);

  const handleTemplateSelect = (e) => {
    const id = e.target.value;
    const tmpl = templates.find((t) => String(t._id || t.id) === id);
    setSelectedTemplate(tmpl || null);
    setVariables({});
    setStatus(null);
    if (tmpl?.subject) setSubject(tmpl.subject);
  };

  const handleVariableChange = (key, value) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    if (!recipient) { setStatus({ type: 'error', message: 'Recipient email is required.' }); return; }

    setSending(true);
    setStatus(null);
    try {
      await sendEmail({
        templateId: selectedTemplate._id || selectedTemplate.id,
        to: recipient,
        subject,
        data: variables,
      });
      setStatus({ type: 'success', message: `Email sent successfully to ${recipient}!` });
      setRecipient(''); // Clear recipient to easily send next email, but keep subject and variables
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send email. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const templateVars = selectedTemplate?.variables || [];

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      <div>
        <h2 className="text-xl font-bold text-white">Compose Email</h2>
        <p className="text-gray-500 text-sm mt-0.5">Select a template, fill variables, and send.</p>
      </div>

      <form onSubmit={handleSend} className="space-y-4 sm:space-y-5">
        {/* Template Selector */}
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">1. Choose Template</h3>

          {loadingTemplates ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="animate-spin h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading templates...
            </div>
          ) : error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <select
              onChange={handleTemplateSelect}
              defaultValue=""
              className="input-field"
            >
              <option value="" disabled>— Select a template —</option>
              {templates.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name || t.title}
                </option>
              ))}
            </select>
          )}

          {selectedTemplate && (
            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400 border border-gray-700">
              <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">Selected</p>
              <p className="text-gray-300 font-medium">{selectedTemplate.name || selectedTemplate.title}</p>
              {selectedTemplate.subject && (
                <p className="text-gray-500 text-xs mt-1 truncate">Subject: {selectedTemplate.subject}</p>
              )}
            </div>
          )}
        </div>

        {/* Recipient & Subject */}
        <div className="card space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">2. Recipient</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-2">To (Email)</label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="recipient@example.com"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="input-field"
            />
          </div>
        </div>

        {/* Variables */}
        {templateVars.length > 0 && (
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">3. Fill Variables</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templateVars.map((varName) => (
                <div key={varName}>
                  <label className="block text-sm text-gray-400 mb-2 capitalize">
                    {varName.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="text"
                    value={variables[varName] || ''}
                    onChange={(e) => handleVariableChange(varName, e.target.value)}
                    placeholder={`Enter ${varName.replace(/_/g, ' ')}...`}
                    className="input-field"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        {status && (
          <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm border ${status.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              {status.type === 'success' ? (
                <path fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd" />
              )}
            </svg>
            <span>{status.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedTemplate || sending}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Email
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmailSender;
