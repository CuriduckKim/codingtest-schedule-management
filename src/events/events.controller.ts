import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventRequestPayload } from "./types/request-payload";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() eventData: any) {
    return this.eventsService.createEvent(eventData);
  }

  @Get()
  async getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Put()
  async updateEvent(@Body() eventData: any) {
    return this.eventsService.updateEvent(
      eventData.eventId,
      eventData.calendarEventId,
      eventData
    );
  }

  @Delete()
  async deleteEvent(
    @Query("eventId") eventId: string,
    @Query("calendarEventId") calendarEventId: string
  ) {
    return this.eventsService.deleteEvent(eventId, calendarEventId);
  }
}
