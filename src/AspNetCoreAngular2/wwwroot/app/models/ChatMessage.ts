export class ChatMessage {
    Message: string;
    Sent: Date;

    constructor(message: string, date: string) {
        this.Message = message;
        this.Sent = new Date(date);
    }
}