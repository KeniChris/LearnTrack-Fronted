import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CollectionService } from '../../../core/services/collection.service';
import { GroupService } from '../../../core/services/group.service';
import { Collection, Group } from '../../../shared/models/models';

@Component({
  selector: 'app-collections-list',
  imports: [FormsModule],
  templateUrl: './collections-list.html',
  styleUrl: './collections-list.css',
})
export class CollectionsList implements OnInit {
  private svc = inject(CollectionService);
  private grpSvc = inject(GroupService);
  private router = inject(Router);

  collections = signal<Collection[]>([]);
  groups = signal<Group[]>([]);
  icons = ['🗃️', '💻', '🧮', '🗄️', '📍', '🔬', '📊', '🧠'];
  showModal = signal(false);
  newName = '';
  selectedGroups = signal<string[]>([]);
  nameError = signal('');
  loading = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.svc.getMyCollections().subscribe(c => this.collections.set(c));
    this.grpSvc.getMyGroups().subscribe(g => this.groups.set(g));
  }

  toggleGroup(code: string): void {
    const current = this.selectedGroups();
    const i = current.indexOf(code);
    this.selectedGroups.set(i >= 0 ? current.filter(c => c !== code) : [...current, code]);
  }

  create(): void {
    if (!this.newName.trim()) { this.nameError.set('El nombre es obligatorio'); return; }
    if (this.collections().find(c => c.name.toLowerCase() === this.newName.trim().toLowerCase())) {
      this.nameError.set('Ya existe una colección con este nombre'); return;
    }
    this.loading.set(true);
    this.svc.create({ name: this.newName.trim() }).subscribe({
      next: () => {
        this.showToast('Colección creada', 'success');
        this.closeModal();
        this.load();
      },
      error: (e: { error?: { message?: string } }) => {
        this.nameError.set(e?.error?.message || 'Error');
        this.loading.set(false);
      },
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.newName = '';
    this.selectedGroups.set([]);
    this.nameError.set('');
    this.loading.set(false);
  }

  goDetail(name: string): void { this.router.navigate(['/docentes/colecciones', name]); }
  goStats(name: string): void { this.router.navigate(['/docentes/colecciones', name, 'estadisticas']); }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
