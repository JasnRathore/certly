'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { CertEvent, TextConfig, AVAILABLE_FONTS } from '@/lib/types';
import { PdfPreview } from '@/components/PdfPreview';
import { PdfCanvasViewer } from '@/components/PdfCanvasViewer';
import { Modal } from '@/components/Modal';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Upload, Mail, Settings, Users, FileText, CheckCircle2, AlertCircle, Eye, Plus, Pencil, Trash2, Check, X } from 'lucide-react';

type EventTab = 'template' | 'design' | 'recipients' | 'email' | 'actions';

export default function EventDetailWorkspace({ eventId: id }: { eventId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<CertEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<EventTab>('template');
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
        if (data.error) router.push('/dashboard');
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

  if (loading && !event) return <div className="min-h-screen p-10 text-muted-foreground">Loading...</div>;
  if (!event) return <div className="min-h-screen p-10 text-muted-foreground">Event not found</div>;

  return (
    <div className="mx-auto min-h-full max-w-6xl pb-20 text-foreground">
      <nav
        aria-label="Event setup"
        role="tablist"
        className="mb-4 flex gap-1 overflow-x-auto pb-2"
      >
        {([
          { id: 'template', label: 'Template', icon: FileText },
          { id: 'design', label: 'Design', icon: Settings },
          { id: 'recipients', label: 'Recipients', icon: Users },
          { id: 'email', label: 'Email Setup', icon: Mail },
          { id: 'actions', label: 'Generate & Send', icon: CheckCircle2 },
        ] satisfies { id: EventTab; label: string; icon: typeof FileText }[]).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <section
        role="tabpanel"
        className="min-h-[600px] rounded-lg border border-border bg-card p-4 sm:p-5"
      >
          {activeTab === 'template' && (
            <div>
              <div className="relative cursor-pointer rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center transition hover:border-ring">
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleTemplateUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto mb-4 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag and drop or click to upload PDF</p>
                {event.hasTemplate && (
                  <p className="mx-auto mt-4 flex w-max items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    <CheckCircle2 className="w-4 h-4" /> Template uploaded successfully
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div>
              {!event.hasTemplate ? (
                <p className="text-sm text-destructive">Please upload a template first.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col gap-5">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">X Position (%)</label>
                      <input 
                        type="range" min="0" max="100" 
                        value={event.textConfig.x}
                        onChange={e => updateConfig({...event.textConfig, x: Number(e.target.value)})}
                        className="w-full accent-white"
                      />
                      <div className="mt-1 text-right text-xs text-muted-foreground">{event.textConfig.x}%</div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Y Position (%)</label>
                      <input 
                        type="range" min="0" max="100" 
                        value={event.textConfig.y}
                        onChange={e => updateConfig({...event.textConfig, y: Number(e.target.value)})}
                        className="w-full accent-white"
                      />
                      <div className="mt-1 text-right text-xs text-muted-foreground">{event.textConfig.y}%</div>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Font Size</label>
                      <Input 
                        type="number"
                        value={event.textConfig.fontSize}
                        onChange={e => updateConfig({...event.textConfig, fontSize: Number(e.target.value)})}
                        className="w-full px-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Font Family</label>
                      <Combobox
                        items={AVAILABLE_FONTS.map(font => font.value)}
                        value={event.textConfig.fontFamily}
                        itemToStringLabel={value => AVAILABLE_FONTS.find(font => font.value === value)?.label ?? value}
                        onValueChange={fontFamily => {
                          if (fontFamily !== null) {
                            updateConfig({ ...event.textConfig, fontFamily });
                          }
                        }}
                      >
                        <ComboboxInput
                          aria-label="Font family"
                          placeholder="Select font"
                          className="w-full"
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No fonts found.</ComboboxEmpty>
                          <ComboboxList>
                            {(font) => (
                              <ComboboxItem key={font} value={font}>
                                {AVAILABLE_FONTS.find(option => option.value === font)?.label ?? font}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Color (Hex)</label>
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              className="size-10 overflow-hidden p-0"
                              aria-label={`Choose text color, currently ${event.textConfig.color}`}
                            />
                          }
                        >
                          <span
                            aria-hidden="true"
                            className="size-full bg-(--event-text-color)"
                            style={
                              {
                                '--event-text-color': event.textConfig.color,
                              } as CSSProperties
                            }
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          side="bottom"
                          sideOffset={6}
                          className="w-fit gap-0 p-0"
                        >
                          <ColorPicker
                            value={event.textConfig.color}
                            onValueChange={color =>
                              updateConfig({ ...event.textConfig, color })
                            }
                            format="hex"
                            presets="tailwind"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center overflow-hidden rounded-md border border-border bg-muted/50 p-4 lg:col-span-2">
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
                  <label htmlFor="csv-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                    <Upload className="w-4 h-4" /> Upload CSV
                  </label>
                </div>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">CSV must contain &quot;name&quot; and &quot;email&quot; columns.</p>

              <form onSubmit={addManualRecipient} className="mb-6 flex items-end gap-3 ">
                <div className="flex-1">
                  <Input 
                    type="text" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="h-[38px] w-full px-2 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    type="email" 
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="h-[38px] w-full px-2 text-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newName || !newEmail}
                  className="inline-flex h-[38px] items-center gap-2 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-muted text-muted-foreground">
                    <tr>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Email</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.recipients.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No recipients uploaded yet.</td></tr>
                    ) : (
                      event.recipients.map((r, i) => {
                        let statusBadge = 'bg-muted text-muted-foreground';
                        let dot = 'bg-muted-foreground';
                        if (r.status === 'sent') {
                          statusBadge = 'bg-primary/10 text-primary';
                          dot = 'bg-primary';
                        } else if (r.status === 'generated') {
                          statusBadge = 'bg-secondary text-secondary-foreground';
                          dot = 'bg-secondary-foreground';
                        } else if (r.status === 'failed') {
                          statusBadge = 'bg-destructive/10 text-destructive';
                          dot = 'bg-destructive';
                        }
                        
                        const isEditing = editIndex === i;

                        return (
                          <tr key={i} className="border-b border-border last:border-b-0">
                            <td className="p-3 text-card-foreground">
                              {isEditing ? (
                                <Input 
                                  type="text" value={editName} onChange={e => setEditName(e.target.value)}
                                  className="h-8 w-full px-2 text-sm"
                                />
                              ) : r.name}
                            </td>
                            <td className="p-3 text-card-foreground">
                              {isEditing ? (
                                <Input 
                                  type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                                  className="h-8 w-full px-2 text-sm"
                                  onKeyDown={e => { if (e.key === 'Enter') saveRecipientEdit(); if (e.key === 'Escape') setEditIndex(null); }}
                                />
                              ) : r.email}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium capitalize ${statusBadge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
                                {r.status || 'pending'}
                              </span>
                              {r.error && <p className="mt-1 text-xs text-destructive">{r.error}</p>}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-end gap-1.5">
                                {isEditing ? (
                                  <>
                                    <button 
                                      onClick={saveRecipientEdit}
                                      className="rounded p-1.5 text-primary transition hover:bg-primary/10"
                                      title="Save"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => setEditIndex(null)}
                                      className="rounded p-1.5 text-muted-foreground transition hover:bg-muted"
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
                                      className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                      title="Preview PDF"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => startEdit(i)}
                                      className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                      title="Edit"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => removeRecipient(i)}
                                      className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
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
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Subject</label>
                  <Input 
                    type="text" 
                    value={event.emailSubject}
                    onChange={e => updateEmail(e.target.value, event.emailBody)}
                    className="w-full px-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Body</label>
                  <textarea 
                    value={event.emailBody}
                    onChange={e => updateEmail(event.emailSubject, e.target.value)}
                    rows={8}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-sm text-foreground outline-none transition focus:border-ring"
                  />
                </div>
                <div className="flex items-start gap-3 rounded-md border border-secondary bg-secondary/30 p-4 text-sm text-secondary-foreground">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium mb-1">Variables available:</strong>
                    <p className="opacity-80">Use <code>{'{name}'}</code> for recipient&apos;s name, and <code>{'{event}'}</code> for the event name.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div>
              <h2 className="text-lg font-medium mb-6">Validate & Send</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col rounded-lg border border-border bg-muted/50 p-6">
                  <div className="mb-auto">
                    <h3 className="mb-2 font-medium text-foreground">1. Validate Recipients</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Check for font compatibility and prepare certificates for all {event.recipients.length} recipients.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={generateCertificates}
                      disabled={!event.hasTemplate || event.recipients.length === 0 || loading}
                      className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Validate {event.recipients.length} Recipients
                    </button>
                    {event.status === 'generated' && (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-secondary-foreground"><CheckCircle2 className="h-4 w-4"/> Validation Complete</p>
                    )}
                    {event.status === 'sent' && (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-secondary-foreground"><CheckCircle2 className="h-4 w-4"/> Validation Complete</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col rounded-lg border border-border bg-muted/50 p-6">
                  <div className="mb-auto">
                    <h3 className="mb-2 font-medium text-foreground">2. Send Emails</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Dispatch emails with generated certificates attached.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setIsSendModalOpen(true)}
                      disabled={(event.status !== 'generated' && event.status !== 'sent') || loading}
                      className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send Emails
                    </button>
                    {event.status === 'sent' && (
                      <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-primary"><CheckCircle2 className="h-4 w-4"/> Emails Sent</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </section>

      <Modal 
        isOpen={isSendModalOpen} 
        onClose={() => setIsSendModalOpen(false)}
        title="Send Emails"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to send emails to all {event.recipients.length} recipients? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsSendModalOpen(false)}
              className="h-9 rounded-md px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={sendEmails}
              disabled={loading}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
