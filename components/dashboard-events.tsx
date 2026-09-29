'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Search, MoreVertical, Plus, ChevronDown } from 'lucide-react';
import { CertEvent } from '@/lib/types';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function DashboardEvents() {
  const [events, setEvents] = useState<CertEvent[]>([]);
  const [search, setSearch] = useState('');
  
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/events')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load events (${res.status})`);
        }
        return res.json();
      })
      .then((data: CertEvent[]) => {
        if (!cancelled) setEvents(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch events:', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const createEvent = async () => {
    if (!newEventName.trim() || isCreatingEvent) return;
    
    setIsCreatingEvent(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEventName.trim() }),
      });
      if (res.ok) {
        const newEvent = await res.json();
        router.push(`/dashboard?section=event&eventId=${encodeURIComponent(newEvent.id)}`);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      setIsCreatingEvent(false);
    }
  };

  const deleteEvent = async () => {
    if (!deleteEventId) return;
    setIsDeletingEvent(true);
    
    try {
      const res = await fetch(`/api/events/${deleteEventId}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(events.filter((ev) => ev.id !== deleteEventId));
        setDeleteEventId(null);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setIsDeletingEvent(false);
    }
  };

  const filteredEvents = events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto min-h-full max-w-7xl text-foreground">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg bg-card py-2 pl-9 pr-10 text-sm"
          />
          <div className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded border border-border bg-muted text-[10px] text-muted-foreground">
            /
          </div>
        </div>
        
        <button
          onClick={() => {
            setNewEventName('');
            setIsCreateEventModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
          <ChevronDown className="ml-1 h-4 w-4 opacity-60" />
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="mx-auto mt-20 flex max-w-2xl flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium text-foreground">No events yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">Create your first event to get started</p>
          <button
            onClick={() => {
              setNewEventName('');
              setIsCreateEventModalOpen(true);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            let statusColor = "bg-muted text-muted-foreground";
            let statusDot = "bg-muted-foreground";
            if (event.status === 'configured') {
              statusColor = "bg-secondary text-secondary-foreground";
              statusDot = "bg-primary";
            } else if (event.status === 'generated') {
              statusColor = "bg-accent text-accent-foreground";
              statusDot = "bg-accent-foreground";
            } else if (event.status === 'sent') {
              statusColor = "bg-primary text-primary-foreground";
              statusDot = "bg-primary-foreground";
            }

            return (
              <Link
                href={`/dashboard?section=event&eventId=${encodeURIComponent(event.id)}`}
                key={event.id}
              >
                <div className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring">
                  <div>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={event.avatar}
                          alt=""
                          aria-hidden="true"
                          width={36}
                          height={36}
                          unoptimized
                          className="size-9 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-card-foreground">{event.name}</h3>
                          <p className="text-xs text-muted-foreground">{event.recipients?.length || 0} recipients</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteEventId(event.id);
                        }} 
                        className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-4">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full capitalize font-medium ${statusColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                      {event.status}
                    </span>
                    <span className="text-muted-foreground">
                      {event.createdAt
                        ? new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal 
        isOpen={isCreateEventModalOpen} 
        onClose={() => setIsCreateEventModalOpen(false)}
        title="Create Event"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground" htmlFor="eventName">
              Event Name
            </label>
            <Input
              id="eventName"
              type="text"
              placeholder="e.g. Summer Hackathon 2026"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              className="h-9 w-full px-3 text-sm"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreateEventModalOpen(false)}
              className="h-9 rounded-md px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={createEvent}
              disabled={isCreatingEvent || !newEventName.trim()}
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingEvent ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={!!deleteEventId} 
        onClose={() => setDeleteEventId(null)}
        title="Delete Event"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this event? This action cannot be undone and will delete all associated recipients and files.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteEventId(null)}
              className="h-9 rounded-md px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={deleteEvent}
              disabled={isDeletingEvent}
              className="h-9 rounded-md border border-destructive/20 bg-destructive/10 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeletingEvent ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
