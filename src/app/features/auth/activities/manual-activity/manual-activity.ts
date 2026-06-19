import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../../core/services/activity.service';
import { Question } from '../../../shared/models/models';

@Component({
  selector: 'app-manual-activity',
  imports: [FormsModule, RouterLink],
  templateUrl: './manual-activity.html',
  styleUrl: './manual-activity.css',
})
export class ManualActivity implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actSvc = inject(ActivityService);

  collectionName = signal('');
  topicId = signal(0);
  activityTitle = signal('');
  titleError = signal('');
  loading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  questions = signal<Question[]>([]);

  ngOnInit(): void {
    this.collectionName.set(this.route.snapshot.paramMap.get('collectionName') || '');
    this.topicId.set(Number(this.route.snapshot.paramMap.get('topicId') || 0));
    this.addQuestion();
  }

  addQuestion(): void {
    this.questions.update(q => [...q, {
      statement: '',
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
      ],
    }]);
  }

  removeQuestion(i: number): void {
    this.questions.update(q => q.filter((_, idx) => idx !== i));
  }

  setCorrect(qi: number, oi: number): void {
    this.questions.update(qs => qs.map((q, qi2) => qi2 !== qi ? q : {
      ...q,
      options: (q.options ?? []).map((o, oi2) => ({ ...o, correct: oi2 === oi })),
    }));
  }

  updateStatement(qi: number, val: string): void {
    this.questions.update(qs => qs.map((q, i) => i === qi ? { ...q, statement: val } : q));
  }

  updateOptionText(qi: number, oi: number, val: string): void {
    this.questions.update(qs => qs.map((q, i) => i !== qi ? q : {
      ...q,
      options: (q.options ?? []).map((o, j) => j === oi ? { ...o, text: val } : o),
    }));
  }

  save(): void {
    if (!this.activityTitle().trim()) { this.titleError.set('El título es obligatorio'); return; }
    if (this.questions().length === 0) { this.showToast('Agrega al menos una pregunta', 'error'); return; }

    for (let i = 0; i < this.questions().length; i++) {
      const q = this.questions()[i];
      if (!q.statement.trim()) {
        this.showToast(`La pregunta ${i + 1} no tiene enunciado`, 'error'); return;
      }
      const opts = q.options ?? [];
      if (opts.length === 0) {
        this.showToast(`La pregunta ${i + 1} no tiene opciones`, 'error'); return;
      }
      for (let j = 0; j < opts.length; j++) {
        if (!opts[j].text.trim()) {
          this.showToast(`La pregunta ${i + 1}, opción ${j + 1} está vacía`, 'error'); return;
        }
      }
      if (!opts.some(o => o.correct)) {
        this.showToast(`La pregunta ${i + 1} no tiene ninguna opción marcada como correcta`, 'error'); return;
      }
    }

    this.loading.set(true);
    this.actSvc.create(this.topicId(), { title: this.activityTitle(), questions: this.questions() }).subscribe({
      next: () => {
        this.showToast('Actividad creada con éxito', 'success');
        setTimeout(() => this.router.navigate(['/docentes/colecciones', this.collectionName(), 'temas', this.topicId()]), 1500);
      },
      error: (e: { error?: { message?: string } }) => {
        this.showToast(e?.error?.message || 'Error al crear actividad', 'error');
        this.loading.set(false);
      },
    });
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
