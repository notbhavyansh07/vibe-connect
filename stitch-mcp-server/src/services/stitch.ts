import axios, { AxiosInstance } from 'axios';
import logger from '../utils/logger.js';

export interface StitchProject {
  id: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface StitchScreen {
  id: string;
  name: string;
  project_id: string;
  content: any;
}

export class StitchService {
  private client: AxiosInstance;

  constructor(apiKey: string, baseUrl: string = 'https://api.stitch.ai/v1') {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createProject(title: string): Promise<StitchProject> {
    try {
      logger.info(`Creating Stitch project: ${title}`);
      const response = await this.client.post('/projects', { title });
      return response.data;
    } catch (error: any) {
      logger.error(`Error creating project: ${error.message}`);
      throw new Error(`Stitch API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async listScreens(projectId: string): Promise<StitchScreen[]> {
    try {
      logger.info(`Listing screens for project: ${projectId}`);
      const response = await this.client.get(`/projects/${projectId}/screens`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error listing screens: ${error.message}`);
      throw new Error(`Stitch API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  async generateUI(prompt: string, projectId: string): Promise<StitchScreen> {
    try {
      logger.info(`Generating UI for project ${projectId} with prompt: ${prompt}`);
      const response = await this.client.post(`/projects/${projectId}/generate`, { prompt });
      return response.data;
    } catch (error: any) {
      logger.error(`Error generating UI: ${error.message}`);
      throw new Error(`Stitch API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}
