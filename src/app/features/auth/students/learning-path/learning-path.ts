import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GroupService } from '../../../core/services/group.service';
import { StudentLearningPath } from '../../../shared/models/models';

@Component({
  selector: 'app-learning-path',
  imports: [RouterLink],
  templateUrl: './learning-path.html',
  styleUrl: './learning-path.css',
})
export class LearningPath implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(GroupService);

  groupCode = signal('');
  paths = signal<StudentLearningPath[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.groupCode.set(this.route.snapshot.paramMap.get('groupCode') || '');
    this.loading.set(true);
    this.svc.getLearningPaths(this.groupCode()).subscribe({
      next: d => { this.paths.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
