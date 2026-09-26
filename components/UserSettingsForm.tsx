'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { updateUser, deleteUserAccount } from '@/app/actions/user';
import { logout } from '@/app/actions/auth';

export function UserSettingsForm({ user }: { user: any }) {
  const router = useRouter();
  
  const [name, setName] = useState(user.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await updateUser({ name });
      setSaveMessage('Profile updated successfully.');
      router.refresh();
    } catch (error) {
      setSaveMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and you will lose access to all your organizations.'
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteUserAccount();
      await logout();
    } catch (error) {
      alert('Failed to delete account.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-white mb-1">Profile</h2>
          <p className="text-[#888] text-sm">Update your personal information.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 bg-[#0a0a0a] border border-[#222] p-5 rounded-lg">
          <div>
            <label className="block text-sm text-[#888] mb-1.5" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              value={user.email || ''} 
              disabled 
              className="w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-[#666] text-sm cursor-not-allowed"
            />
            <p className="text-[#666] text-xs mt-1.5">Your email address is used for sign-in and cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm text-[#888] mb-1.5" htmlFor="name">Display Name</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-[#333] rounded-md h-9 px-3 text-white text-sm focus:border-[#666] focus:outline-none transition-colors"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-green-400 text-sm">{saveMessage}</span>
            <button 
              type="submit" 
              disabled={isSaving || name === user.name}
              className="bg-white text-black px-4 h-9 rounded-md text-sm font-medium hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* OAuth Connections Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-white mb-1">Connected Accounts</h2>
          <p className="text-[#888] text-sm">Manage your OAuth connections.</p>
        </div>
        
        <div className="bg-[#0a0a0a] border border-[#222] p-5 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Google</p>
            <p className="text-[#888] text-xs mt-0.5">Connected as {user.email}</p>
          </div>
          <button disabled className="text-sm text-[#666] cursor-not-allowed border border-[#333] px-3 py-1.5 rounded-md">
            Disconnect
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-4 pt-4 border-t border-[#222]">
        <div>
          <h2 className="text-lg font-medium text-red-400 mb-1 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-[#888] text-sm">Irreversible and destructive actions.</p>
        </div>

        <div className="bg-[#1a0f0f] border border-[#4a1c1c] p-5 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium text-sm">Delete Account</h3>
            <p className="text-[#888] text-xs mt-1 max-w-md">
              Permanently remove your personal account and all of its contents from our platform. This action is not reversible.
            </p>
          </div>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-4 h-9 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shrink-0"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
