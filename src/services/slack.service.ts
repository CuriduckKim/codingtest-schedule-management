import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import axios from 'axios'

@Injectable()
export class SlackService {
    //private slack: WebClient;
	private webhookUrl: string;

    constructor() {
        this.webhookUrl = process.env.SLACK_WEBHOOK_URL || ''; // 웹훅 URL을 환경 변수에서 가져옵니다.
    }

    async notifyEventCreation(eventData: any) {
        const message = {
            text: `New event created: ${eventData.summary}`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*New Event Created*\n*Title:* ${eventData.summary}\n*Start:* ${eventData.start.dateTime}\n*End:* ${eventData.end.dateTime}`,
                    },
                },
            ],
        };

        await axios.post(this.webhookUrl, message);
    }

    async notifyEventUpdate(eventData: any) {
        const message = {
            text: `Event updated: ${eventData.summary}`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*Event Updated*\n*Title:* ${eventData.summary}\n*Start:* ${eventData.start.dateTime}\n*End:* ${eventData.end.dateTime}`,
                    },
                },
            ],
        };

        await axios.post(this.webhookUrl, message);
    }

    async notifyEventDeletion(eventId: string) {
        const message = {
            text: `Event deleted: ${eventId}`,
        };

        await axios.post(this.webhookUrl, message);
    }
}