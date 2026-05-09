import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StitchService } from './services/stitch.js';
import { VibeBackendService } from './services/vibe-backend.js';
import { registerVibeTools } from './tools/vibe-tools.js';
import logger from './utils/logger.js';

// Export so the index can pass both services together
export { registerVibeTools } from './tools/vibe-tools.js';

export function registerTools(server: McpServer, stitchService: StitchService, vibeService?: VibeBackendService) {
  // 1. Tool to create a project
  server.tool(
    'create-stitch-project',
    'Creates a new Stitch project for UI design.',
    {
      title: z.string().describe('The title of the project to create'),
    },
    async ({ title }) => {
      try {
        const project = await stitchService.createProject(title);
        return {
          content: [{ type: 'text', text: `Project created successfully! ID: ${project.id}, Title: ${project.title}` }],
        };
      } catch (error: any) {
        logger.error(`Tool create-stitch-project failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to create project: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // 2. Tool to list screens
  server.tool(
    'list-stitch-screens',
    'Lists all screens within a given Stitch project.',
    {
      projectId: z.string().describe('The ID of the project to list screens for'),
    },
    async ({ projectId }) => {
      try {
        const screens = await stitchService.listScreens(projectId);
        const screenList = screens.map(s => `- ${s.name} (ID: ${s.id})`).join('\n');
        return {
          content: [{ type: 'text', text: `Screens in project ${projectId}:\n${screenList || 'No screens found.'}` }],
        };
      } catch (error: any) {
        logger.error(`Tool list-stitch-screens failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to list screens: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // 3. Tool to generate UI
  server.tool(
    'generate-stitch-ui',
    'Generates a new UI screen/component in a Stitch project from a text prompt.',
    {
      projectId: z.string().describe('The project ID to generate the screen for'),
      prompt: z.string().describe('The input text describing the UI to generate (e.g., "A modern login page for a dark mode app")'),
    },
    async ({ projectId, prompt }) => {
      try {
        const screen = await stitchService.generateUI(prompt, projectId);
        return {
          content: [{ type: 'text', text: `Successfully generated UI: ${screen.name} (ID: ${screen.id})` }],
        };
      } catch (error: any) {
        logger.error(`Tool generate-stitch-ui failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to generate UI: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── Register VibeConnect tools (if service provided) ──────
  if (vibeService) {
    registerVibeTools(server, vibeService);
  }
}