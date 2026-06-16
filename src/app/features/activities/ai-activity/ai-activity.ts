import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../../core/services/activity.service';

const ACTIVITY_TYPES = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_THE_BLANK'];

@Component({
  selector: 'app-ai-activity',
  imports: [FormsModule, RouterLink],
  templateUrl: './ai-activity.html',
  styleUrl: './ai-activity.css',
})
export class AiActivity {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actSvc = inject(ActivityService);

  collectionName = this.route.snapshot.paramMap.get('collectionName') || '';
  topicId = Number(this.route.snapshot.paramMap.get('topicId') || 0);

  topicName = signal('');
  selectedFile = signal<File | null>(null);
  fileError = signal('');
  topicError = signal('');
  selectedTypes = signal<string[]>(['MULTIPLE_CHOICE']);
  loading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  readonly allTypes = ACTIVITY_TYPES;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileError.set('');
    if (file && file.type !== 'application/pdf') {
      this.fileError.set('Solo se permiten archivos PDF');
      this.selectedFile.set(null);
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      this.fileError.set('El archivo no puede superar 5 MB');
      this.selectedFile.set(null);
      return;
    }
    this.selectedFile.set(file);
  }

  toggleType(type: string): void {
    this.selectedTypes.update(types =>
      types.includes(type) ? types.filter(t => t !== type) : [...types, type]
    );
  }

  upload(): void {
    if (!this.selectedFile()) { this.fileError.set('Selecciona un archivo PDF'); return; }
    if (!this.topicName().trim()) { this.topicError.set('Ingresa el nombre del tema'); return; }
    if (!this.selectedTypes().length) { this.showToast('Selecciona al menos un tipo de pregunta', 'error'); return; }

    this.loading.set(true);
    this.actSvc.uploadAI(this.selectedFile()!, this.topicName(), this.selectedTypes()).subscribe({
      next: () => {
        this.showToast('Actividad generada con IA exitosamente', 'success');
        setTimeout(() => this.router.navigate(['/docentes/colecciones', this.collectionName, 'temas', this.topicId]), 1500);
      },
      error: (e: { error?: { message?: string } }) => {
        this.showToast(e?.error?.message || 'Error al generar actividad con IA', 'error');
        this.loading.set(false);
      },
    });
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 5000);
  }
}
