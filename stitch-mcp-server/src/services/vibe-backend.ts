import axios, { AxiosInstance } from 'axios';
import logger from '../utils/logger.js';

export interface VibeUser {
  _id: string;
  displayName: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  vibes?: string[];
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  [key: string]: any;
}

export interface VibePost {
  _id: string;
  userId: VibeUser | string;
  content: string;
  media?: string[];
  hashtags?: string[];
  likeCount?: number;
  commentCount?: number;
  createdAt: string;
  [key: string]: any;
}

export interface VibeMatch {
  userId: string;
  displayName: string;
  handle: string;
  matchScore: number;
  vibes?: string[];
  [key: string]: any;
}

export interface VibeNotification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  [key: string]: any;
}

export class VibeBackendService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
  }

  // Set the auth token for protected endpoints after the user logs in
  setAuthToken(token: string): void {
    this.authToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    logger.info('[VibeBackend] Auth token set');
  }

  // Clear the auth token (logout)
  clearAuthToken(): void {
    this.authToken = null;
    delete this.client.defaults.headers.common['Authorization'];
    logger.info('[VibeBackend] Auth token cleared');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  // ── Auth ──────────────────────────────────────────────────
  async login(email: string, password: string): Promise<any> {
    try {
      logger.info(`[VibeBackend] Attempting login for ${email}`);
      const response = await this.client.post('/api/auth/login', { email, password });
      const token = response.data.token;
      if (token) {
        this.setAuthToken(token);
      }
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Login error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async register(displayName: string, handle: string, email: string, password: string): Promise<any> {
    try {
      logger.info(`[VibeBackend] Registering user: ${handle}`);
      const response = await this.client.post('/api/auth/register', {
        displayName,
        handle,
        email,
        password,
      });
      const token = response.data.token;
      if (token) {
        this.setAuthToken(token);
      }
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Register error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getMe(): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching current user (getMe)');
      const response = await this.client.get('/api/auth/me');
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] GetMe error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // ── Users ─────────────────────────────────────────────────
  async getUser(handle: string): Promise<any> {
    try {
      logger.info(`[VibeBackend] Fetching user profile: ${handle}`);
      const response = await this.client.get(`/api/users/${handle}`);
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Get user error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getRecommendedUsers(limit?: number): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching recommended users');
      const response = await this.client.get('/api/users/recommended', {
        params: limit ? { limit } : {},
      });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Recommended users error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // ── Posts ─────────────────────────────────────────────────
  async getFeed(sort?: string, page?: number, tag?: string): Promise<any> {
    try {
      logger.info(`[VibeBackend] Fetching feed (sort=${sort}, page=${page}, tag=${tag})`);
      const response = await this.client.get('/api/posts', {
        params: { sort, page, tag },
      });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Get feed error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getTrending(limit?: number): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching trending posts');
      const response = await this.client.get('/api/posts/trending', {
        params: limit ? { limit } : {},
      });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Get trending error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getPersonalizedFeed(page?: number, limit?: number): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching personalized feed');
      const response = await this.client.get('/api/posts/personalized', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Personalized feed error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async createPost(content: string, hashtags?: string[], vibe?: string): Promise<any> {
    try {
      logger.info(`[VibeBackend] Creating post: ${content.substring(0, 50)}...`);
      const body: any = { content };
      if (hashtags) body.hashtags = hashtags;
      if (vibe) body.vibe = vibe;
      const response = await this.client.post('/api/posts', body);
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Create post error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // ── Vibe ──────────────────────────────────────────────────
  async getVibeMatches(limit?: number): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching vibe matches');
      const response = await this.client.get('/api/vibe/matches', {
        params: limit ? { limit } : {},
      });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Get vibe matches error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getMyVibes(): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching my vibes');
      const response = await this.client.get('/api/vibe/my-vibes');
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Get my vibes error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // ── Notifications ─────────────────────────────────────────
  async getNotifications(page?: number, limit?: number): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching notifications');
      const response = await this.client.get('/api/notifications', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Get notifications error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async getUnreadCount(): Promise<any> {
    try {
      logger.info('[VibeBackend] Fetching unread notification count');
      const response = await this.client.get('/api/notifications/unread');
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Unread count error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  // ── AI Helpers ────────────────────────────────────────────
  async enhanceContent(content: string): Promise<any> {
    try {
      logger.info('[VibeBackend] Enhancing content via AI');
      const response = await this.client.post('/api/ai/enhance', { content });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Enhance content error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async generateHashtags(content: string): Promise<any> {
    try {
      logger.info('[VibeBackend] Generating hashtags');
      const response = await this.client.post('/api/ai/hashtags', { content });
      return response.data;
    } catch (error: any) {
      logger.error(`[VibeBackend] Generate hashtags error: ${error.message}`);
      throw new Error(`VibeBackend API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}
