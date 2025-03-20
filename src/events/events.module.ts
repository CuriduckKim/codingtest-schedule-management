
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { GoogleCalendarService } from '../services/google-calendar.service';
import { GoogleSheetsService } from '../services/google-sheets.service';
import { SlackService } from '../services/slack.service';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    GoogleCalendarService,
    GoogleSheetsService,
    SlackService
  ]
})
export class EventsModule {}
