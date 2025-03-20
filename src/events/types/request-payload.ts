export type CreateEventRequestPayload = {
    title: string,
    company: string,
    channelIndex: string,
    startDatetime: string,
    endDatetime: string,
    option: "normal" | "advanced" | "obserview" | "ai-obserview",
    examineeCount: number,
    description: string,
    etc: string
}