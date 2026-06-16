import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-activity',
  imports: [RouterLink],
  templateUrl: './select-activity.html',
  styleUrl: './select-activity.css',
})
export class SelectActivity {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  collectionName = this.route.snapshot.paramMap.get('collectionName') || '';
  topicId = this.route.snapshot.paramMap.get('topicId') || '';

  goManual(): void {
    this.router.navigate(['/docentes/colecciones', this.collectionName, 'temas', this.topicId, 'actividades', 'manual']);
  }

  goAI(): void {
    this.router.navigate(['/docentes/colecciones', this.collectionName, 'temas', this.topicId, 'actividades', 'ia']);
  }
}
