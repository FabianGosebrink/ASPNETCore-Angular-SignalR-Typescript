import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChatMessage } from '@app/models/chatMessage.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  @Input() chatmessages = [];
  @Input() connectionEstablished = false;
  @Output() sendChat = new EventEmitter();

  form: FormGroup;

  constructor(formbuilder: FormBuilder) {
    this.form = formbuilder.group({
      chatmessage: ['', Validators.required]
    });
  }

  send() {
    this.sendChat.emit(new ChatMessage(this.form.value.chatmessage));
    this.form.reset();
  }
}
