import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebClient } from "@slack/web-api";
import axios from "axios";

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
export class SlackService {
  //private slack: WebClient;
  private webhookUrl: string;

  constructor(private configService: ConfigService) {
    this.webhookUrl = configService.get<string>("SLACK_WEBHOOK_URL") || ""; // 웹훅 URL을 환경 변수에서 가져옵니다.
  }

  async notifyEventCreation(eventData: EventType) {
    await axios.post(this.webhookUrl, {
      message: `🎊 코딩 테스트 일정이 추가되었습니다. 🎊

    - 제목: ${eventData.title}
    - 회사: ${eventData.company}
    - 시작 시간: ${eventData.startDatetime}
    - 종료 시간: ${eventData.endDatetime}
    - 설명: ${eventData.description}
    - 옵션: ${eventData.option}
    - 평가 URL: ${eventData.assessmentUrl}
    - 응시자 수: ${eventData.examineeCount}`,
    });
  }

  async notifyEventUpdate(eventData: EventType) {
    await axios.post(this.webhookUrl, {
      message: `📝 코딩 테스트 일정이 수정되었습니다. 📝

    - 제목: ${eventData.title}
    - 회사: ${eventData.company}
    - 시작 시간: ${eventData.startDatetime}
    - 종료 시간: ${eventData.endDatetime}
    - 설명: ${eventData.description}
    - 옵션: ${eventData.option}
    - 평가 URL: ${eventData.assessmentUrl}
    - 응시자 수: ${eventData.examineeCount}`,
    });
  }

  async notifyEventDeletion(eventTitle: string, startDatetime: string) {
    const message = `🗑️ 코딩 테스트 일정이 삭제되었습니다. 🗑️
    - 제목: ${eventTitle}
    - 시작일시: ${startDatetime}
    `;
    await axios.post(this.webhookUrl, { message });
  }
}
