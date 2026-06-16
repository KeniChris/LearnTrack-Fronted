import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ReportService } from '../../../core/services/report.service';
import { PdfReport } from '../../../shared/models/models';

@Component({
  selector: 'app-group-stats',
  imports: [FormsModule, RouterLink, SlicePipe],
  templateUrl: './group-stats.html',
  styleUrl: './group-stats.css',
})
export class GroupStats implements OnInit {
  private route = inject(ActivatedRoute);
  private reportSvc = inject(ReportService);

  groupCode = signal('');
  reports = signal<PdfReport[]>([]);
  loading = signal(false);

  showModal = signal(false);
  collectionName = signal('');
  optionalEmail = signal('');
  collectionError = signal('');
  sending = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  ngOnInit(): void {
    this.groupCode.set(this.route.snapshot.paramMap.get('groupCode') || '');
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.reportSvc.getGroupReports(this.groupCode()).subscribe({
      next: d => { this.reports.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  sendReport(): void {
    if (!this.collectionName().trim()) { this.collectionError.set('El nombre de colección es obligatorio'); return; }
    this.sending.set(true);
    this.reportSvc.sendReport({
      groupCode: this.groupCode(),
      collectionName: this.collectionName(),
      optionalEmail: this.optionalEmail().trim() || undefined,
    }).subscribe({
      next: () => {
        this.showModal.set(false);
        this.collectionName.set('');
        this.optionalEmail.set('');
        this.sending.set(false);
        this.showToast('Reporte PDF generado y enviado', 'success');
        this.load();
      },
      error: (e: { error?: { message?: string } }) => {
        this.showToast(e?.error?.message || 'Error al generar el reporte', 'error');
        this.sending.set(false);
      },
    });
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 5000);
  }
}
