import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailEditorComponent } from './email-editor/email-editor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EmailEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-angular-app';
}
