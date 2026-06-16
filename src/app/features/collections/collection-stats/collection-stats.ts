import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CollectionService } from '../../../core/services/collection.service';
import { ReportService } from '../../../core/services/report.service';
import { TopicStat, GroupStat } from '../../../shared/models/models';

@Component({
  selector: 'app-collection-stats',
  imports: [FormsModule, RouterLink],
  templateUrl: './collection-stats.html',
  styleUrl: './collection-stats.css',
})
export class CollectionStats implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(CollectionService);
  private reportSvc = inject(ReportService);

  collectionName = signal('');
  tab = signal<'tema' | 'grupos'>('tema');
  months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  selectedMonth = signal(new Date().getMonth());
  selectedYear = signal(new Date().getFullYear());
  topicStats = signal<TopicStat[]>([]);
  groupStats = signal<GroupStat[]>([]);
  loading = signal(false);

  showReportModal = signal(false);
  reportGroupCode = signal('');
  reportGroupCodeError = signal('');
  optionalEmail = signal('');
  sending = signal(false);
  toast = signal<{ msg: string; type: string } | null>(null);

  avgScore = computed(() => {
    const stats = this.topicStats();
    if (!stats.length) return 0;
    return Math.round(stats.reduce((s, t) => s + (t.averageScore || 0), 0) / stats.length);
  });

  allTopics = computed(() =>
    [...new Set(this.groupStats().flatMap(g => Object.keys(g.topicAverageMap || {})))]
  );

  ngOnInit(): void {
    this.collectionName.set(this.route.snapshot.paramMap.get('collectionName') || '');
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const start = new Date(this.selectedYear(), this.selectedMonth(), 1).toISOString().split('T')[0];
    const end = new Date(this.selectedYear(), this.selectedMonth() + 1, 0).toISOString().split('T')[0];
    this.svc.getTopicStats(this.collectionName(), start, end).subscribe(d => this.topicStats.set(d));
    this.svc.getGroupStats(this.collectionName(), start, end).subscribe(d => { this.groupStats.set(d); this.loading.set(false); });
  }

  getGroupValue(g: GroupStat, topic: string): number {
    return Math.round(Number(g.topicAverageMap?.[topic] || 0));
  }

  sendReport(): void {
    if (!this.reportGroupCode().trim()) { this.reportGroupCodeError.set('El código de grupo es obligatorio'); return; }
    this.sending.set(true);
    this.reportSvc.sendReport({
      groupCode: this.reportGroupCode(),
      collectionName: this.collectionName(),
      optionalEmail: this.optionalEmail().trim() || undefined,
    }).subscribe({
      next: () => {
        this.showReportModal.set(false);
        this.reportGroupCode.set('');
        this.optionalEmail.set('');
        this.sending.set(false);
        this.showToast('Reporte PDF generado y enviado al correo institucional', 'success');
      },
      error: (e: { error?: { message?: string } }) => {
        this.showToast(e?.error?.message || 'Error al enviar el reporte', 'error');
        this.sending.set(false);
      },
    });
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });
    setTimeout(() => this.toast.set(null), 5000);
  }
}
