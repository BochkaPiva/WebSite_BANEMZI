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
  
  // Нормализуем номер телефона для России
  let digits = value.replace(/[^0-9+]/g, '');
  
  // Если номер начинается с 8, заменяем на +7
  if (digits.startsWith('8') && digits.length === 11) {
    digits = '+7' + digits.substring(1);
  }
  // Если номер начинается с 7 без +, добавляем +
  else if (digits.startsWith('7') && digits.length === 11) {
    digits = '+' + digits;
  }
  
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
  eventType: z.enum(['corporate', 'teambuilding', 'presentation', 'promo', 'business']),
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
  const map: Record<string, string> = {
    'corporate': 'Корпоративные праздники',
    'teambuilding': 'Тимбилдинги и квесты',
    'presentation': 'Презентации и запуски',
    'promo': 'Промо-мероприятия',
    'business': 'Деловые события'
  };
  return map[type] || type;
}

function humanizeGuestsBucket(bucket: string): string {
  const map: Record<string, string> = {
    'lt20': 'до 20',
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
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const topicId = process.env.TELEGRAM_TOPIC_ID; // ID топика для заявок
    
    console.log('=== TELEGRAM NOTIFICATION START ===');
    console.log('Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      botTokenExists: !!botToken,
      botTokenLength: botToken ? botToken.length : 0,
      chatIdExists: !!chatId,
      chatIdValue: chatId,
      topicIdExists: !!topicId,
      topicIdValue: topicId,
      topicIdType: typeof topicId,
      topicIdParsed: topicId ? parseInt(topicId) : null
    });
    
    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      return;
    }

    const message = `🆕 Заявка
Тип: ${humanizeEventType(data.eventType as string)}
Город: ${data.city}
Гостей: ${humanizeGuestsBucket(data.guestsBucket as string)}
Контакт: ${humanizeContact(data.contact as { kind: string; value: string })}
Связаться: ${humanizeCallback(data.callback as { type: string; atUtc?: string })}`;

    console.log('Telegram message:', message);

    const requestBody: any = {
      chat_id: chatId,
      text: message
      // Убираем parse_mode: 'HTML' чтобы избежать ошибок парсинга
    };

    // Если указан ID топика, отправляем в топик
    if (topicId) {
      requestBody.message_thread_id = parseInt(topicId);
      console.log('Sending to topic:', topicId, 'parsed:', parseInt(topicId));
    } else {
      console.log('No topic ID provided, sending to general chat');
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('Telegram API URL:', telegramUrl.replace(botToken, 'BOT_TOKEN_HIDDEN'));
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    // Test Telegram API connectivity first
    try {
      const testResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
        method: 'GET'
      });
      const testResult = await testResponse.text();
      console.log('Telegram bot test:', testResponse.status, testResult);
    } catch (testError) {
      console.error('Telegram bot test failed:', testError);
    }
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    const responseText = await response.text();
    console.log('Telegram response:', response.status, responseText);
    
    if (!response.ok) {
      console.error('Telegram notification failed:', responseText);
    } else {
      console.log('Telegram notification sent successfully');
    }
    
    console.log('=== TELEGRAM NOTIFICATION END ===');
  } catch (error) {
    console.error('Telegram notification error:', error);
    throw error; // Re-throw to be caught by Promise.allSettled
  }
}

async function copyToGoogleSheet(data: Record<string, unknown>) {
  try {
    const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    
    if (!spreadsheetId || !serviceAccountJson) {
      console.error('Google Sheets credentials not configured');
      return;
    }
    const { google } = await import('googleapis');
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    const values = [
      [
        new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }), // A: Время
        humanizeEventType(data.eventType as string), // B: Тип мероприятия
        data.city as string, // C: Город
        humanizeGuestsBucket(data.guestsBucket as string), // D: Кол-во человек
        (data.contact as { kind: string; value: string }).kind, // E: Тип связи
        (data.contact as { kind: string; value: string }).value, // F: Контакт
        humanizeCallback(data.callback as { type: string; atUtc?: string }) // G: Желаемое время
      ]
    ];
    
    console.log('Google Sheets values:', JSON.stringify(values, null, 2));
    
    // Сначала получаем все данные, чтобы найти первую пустую строку
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Заявки!A:G'
    });
    
    const existingData = response.data.values || [];
    const nextRow = existingData.length + 1;
    
    // Добавляем данные в конкретную строку
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Заявки!A${nextRow}:G${nextRow}`,
      valueInputOption: 'RAW',
      requestBody: { values }
    });
  } catch (error) {
    console.error('Google Sheets error:', error);
    throw error; // Re-throw to be caught by Promise.allSettled
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
    console.log('=== LEAD API DEBUG ===');
    console.log('Received data:', JSON.stringify(body, null, 2));
    console.log('Environment check:', {
      hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChatId: !!process.env.TELEGRAM_CHAT_ID,
      hasTopicId: !!process.env.TELEGRAM_TOPIC_ID,
      topicIdValue: process.env.TELEGRAM_TOPIC_ID
    });
    
    // Validate city
    console.log('City validation:', {
      providedCity: body.city,
      cityInList: RU_CITIES.includes(body.city),
      cityTrimmed: body.city?.trim(),
      cityTrimmedInList: RU_CITIES.includes(body.city?.trim())
    });
    
    if (!RU_CITIES.includes(body.city)) {
      console.log('City validation failed:', body.city);
      return NextResponse.json(
        { error: 'INVALID_CITY', details: `City "${body.city}" not found in allowed cities` },
        { status: 400 }
      );
    }
    
    // Parse and validate data
    console.log('Parsing data with schema...');
    const data = leadSchema.parse(body);
    console.log('Schema validation passed:', {
      eventType: data.eventType,
      city: data.city,
      guestsBucket: data.guestsBucket,
      contact: data.contact,
      callback: data.callback
    });
    
    // Verify reCAPTCHA (temporarily disabled for debugging)
    console.log('reCAPTCHA validation:', {
      hasToken: !!data.recaptchaToken,
      tokenValue: data.recaptchaToken ? data.recaptchaToken.substring(0, 10) + '...' : null
    });
    
    // Временно отключаем проверку reCAPTCHA для отладки
    if (false && data.recaptchaToken && !(await verifyRecaptcha(data.recaptchaToken))) {
      console.log('reCAPTCHA validation failed');
      return NextResponse.json(
        { error: 'RECAPTCHA_FAILED' },
        { status: 400 }
      );
    }
    
    // Verify email domain
    console.log('Email domain validation:', {
      contactKind: data.contact.kind,
      contactValue: data.contact.value,
      isEmail: data.contact.kind === 'email'
    });
    
    if (!(await verifyEmailMxIfNeeded(data.contact))) {
      console.log('Email domain validation failed');
      return NextResponse.json(
        { error: 'INVALID_EMAIL_DOMAIN' },
        { status: 400 }
      );
    }
    
    // Send notifications (parallel with individual error handling)
    const results = await Promise.allSettled([
      notifyTelegram(data),
      copyToGoogleSheet(data)
    ]);
    
    // Log results
    results.forEach((result, index) => {
      const service = index === 0 ? 'Telegram' : 'Google Sheets';
      if (result.status === 'fulfilled') {
        console.log(`${service} notification: SUCCESS`);
      } else {
        console.error(`${service} notification: FAILED`, result.reason);
      }
    });
    
    console.log('=== LEAD API SUCCESS ===');
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('=== LEAD API ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', error.issues);
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('=== LEAD API ERROR END ===');
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}