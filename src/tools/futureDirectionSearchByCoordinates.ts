import { z } from "zod";
import dotenv from "dotenv";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
dotenv.config();

export const futureDirectionSearchByCoordinatesSchema = {
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
};

export const futureDirectionSearchByCoordinatesHandler = async ({
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
}: {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  departureTime: string;
  waypoints?: string;
  priority?: string;
  avoid?: string;
  roadEvent?: number;
  alternatives?: boolean;
  roadDetails?: boolean;
  carType?: number;
  carFuel?: string;
  carHipass?: boolean;
  summary?: boolean;
}): Promise<CallToolResult> => {
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
};
