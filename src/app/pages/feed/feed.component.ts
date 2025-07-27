import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedService } from '../../services/feed.service';
import { AuthService } from '../../services/auth.service';
import { Post, Comment } from '../../models/post.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feed-container">
      <!-- Create Post Section -->
      <div class="create-post-section">
        <div class="create-post-card">
          <div class="user-avatar">
            <img [src]="currentUserAvatar" alt="Your avatar" />
          </div>
          <div class="post-input-container">
            <textarea 
              [(ngModel)]="newPostContent" 
              placeholder="What's happening in your community?"
              class="post-input"
              rows="3"
            ></textarea>
            <div class="post-actions">
              <button class="post-btn" (click)="createPost()" [disabled]="!newPostContent.trim()">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts Feed -->
      <div class="posts-feed">
        <div class="post-card" *ngFor="let post of posts">
          <!-- Post Header -->
          <div class="post-header">
            <div class="post-author">
              <img [src]="post.authorAvatar" [alt]="post.author" class="author-avatar" />
              <div class="author-info">
                <div class="author-name">{{ post.author }}</div>
                <div class="post-meta">
                  <span class="community-name">{{ post.community }}</span>
                  <span class="post-time">{{ getTimeAgo(post.timestamp) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Post Content -->
          <div class="post-content">
            <p class="post-text">{{ post.content }}</p>
            <img *ngIf="post.imageUrl" [src]="post.imageUrl" [alt]="post.content" class="post-image" />
          </div>

          <!-- Post Actions -->
          <div class="post-actions">
            <button 
              class="action-btn like-btn" 
              [class.liked]="post.isLiked"
              (click)="likePost(post.id)"
            >
              <span class="action-icon">❤️</span>
              <span class="action-count">{{ post.likes }}</span>
            </button>
            <button 
              class="action-btn comment-btn"
              (click)="toggleComments(post.id)"
            >
              <span class="action-icon">💬</span>
              <span class="action-count">{{ post.comments.length }}</span>
            </button>
          </div>

          <!-- Comments Section -->
          <div class="comments-section" *ngIf="expandedPosts.has(post.id)">
            <!-- Existing Comments -->
            <div class="comment" *ngFor="let comment of post.comments">
              <div class="comment-header">
                <img [src]="comment.authorAvatar" [alt]="comment.author" class="comment-avatar" />
                <div class="comment-info">
                  <div class="comment-author">{{ comment.author }}</div>
                  <div class="comment-time">{{ getTimeAgo(comment.timestamp) }}</div>
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
            </div>

            <!-- Add Comment -->
            <div class="add-comment">
              <div class="comment-input-container">
                <img [src]="currentUserAvatar" [alt]="currentUser" class="comment-input-avatar" />
                <input 
                  [(ngModel)]="newComments[post.id]" 
                  placeholder="Add a comment..."
                  class="comment-input"
                  (keyup.enter)="addComment(post.id)"
                />
                <button 
                  class="comment-submit-btn"
                  (click)="addComment(post.id)"
                  [disabled]="!(newComments[post.id] || '').trim()"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feed-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .create-post-section {
      margin-bottom: 20px;
    }

    .create-post-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 15px;
    }

    .user-avatar img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .post-input-container {
      flex: 1;
    }

    .post-input {
      width: 100%;
      border: none;
      resize: none;
      font-size: 16px;
      font-family: inherit;
      outline: none;
      margin-bottom: 10px;
    }

    .post-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      float: right;
    }

    .post-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .posts-feed {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .post-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .post-header {
      margin-bottom: 15px;
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-name {
      font-weight: 600;
      font-size: 16px;
      color: #333;
    }

    .post-meta {
      display: flex;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }

    .community-name {
      color: #667eea;
      font-weight: 500;
    }

    .post-content {
      margin-bottom: 15px;
    }

    .post-text {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin-bottom: 15px;
    }

    .post-image {
      width: 100%;
      border-radius: 8px;
      object-fit: cover;
      max-height: 400px;
    }

    .post-actions {
      display: flex;
      gap: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 20px;
      transition: background-color 0.2s;
    }

    .action-btn:hover {
      background-color: #f0f0f0;
    }

    .action-btn.liked {
      color: #e74c3c;
    }

    .action-icon {
      font-size: 18px;
    }

    .action-count {
      font-size: 14px;
      font-weight: 500;
    }

    .comments-section {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .comment {
      margin-bottom: 15px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .comment-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .comment-author {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .comment-time {
      font-size: 12px;
      color: #666;
    }

    .comment-content {
      font-size: 14px;
      line-height: 1.4;
      color: #333;
    }

    .add-comment {
      margin-top: 15px;
    }

    .comment-input-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .comment-input-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .comment-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 8px 15px;
      font-size: 14px;
      outline: none;
    }

    .comment-input:focus {
      border-color: #667eea;
    }

    .comment-submit-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .comment-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  newPostContent = '';
  newComments: { [postId: string]: string } = {};
  expandedPosts = new Set<string>();
  currentUser = '';
  currentUserAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100';

  constructor(
    private feedService: FeedService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser() || 'Anonymous';
    this.loadPosts();
  }

  loadPosts() {
    this.feedService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  createPost() {
    if (this.newPostContent.trim()) {
      this.feedService.createPost({
        author: this.currentUser,
        authorAvatar: this.currentUserAvatar,
        community: 'General',
        content: this.newPostContent
      });
      this.newPostContent = '';
    }
  }

  likePost(postId: string) {
    this.feedService.likePost(postId);
  }

  toggleComments(postId: string) {
    if (this.expandedPosts.has(postId)) {
      this.expandedPosts.delete(postId);
    } else {
      this.expandedPosts.add(postId);
    }
  }

  addComment(postId: string) {
    const commentText = this.newComments[postId];
    if (commentText?.trim()) {
      this.feedService.addComment(postId, {
        author: this.currentUser,
        authorAvatar: this.currentUserAvatar,
        content: commentText
      });
      this.newComments[postId] = '';
    }
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
