import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  imports: [InputTextModule, InputTextareaModule, ButtonModule, FormsModule]
})
export class ContactComponent {
  email: string = '';
  message: string = '';

  onSubmit() {
    alert('Demande de contact envoyée avec succès');
  }
}
