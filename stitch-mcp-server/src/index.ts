import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StitchService } from './services/stitch.js';
import { VibeBackendService } from './services/vibe-backend.js';
import { registerTools } from './tools.js';
import logger from './utils/logger.js';

async function main() {
  const apiKey = process.env.STITCH_API_KEY;
  const baseUrl = process.env.STITCH_BASE_URL || 'https://api.stitch.ai/v1';

  if (!apiKey) {
    logger.error('Missing STITCH_API_KEY environment variable. Exiting.');
    process.exit(1);
  }

  // Create the MCP Server
  const server = new McpServer({
    name: 'stitch-mcp-server',
    version: '1.0.0',
  });

  // Initialize the Stitch Service
  const stitchService = new StitchService(apiKey, baseUrl);

  // Initialize the VibeBackend Service (optional – skips if not configured)
  const vibeBackendUrl = process.env.VIBE_BACKEND_URL || 'http://localhost:5000';
  const vibeBackendService = new VibeBackendService(vibeBackendUrl);
  logger.info(`VibeBackend service initialized (base: ${vibeBackendUrl})`);

  // If a default auth token is provided, attach it so protected tools work immediately
  const vibeAuthToken = process.env.VIBE_AUTH_TOKEN;
  if (vibeAuthToken) {
    vibeBackendService.setAuthToken(vibeAuthToken);
    logger.info('[VibeBackend] Pre-configured with auth token');
  }

  // Register all tools (Stitch + VibeConnect)
  registerTools(server, stitchService, vibeBackendService);

  // Connect the server to transport (Stdio by default)
  const transport = new StdioServerTransport();
  
  try {
    await server.connect(transport);
    logger.info('Stitch MCP Server is running and connected via Stdio.');
  } catch (error: any) {
    logger.error(`Failed to start the server: ${error.message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error(`Critical error: ${error.message}`);
  process.exit(1);
});
