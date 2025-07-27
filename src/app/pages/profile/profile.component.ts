import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FeedService } from '../../services/feed.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-banner">
          <div class="profile-avatar">
            <img [src]="userProfile.avatar" [alt]="userProfile.username" />
            <div class="avatar-edit">
              <span>📷</span>
            </div>
          </div>
        </div>
        
        <div class="profile-info">
          <div class="profile-details">
            <h1 class="username">{{ userProfile.username }}</h1>
                         <div class="user-stats">
               <div class="stat">
                 <span class="stat-number">{{ userProfile.posts.length }}</span>
                 <span class="stat-label">Posts</span>
               </div>
               <div class="stat">
                 <span class="stat-number">{{ userProfile.commentCount }}</span>
                 <span class="stat-label">Comments</span>
               </div>
               <div class="stat">
                 <span class="stat-number">{{ userProfile.memberSince }}</span>
                 <span class="stat-label">Member</span>
               </div>
             </div>
            <p class="bio">{{ userProfile.bio }}</p>
          </div>
          
          <div class="profile-actions">
            <button class="edit-profile-btn">Edit Profile</button>
            <button class="settings-btn">⚙️</button>
          </div>
        </div>
      </div>

      <!-- Profile Navigation -->
      <div class="profile-nav">
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'posts'"
          (click)="setActiveTab('posts')"
        >
          Posts
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'comments'"
          (click)="setActiveTab('comments')"
        >
          Comments
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'upvoted'"
          (click)="setActiveTab('upvoted')"
        >
          Upvoted
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'downvoted'"
          (click)="setActiveTab('downvoted')"
        >
          Downvoted
        </button>
      </div>

      <!-- Profile Content -->
      <div class="profile-content">
        <!-- Posts Tab -->
        <div class="tab-content" *ngIf="activeTab === 'posts'">
          <div class="posts-list">
            <div class="post-item" *ngFor="let post of userProfile.posts">
              <div class="post-votes">
                <button class="vote-btn upvote" [class.active]="post.isLiked">
                  ▲
                </button>
                <span class="vote-count">{{ post.likes }}</span>
                <button class="vote-btn downvote" [class.active]="post.isDisliked">
                  ▼
                </button>
              </div>
              
              <div class="post-content">
                <div class="post-header">
                  <span class="community-name">r/{{ post.community }}</span>
                  <span class="post-time">{{ getTimeAgo(post.timestamp) }}</span>
                </div>
                <h3 class="post-title">{{ post.content }}</h3>
                <div class="post-actions">
                  <button class="action-btn">
                    💬 {{ post.comments.length }} Comments
                  </button>
                  <button class="action-btn">Share</button>
                  <button class="action-btn">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Tab -->
        <div class="tab-content" *ngIf="activeTab === 'comments'">
          <div class="comments-list">
                         <div class="comment-item" *ngFor="let comment of userProfile.userComments">
              <div class="comment-votes">
                <button class="vote-btn upvote" [class.active]="comment.isLiked">
                  ▲
                </button>
                <span class="vote-count">{{ comment.likes }}</span>
                <button class="vote-btn downvote" [class.active]="comment.isDisliked">
                  ▼
                </button>
              </div>
              
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-on">Comment on</span>
                  <span class="post-title">{{ comment.postTitle }}</span>
                  <span class="comment-time">{{ getTimeAgo(comment.timestamp) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Upvoted Tab -->
        <div class="tab-content" *ngIf="activeTab === 'upvoted'">
          <div class="empty-state">
            <div class="empty-icon">👍</div>
            <h3>No upvoted posts yet</h3>
            <p>Posts you upvote will appear here</p>
          </div>
        </div>

        <!-- Downvoted Tab -->
        <div class="tab-content" *ngIf="activeTab === 'downvoted'">
          <div class="empty-state">
            <div class="empty-icon">👎</div>
            <h3>No downvoted posts yet</h3>
            <p>Posts you downvote will appear here</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .profile-header {
      position: relative;
    }

    .profile-banner {
      height: 120px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
    }

    .profile-avatar {
      position: absolute;
      bottom: -40px;
      left: 20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid white;
      overflow: hidden;
      cursor: pointer;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-edit {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0,0.7);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .profile-info {
      padding: 50px 20px 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .profile-details {
      flex: 1;
    }

    .username {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1b;
      margin: 0 0 10px 0;
    }

    .user-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1b;
    }

    .stat-label {
      font-size: 12px;
      color: #7c7c7c;
      text-transform: uppercase;
    }

    .bio {
      color: #1a1a1b;
      margin: 0;
      line-height: 1.4;
    }

    .profile-actions {
      display: flex;
      gap: 10px;
    }

    .edit-profile-btn {
      background: #0079d3;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }

    .edit-profile-btn:hover {
      background: #005fa3;
    }

    .settings-btn {
      background: #f6f7f8;
      border: 1px solid #edeff1;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .settings-btn:hover {
      background: #e9ecef;
    }

    .profile-nav {
      display: flex;
      border-bottom: 1px solid #edeff1;
      background: #f6f7f8;
    }

    .nav-tab {
      background: none;
      border: none;
      padding: 16px 24px;
      font-size: 14px;
      font-weight: 600;
      color: #7c7c7c;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .nav-tab:hover {
      background: #e9ecef;
      color: #1a1a1b;
    }

    .nav-tab.active {
      color: #0079d3;
      border-bottom-color: #0079d3;
      background: white;
    }

    .profile-content {
      min-height: 400px;
    }

    .tab-content {
      padding: 20px;
    }

    .post-item, .comment-item {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #edeff1;
    }

    .post-item:last-child, .comment-item:last-child {
      border-bottom: none;
    }

    .post-votes, .comment-votes {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 40px;
    }

    .vote-btn {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #878a8c;
      padding: 2px;
      border-radius: 2px;
    }

    .vote-btn:hover {
      background: #e9ecef;
    }

    .vote-btn.active {
      color: #ff4500;
    }

    .vote-btn.downvote.active {
      color: #7193ff;
    }

    .vote-count {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a1b;
    }

    .post-content, .comment-content {
      flex: 1;
    }

    .post-header, .comment-header {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .community-name {
      color: #0079d3;
      font-weight: 600;
    }

    .post-time, .comment-time {
      color: #7c7c7c;
    }

    .post-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1b;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .post-actions {
      display: flex;
      gap: 16px;
    }

    .action-btn {
      background: none;
      border: none;
      color: #7c7c7c;
      font-size: 12px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 2px;
    }

    .action-btn:hover {
      background: #e9ecef;
    }

    .comment-on {
      color: #7c7c7c;
    }

    .comment-text {
      color: #1a1a1b;
      line-height: 1.4;
      margin: 0;
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
  `]
})
export class ProfileComponent implements OnInit {
  activeTab = 'posts';
     userProfile = {
     username: 'JohnDoe',
     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
     posts: [] as Post[],
     commentCount: 89,
     memberSince: 365,
     bio: 'Passionate about technology, food, and fitness. Always learning and sharing knowledge with the community!',
     userComments: [
      {
        content: 'This is exactly what I was looking for! Thanks for sharing.',
        postTitle: 'Best ramen places in downtown',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        isLiked: false,
        isDisliked: false
      },
      {
        content: 'I\'ve been using this framework for months now. It\'s really powerful!',
        postTitle: 'New AI development framework',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 8,
        isLiked: true,
        isDisliked: false
      }
    ]
  };

  constructor(
    private authService: AuthService,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

     loadUserProfile() {
     // Get current user data
     const currentUserData = this.authService.getCurrentUserData();
     if (currentUserData) {
       this.userProfile.username = currentUserData.username;
       
       // Calculate days since member
       const now = new Date();
       const memberSince = currentUserData.memberSince;
       const diffTime = Math.abs(now.getTime() - memberSince.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       this.userProfile.memberSince = diffDays;
     }

     // Load user's posts
     this.feedService.getPosts().subscribe(posts => {
       this.userProfile.posts = posts.filter(post => post.author === this.userProfile.username);
     });
   }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
}
