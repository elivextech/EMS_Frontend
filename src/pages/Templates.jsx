import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllTemplates, deleteTemplate, updateTemplate, fetchTemplateById } from '../services/template.service';
import { useAuth } from '../context/AuthContext';

const TemplateCard = ({ template, onDelete, onEdit, onPreview, canModify }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      await onDelete(template._id || template.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      onClick={() => onPreview(template)}
      className="card hover:border-blue-500/50 hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            <h3 className="text-white font-semibold text-sm truncate">
              {template.name || template.title || 'Untitled'}
            </h3>
          </div>
          {template.subject && (
            <p className="text-gray-500 text-xs mb-2 truncate">Subject: {template.subject}</p>
          )}
          {(template.description || template.body || template.content) && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {template.description || (template.body || template.content || '').slice(0, 120) + '...'}
            </p>
          )}
        </div>

        {/* Action buttons — always visible on mobile, hover-reveal on desktop */}
        <div
          className="flex items-center gap-1.5 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to="/emails/compose"
            state={{ templateId: template._id || template.id }}
            className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition-colors touch-target flex items-center justify-center"
            title="Use Template"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Link>
          {canModify && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(template); }}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors touch-target flex items-center justify-center"
                title="Edit Template"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors disabled:opacity-50 touch-target flex items-center justify-center"
                title="Delete Template"
              >
                {deleting ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-600 truncate">
        Category: {(template.category).toUpperCase()}
      </div>
    </div>
  );
};

const Templates = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Edit Modal State
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', subject: '', category: '' });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Preview Modal State
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAllTemplates();
      const templateArray = response?.data?.templates || response?.templates || [];
      setTemplates(Array.isArray(templateArray) ? templateArray : []);
    } catch {
      setError('Failed to load templates. Make sure the backend is running at localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete template');
    }
  };

  const openEditModal = (template) => {
    setEditingTemplate(template);
    setEditForm({
      name: template.name || template.title || '',
      subject: template.subject || '',
      category: template.category || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmittingEdit(true);
    try {
      const id = editingTemplate._id || editingTemplate.id;
      const updated = await updateTemplate(id, editForm);
      setTemplates((prev) => prev.map((t) => {
        if ((t._id || t.id) === id) {
          return { ...t, ...editForm, ...updated.data };
        }
        return t;
      }));
      setEditingTemplate(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update template');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handlePreview = async (template) => {
    setPreviewTemplate(template);
    setPreviewLoading(true);
    setPreviewHtml('');
    try {
      const id = template._id || template.id;
      const response = await fetchTemplateById(id);
      setPreviewHtml(response?.data?.html || response?.html || '<div style="color:white;text-align:center;padding:2rem;">No HTML content found</div>');
    } catch {
      setPreviewHtml('<div style="color:red;text-align:center;padding:2rem;">Failed to load template HTML</div>');
    } finally {
      setPreviewLoading(false);
    }
  };

  const filtered = templates.filter((t) => {
    const name = (t.name || t.title || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Email Templates</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {templates.length} template{templates.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={fetchTemplates}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 text-gray-300 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {canModify && (
            <Link
              to="/upload-template"
              className="btn-primary flex items-center gap-2 px-3 sm:px-4 py-2 text-sm flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Template</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="input-field pl-10"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 text-sm">Loading templates...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card border-red-500/20 bg-red-500/5 text-center py-10">
          <svg className="w-10 h-10 text-red-500/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={fetchTemplates} className="mt-4 btn-primary text-sm px-6 py-2">
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-sm">
            {search ? 'No templates match your search.' : 'No templates found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((template) => (
            <TemplateCard
              key={template._id || template.id}
              template={template}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onPreview={handlePreview}
              canModify={canModify}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
          <div className="card w-full max-w-md border-gray-700 shadow-2xl max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Edit Template</h3>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  className="input-field py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="input-field py-2"
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

              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="flex-1 btn-primary py-2 text-sm flex justify-center items-center"
                >
                  {submittingEdit ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gray-950/90 backdrop-blur-sm">
          <div className="card w-full max-w-4xl h-full max-h-[95dvh] sm:max-h-[90dvh] flex flex-col border-gray-700 shadow-2xl p-0 overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{previewTemplate.name || 'Template Preview'}</h3>
                {previewTemplate.subject && (
                  <p className="text-sm text-gray-500 mt-0.5 truncate">Subject: {previewTemplate.subject}</p>
                )}
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="ml-3 flex-shrink-0 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Close Preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 bg-white relative overflow-hidden">
              {previewLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                  <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Rendering HTML...</p>
                </div>
              ) : (
                <iframe
                  title="Template Preview"
                  srcDoc={previewHtml}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
