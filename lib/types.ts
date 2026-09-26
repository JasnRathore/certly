export interface TextConfig {
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export interface CertEvent {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'draft' | 'configured' | 'generated' | 'sent';
  emailSubject: string;
  emailBody: string;
  textConfig: TextConfig;
  recipients: Recipient[];
  hasTemplate: boolean;
  templateWidth?: number | null;
  templateHeight?: number | null;
}

export interface Recipient {
  name: string;
  email: string;
  status: 'pending' | 'generated' | 'sent' | 'failed';
  error?: string | null;
}

export const AVAILABLE_FONTS = [
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Helvetica Bold', value: 'Helvetica-Bold' },
  { label: 'Times Roman', value: 'TimesRoman' },
  { label: 'Times Roman Bold', value: 'TimesRoman-Bold' },
  { label: 'Courier', value: 'Courier' },
  { label: 'Courier Bold', value: 'Courier-Bold' },
] as const;

export const DEFAULT_TEXT_CONFIG: TextConfig = {
  x: 50,
  y: 50,
  fontSize: 36,
  fontFamily: 'Helvetica',
  color: '#000000',
};

export const DEFAULT_EMAIL_SUBJECT = "Your Certificate - {event}";
export const DEFAULT_EMAIL_BODY = "Dear {name},\n\nPlease find your certificate for {event} attached to this email.\n\nBest regards";
