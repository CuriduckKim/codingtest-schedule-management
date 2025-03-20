
import { Injectable } from '@nestjs/common';
import { google, calendar_v3, sheets_v4  } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private calendar: any;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE_PATH,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createEvent(eventData: calendar_v3.Schema$Event ) {
    return this.calendar.events.insert({
      calendarId: 'primary',
      resource: eventData,
    });
  }

  async listEvents() {
    return this.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
  }

  async updateEvent(eventId: string, eventData: any) {
    return this.calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: eventData,
    });
  }

  async deleteEvent(eventId: string) {
    return this.calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
  }
}
