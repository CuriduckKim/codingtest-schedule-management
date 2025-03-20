
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleSheetsService {
  private sheets: any;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async addEventToSheet(eventData: any) {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Events!A:E',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          eventData.id,
          eventData.summary,
          eventData.start.dateTime,
          eventData.end.dateTime,
          eventData.description
        ]]
      }
    });
  }

  async updateEventInSheet(eventId: string, eventData: any) {
    // Implementation for updating event in sheet
  }

  async deleteEventFromSheet(eventId: string) {
    // Implementation for deleting event from sheet
  }
}
