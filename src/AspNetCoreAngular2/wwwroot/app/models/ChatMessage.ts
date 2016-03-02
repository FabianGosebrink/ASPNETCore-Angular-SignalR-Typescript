export class ChatMessage {
    public Message: string;
    public Sent: Date;

    constructor(message: string, date: string) {
        this.Message = message;
        this.Sent = new Date(date);
    }
}