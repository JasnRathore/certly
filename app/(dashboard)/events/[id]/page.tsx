'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CertEvent, TextConfig, AVAILABLE_FONTS } from '@/lib/types';
import { PdfPreview } from '@/components/PdfPreview';
import { PdfCanvasViewer } from '@/components/PdfCanvasViewer';
import { Modal } from '@/components/Modal';
import { Upload, Mail, Settings, Users, FileText, CheckCircle2, AlertCircle, Eye, Plus, Pencil, Trash2, Check, X } from 'lucide-react';

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<CertEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'template' | 'design' | 'recipients' | 'email' | 'actions'>('template');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const loadEvent = () => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) router.push('/');
        else setEvent(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    
    setLoading(true);
    await fetch(`/api/events/${id}/template`, { method: 'POST', body: formData });
    loadEvent();
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    
    setLoading(true);
    await fetch(`/api/events/${id}/csv`, { method: 'POST', body: formData });
    loadEvent();
  };

  const addManualRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !newName || !newEmail) return;
    
    const updatedRecipients = [...event.recipients, { name: newName, email: newEmail, status: 'pending' as const }];
    setEvent({ ...event, recipients: updatedRecipients });
    setNewName('');
    setNewEmail('');

    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients: updatedRecipients })
    });
  };

  const startEdit = (i: number) => {
    if (!event) return;
    setEditIndex(i);
    setEditName(event.recipients[i].name);
    setEditEmail(event.recipients[i].email);
  };

  const saveRecipientEdit = async () => {
    if (!event || editIndex === null || !editName || !editEmail) return;
    const updatedRecipients = [...event.recipients];
    updatedRecipients[editIndex] = { ...updatedRecipients[editIndex], name: editName, email: editEmail };
    setEvent({ ...event, recipients: updatedRecipients });
    setEditIndex(null);

    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients: updatedRecipients })
    });
  };

  const removeRecipient = async (i: number) => {
    if (!event) return;
    const updatedRecipients = event.recipients.filter((_, idx) => idx !== i);
    setEvent({ ...event, recipients: updatedRecipients });

    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients: updatedRecipients })
    });
  };

  const updateConfig = async (config: TextConfig) => {
    if (!event) return;
    const updated = { ...event, textConfig: config };
    setEvent(updated); // Optimistic
    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textConfig: config })
    });
  };

  const updateEmail = async (subject: string, body: string) => {
    if (!event) return;
    const updated = { ...event, emailSubject: subject, emailBody: body };
    setEvent(updated);
    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailSubject: subject, emailBody: body })
    });
  };

  const generateCertificates = async () => {
    setLoading(true);
    await fetch(`/api/events/${id}/generate`, { method: 'POST' });
    loadEvent();
  };

  const sendEmails = async () => {
    setIsSendModalOpen(false);
    setLoading(true);
    await fetch(`/api/events/${id}/send`, { method: 'POST' });
    loadEvent();
  };

  if (loading && !event) return <div className="text-white bg-black min-h-screen p-10">Loading...</div>;
  if (!event) return <div className="text-white bg-black min-h-screen p-10">Event not found</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 p-6 md:p-0 min-h-screen bg-black text-white">
      <div className="mb-8 border-b border-[#222] pb-6">
        <h1 className="text-3xl font-medium tracking-tight mb-2">{event.name}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'template', label: '1. Template', icon: FileText },
              { id: 'design', label: '2. Design', icon: Settings },
              { id: 'recipients', label: '3. Recipients', icon: Users },
              { id: 'email', label: '4. Email Setup', icon: Mail },
              { id: 'actions', label: '5. Generate & Send', icon: CheckCircle2 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 py-2 px-3 text-left transition-colors text-sm ${
                    activeTab === tab.id 
                      ? 'text-white border-l-2 border-white pl-[10px]' 
                      : 'text-[#888] hover:text-white border-l-2 border-transparent pl-[10px]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 bg-black border border-[#222] rounded-lg p-6 min-h-[600px]">
          {activeTab === 'template' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Upload PDF Template</h2>
              <div className="border border-dashed border-[#333] rounded-lg p-12 text-center hover:border-[#555] transition cursor-pointer relative bg-[#0a0a0a]">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleTemplateUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 mx-auto text-[#666] mb-4" />
                <p className="text-[#888] text-sm">Drag and drop or click to upload PDF</p>
                {event.hasTemplate && (
                  <p className="text-green-400 mt-4 text-sm font-medium flex items-center justify-center gap-2 bg-green-400/10 py-1.5 px-3 rounded-full w-max mx-auto">
                    <CheckCircle2 className="w-4 h-4" /> Template uploaded successfully
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Design Text Overlay</h2>
              {!event.hasTemplate ? (
                <p className="text-red-400 text-sm">Please upload a template first.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col gap-5">
                    <div>
                      <label className="block text-xs font-medium text-[#888] mb-2 uppercase tracking-wider">X Position (%)</label>
                      <input 
                        type="range" min="0" max="100" 
                        value={event.textConfig.x}
                        onChange={e => updateConfig({...event.textConfig, x: Number(e.target.value)})}
                        className="w-full accent-white"
                      />
                      <div className="text-right text-xs text-[#666] mt-1">{event.textConfig.x}%</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#888] mb-2 uppercase tracking-wider">Y Position (%)</label>
                      <input 
                        type="range" min="0" max="100" 
                        value={event.textConfig.y}
                        onChange={e => updateConfig({...event.textConfig, y: Number(e.target.value)})}
                        className="w-full accent-white"
                      />
                      <div className="text-right text-xs text-[#666] mt-1">{event.textConfig.y}%</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#888] mb-2 uppercase tracking-wider">Font Size</label>
                      <input 
                        type="number"
                        value={event.textConfig.fontSize}
                        onChange={e => updateConfig({...event.textConfig, fontSize: Number(e.target.value)})}
                        className="w-full bg-[#0a0a0a] border border-[#222] rounded-md p-2 text-white text-sm focus:border-[#444] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#888] mb-2 uppercase tracking-wider">Font Family</label>
                      <select
                        value={event.textConfig.fontFamily}
                        onChange={e => updateConfig({...event.textConfig, fontFamily: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-[#222] rounded-md p-2 text-white text-sm focus:border-[#444] focus:outline-none transition"
                      >
                        {AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#888] mb-2 uppercase tracking-wider">Color (Hex)</label>
                      <input 
                        type="color"
                        value={event.textConfig.color}
                        onChange={e => updateConfig({...event.textConfig, color: e.target.value})}
                        className="w-full h-10 rounded cursor-pointer bg-[#0a0a0a] border border-[#222] p-1"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 lg:col-span-2 border border-[#222] rounded-md overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-4">
                    <PdfPreview eventId={id} config={event.textConfig} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recipients' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Recipients</h2>
                <div>
                  <input type="file" accept=".csv" id="csv-upload" className="hidden" onChange={handleCsvUpload} />
                  <label htmlFor="csv-upload" className="bg-white text-black hover:bg-[#ccc] px-4 py-2 rounded-md cursor-pointer inline-flex items-center gap-2 text-sm font-medium transition">
                    <Upload className="w-4 h-4" /> Upload CSV
                  </label>
                </div>
              </div>
              <p className="text-sm text-[#888] mb-6">CSV must contain "name" and "email" columns.</p>

              <form onSubmit={addManualRecipient} className="flex gap-3 mb-6 bg-[#0a0a0a] p-4 border border-[#222] rounded-md items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#888] mb-1 uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-black border border-[#222] rounded-md p-2 text-white text-sm focus:border-[#444] focus:outline-none transition h-[38px]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#888] mb-1 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-black border border-[#222] rounded-md p-2 text-white text-sm focus:border-[#444] focus:outline-none transition h-[38px]"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newName || !newEmail}
                  className="bg-[#111] border border-[#222] text-white hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md inline-flex items-center gap-2 text-sm font-medium transition h-[38px]"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              <div className="border border-[#222] rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0a0a0a] border-b border-[#222] text-[#888]">
                    <tr>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.recipients.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-[#666]">No recipients uploaded yet.</td></tr>
                    ) : (
                      event.recipients.map((r, i) => {
                        let statusBadge = 'bg-[#111] text-[#888]';
                        let dot = 'bg-[#666]';
                        if (r.status === 'sent') {
                          statusBadge = 'bg-green-400/10 text-green-400';
                          dot = 'bg-green-400';
                        } else if (r.status === 'generated') {
                          statusBadge = 'bg-blue-400/10 text-blue-400';
                          dot = 'bg-blue-400';
                        } else if (r.status === 'failed') {
                          statusBadge = 'bg-red-400/10 text-red-400';
                          dot = 'bg-red-400';
                        }
                        
                        const isEditing = editIndex === i;

                        return (
                          <tr key={i} className="border-b border-[#111] last:border-b-0">
                            <td className="p-3 text-[#ccc]">
                              {isEditing ? (
                                <input 
                                  type="text" value={editName} onChange={e => setEditName(e.target.value)}
                                  className="w-full bg-black border border-[#333] rounded px-2 py-1 text-white text-sm focus:border-[#555] focus:outline-none"
                                />
                              ) : r.name}
                            </td>
                            <td className="p-3 text-[#ccc]">
                              {isEditing ? (
                                <input 
                                  type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                                  className="w-full bg-black border border-[#333] rounded px-2 py-1 text-white text-sm focus:border-[#555] focus:outline-none"
                                  onKeyDown={e => { if (e.key === 'Enter') saveRecipientEdit(); if (e.key === 'Escape') setEditIndex(null); }}
                                />
                              ) : r.email}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
                                {r.status || 'pending'}
                              </span>
                              {r.error && <p className="text-red-400 text-xs mt-1">{r.error}</p>}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-end gap-1.5">
                                {isEditing ? (
                                  <>
                                    <button 
                                      onClick={saveRecipientEdit}
                                      className="p-1.5 rounded hover:bg-green-400/10 text-green-400 transition"
                                      title="Save"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => setEditIndex(null)}
                                      className="p-1.5 rounded hover:bg-[#222] text-[#888] transition"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => setPreviewIndex(i)}
                                      disabled={!event.hasTemplate}
                                      className="p-1.5 rounded hover:bg-[#222] text-[#888] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Preview PDF"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => startEdit(i)}
                                      className="p-1.5 rounded hover:bg-[#222] text-[#888] hover:text-white transition"
                                      title="Edit"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => removeRecipient(i)}
                                      className="p-1.5 rounded hover:bg-red-400/10 text-[#888] hover:text-red-400 transition"
                                      title="Remove"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Email Template</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#888] mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={event.emailSubject}
                    onChange={e => updateEmail(e.target.value, event.emailBody)}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-md p-2.5 text-white text-sm focus:border-[#444] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#888] mb-1">Body</label>
                  <textarea 
                    value={event.emailBody}
                    onChange={e => updateEmail(event.emailSubject, e.target.value)}
                    rows={8}
                    className="w-full bg-[#0a0a0a] border border-[#222] rounded-md p-2.5 text-white text-sm focus:border-[#444] focus:outline-none transition"
                  />
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 text-blue-300 p-4 rounded-md text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium mb-1">Variables available:</strong>
                    <p className="text-blue-300/80">Use <code>{'{name}'}</code> for recipient's name, and <code>{'{event}'}</code> for the event name.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div>
              <h2 className="text-lg font-medium mb-6">Validate & Send</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#222] rounded-lg p-6 bg-[#0a0a0a] flex flex-col">
                  <div className="mb-auto">
                    <h3 className="font-medium text-white mb-2">1. Validate Recipients</h3>
                    <p className="text-[#888] text-sm mb-6">
                      Check for font compatibility and prepare certificates for all {event.recipients.length} recipients.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={generateCertificates}
                      disabled={!event.hasTemplate || event.recipients.length === 0 || loading}
                      className="w-full bg-white text-black hover:bg-[#ccc] disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed px-4 py-2.5 rounded-md font-medium text-sm transition"
                    >
                      Validate {event.recipients.length} Recipients
                    </button>
                    {event.status === 'generated' && (
                      <p className="text-blue-400 mt-4 text-sm font-medium flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Validation Complete</p>
                    )}
                    {event.status === 'sent' && (
                      <p className="text-blue-400 mt-4 text-sm font-medium flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Validation Complete</p>
                    )}
                  </div>
                </div>

                <div className="border border-[#222] rounded-lg p-6 bg-[#0a0a0a] flex flex-col">
                  <div className="mb-auto">
                    <h3 className="font-medium text-white mb-2">2. Send Emails</h3>
                    <p className="text-[#888] text-sm mb-6">
                      Dispatch emails with generated certificates attached.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setIsSendModalOpen(true)}
                      disabled={(event.status !== 'generated' && event.status !== 'sent') || loading}
                      className="w-full bg-white text-black hover:bg-[#ccc] disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed px-4 py-2.5 rounded-md font-medium text-sm transition"
                    >
                      Send Emails
                    </button>
                    {event.status === 'sent' && (
                      <p className="text-green-400 mt-4 text-sm font-medium flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Emails Sent</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)}
        title="Send Emails"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#888]">
            Are you sure you want to send emails to all {event.recipients.length} recipients? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsSendModalOpen(false)}
              className="px-4 h-9 rounded-md text-sm text-[#888] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendEmails}
              disabled={loading}
              className="bg-white text-black px-4 h-9 rounded-md text-sm font-medium hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Emails'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={previewIndex !== null}
        onClose={() => setPreviewIndex(null)}
        title={previewIndex !== null && event.recipients[previewIndex] ? `Preview for ${event.recipients[previewIndex].name}` : 'Preview'}
      >
        {previewIndex !== null && (
          <PdfCanvasViewer src={`/api/events/${id}/certificate/${previewIndex}`} />
        )}
      </Modal>
    </div>
  );
}
