import { Injectable } from "@nestjs/common";
import { GoogleCalendarService } from "../services/google-calendar.service";
import { GoogleSheetsService } from "../services/google-sheets.service";
import { SlackService } from "../services/slack.service";
import { calendar_v3 } from "googleapis";
import { formatDate } from "#/utils/day-util";
import { v4 as uuidv4 } from "uuid";

type EventType = {
  title: string;
  company: string;
  startDatetime: Date;
  endDatetime: Date;
  description: string;
  option: string;
  assessmentUrl: string;
  examineeCount: number;
};

@Injectable()
export class EventsService {
  constructor(
    private readonly googleCalendarService: GoogleCalendarService,
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly slackService: SlackService
  ) {}

  private createGoogleCalendarDescriptionTemplate(
    eventType: EventType
  ): string {
    return `
    <p>
        - 응시 인원 : ${eventType.examineeCount} 명 <br/>
        - 사용 옵션: ${eventType.option} <br/>
        - 링크: <a href='${eventType.assessmentUrl}'>링크 바로가기</a>
        - 설명: ${eventType.description}<br/>
    </p>`;
  }

  private createGoogleCalendarEventData(
    eventType: EventType,
    eventId: string,
    description: string
  ): calendar_v3.Schema$Event {
    return {
      source: {
        title: eventType.title,
        url: eventType.assessmentUrl,
      },
      guestsCanInviteOthers: true,
      guestsCanModify: true,
      start: {
        dateTime: formatDate(eventType.startDatetime),
        timeZone: "Asia/Seoul",
      },
      end: {
        dateTime: formatDate(eventType.endDatetime),
        timeZone: "Asia/Seoul",
      },
      summary: eventType.title,
      description,
      extendedProperties: {
        private: {
          eventId,
        },
      },
    };
  }

  private createGoogleSheetRowData(
    eventData: EventType,
    eventId: string,
    calendarEventId: string
  ) {
    return [
      eventData.title,
      eventData.company,
      eventData.option,
      eventData.examineeCount.toString(),
      eventData.startDatetime.toString(),
      eventData.endDatetime.toString(),
      eventData.description,
      eventData.assessmentUrl,
      eventId,
      calendarEventId,
    ];
  }

  async createEvent(eventData: EventType) {
    const eventId = uuidv4();
    const {
      title,
      company,
      startDatetime,
      endDatetime,
      description,
      option,
      assessmentUrl,
      examineeCount,
    } = eventData;

    const googleCalendarDescriptionTemplate: string =
      this.createGoogleCalendarDescriptionTemplate(eventData);

    const googleCalendarEventData: calendar_v3.Schema$Event =
      this.createGoogleCalendarEventData(
        eventData,
        eventId,
        googleCalendarDescriptionTemplate
      );

    // Add event to Google Calendar
    const calendarEventResponse = await this.googleCalendarService.createEvent(
      googleCalendarEventData
    );

    const calendarEventId: string = calendarEventResponse.data.id || "";

    const googleSheetRowData: string[] = this.createGoogleSheetRowData(
      eventData,
      eventId,
      calendarEventId
    );

    // Update Google Sheets
    const sheetEventReponse = await this.googleSheetsService.addEventToSheet(
      "시트1!A:J",
      googleSheetRowData
    );

    // Send Slack notification
    await this.slackService.notifyEventCreation({
      title,
      company,
      startDatetime,
      endDatetime,
      description,
      option,
      assessmentUrl,
      examineeCount,
    });

    // return calendarEvent;
    return true;
  }

  async getAllEvents() {
    return this.googleSheetsService.getAllEventsFromSheet("시트1!A:J");
  }

  async updateEvent(eventId: string, calendarEventId: string, eventData: any) {
    const googleCalendarDescriptionTemplate: string =
      this.createGoogleCalendarDescriptionTemplate(eventData);

    const googleCalendarEventData: calendar_v3.Schema$Event =
      this.createGoogleCalendarEventData(
        eventData,
        eventId,
        googleCalendarDescriptionTemplate
      );

    const updatedEvent = await this.googleCalendarService.updateEvent(
      calendarEventId,
      googleCalendarEventData
    );

    const googleSheetRowData: string[] = this.createGoogleSheetRowData(
      eventData,
      eventId,
      calendarEventId
    );

    const eventRowIndex =
      await this.googleSheetsService.getEventRowIndexFromSheet(
        "시트1!A:J",
        eventId
      );

    await this.googleSheetsService.updateEventInSheet(
      `시트1!${eventRowIndex}:${eventRowIndex}`,
      googleSheetRowData
    );
    await this.slackService.notifyEventUpdate(eventData);
    return true;
  }

  async deleteEvent(eventId: string, calendarEventId: string) {
    const eventRowIndexFromSheet =
      await this.googleSheetsService.getEventRowIndexFromSheet(
        "시트1!A:J",
        eventId
      );
    const previousEventRow: string[] | null =
      await this.googleSheetsService.getEventFromSheet(
        `시트1!${eventRowIndexFromSheet}:${eventRowIndexFromSheet}`
      );
    try {
      await this.googleCalendarService.deleteEvent(calendarEventId);
    } catch (err) {
      console.log(err);
    }
    const startIndex: number = eventRowIndexFromSheet - 1;
    const endIndex: number = Number(eventRowIndexFromSheet);
    await this.googleSheetsService.deleteEventFromSheet(
      0,
      startIndex,
      endIndex
    );
    if (previousEventRow)
      await this.slackService.notifyEventDeletion(
        previousEventRow[0],
        previousEventRow[4]
      );
  }
}
