import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-topic-resource',
  imports: [RouterLink],
  templateUrl: './topic-resource.html',
  styleUrl: './topic-resource.css',
})
export class TopicResource implements OnInit {
  private route = inject(ActivatedRoute);

  topicName = signal('');
  groupCode = signal('');

  ngOnInit(): void {
    this.topicName.set(decodeURIComponent(this.route.snapshot.paramMap.get('topicName') || ''));
    this.groupCode.set(this.route.snapshot.parent?.paramMap.get('groupCode') || '');
  }
}
