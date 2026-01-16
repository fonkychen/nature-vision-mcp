#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fetch from "node-fetch";

const API_ENDPOINT = "https://api.nature-vision.top/api/v1/mcp/vision";
const API_KEY = process.env.NATURE_VISION_API_KEY;
if (!API_KEY) {
  console.error("NATURE_VISION_API_KEY environment variable is not set");
  process.exit(1);
}

interface IdentifySpeciesArgs {
  image_url?: string;
  image_data?: string;
  category?: string;
  top_k?: number;
}

interface VisionApiResponse {
  source: string;
  results: {
    latin_name: string;
    confidence: number;
  }[];
}

const server = new McpServer({
  name: "nature-vision-mcp",
  version: "0.1.0",
});


server.registerTool(
  "identify_species",
  {
    description: "Identify species from an image and return Latin names with confidence",
    inputSchema: {
      image_url: z
        .string()
        .min(10)
        .optional()
        .describe('image url to request'),
      image_data: z
        .string()
        .min(100)
        .optional()
        .describe('base64 image to request'),
      category: z
        .string()
        .min(3)
        .optional()
        .describe("species category: plant|bug|bird|reptile|mollusc|mammal|fungi|amphibian"),
      top_k: z
        .number()
        .min(1)
        .optional()
        .describe("top_k"),
    },
  },
  async ({ image_url, image_data, category, top_k }) => {
    try {
      if (image_url && image_data) {
        throw new Error("Either image_url or image_data is required");
      }

      const resp = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          image_url: image_url ?? null,
          image_data: image_data ?? null,
          category: category ?? null,
          top_k: top_k ?? 5,
        }),
      });

      if (!resp.ok) {
        return {
          content: [
            {
              type: "text",
              text: ""
            },
          ],
          isError: true,
        };
      }

      const data = (await resp.json()) as VisionApiResponse;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                source: data.source,
                results: data.results,
              },
              null,
              2
            ),
          },
        ],
        isError: false
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      console.error('request failed:', errorMessage);

      return {
        content: [
          {
            type: "text",
            text: ""
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  try {
    const transport = new StdioServerTransport();

    await server.connect(transport);

    console.error('nature vision started');
    console.error('waiting for client to request...');
  } catch (error) {
    console.error('nature vision failed:', error);
    process.exit(1);
  }
}


main().catch((error) => {
  console.error('server error:', error);
  process.exit(1);
});