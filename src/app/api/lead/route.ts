import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import dns from 'dns/promises';
import { RU_CITIES } from '@/data/cities';
import { hasProfanity } from '@/utils/profanity';

const contactSchema = z.string().min(3).max(128).transform((raw) => {
  const value = raw.trim();
  if (value.includes('@') && value.includes('.')) {
    return { kind: 'email' as const, value };
  }
  const digits = value.replace(/[^0-9+]/g, '');
  if (/^[+0-9]/.test(value) && digits.length >= 10) {
    try {
      const phone = parsePhoneNumber(digits, 'RU');
      if (phone && isPossiblePhoneNumber(phone.number)) {
        return { kind: 'phone' as const, value: phone.number };
      }
    } catch {}
  }
  if (/^@?[A-Za-z0-9][A-Za-z0-9_]{3,30}[A-Za-z0-9]$/.test(value)) {
    const username = value.startsWith('@') ? value : `@${value}`;
    return { kind: 'telegram' as const, value: username };
  }
  throw new Error('INVALID_CONTACT');
});

const leadSchema = z.object({
  eventType: z.enum(['corporate', 'teambuilding']),
  city: z.string().min(2).max(64),
  guestsBucket: z.enum(['lt20', '20_50', '50_200', '200_500', '500p']),
  contact: contactSchema,
  callback: z
    .object({ type: z.enum(['asap', 'slot']), atUtc: z.string().datetime().optional() })
    .refine((v) => (v.type === 'slot' ? Boolean(v.atUtc) : true), 'slot time required'),
  utm: z.string().optional(),
  recaptchaToken: z.string().optional(),
});

const BAD_DOMAIN_PARTS = ['fuck','sex','porn','huy','hui','xuy','pizd','pidor','ebal','suka','govn','derm'];

async function verifyEmailMxIfNeeded(contact: { kind: string; value: string }) {
  if (contact.kind !== 'email') return true;
  const domain = contact.value.split('@')[1];
  if (!domain) return false;
  const dLower = domain.toLowerCase();
  
  // Check for profanity in domain
  if (hasProfanity(dLower)) return false;
  
  // Check for bad domain parts
  if (BAD_DOMAIN_PARTS.some(part => dLower.includes(part))) return false;
  
  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch {
    return false;
  }
}

function humanizeEventType(type: string): string {
  return type === 'corporate' ? 'Корпоратив' : 'Тимбилдинг';
}

function humanizeGuestsBucket(bucket: string): string {
  const map: Record<string, string> = {
    'lt20': '<20',
    '20_50': '20-50',
    '50_200': '50-200',
    '200_500': '200-500',
    '500p': '500+'
  };
  return map[bucket] || bucket;
}

function humanizeContact(contact: { kind: string; value: string }): string {
  const kindMap: Record<string, string> = {
    'email': 'Email',
    'phone': 'Телефон',
    'telegram': 'Telegram'
  };
  return `${kindMap[contact.kind] || contact.kind} — ${contact.value}`;
}

function humanizeCallback(callback: { type: string; atUtc?: string }): string {
  if (callback.type === 'asap') return 'как можно скорее';
  if (callback.atUtc) {
    const date = new Date(callback.atUtc);
    return date.toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return 'не указано';
}

async function notifyTelegram(data: Record<string, unknown>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured');
    return;
  }

  const message = `🆕 Заявка
Тип: ${humanizeEventType(data.eventType)}
Город: ${data.city}
Гостей: ${humanizeGuestsBucket(data.guestsBucket)}
Контакт: ${humanizeContact(data.contact)}
Связаться: ${humanizeCallback(data.callback)}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    if (!response.ok) {
      console.error('Telegram notification failed:', await response.text());
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

async function copyToGoogleSheet(data: Record<string, unknown>) {
  const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  
  if (!spreadsheetId || !serviceAccountJson) {
    console.error('Google Sheets credentials not configured');
    return;
  }

  try {
    const { google } = await import('googleapis');
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    const values = [
      [
        new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
        humanizeEventType(data.eventType),
        data.city,
        humanizeGuestsBucket(data.guestsBucket),
        data.contact.kind,
        data.contact.value,
        humanizeCallback(data.callback),
        data.utm || '',
        data.userAgent || '',
        data.ipHash || ''
      ]
    ];
    
    console.log('Google Sheets values:', JSON.stringify(values, null, 2));
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Заявки!A:J',
      valueInputOption: 'RAW',
      requestBody: { values }
    });
  } catch (error) {
    console.error('Google Sheets error:', error);
  }
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // Skip if not configured
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`
    });
    
    const data = await response.json();
    return data.success && data.score > 0.5;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received data:', JSON.stringify(body, null, 2));
    
    // Validate city
    if (!RU_CITIES.includes(body.city)) {
      return NextResponse.json(
        { error: 'INVALID_CITY' },
        { status: 400 }
      );
    }
    
    // Parse and validate data
    const data = leadSchema.parse(body);
    
    // Verify reCAPTCHA
    if (data.recaptchaToken && !(await verifyRecaptcha(data.recaptchaToken))) {
      return NextResponse.json(
        { error: 'RECAPTCHA_FAILED' },
        { status: 400 }
      );
    }
    
    // Verify email domain
    if (!(await verifyEmailMxIfNeeded(data.contact))) {
      return NextResponse.json(
        { error: 'INVALID_EMAIL_DOMAIN' },
        { status: 400 }
      );
    }
    
    // Get additional data
    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : '';
    
    const leadData = {
      ...data,
      userAgent,
      ipHash
    };
    
    // Send notifications (parallel)
    await Promise.all([
      notifyTelegram(leadData),
      copyToGoogleSheet(leadData)
    ]);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Lead submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}