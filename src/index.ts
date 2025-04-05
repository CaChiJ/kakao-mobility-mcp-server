import { config } from 'dotenv';
import { KakaoMobilityClient } from './services/kakaoClient';

// .env 파일 로드
config();

const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
if (!kakaoApiKey) {
  throw new Error('KAKAO_REST_API_KEY is required in environment variables');
}

const client = new KakaoMobilityClient(kakaoApiKey);

export const handlers = {
  async mcp_kakao_mobility_car_route(params: any) {
    const { origin, destination, priority, carFuel, carHipass } = params;
    const result = await client.findCarRoute({
      origin: {
        latitude: parseFloat(origin.split(',')[0]),
        longitude: parseFloat(origin.split(',')[1])
      },
      destination: {
        latitude: parseFloat(destination.split(',')[0]),
        longitude: parseFloat(destination.split(',')[1])
      },
      priority,
      carFuel,
      carHipass
    });
    return result;
  },

  async mcp_kakao_mobility_transit(params: any) {
    const { origin, destination, priority, departureTime } = params;
    const result = await client.findTransitRoute({
      origin: {
        latitude: parseFloat(origin.split(',')[0]),
        longitude: parseFloat(origin.split(',')[1])
      },
      destination: {
        latitude: parseFloat(destination.split(',')[0]),
        longitude: parseFloat(destination.split(',')[1])
      },
      priority,
      departureTime
    });
    return result;
  },

  async mcp_kakao_mobility_bicycle(params: any) {
    const { origin, destination, priority } = params;
    const result = await client.findBicycleRoute({
      origin: {
        latitude: parseFloat(origin.split(',')[0]),
        longitude: parseFloat(origin.split(',')[1])
      },
      destination: {
        latitude: parseFloat(destination.split(',')[0]),
        longitude: parseFloat(destination.split(',')[1])
      },
      priority
    });
    return result;
  },

  async mcp_kakao_mobility_walk(params: any) {
    const { origin, destination } = params;
    const result = await client.findWalkRoute({
      origin: {
        latitude: parseFloat(origin.split(',')[0]),
        longitude: parseFloat(origin.split(',')[1])
      },
      destination: {
        latitude: parseFloat(destination.split(',')[0]),
        longitude: parseFloat(destination.split(',')[1])
      }
    });
    return result;
  }
}; 