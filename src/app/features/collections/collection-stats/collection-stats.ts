import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AssessmentService } from '../../../core/services/assessment.service';
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
  private assessmentSvc = inject(AssessmentService);
  private reportSvc = inject(ReportService);

  collectionName = signal('');

  tab = signal<'tema' | 'grupos'>('tema');

  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

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

    const total = stats.reduce((sum, topic) => {
      return sum + Number(topic.averageScore || 0);
    }, 0);

    return Math.round(total / stats.length);
  });

  allTopics = computed(() => {
    const topics = this.groupStats().flatMap(group =>
      Object.keys(group.topicAverageMap || {})
    );

    return [...new Set(topics)];
  });

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('collectionName') || '';
    this.collectionName.set(name);

    this.load();
  }

  load(): void {
    this.loading.set(true);

    const start = new Date(
      this.selectedYear(),
      this.selectedMonth(),
      1
    )
      .toISOString()
      .split('T')[0];

    const end = new Date(
      this.selectedYear(),
      this.selectedMonth() + 1,
      0
    )
      .toISOString()
      .split('T')[0];

    this.assessmentSvc
      .getCollectionTopicStats(this.collectionName(), start, end)
      .subscribe({
        next: data => {
          this.topicStats.set(data);
        },
        error: () => {
          this.topicStats.set([]);
          this.showToast('No se pudieron cargar las estadísticas por tema', 'error');
        },
      });

    this.assessmentSvc
      .getCollectionGroupStats(this.collectionName(), start, end)
      .subscribe({
        next: data => {
          this.groupStats.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.groupStats.set([]);
          this.loading.set(false);
          this.showToast('No se pudieron cargar las estadísticas por grupo', 'error');
        },
      });
  }

  getGroupValue(group: GroupStat, topic: string): number {
    return Math.round(Number(group.topicAverageMap?.[topic] || 0));
  }

  openReportModal(): void {
    this.reportGroupCode.set('');
    this.reportGroupCodeError.set('');
    this.optionalEmail.set('');
    this.showReportModal.set(true);
  }

  closeReportModal(): void {
    this.showReportModal.set(false);
    this.reportGroupCode.set('');
    this.reportGroupCodeError.set('');
    this.optionalEmail.set('');
  }

  sendReport(): void {
    const groupCode = this.reportGroupCode().trim();
    const email = this.optionalEmail().trim();

    if (!groupCode) {
      this.reportGroupCodeError.set('El código de grupo es obligatorio');
      return;
    }

    this.reportGroupCodeError.set('');
    this.sending.set(true);

    this.reportSvc
      .sendReport({
        groupCode,
        collectionName: this.collectionName(),
        optionalEmail: email || undefined,
      })
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.closeReportModal();
          this.showToast(
            'Reporte PDF generado y enviado al correo institucional',
            'success'
          );
        },
        error: (e: HttpErrorResponse) => {
          const msg = e.error?.message || 'Error al enviar el reporte';

          this.sending.set(false);
          this.showToast(msg, 'error');
        },
      });
  }

  showToast(msg: string, type: string): void {
    this.toast.set({ msg, type });

    setTimeout(() => {
      this.toast.set(null);
    }, 5000);
  }
  downloadReport(): void {
  this.showToast('La descarga de PDF aún debe conectarse con el backend', 'error');
}
}