import express, { Request, Response, RequestHandler } from 'express';
import dotenv from 'dotenv';
import { KakaoMobilityClient } from './services/kakaoClient';
import { Coordinates, CarRouteParams, FutureRouteParams } from './types';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.KAKAO_REST_API_KEY;
if (!apiKey) {
  console.error('KAKAO_REST_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const kakaoClient = new KakaoMobilityClient(apiKey);

// Utility function to convert location string (address or "lon,lat") to Coordinates
async function convertToCoords(location: string): Promise<Coordinates> {
  if (location.includes(',')) {
    const [lon, lat] = location.split(',').map(parseFloat);
    if (!isNaN(lon) && !isNaN(lat)) {
      return { longitude: lon, latitude: lat };
    }
  }
  const coords = await kakaoClient.searchAddress(location);
  if (!coords) {
    throw new Error(`주소를 찾을 수 없습니다: ${location}`);
  }
  return coords;
}

// 자동차 길찾기 엔드포인트
const carRouteHandler: RequestHandler = async (req, res) => {
  try {
    const { origin, destination, waypoints, priority, carFuel, carHipass } = req.body;

    if (!origin || !destination) {
       res.status(400).json({ error: 'origin and destination are required' });
       return;
    }

    const originCoords = await convertToCoords(origin as string);
    const destCoords = await convertToCoords(destination as string);
    let waypointCoords: Coordinates[] | undefined = undefined;
    if (waypoints && Array.isArray(waypoints)) {
      waypointCoords = await Promise.all((waypoints as string[]).map(wp => convertToCoords(wp)));
    }

    const params: CarRouteParams = {
      origin: originCoords,
      destination: destCoords,
      waypoints: waypointCoords,
      priority,
      carFuel,
      carHipass
    };

    const result = await kakaoClient.findCarRoute(params);
    // 성공 응답과 오류 응답을 구분하여 처리
    if ('summary' in result) {
        res.json(result);
    } else {
        res.status(404).json(result); // NO_ROUTE 등의 상태
    }
  } catch (error: any) {
     console.error('Car route error:', error);
      if (error.message.includes('주소를 찾을 수 없습니다')) {
        res.status(400).json({ error: error.message });
        return;
      } else {
         res.status(500).json({ error: 'Failed to find car route' });
         return;
      }
  }
};
app.post('/mcp_kakao_mobility_car_route', carRouteHandler);

// 미래 운행 정보 길찾기 엔드포인트
const futureRouteHandler: RequestHandler = async (req, res) => {
  try {
    const { origin, destination, departureTime, priority, carFuel, carHipass, predictionType, alternatives } = req.body;

    if (!origin || !destination || !departureTime) {
       res.status(400).json({ error: 'origin, destination, and departureTime are required' });
       return;
    }

    const originCoords = await convertToCoords(origin as string);
    const destCoords = await convertToCoords(destination as string);

    const params: FutureRouteParams = {
      origin: originCoords,
      destination: destCoords,
      departureTime: departureTime as string,
      priority,
      carFuel,
      carHipass,
      predictionType,
      alternatives
    };

    const result = await kakaoClient.findFutureRoute(params);
    // 성공 응답과 오류 응답을 구분하여 처리
    if ('summary' in result) {
        res.json(result);
    } else {
        res.status(500).json(result); // Future API 오류
    }

  } catch (error: any) {
    console.error('Future route error:', error);
    if (error.message.includes('주소를 찾을 수 없습니다')) {
      res.status(400).json({ error: error.message });
      return;
    } else {
      res.status(500).json({ error: 'Failed to find future route' });
      return;
    }
  }
};
app.post('/mcp_kakao_mobility_future_route', futureRouteHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 