import { Controller, Post, Body, Get, Put, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventRequestPayload } from './types/request-payload';
import { calendar_v3 } from 'googleapis'


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    async createEvent(@Body() eventData: CreateEventRequestPayload) {
        console.log(eventData);
		const googleCalendarEventPayload: calendar_v3.Schema$Event = {
			
		}
		}
        //return this.eventsService.createEvent(eventData);
        return true;
    }

    @Get()
    async getAllEvents() {
        return this.eventsService.getAllEvents();
    }

    @Put(':id')
    async updateEvent(@Param('id') id: string, @Body() eventData: any) {
        return this.eventsService.updateEvent(id, eventData);
    }

    @Delete(':id')
    async deleteEvent(@Param('id') id: string) {
        return this.eventsService.deleteEvent(id);
    }
}