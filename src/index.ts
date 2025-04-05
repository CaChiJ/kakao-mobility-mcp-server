import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
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
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(data),
      }],
      isError: false,
    };
  }
);

server.tool(
  "direction_search_by_address",
  {
    originAddress: z.string(),
    destAddress: z.string(),
  },
  async ({
    originAddress,
    destAddress,
  }: {
    originAddress: string;
    destAddress: string;
  }) => {
    const [originResult, destResult]: [any, any] = await Promise.all([
      (async () => {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/address?query=${originAddress}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Kakao geocode API request failed for origin: ${response.statusText}`
          );
        }
        const data = await response.json();
        return data;
      })(),
      (async () => {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/address?query=${destAddress}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Kakao geocode API request failed for destination: ${response.statusText}`
          );
        }
        const data = await response.json();
        return data;
      })(),
    ]);

    // Add basic error handling for geocoding results
    if (
      !originResult?.documents?.[0]?.x ||
      !originResult?.documents?.[0]?.y ||
      !destResult?.documents?.[0]?.x ||
      !destResult?.documents?.[0]?.y
    ) {
      // Consider returning a more informative error structure for MCP
      return {
        content: [{
          type: "text",
          text: "Geocoding failed or returned incomplete data for one or both locations."
        }],
        isError: true,
      };
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
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(data),
      }],
      isError: false,
    };
  }
);


server.tool(
  "address_search_by_place_name",
  {
    placeName: z.string(),
  },
  async ({ placeName }: { placeName: string }) => {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword?query=${placeName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    const data = await response.json();

    return {
      content: [{
        type: "text",
        text: JSON.stringify(data),
      }],
      isError: false,
    };
  }
);

server.tool(
  "geocode",
  {
    placeName: z.string(),
  },
  async ({ placeName }: { placeName: string }) => {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address?query=${placeName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );
    const data = await response.json();

    return {
      content: [{
        type: "text",
        text: JSON.stringify(data),
      }],
      isError: false,
    };
  }
);

server.tool(
  "future_direction_search_by_coordinates",
  {
    originLatitude: z.number(),
    originLongitude: z.number(),
    destinationLatitude: z.number(),
    destinationLongitude: z.number(),
    departureTime: z.string(),
    waypoints: z.string().optional(),
    priority: z.enum(["RECOMMEND", "TIME", "DISTANCE"]).optional(),
    avoid: z.string().optional(),
    roadEvent: z.number().optional(),
    alternatives: z.boolean().optional(),
    roadDetails: z.boolean().optional(),
    carType: z.number().optional(),
    carFuel: z.enum(["GASOLINE", "DIESEL", "LPG"]).optional(),
    carHipass: z.boolean().optional(),
    summary: z.boolean().optional(),
  },
  async ({
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
    departureTime,
    waypoints,
    priority,
    avoid,
    roadEvent,
    alternatives,
    roadDetails,
    carType,
    carFuel,
    carHipass,
    summary,
  }) => {
    let url = `https://apis-navi.kakaomobility.com/v1/future/directions?origin=${originLongitude},${originLatitude}&destination=${destinationLongitude},${destinationLatitude}&departure_time=${departureTime}`;

    if (waypoints) url += `&waypoints=${waypoints}`;
    if (priority) url += `&priority=${priority}`;
    if (avoid) url += `&avoid=${avoid}`;
    if (roadEvent !== undefined) url += `&roadevent=${roadEvent}`;
    if (alternatives !== undefined) url += `&alternatives=${alternatives}`;
    if (roadDetails !== undefined) url += `&road_details=${roadDetails}`;
    if (carType !== undefined) url += `&car_type=${carType}`;
    if (carFuel) url += `&car_fuel=${carFuel}`;
    if (carHipass !== undefined) url += `&car_hipass=${carHipass}`;
    if (summary !== undefined) url += `&summary=${summary}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
    });

    const data = await response.json();
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(data),
      }],
      isError: false,
    };
  }
);

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();