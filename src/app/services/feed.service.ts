import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post, Comment, Community } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private posts = new BehaviorSubject<Post[]>([]);
  private communities = new BehaviorSubject<Community[]>([]);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock communities
    const mockCommunities: Community[] = [
      {
        id: '1',
        name: 'Downtown Foodies',
        description: 'Best restaurants and food spots in downtown',
        memberCount: 1247,
        imageUrl: 'https://images.unsplash.com/photo-1504674900240-9c9c0c1d0b1a?w=400'
      },
      {
        id: '2',
        name: 'Tech Enthusiasts',
        description: 'Latest in technology and innovation',
        memberCount: 892,
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400'
      },
      {
        id: '3',
        name: 'Fitness & Wellness',
        description: 'Health, fitness, and wellness tips',
        memberCount: 2156,
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
      }
    ];

    // Mock posts
    const mockPosts: Post[] = [
                   {
               id: '1',
               author: 'Sarah Chen',
               authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
               community: 'Downtown Foodies',
               content: 'Just discovered this amazing ramen place! The broth is incredible and the noodles are perfectly cooked. Has anyone else tried it?',
               imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
               timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
               likes: 24,
               comments: [
                 {
                   id: '1',
                   author: 'Mike Johnson',
                   authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                   content: 'I went there last week! The spicy miso ramen is my favorite.',
                   timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                   likes: 5,
                   replies: []
                 },
                 {
                   id: '2',
                   author: 'Emma Wilson',
                   authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
                   content: 'What\'s the name of the place? I want to try it!',
                   timestamp: new Date(Date.now() - 30 * 60 * 1000),
                   likes: 3,
                   replies: []
                 }
               ],
               isLiked: false,
               isDisliked: false
             },
                   {
               id: '2',
               author: 'Alex Rodriguez',
               authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
               community: 'Tech Enthusiasts',
               content: 'Just finished building my first AI chatbot! It\'s amazing how much you can do with modern APIs. Anyone interested in collaborating on a project?',
               imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
               timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
               likes: 18,
               comments: [
                 {
                   id: '3',
                   author: 'David Kim',
                   authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
                   content: 'What framework did you use? I\'ve been thinking about getting into AI development.',
                   timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                   likes: 7,
                   replies: []
                 }
               ],
               isLiked: true,
               isDisliked: false
             },
                   {
               id: '3',
               author: 'Lisa Park',
               authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
               community: 'Fitness & Wellness',
               content: 'Morning workout complete! 💪 Started with 30 minutes of cardio followed by strength training. What\'s everyone\'s favorite morning routine?',
               imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
               timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
               likes: 31,
               comments: [
                 {
                   id: '4',
                   author: 'Tom Anderson',
                   authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                   content: 'I love starting with yoga! It really sets the tone for the day.',
                   timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                   likes: 12,
                   replies: []
                 }
               ],
               isLiked: false,
               isDisliked: false
             }
    ];

    this.communities.next(mockCommunities);
    this.posts.next(mockPosts);
  }

  getPosts(): Observable<Post[]> {
    return this.posts.asObservable();
  }

  getCommunities(): Observable<Community[]> {
    return this.communities.asObservable();
  }

  likePost(postId: string): void {
    const currentPosts = this.posts.value;
    const postIndex = currentPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
      const post = currentPosts[postIndex];
      if (post.isLiked) {
        post.likes--;
        post.isLiked = false;
      } else {
        post.likes++;
        post.isLiked = true;
      }
      this.posts.next([...currentPosts]);
    }
  }

  addComment(postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'replies'>): void {
    const currentPosts = this.posts.value;
    const postIndex = currentPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        timestamp: new Date(),
        likes: 0,
        replies: []
      };
      
      currentPosts[postIndex].comments.push(newComment);
      this.posts.next([...currentPosts]);
    }
  }

           createPost(post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked' | 'isDisliked'>): void {
           const newPost: Post = {
             ...post,
             id: Date.now().toString(),
             timestamp: new Date(),
             likes: 0,
             comments: [],
             isLiked: false,
             isDisliked: false
           };
    
    const currentPosts = this.posts.value;
    this.posts.next([newPost, ...currentPosts]);
  }
} 