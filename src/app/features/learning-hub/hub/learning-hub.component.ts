import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../../shared/layouts/main-layout/breadcrumb/breadcrumb.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { SuggestedResourceModalComponent } from './suggested-resource-modal/suggested-resource-modal.component';
import { LearningHubService } from '../../../core/services/learning-hub.service';
import { GroupService } from '../../../core/services/group.service';
import { CollectionService } from '../../../core/services/collection.service';
import { StudentLearningPath } from '../../../shared/models/learning-gap.model';

@Component({
  selector: 'app-learning-hub',
  standalone: true,
  imports: [FormsModule, BreadcrumbComponent, StatusBadgeComponent, SuggestedResourceModalComponent],
  templateUrl: './learning-hub.html',
  styleUrl: './learning-hub.css',
})
export class LearningHubComponent implements OnInit {
  private hubSvc = inject(LearningHubService);
  private groupSvc = inject(GroupService);
  private collectionSvc = inject(CollectionService);

  breadcrumbs = [{ label: 'Ruta de Aprendizaje' }];
  
  // Opciones de filtros
  groups = signal<any[]>([]);
  collections = signal<any[]>([]);
  
  // Estado de los filtros
  selectedGroupCode = signal<string>('');
  selectedCollectionId = signal<number>(0);

  // Datos
  paths = signal<StudentLearningPath[]>([]);
  loading = signal(false);

  // Modal State
  selectedStudentModal = signal<string>('');
  selectedTopicModal = signal<string>('');
  showModal = signal(false);

  ngOnInit() {
    // Cargar opciones para los dropdowns
    this.groupSvc.getMyGroups().subscribe(g => this.groups.set(g));
    this.collectionSvc.getMyCollections().subscribe(c => this.collections.set(c));
  }

  fetchData() {
    if (!this.selectedGroupCode() || !this.selectedCollectionId()) return;
    
    this.loading.set(true);
    this.hubSvc.getLearningPaths(this.selectedGroupCode(), this.selectedCollectionId()).subscribe({
      next: (data) => {
        this.paths.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openResourceModal(studentName: string, topicName: string) {
    this.selectedStudentModal.set(studentName);
    this.selectedTopicModal.set(topicName);
    this.showModal.set(true);
  }
}