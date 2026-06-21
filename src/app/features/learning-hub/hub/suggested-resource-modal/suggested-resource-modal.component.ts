import { Component, EventEmitter, Output, input, inject, OnInit, signal } from '@angular/core';
import { LearningHubService } from '../../../../core/services/learning-hub.service';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-suggested-resource-modal',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './suggested-resource-modal.html',
  styleUrl: './suggested-resource-modal.css',
})
export class SuggestedResourceModalComponent implements OnInit {
  topicName = input.required<string>();
  studentName = input.required<string>();
  
  @Output() close = new EventEmitter<void>();

  private hubSvc = inject(LearningHubService);
  
  loading = signal(true);
  resource = signal<{ title: string; description: string; type: string } | null>(null);
  error = signal('');

  ngOnInit() {
    this.hubSvc.getSuggestedResource(this.topicName()).subscribe({
      next: (res) => {
        this.resource.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo generar el recurso sugerido en este momento.');
        this.loading.set(false);
      }
    });
  }
}