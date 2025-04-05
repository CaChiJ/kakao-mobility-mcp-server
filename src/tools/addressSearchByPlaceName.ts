import { z } from "zod";
import dotenv from "dotenv";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
dotenv.config();

export const addressSearchByPlaceNameSchema = {
  placeName: z.string(),
};

export const addressSearchByPlaceNameHandler = async ({ placeName }: { placeName: string }): Promise<CallToolResult> => {
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
};
