import { z } from "zod";
import dotenv from "dotenv";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
dotenv.config();

export const directionSearchByAddressSchema = {
  originAddress: z.string(),
  destAddress: z.string(),
};

export const directionSearchByAddressHandler = async ({
  originAddress,
  destAddress,
}: {
  originAddress: string;
  destAddress: string;
}): Promise<CallToolResult> => {
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
        text: "Geocoding failed or returned incomplete data for one or both locations.",
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
};
