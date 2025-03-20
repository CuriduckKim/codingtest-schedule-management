import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { google, calendar_v3 } from "googleapis";
import * as path from "path";

@Injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private calendarId?: string;
  private googleConfigurationFileName: string;

  constructor(private configService: ConfigService) {
    this.googleConfigurationFileName =
      this.configService.get("GOOGLE_APPLICATION_CREDENTIALS_FILE_NAME") || "";
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(this.googleConfigurationFileName),
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    this.calendarId = this.configService.get("GOOGLE_CALENDAR_ID");
    this.calendar = google.calendar({
      version: "v3",
      auth,
    });
  }

  async createEvent(eventData: calendar_v3.Schema$Event) {
    return this.calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: eventData,
    });
  }

  async findEvent(eventId: string) {
    return this.calendar.events.get({
      calendarId: this.calendarId,
      eventId,
    });
  }

  async updateEvent(calendarEventId: string, eventData: any) {
    const updateEventResponse = this.calendar.events.update({
      calendarId: this.calendarId,
      eventId: calendarEventId,
      requestBody: eventData,
    });
    return updateEventResponse;
  }

  async deleteEvent(calendarEventId: string) {
    const deleteEventResponse = this.calendar.events.delete({
      calendarId: this.calendarId,
      eventId: calendarEventId,
    });
    return deleteEventResponse;
  }
}
