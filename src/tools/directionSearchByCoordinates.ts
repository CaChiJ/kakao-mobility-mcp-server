import { z } from "zod";
import dotenv from "dotenv";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
dotenv.config();

export const directionSearchByCoordinatesSchema = {
  originLongitude: z.number(),
  originLatitude: z.number(),
  destLongitude: z.number(),
  destLatitude: z.number(),
};

export const directionSearchByCoordinatesHandler = async ({
  originLongitude,
  originLatitude,
  destLongitude,
  destLatitude,
}: {
  originLongitude: number;
  originLatitude: number;
  destLongitude: number;
  destLatitude: number;
}): Promise<CallToolResult> => {
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
};
