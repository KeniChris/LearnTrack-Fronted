import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../core/services/group.service';
import { Group } from '../../../shared/models/models';

@Component({
  selector: 'app-students-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './students-list.html',
  styleUrl: './students-list.css',
})
export class StudentsList implements OnInit {
  private svc = inject(GroupService);

  groups = signal<Group[]>([]);
  showModal = signal(false);
  groupName = signal('');
  groupCode = signal('');
  nameError = signal('');
  codeError = signal('');
  loading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.svc.getMyGroups().subscribe({
      next: d => this.groups.set(d),
      error: () => this.showToast('Error al cargar grupos', 'error'),
    });
  }

  create(): void {
    if (!this.groupName().trim()) { this.nameError.set('El nombre es obligatorio'); return; }
    if (!this.groupCode().trim()) { this.codeError.set('El código es obligatorio'); return; }
    this.loading.set(true);
    this.svc.create({ name: this.groupName(), code: this.groupCode() }).subscribe({
      next: () => { this.closeModal(); this.load(); this.showToast('Grupo creado exitosamente', 'success'); },
      error: (e) => {
        const msg = e?.error?.fieldErrors?.code || e?.error?.message || 'Error al crear grupo';
        this.showToast(msg, 'error');
        this.loading.set(false);
      },
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.groupName.set('');
    this.groupCode.set('');
    this.nameError.set('');
    this.codeError.set('');
    this.loading.set(false);
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
