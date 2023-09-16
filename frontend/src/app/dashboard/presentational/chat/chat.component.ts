import { DatePipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgFor],
})
export class ChatComponent {
  private readonly formbuilder = inject(FormBuilder);

  @Input() chatmessages = [];

  @Input() connectionEstablished = false;

  @Output() sendChat = new EventEmitter();

  form = this.formbuilder.group({
    chatmessage: ['', Validators.required],
  });

  send() {
    const chatMessage = {
      sent: new Date().toISOString(),
      message: this.form.value.chatmessage,
    };
    this.sendChat.emit(chatMessage);
    this.form.reset();
  }
}
