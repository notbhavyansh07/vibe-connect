# Stitch MCP Server

A production-ready Model Context Protocol (MCP) server that integrates with the **Stitch AI platform** as its data layer. This server allows AI agents (like Claude Desktop, Cursor, or Gemini) to interact with Stitch for project management and UI generation.

## Features

- **Project Management**: Create and list Stitch projects.
- **Screen Management**: List existing screens/components.
- **UI Generation**: Trigger Stitch's AI to generate new UI components from natural language prompts.
- **MCP Standards Compliant**: Follows the official Model Context Protocol (MCP) standards using Node.js SDK.
- **Production-Ready**: Scalable architecture, clean TypeScript code, and robust logging with Winston.

## Prerequisites

- Node.js (v18+)
- npm or yarn
- A valid **Stitch API Key** (from the [Stitch Platform](https://stitch.ai))

## Setup Instructions

1. **Clone or Copy the Files** into a directory (e.g., `stitch-mcp-server`).
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your actual credentials:
   ```bash
   STITCH_API_KEY=your_actual_key_here
   STITCH_BASE_URL=https://api.stitch.ai/v1
   ```
4. **Build the Project**:
   ```bash
   npm run build
   ```
5. **Run the Server**: (Uses Stdio for communication)
   ```bash
   npm start
   ```

## Development & Testing

### Run in Development Mode
To run without building:
```bash
npm run dev
```

### Test using MCP Inspector
The **MCP Inspector** provides a browser GUI to interact with and debug your server:
1. Ensure the project is built (`npm run build`).
2. Run the inspector:
   ```bash
   npm run inspector
   ```
3. Open the URL provided in the terminal to test tool calling!

### Local Test using Terminal (Curl/Postman)
Since this server uses **Stdio** for standard AI agents, local testing via HTTP isn't directly supported unless you switch to an SSE transport. However, you can use the **MCP Inspector** as a proxy for testing.

## Logging & Debugging
- Logs are output to the console (using Winston).
- Set `LOG_LEVEL=debug` in `.env` for more verbose output.

## Folder Structure

```
stitch-mcp-server/
├── src/
│   ├── index.ts        # Entry point & Server initialization
│   ├── server.ts       # MCP Server instance & transport
│   ├── tools.ts        # Tool registration & schemas
│   ├── services/
│   │   └── stitch.ts   # Stitch API integration logic (Service Layer)
│   └── utils/
│       └── logger.ts   # Winston logging utility
├── .env                # Secret credentials
├── tsconfig.json       # TypeScript configuration
└── package.json        # scripts and dependencies
```

## Example Request/Response

### Request (from AI Agent)
```json
{
  "method": "callTool",
  "params": {
    "name": "create-stitch-project",
    "arguments": {
      "title": "My New App"
    }
  }
}
```

### Response (from MCP Server)
```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Project created successfully! ID: proj_123456, Title: My New App"
      }
    ]
  }
}
```

## Optimization
- **Caching**: The `StitchService` can be extended with in-memory caching to reduce API latency.
- **Retries**: Axios configurations can be added for automatic retries on transient network errors.
- **Modular Scaling**: New tools can be easily added in `tools.ts` by integrating with more Stitch endpoints in `stitch.ts`.
