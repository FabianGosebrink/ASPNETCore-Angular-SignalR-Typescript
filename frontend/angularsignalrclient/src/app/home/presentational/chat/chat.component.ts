import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChatMessage } from '@app/models/chatMessage.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() chatmessages = [];
  @Input() connectionEstablished = false;
  @Output() sendChat = new EventEmitter();

  form: FormGroup;

  constructor(formbuilder: FormBuilder) {
    this.form = formbuilder.group({
      chatmessage: ''
    });
  }

  send() {
    this.sendChat.emit(new ChatMessage(this.form.value.chatmessage));
    this.form.reset();
  }
}
