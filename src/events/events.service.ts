import { Injectable } from "@nestjs/common";
import { GoogleCalendarService } from "../services/google-calendar.service";
import { GoogleSheetsService } from "../services/google-sheets.service";
import { SlackService } from "../services/slack.service";
import { calendar_v3 } from "googleapis";

@Injectable()
export class EventsService {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly slackService: SlackService
  ) {}

  async createEvent(
    googleCalendarEventData: calendar_v3.Schema$Event,
    googleSheetEventData: any,
    slackEventData: any
  ) {
    // Add event to Google Calendar
    const calendarEvent = await this.googleCalendarService.createEvent(
      googleCalendarEventData
    );

    // Update Google Sheets
    await this.googleSheetsService.addEventToSheet(googleSheetEventData);

    // Send Slack notification
    await this.slackService.notifyEventCreation(slackEventData);

    return calendarEvent;
  }

  async getAllEvents() {
    return this.googleCalendarService.listEvents();
  }

  async updateEvent(id: string, eventData: any) {
    const updatedEvent = await this.googleCalendarService.updateEvent(
      id,
      eventData
    );
    await this.googleSheetsService.updateEventInSheet(id, eventData);
    await this.slackService.notifyEventUpdate(eventData);
    return updatedEvent;
  }

  async deleteEvent(id: string) {
    await this.googleCalendarService.deleteEvent(id);
    await this.googleSheetsService.deleteEventFromSheet(id);
    await this.slackService.notifyEventDeletion(id);
  }
}
