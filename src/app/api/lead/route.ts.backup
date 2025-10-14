import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@/generated/prisma';
import { isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import dns from 'dns/promises';
import { RU_CITIES } from '@/data/cities';
import { hasProfanity } from '@/utils/profanity';

const prisma = new PrismaClient();

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
  if (BAD_DOMAIN_PARTS.some((p) => dLower.includes(p))) return false;
  try {
    const mx = await dns.resolveMx(domain);
    // Строго: принимаем только если MX есть
    return Array.isArray(mx) && mx.length > 0;
  } catch {}
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const ua = req.headers.get('user-agent') || '';
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'VALIDATION', details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    // City strict check and profanity filter
    if (!RU_CITIES.includes(data.city) || hasProfanity(data.city)) {
      return NextResponse.json({ ok: false, error: 'CITY_INVALID' }, { status: 400 });
    }

    // Verify reCAPTCHA v3 if provided
    if (process.env.RECAPTCHA_SECRET && data.recaptchaToken) {
      try {
        const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET, response: data.recaptchaToken }).toString(),
        });
        const ver = await resp.json();
        if (!ver.success || (typeof ver.score === 'number' && ver.score < 0.5)) {
          return NextResponse.json({ ok: false, error: 'RECAPTCHA' }, { status: 400 });
        }
      } catch {}
    }
    // DNS check for email (strict)
    const emailOk = await verifyEmailMxIfNeeded(data.contact);
    if (!emailOk) {
      return NextResponse.json({ ok: false, error: 'EMAIL_MX' }, { status: 400 });
    }

    const saved = await prisma.lead.create({
      data: {
        eventType: data.eventType,
        city: data.city,
        guestsBucket: data.guestsBucket,
        contactKind: data.contact.kind,
        contactValue: data.contact.value,
        callbackType: data.callback.type,
        callbackAtUtc: data.callback.atUtc ? new Date(data.callback.atUtc) : null,
        utm: data.utm || null,
        userAgent: ua,
        ipHash: ip ? await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip)).then((buf) => Buffer.from(buf).toString('hex')) : null,
      },
    });

    // Fire-and-forget notifications/copies
    notifyTelegram(saved).catch(() => {});
    copyToGoogleSheet(saved).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'SERVER' }, { status: 500 });
  }
}

function humanizeEventType(code: string): string {
  return code === 'corporate' ? 'Корпоратив' : 'Тимбилдинг';
}

function humanizeGuestsBucket(code: string): string {
  switch (code) {
    case 'lt20':
      return '<20';
    case '20_50':
      return '20–50';
    case '50_200':
      return '50–200';
    case '200_500':
      return '200–500';
    case '500p':
      return '500+';
    default:
      return code;
  }
}

function humanizeContact(kind: string): string {
  if (kind === 'phone') return 'Телефон';
  if (kind === 'telegram') return 'Telegram';
  if (kind === 'email') return 'Email';
  return kind;
}

function humanizeCallback(type: string, at?: any): string {
  if (type === 'asap') return 'как можно скорее';
  if (type === 'slot' && at) {
    try {
      const dt = new Date(at);
      return `к ${dt.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' })} ${dt.toLocaleDateString('ru-RU')}`;
    } catch {
      return 'к указанному времени';
    }
  }
  return type;
}

async function notifyTelegram(lead: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const text = [
    '🆕 Заявка',
    `Тип: ${humanizeEventType(lead.eventType)}`,
    `Город: ${lead.city}`,
    `Гостей: ${humanizeGuestsBucket(lead.guestsBucket)}`,
    `Контакт: ${humanizeContact(lead.contactKind)} — ${lead.contactValue}`,
    `Связаться: ${humanizeCallback(lead.callbackType, lead.callbackAtUtc)}`,
  ].join('\n');
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function copyToGoogleSheet(lead: any) {
  const creds = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = process.env.SHEETS_SPREADSHEET_ID;
  if (!creds || !sheetId) return;
  const { google } = await import('googleapis');
  const auth = new google.auth.JWT({
    email: JSON.parse(creds).client_email,
    key: JSON.parse(creds).private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Заявки!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [
          new Date(lead.createdAt).toLocaleString('ru-RU'),
          humanizeEventType(lead.eventType),
          lead.city,
          humanizeGuestsBucket(lead.guestsBucket),
          humanizeContact(lead.contactKind),
          lead.contactValue,
          humanizeCallback(lead.callbackType, lead.callbackAtUtc),
          lead.callbackAtUtc ? new Date(lead.callbackAtUtc).toLocaleString('ru-RU') : '',
          lead.utm || '',
        ],
      ],
    },
  });
}


