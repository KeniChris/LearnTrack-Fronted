import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../core/services/group.service';
import { Group, Student } from '../../../shared/models/models';

@Component({
  selector: 'app-group-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css',
})
export class GroupDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(GroupService);

  groupCode = signal('');
  group = signal<Group | null>(null);
  students = signal<Student[]>([]);
  loading = signal(false);
  showEnrollModal = signal(false);
  enrollEmails = signal('');
  enrollLoading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  ngOnInit(): void {
    this.groupCode.set(this.route.snapshot.paramMap.get('groupCode') || '');
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.svc.getByCode(this.groupCode()).subscribe({
      next: g => this.group.set(g),
      error: () => {},
    });
    this.svc.getStudents(this.groupCode()).subscribe({
      next: d => { this.students.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  enroll(): void {
    const emails = this.enrollEmails().split('\n').map(e => e.trim()).filter(e => e);
    if (!emails.length) return;
    this.enrollLoading.set(true);
    this.svc.enrollStudents(this.groupCode(), emails).subscribe({
      next: () => {
        this.showEnrollModal.set(false);
        this.enrollEmails.set('');
        this.enrollLoading.set(false);
        this.load();
        this.showToast('Estudiantes matriculados exitosamente', 'success');
      },
      error: (e) => {
        this.showToast(e?.error?.message || 'Error al matricular', 'error');
        this.enrollLoading.set(false);
      },
    });
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.groupCode()).then(() =>
      this.showToast('Código copiado al portapapeles', 'success')
    );
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
