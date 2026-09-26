'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Calendar, Search, LayoutGrid, List, MoreVertical, Plus, ChevronDown } from 'lucide-react';
import { CertEvent } from '@/lib/types';
import { Modal } from '@/components/Modal';

const gradients = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-emerald-500',
  'from-indigo-500 to-violet-500',
  'from-amber-500 to-yellow-500',
];

export default function Dashboard() {
  const [events, setEvents] = useState<CertEvent[]>([]);
  const [search, setSearch] = useState('');
  
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

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
        router.push(`/events/${newEvent.id}`);
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
    <div className="max-w-7xl mx-auto text-white min-h-screen bg-black">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            type="text"
            placeholder="Search Events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-md py-2 pl-9 pr-10 text-sm focus:outline-none focus:border-[#444] transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded border border-[#222] bg-[#111] text-[10px] text-[#666]">
            /
          </div>
        </div>
        
        <button
          onClick={() => {
            setNewEventName('');
            setIsCreateEventModalOpen(true);
          }}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-[#ccc] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
          <ChevronDown className="w-4 h-4 text-black/50 ml-1" />
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="border border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center p-16 text-center max-w-2xl mx-auto mt-20">
          <Calendar className="w-12 h-12 text-[#444] mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No events yet</h3>
          <p className="text-[#888] text-sm mb-6">Create your first event to get started</p>
          <button
            onClick={() => {
              setNewEventName('');
              setIsCreateEventModalOpen(true);
            }}
            className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-[#ccc] transition-colors"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event, index) => {
            const gradient = gradients[index % gradients.length];
            
            let statusColor = "text-[#888] bg-[#111]";
            let statusDot = "bg-[#666]";
            if (event.status === 'configured') {
              statusColor = "text-yellow-400 bg-yellow-400/10";
              statusDot = "bg-yellow-400";
            } else if (event.status === 'generated') {
              statusColor = "text-blue-400 bg-blue-400/10";
              statusDot = "bg-blue-400";
            } else if (event.status === 'sent') {
              statusColor = "text-green-400 bg-green-400/10";
              statusDot = "bg-green-400";
            }

            return (
              <Link href={`/events/${event.id}`} key={event.id}>
                <div className="border border-[#222] rounded-lg p-4 hover:border-[#444] transition-colors group bg-black h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                          {event.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-sm">{event.name}</h3>
                          <p className="text-[#666] text-xs">{event.recipients?.length || 0} recipients</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteEventId(event.id);
                        }} 
                        className="opacity-0 group-hover:opacity-100 text-[#666] hover:text-white transition p-1 rounded-md hover:bg-[#222]"
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
                    <span className="text-[#666]">
                      {new Date(event.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
            <label className="text-[#888] text-xs mb-1.5 block" htmlFor="eventName">
              Event Name
            </label>
            <input
              id="eventName"
              type="text"
              placeholder="e.g. Summer Hackathon 2026"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              className="bg-black border border-[#333] rounded-md h-9 px-3 text-white text-sm focus:border-[#666] focus:outline-none w-full transition-colors"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreateEventModalOpen(false)}
              className="px-4 h-9 rounded-md text-sm text-[#888] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createEvent}
              disabled={isCreatingEvent || !newEventName.trim()}
              className="bg-white text-black px-4 h-9 rounded-md text-sm font-medium hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <p className="text-sm text-[#888]">
            Are you sure you want to delete this event? This action cannot be undone and will delete all associated recipients and files.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteEventId(null)}
              className="px-4 h-9 rounded-md text-sm text-[#888] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteEvent}
              disabled={isDeletingEvent}
              className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 h-9 rounded-md text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeletingEvent ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
