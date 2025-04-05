import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from 'dotenv';
dotenv.config();

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});


server.tool(
  "direction_search_by_coordinates",
  {
    originLongitude: z.number(),
    originLatitude: z.number(),

    destLongitude: z.number(),
    destLatitude: z.number(),
  },
  async ({
    originLongitude,
    originLatitude,
    destLongitude,
    destLatitude,
  }: {
    originLongitude: number;
    originLatitude: number;
    destLongitude: number;
    destLatitude: number;
  }) => {
    const response = await fetch(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${originLongitude},${originLatitude}&destination=${destLongitude},${destLatitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data;
  }
);




server.tool(
  "direction_search_by_names",
  {
    originAddress: z.string(),
    destAddress: z.string()
  },
  async ({
    originAddress,
    destAddress
  }: {
    originAddress: string;
    destAddress: string;
  }) => {
    const [originResult, destResult]: [any, any] = await Promise.all([
      (async () => {
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/address?query=${originAddress}`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Kakao geocode API request failed for origin: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      })(),
      (async () => {
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/address?query=${destAddress}`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Kakao geocode API request failed for destination: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      })()
    ]);

    // Add basic error handling for geocoding results
    if (!originResult?.documents?.[0]?.x || !originResult?.documents?.[0]?.y ||
        !destResult?.documents?.[0]?.x || !destResult?.documents?.[0]?.y) {
      // Consider returning a more informative error structure for MCP
      return { error: "Geocoding failed or returned incomplete data for one or both locations." };
    }

    const originLongitude = originResult.documents[0].x;
    const originLatitude = originResult.documents[0].y;
    const destLongitude = destResult.documents[0].x;
    const destLatitude = destResult.documents[0].y;

    const response = await fetch(
      `https://apis-navi.kakaomobility.com/v1/directions?origin=${originLongitude},${originLatitude}&destination=${destLongitude},${destLatitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    return data;
  }
);


server.tool(
  "geocode",
  {
    placeName: z.string(),
  },
  async ({ placeName }: { placeName: string }) => {
    const response = await fetch(`https://dapi.kakao.com/v2/local/search/address?query=${placeName}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }
);



// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri: URL, variables: Record<string, any>) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${variables.name}!`,
      },
    ],
  })
);

// Start receiving messages on stdin and sending messages on stdout
(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
