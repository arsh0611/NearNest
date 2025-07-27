import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Event {
  id: string;
  title: string;
  description: string;
  community: string;
  communityAvatar: string;
  date: Date;
  location: string;
  eventType: 'volunteer' | 'gathering' | 'workshop' | 'meetup';
  attendees: number;
  maxAttendees: number;
  isAttending: boolean;
  organizer: string;
  organizerAvatar: string;
  tags: string[];
  imageUrl?: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="events-container">
      <!-- Events Header -->
      <div class="events-header">
        <h1>Community Events</h1>
        <p>Discover and join events in your communities</p>
      </div>

      <!-- Event Filters -->
      <div class="event-filters">
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'all'"
          (click)="setFilter('all')"
        >
          All Events
        </button>
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'volunteer'"
          (click)="setFilter('volunteer')"
        >
          🛠️ Volunteer
        </button>
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'gathering'"
          (click)="setFilter('gathering')"
        >
          🎉 Gatherings
        </button>
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'workshop'"
          (click)="setFilter('workshop')"
        >
          📚 Workshops
        </button>
        <button 
          class="filter-btn" 
          [class.active]="activeFilter === 'meetup'"
          (click)="setFilter('meetup')"
        >
          🤝 Meetups
        </button>
      </div>

      <!-- Events List -->
      <div class="events-list">
        <div class="event-card" *ngFor="let event of filteredEvents">
          <div class="event-image" *ngIf="event.imageUrl">
            <img [src]="event.imageUrl" [alt]="event.title" />
            <div class="event-type-badge" [class]="event.eventType">
              {{ getEventTypeLabel(event.eventType) }}
            </div>
          </div>
          
          <div class="event-content">
            <div class="event-header">
              <div class="community-info">
                <img [src]="event.communityAvatar" [alt]="event.community" class="community-avatar" />
                <span class="community-name">r/{{ event.community }}</span>
              </div>
              <div class="event-date">
                {{ getEventDate(event.date) }}
              </div>
            </div>

            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-description">{{ event.description }}</p>

            <div class="event-details">
              <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span>{{ event.location }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">👥</span>
                <span>{{ event.attendees }}/{{ event.maxAttendees }} attending</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">👤</span>
                <span>Organized by {{ event.organizer }}</span>
              </div>
            </div>

            <div class="event-tags">
              <span class="tag" *ngFor="let tag of event.tags">{{ tag }}</span>
            </div>

            <div class="event-actions">
              <button 
                class="attend-btn" 
                [class.attending]="event.isAttending"
                (click)="toggleAttendance(event)"
                [disabled]="event.attendees >= event.maxAttendees && !event.isAttending"
              >
                <span *ngIf="!event.isAttending">
                  {{ event.attendees >= event.maxAttendees ? 'Full' : 'Attend' }}
                </span>
                <span *ngIf="event.isAttending">✓ Attending</span>
              </button>
              <button class="share-btn">Share</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="filteredEvents.length === 0">
        <div class="empty-icon">📅</div>
        <h3>No events found</h3>
        <p>Check back later for new community events!</p>
      </div>
    </div>
  `,
  styles: [`
    .events-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .events-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .events-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1b;
      margin: 0 0 8px 0;
    }

    .events-header p {
      color: #7c7c7c;
      font-size: 16px;
      margin: 0;
    }

    .event-filters {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: white;
      border: 1px solid #edeff1;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #7c7c7c;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      background: #f6f7f8;
      color: #1a1a1b;
    }

    .filter-btn.active {
      background: #0079d3;
      color: white;
      border-color: #0079d3;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .event-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .event-card:hover {
      transform: translateY(-2px);
    }

    .event-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .event-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .event-type-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: white;
    }

    .event-type-badge.volunteer {
      background: #ff6b35;
    }

    .event-type-badge.gathering {
      background: #4ecdc4;
    }

    .event-type-badge.workshop {
      background: #45b7d1;
    }

    .event-type-badge.meetup {
      background: #96ceb4;
    }

    .event-content {
      padding: 20px;
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .community-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .community-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }

    .community-name {
      font-size: 14px;
      font-weight: 600;
      color: #0079d3;
    }

    .event-date {
      font-size: 14px;
      color: #7c7c7c;
    }

    .event-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1b;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .event-description {
      color: #1a1a1b;
      line-height: 1.5;
      margin: 0 0 16px 0;
    }

    .event-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #7c7c7c;
    }

    .detail-icon {
      font-size: 16px;
    }

    .event-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .tag {
      background: #f6f7f8;
      color: #1a1a1b;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .event-actions {
      display: flex;
      gap: 12px;
    }

    .attend-btn {
      flex: 1;
      background: #0079d3;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .attend-btn:hover:not(:disabled) {
      background: #005fa3;
    }

    .attend-btn.attending {
      background: #27ae60;
    }

    .attend-btn.attending:hover {
      background: #229954;
    }

    .attend-btn:disabled {
      background: #e9ecef;
      color: #7c7c7c;
      cursor: not-allowed;
    }

    .share-btn {
      background: #f6f7f8;
      color: #1a1a1b;
      border: 1px solid #edeff1;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .share-btn:hover {
      background: #e9ecef;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #7c7c7c;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #1a1a1b;
    }

    .empty-state p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .events-container {
        padding: 15px;
      }
      
      .event-filters {
        justify-content: center;
      }
      
      .event-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class EventsComponent implements OnInit {
  activeFilter = 'all';
  events: Event[] = [
    {
      id: '1',
      title: 'Community Garden Cleanup',
      description: 'Join us for a morning of gardening and community building! We\'ll be cleaning up the local community garden and planting new vegetables. All skill levels welcome.',
      community: 'Downtown Foodies',
      communityAvatar: 'https://images.unsplash.com/photo-1504674900240-9c9c0c1d0b1a?w=100',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      location: 'Central Park Community Garden',
      eventType: 'volunteer',
      attendees: 12,
      maxAttendees: 20,
      isAttending: false,
      organizer: 'Sarah Chen',
      organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      tags: ['Gardening', 'Community', 'Outdoor'],
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'
    },
    {
      id: '2',
      title: 'Tech Meetup: AI in 2024',
      description: 'An evening of networking and learning about the latest developments in artificial intelligence. Guest speakers from local tech companies will share insights.',
      community: 'Tech Enthusiasts',
      communityAvatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      location: 'Downtown Tech Hub',
      eventType: 'meetup',
      attendees: 8,
      maxAttendees: 15,
      isAttending: true,
      organizer: 'Alex Rodriguez',
      organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      tags: ['AI', 'Networking', 'Technology']
    },
    {
      id: '3',
      title: 'Yoga & Wellness Workshop',
      description: 'A relaxing afternoon of yoga, meditation, and wellness tips. Perfect for beginners and experienced practitioners alike. Mats provided.',
      community: 'Fitness & Wellness',
      communityAvatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      location: 'Wellness Center',
      eventType: 'workshop',
      attendees: 18,
      maxAttendees: 25,
      isAttending: false,
      organizer: 'Lisa Park',
      organizerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      tags: ['Yoga', 'Wellness', 'Meditation'],
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'
    },
    {
      id: '4',
      title: 'Food Festival Planning Meeting',
      description: 'Help us plan the annual downtown food festival! We need volunteers for coordination, marketing, and event management. Food and drinks provided.',
      community: 'Downtown Foodies',
      communityAvatar: 'https://images.unsplash.com/photo-1504674900240-9c9c0c1d0b1a?w=100',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      location: 'Community Center',
      eventType: 'volunteer',
      attendees: 6,
      maxAttendees: 12,
      isAttending: false,
      organizer: 'Mike Johnson',
      organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      tags: ['Planning', 'Food', 'Festival']
    },
    {
      id: '5',
      title: 'Summer Block Party',
      description: 'Annual neighborhood block party with live music, food trucks, games, and activities for all ages. Bring your family and friends!',
      community: 'Downtown Foodies',
      communityAvatar: 'https://images.unsplash.com/photo-1504674900240-9c9c0c1d0b1a?w=100',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      location: 'Main Street',
      eventType: 'gathering',
      attendees: 45,
      maxAttendees: 100,
      isAttending: false,
      organizer: 'Emma Wilson',
      organizerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      tags: ['Party', 'Music', 'Family'],
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600'
    }
  ];

  get filteredEvents(): Event[] {
    if (this.activeFilter === 'all') {
      return this.events;
    }
    return this.events.filter(event => event.eventType === this.activeFilter);
  }

  ngOnInit() {
    // Component initialization
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  toggleAttendance(event: Event) {
    if (event.isAttending) {
      event.attendees--;
      event.isAttending = false;
    } else if (event.attendees < event.maxAttendees) {
      event.attendees++;
      event.isAttending = true;
    }
  }

  getEventTypeLabel(type: string): string {
    const labels = {
      volunteer: 'Volunteer',
      gathering: 'Gathering',
      workshop: 'Workshop',
      meetup: 'Meetup'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getEventDate(date: Date): string {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
} 