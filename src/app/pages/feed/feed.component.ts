import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  people = [
    { name: 'Alice Smith', location: 'Downtown' },
    { name: 'Bob Johnson', location: 'Suburb' },
    { name: 'Charlie Rose', location: 'Uptown' },
    { name: 'Dana Lee', location: 'City Center' }
  ];
}
