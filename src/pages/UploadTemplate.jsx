import { useState } from 'react';
import { uploadTemplate } from '../services/template.service';

const UploadTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    name: '',
    subject: '',
    category: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.subject || !form.category || !file) {
      setStatus({ type: 'error', message: 'Name, subject, category, and HTML file are required.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await uploadTemplate({ ...form, htmlFile: file });
      setStatus({ type: 'success', message: 'Template uploaded successfully!' });
      setForm({ name: '', subject: '', category: '' });
      setFile(null);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload template. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      <div>
        <h2 className="text-xl font-bold text-white">Upload New Template</h2>
        <p className="text-gray-500 text-sm mt-0.5">Upload a new HTML email template.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Template Name*</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Monthly Newsletter"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category*</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="" disabled>Select category</option>
                <option value="welcome">Welcome</option>
                <option value="proposal">Proposal</option>
                <option value="followup">Followup</option>
                <option value="invoice">Invoice</option>
                <option value="project-update">Project Update</option>
                <option value="marketing">Marketing</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Default Subject*</label>
            <input
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="Here's your monthly update!"
              className="input-field"
              required
            />
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">HTML File*</label>
            <label className="block border-2 border-dashed border-gray-700 hover:border-blue-500/50 active:border-blue-500/70 transition-colors bg-gray-800/50 rounded-xl p-6 text-center cursor-pointer">
              <input
                type="file"
                accept=".html"
                onChange={handleFileChange}
                className="sr-only"
                required={!file}
              />
              <svg className="mx-auto h-8 w-8 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {file ? (
                <div>
                  <p className="text-sm font-medium text-blue-400 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">Tap or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">HTML files only</p>
                </>
              )}
            </label>
          </div>

          {status && (
            <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm border ${status.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                {status.type === 'success' ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                )}
              </svg>
              <span>{status.message}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || !file}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Template'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadTemplate;
