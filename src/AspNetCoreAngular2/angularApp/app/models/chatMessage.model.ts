export class ChatMessage {

    public sent: Date;

    constructor(public message: string, date: string) {
        this.sent = new Date(date);
    }
}
