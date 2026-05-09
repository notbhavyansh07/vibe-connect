import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { VibeBackendService } from '../services/vibe-backend.js';
import logger from '../utils/logger.js';

export function registerVibeTools(server: McpServer, vibeService: VibeBackendService) {
  // ── get-vibe-user ─────────────────────────────────────────
  server.tool(
    'get-vibe-user',
    'Fetches a VibeConnect user profile by their handle.',
    {
      handle: z.string().describe('The user handle (e.g., "johndoe") to fetch the profile for'),
    },
    async ({ handle }) => {
      try {
        const user = await vibeService.getUser(handle);
        return {
          content: [{ type: 'text', text: JSON.stringify(user, null, 2) }],
        };
      } catch (error: any) {
        logger.error(`Tool get-vibe-user failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to fetch user: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── get-vibe-feed ─────────────────────────────────────────
  server.tool(
    'get-vibe-feed',
    'Fetches the personalized VibeConnect feed. If authenticated, returns the personalized feed; otherwise returns the public feed.',
    {
      sort: z.string().optional().describe('Sort order for public feed (e.g., "newest", "trending")'),
      page: z.number().optional().describe('Page number for pagination'),
      tag: z.string().optional().describe('Filter feed by a specific hashtag tag'),
    },
    async ({ sort, page, tag }) => {
      try {
        let feed;
        if (vibeService.isAuthenticated()) {
          feed = await vibeService.getPersonalizedFeed(page);
        } else {
          feed = await vibeService.getFeed(sort, page, tag);
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(feed, null, 2) }],
        };
      } catch (error: any) {
        logger.error(`Tool get-vibe-feed failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to fetch feed: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── get-vibe-matches ──────────────────────────────────────
  server.tool(
    'get-vibe-matches',
    'Fetches top vibe-match users from VibeConnect. Returns users with the highest compatibility scores. Requires authentication.',
    {
      limit: z.number().optional().describe('Maximum number of matches to return (default 10)'),
    },
    async ({ limit }) => {
      try {
        if (!vibeService.isAuthenticated()) {
          return {
            content: [{ type: 'text', text: 'Authentication required. Please set the auth token on the VibeBackendService first.' }],
            isError: true,
          };
        }
        const matches = await vibeService.getVibeMatches(limit);
        return {
          content: [{ type: 'text', text: JSON.stringify(matches, null, 2) }],
        };
      } catch (error: any) {
        logger.error(`Tool get-vibe-matches failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to fetch vibe matches: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // ── get-vibe-notifications ────────────────────────────────
  server.tool(
    'get-vibe-notifications',
    'Fetches the current user\'s notifications from VibeConnect. Requires authentication.',
    {
      page: z.number().optional().describe('Page number for pagination'),
      limit: z.number().optional().describe('Maximum number of notifications to return'),
    },
    async ({ page, limit }) => {
      try {
        if (!vibeService.isAuthenticated()) {
          return {
            content: [{ type: 'text', text: 'Authentication required. Please set the auth token on the VibeBackendService first.' }],
            isError: true,
          };
        }
        const notifications = await vibeService.getNotifications(page, limit);
        return {
          content: [{ type: 'text', text: JSON.stringify(notifications, null, 2) }],
        };
      } catch (error: any) {
        logger.error(`Tool get-vibe-notifications failed: ${error.message}`);
        return {
          content: [{ type: 'text', text: `Failed to fetch notifications: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
}
