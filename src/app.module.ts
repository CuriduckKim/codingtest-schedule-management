import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { EventsController } from "./events/events.controller";
import { EventsService } from "./events/events.service";
import { GoogleCalendarService } from "./services/google-calendar.service";
import { GoogleSheetsService } from "./services/google-sheets.service";
import { SlackService } from "./services/slack.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [EventsController],
  providers: [
    ConfigService,
    EventsService,
    GoogleCalendarService,
    GoogleSheetsService,
    SlackService,
  ],
})
export class AppModule {}
