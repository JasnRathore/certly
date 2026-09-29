'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Shuffle } from 'lucide-react';
import { updateUser, deleteUserAccount } from '@/app/actions/user';
import { logout } from '@/app/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  createUserAvatarDataUri,
  type UserAvatarConfig,
  type UserAvatarStyle,
} from '@/lib/user-avatar';

type UserSettingsUser = {
  name?: string | null;
  email?: string | null;
  avatarConfig: UserAvatarConfig;
};

const avatarStyles: { id: UserAvatarStyle; label: string }[] = [
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'bottts', label: 'Bottts' },
  { id: 'clay', label: 'Clay' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'thumbs', label: 'Thumbs' },
];

const settingsTabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
] as const;

type SettingsTab = (typeof settingsTabs)[number]['id'];

export function UserSettingsForm({ user }: { user: UserSettingsUser }) {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [savedProfile, setSavedProfile] = useState(() => ({
    name: user.name || '',
    avatarConfig: { ...user.avatarConfig },
  }));
  const [name, setName] = useState(savedProfile.name);
  const [avatarConfig, setAvatarConfig] = useState(savedProfile.avatarConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const avatarPreview = useMemo(
    () => createUserAvatarDataUri(avatarConfig),
    [avatarConfig],
  );
  const hasProfileChanges =
    name !== savedProfile.name ||
    JSON.stringify(avatarConfig) !== JSON.stringify(savedProfile.avatarConfig);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    const profileToSave = {
      name: name.trim(),
      avatarConfig: { ...avatarConfig },
    };
    
    try {
      await updateUser(profileToSave);
      setName(profileToSave.name);
      setAvatarConfig(profileToSave.avatarConfig);
      setSavedProfile(profileToSave);
      setSaveMessage('Profile updated successfully.');
      router.refresh();
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Failed to update profile.');
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
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="User settings">
        {settingsTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`user-settings-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`user-settings-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => {
                const currentIndex = settingsTabs.findIndex(({ id }) => id === tab.id);
                let nextIndex = currentIndex;

                if (event.key === 'ArrowRight') {
                  nextIndex = (currentIndex + 1) % settingsTabs.length;
                } else if (event.key === 'ArrowLeft') {
                  nextIndex = (currentIndex - 1 + settingsTabs.length) % settingsTabs.length;
                } else if (event.key === 'Home') {
                  nextIndex = 0;
                } else if (event.key === 'End') {
                  nextIndex = settingsTabs.length - 1;
                } else {
                  return;
                }

                event.preventDefault();
                const nextTab = settingsTabs[nextIndex];
                setActiveTab(nextTab.id);
                document.getElementById(`user-settings-tab-${nextTab.id}`)?.focus();
              }}
              className={`inline-flex h-8 items-center rounded-md px-3 text-[13px] transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <section
        id="user-settings-panel-profile"
        role="tabpanel"
        aria-labelledby="user-settings-tab-profile"
        hidden={activeTab !== 'profile'}
        tabIndex={0}
        className="space-y-4"
      >
          <form onSubmit={handleSave} className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5">
          <section
            aria-labelledby="avatar-preview-heading"
            className="flex flex-row items-center gap-3 text-center"
          >
            <Avatar size="lg" className="size-24">
              <AvatarImage src={avatarPreview} alt={`${name || 'Your'} avatar preview`} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <p className="text-3xl font-medium text-foreground">{name.trim() || 'Your name'}</p>
          </section>

          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="name">Display Name</FieldLabel>
            <Input
              id="name"
              type="text" 
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 px-3 text-sm"
              placeholder="e.g. Jane Doe"
            />
            </Field>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Avatar style</p>
                <div className="grid grid-cols-5 gap-2">
                  {avatarStyles.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={avatarConfig.style === id}
                      data-selected={avatarConfig.style === id}
                      onClick={() => setAvatarConfig(current => ({ ...current, style: id }))}
                      className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-2 text-xs text-muted-foreground transition-colors hover:bg-muted data-[selected=true]:border-ring data-[selected=true]:text-foreground"
                    >
                      <Avatar>
                        <AvatarImage
                          src={createUserAvatarDataUri({ ...avatarConfig, style: id })}
                          alt=""
                        />
                        <AvatarFallback>{label.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-1">
                <Field>
                  <FieldLabel>Background color</FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="w-fit justify-start gap-2 p-0 overflow-hidden"
                          aria-label={`Choose avatar background color, currently ${avatarConfig.backgroundColor}`}
                        />
                      }
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 w-full h-full bg-(--avatar-background)"
                        style={
                          {
                            '--avatar-background': avatarConfig.backgroundColor,
                          } as React.CSSProperties
                        }
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="bottom"
                      sideOffset={6}
                      className="w-fit gap-0 p-0"
                    >
                      <div className="flex justify-center">
                        <ColorPicker
                          value={avatarConfig.backgroundColor}
                          onValueChange={(backgroundColor) =>
                            setAvatarConfig(current => ({ ...current, backgroundColor }))
                          }
                          format="hex"
                          presets="tailwind"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </Field>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAvatarConfig(current => ({ ...current, seed: crypto.randomUUID().slice(0, 8) }))}
              >
                <Shuffle data-icon="inline-start" />
                Shuffle avatar
              </Button>
          </FieldGroup>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span aria-live="polite" className="text-sm text-muted-foreground">{saveMessage}</span>
            {hasProfileChanges && (
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => {
                  setName(savedProfile.name);
                  setAvatarConfig({ ...savedProfile.avatarConfig });
                  setSaveMessage('');
                }}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSaving || !hasProfileChanges || !name.trim() || !avatarConfig.seed.trim()}>
              {isSaving && <Loader2 data-icon="inline-start" className="animate-spin" />}
              Save Changes
            </Button>
          </div>
          </form>
      </section>

      <section
        id="user-settings-panel-account"
        role="tabpanel"
        aria-labelledby="user-settings-tab-account"
        hidden={activeTab !== 'account'}
        tabIndex={0}
        className="space-y-4"
      >
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="h-9 px-3 text-sm"
              />
              <FieldDescription>Your email address is used for sign-in and cannot be changed.</FieldDescription>
            </Field>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground">Google</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Connected as {user.email}</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Disconnect
              </Button>
            </div>
          </div>

          <section className="space-y-4 border-t border-border pt-4">
            <div>
              <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="size-4" />
                Danger Zone
              </h3>
              <p className="text-xs text-muted-foreground">Irreversible and destructive actions.</p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-5">
              <div>
                <h4 className="text-sm font-medium text-foreground">Delete Account</h4>
                <p className="mt-1 max-w-md text-xs text-muted-foreground">
                  Permanently remove your personal account and all of its contents from our platform. This action is not reversible.
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="shrink-0"
              >
                {isDeleting && <Loader2 data-icon="inline-start" className="animate-spin" />}
                Delete Account
              </Button>
            </div>
          </section>
      </section>
    </div>
  );
}
