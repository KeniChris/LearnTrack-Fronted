import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../../core/services/topic.service';
import { Topic } from '../../../shared/models/models';

@Component({
  selector: 'app-collection-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.css',
})
export class CollectionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(TopicService);

  collectionName = signal('');
  topics = signal<Topic[]>([]);
  showModal = signal(false);
  topicName = '';
  nameError = signal('');
  loading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  ngOnInit(): void {
    this.collectionName.set(this.route.snapshot.paramMap.get('collectionName') || '');
    this.load();
  }

  load(): void {
    this.svc.getByCollection(this.collectionName()).subscribe(t => this.topics.set(t));
  }

  create(): void {
    if (!this.topicName.trim()) { this.nameError.set('El nombre es obligatorio'); return; }
    if (this.topics().find(t => t.name.toLowerCase() === this.topicName.trim().toLowerCase())) {
      this.nameError.set('Ya existe un tema con este nombre'); return;
    }
    this.loading.set(true);
    this.svc.create(this.collectionName(), { name: this.topicName.trim() }).subscribe({
      next: () => { this.showToast('Tema creado', 'success'); this.closeModal(); this.load(); },
      error: (e: { error?: { message?: string } }) => { this.nameError.set(e?.error?.message || 'Error'); this.loading.set(false); },
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.topicName = '';
    this.nameError.set('');
    this.loading.set(false);
  }

  goTopic(id: number): void {
    this.router.navigate(['/docentes/colecciones', this.collectionName(), 'temas', id]);
  }

  goStats(): void {
    this.router.navigate(['/docentes/colecciones', this.collectionName(), 'estadisticas']);
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
