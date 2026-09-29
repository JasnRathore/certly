CREATE TABLE IF NOT EXISTS Organization (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gmailAddress TEXT,
  gmailAppPassword TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS OrganizationAvatar (
  orgId TEXT PRIMARY KEY,
  config TEXT NOT NULL,
  FOREIGN KEY (orgId) REFERENCES Organization(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS UserAvatar (
  userId TEXT PRIMARY KEY,
  config TEXT NOT NULL,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OrgMembership (
  id TEXT PRIMARY KEY,
  role TEXT DEFAULT 'MEMBER',
  userId TEXT NOT NULL,
  orgId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  FOREIGN KEY (orgId) REFERENCES Organization(id) ON DELETE CASCADE,
  UNIQUE(userId, orgId)
);

CREATE TABLE IF NOT EXISTS Event (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  emailSubject TEXT DEFAULT 'Your Certificate - {event}',
  emailBody TEXT DEFAULT 'Dear {name},\n\nPlease find your certificate for {event} attached to this email.\n\nBest regards',
  textConfig TEXT NOT NULL,
  hasTemplate BOOLEAN DEFAULT 0,
  templateWidth REAL,
  templateHeight REAL,
  orgId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orgId) REFERENCES Organization(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS EventAvatar (
  eventId TEXT PRIMARY KEY,
  config TEXT NOT NULL,
  FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Recipient (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  error TEXT,
  eventId TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (eventId) REFERENCES Event(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OTP (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expiresAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS PasswordResetToken (
  tokenHash TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  expiresAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OrgInvite (
  id TEXT PRIMARY KEY,
  orgId TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  token TEXT NOT NULL UNIQUE,
  invitedBy TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  expiresAt DATETIME NOT NULL,
  acceptedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orgId) REFERENCES Organization(id) ON DELETE CASCADE,
  FOREIGN KEY (invitedBy) REFERENCES User(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_org_invite_email_status ON OrgInvite (email, status);
CREATE INDEX IF NOT EXISTS idx_org_invite_org_status ON OrgInvite (orgId, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_invite_one_pending
  ON OrgInvite (orgId, email)
  WHERE status = 'PENDING';
