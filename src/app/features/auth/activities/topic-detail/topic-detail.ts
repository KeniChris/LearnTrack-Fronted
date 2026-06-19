import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActivityService } from '../../../core/services/activity.service';
import { Activity } from '../../../shared/models/models';

@Component({
  selector: 'app-topic-detail',
  imports: [RouterLink],
  templateUrl: './topic-detail.html',
  styleUrl: './topic-detail.css',
})
export class TopicDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actSvc = inject(ActivityService);

  collectionName = signal('');
  topicId = signal(0);
  activities = signal<Activity[]>([]);
  loading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  ngOnInit(): void {
    this.collectionName.set(this.route.snapshot.paramMap.get('collectionName') || '');
    this.topicId.set(Number(this.route.snapshot.paramMap.get('topicId') || 0));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.actSvc.getByTopic(this.topicId()).subscribe({
      next: d => { this.activities.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goNew(): void {
    this.router.navigate(['/docentes/colecciones', this.collectionName(), 'temas', this.topicId(), 'actividades', 'nueva']);
  }

  deleteActivity(id: number): void {
    if (!confirm('¿Eliminar esta actividad?')) return;
    this.actSvc.delete(id).subscribe({
      next: () => { this.load(); this.showToast('Actividad eliminada', 'success'); },
      error: () => this.showToast('Error al eliminar', 'error'),
    });
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
