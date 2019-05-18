export class ChatMessage {
  public sent: string;

  constructor(public message: string = '') {
    this.sent = new Date().toISOString();
  }
}
