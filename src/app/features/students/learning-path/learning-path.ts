import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TopicBlindSpot } from '../../../shared/models/models';

@Component({
  selector: 'app-learning-path',
  imports: [RouterLink],
  templateUrl: './learning-path.html',
  styleUrl: './learning-path.css',
})
export class LearningPath implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  groupCode = signal('');
  collectionName = signal('Algoritmos');
  topicContext = signal('Variables');
  topics = signal<TopicBlindSpot[]>([]);
  loading = signal(false);
  expandedTopics = signal<Set<string>>(new Set());

  expandedSubtopicHeaders = computed<string[]>(() => {
    const expanded = this.expandedTopics();
    const result: string[] = [];
    for (const topic of this.topics()) {
      if (expanded.has(topic.topicName) && topic.subtopics?.length) {
        for (const sub of topic.subtopics) {
          if (!result.includes(sub.name)) result.push(sub.name);
        }
      }
    }
    return result;
  });

  extraColsArray = computed(() =>
    Array(this.expandedSubtopicHeaders().length).fill(0)
  );

  ngOnInit(): void {
    this.groupCode.set(this.route.snapshot.paramMap.get('groupCode') || '');
    this.topics.set([
      {
        topicName: 'Arreglos',
        assimilationLevel: 38,
        status: 'Crítico',
        suggestedResource: '#',
        subtopics: [
          { name: 'Declaración de índices', failureRate: 72, status: 'Refuerzo', resource: '#' },
          { name: 'Límites del arreglo', failureRate: 65, status: 'Refuerzo', resource: '#' },
        ],
      },
      {
        topicName: 'Punteros',
        assimilationLevel: 55,
        status: 'Bajo',
        suggestedResource: '#',
        subtopics: [],
      },
      {
        topicName: 'Variables y Scope',
        assimilationLevel: 82,
        status: 'Óptimo',
        subtopics: [],
      },
    ]);
  }

  toggle(topicName: string): void {
    const set = new Set(this.expandedTopics());
    if (set.has(topicName)) set.delete(topicName);
    else set.add(topicName);
    this.expandedTopics.set(set);
  }

  isExpanded(topicName: string): boolean {
    return this.expandedTopics().has(topicName);
  }

  goToResource(topicName: string): void {
    this.router.navigate(['temas', encodeURIComponent(topicName)], { relativeTo: this.route });
  }

  rowClass(topic: TopicBlindSpot): string {
    if (topic.status === 'Crítico') return 'row-critico';
    if (topic.status === 'Bajo') return 'row-bajo';
    return 'row-optimo';
  }

  barColor(n: number): string {
    return n >= 70 ? '#5BC08A' : n >= 40 ? '#F4A261' : '#E76F51';
  }

  statusColor(s: string): string {
    if (s === 'Crítico') return '#C0392B';
    if (s === 'Bajo') return '#C0850A';
    return '#2D7D52';
  }

  statusBg(s: string): string {
    if (s === 'Crítico') return '#FEECEC';
    if (s === 'Bajo') return '#FFF3E0';
    return '#E8F8F0';
  }
}
