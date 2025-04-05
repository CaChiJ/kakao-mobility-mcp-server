import { config } from 'dotenv';
import express from 'express';
import { KakaoMobilityClient } from './services/kakaoClient';

// .env 파일 로드
config();

const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
if (!kakaoApiKey) {
  throw new Error('KAKAO_REST_API_KEY is required in environment variables');
}

const client = new KakaoMobilityClient(kakaoApiKey);
const app = express();

app.use(express.json());

// 엔드포인트 등록
app.post('/mcp_kakao_mobility_car_route', async (req, res) => {
  try {
    const result = await handlers.mcp_kakao_mobility_car_route(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Car route error:', error);
    // 경로 못찾는 경우 처리 추가 (필요 시)
    if (error.response?.data?.code === -404 || error.message.includes('주소를 찾을 수 없습니다')) {
       res.json({ status: 'NO_ROUTE', message: '해당 구간의 자동차 경로를 찾을 수 없습니다.' });
    } else {
        res.status(500).json({ error: 'Failed to find car route' });
    }
  }
});

app.post('/mcp_kakao_mobility_transit', async (req, res) => {
  try {
    const result = await handlers.mcp_kakao_mobility_transit(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Transit route error:', error);
     // 경로 못찾는 경우 처리 추가 (필요 시)
    if (error.response?.data?.code === -404 || error.message.includes('주소를 찾을 수 없습니다')) {
       res.json({ status: 'NO_ROUTE', message: '해당 구간의 대중교통 경로를 찾을 수 없습니다.' });
    } else {
        res.status(500).json({ error: 'Failed to find transit route' });
    }
  }
});

// 핸들러 정의
export const handlers = {
  async mcp_kakao_mobility_car_route(params: any) {
    try {
      const { origin, destination, waypoints = [], priority = 'TIME', carFuel = 'GASOLINE', carHipass = true } = params;
      
      // 주소가 이미 좌표 형식인지 확인
      const isCoordinates = (str: string) => /^\d+(\.\d+)?(,\d+(\.\d+)?)+$/.test(str);
      
      let originCoords;
      let destCoords;
      let waypointCoords = [];

      // 주소인 경우 좌표로 변환
      if (!isCoordinates(origin)) {
        console.log('Searching coordinates for origin:', origin);
        const result = await client.searchAddress(origin);
        if (!result) {
          throw new Error(`출발지 주소를 찾을 수 없습니다: ${origin}`);
        }
        originCoords = result;
        console.log('Origin coordinates found:', originCoords);
      } else {
        const [longitude, latitude] = origin.split(',').map(Number);
        if (isNaN(longitude) || isNaN(latitude)) {
           throw new Error(`잘못된 출발지 좌표 형식: ${origin}`);
        }
        originCoords = { longitude, latitude };
      }

      if (!isCoordinates(destination)) {
        console.log('Searching coordinates for destination:', destination);
        const result = await client.searchAddress(destination);
        if (!result) {
          throw new Error(`도착지 주소를 찾을 수 없습니다: ${destination}`);
        }
        destCoords = result;
        console.log('Destination coordinates found:', destCoords);
      } else {
        const [longitude, latitude] = destination.split(',').map(Number);
         if (isNaN(longitude) || isNaN(latitude)) {
           throw new Error(`잘못된 도착지 좌표 형식: ${destination}`);
        }
        destCoords = { longitude, latitude };
      }

      // 경유지 처리
      if (waypoints.length > 5) {
        throw new Error('경유지는 최대 5개까지만 지원됩니다.');
      }

      for (const waypoint of waypoints) {
        if (!isCoordinates(waypoint)) {
          console.log('Searching coordinates for waypoint:', waypoint);
          const result = await client.searchAddress(waypoint);
          if (!result) {
            throw new Error(`경유지 주소를 찾을 수 없습니다: ${waypoint}`);
          }
          waypointCoords.push(result);
          console.log('Waypoint coordinates found:', result);
        } else {
          const [longitude, latitude] = waypoint.split(',').map(Number);
          if (isNaN(longitude) || isNaN(latitude)) {
            throw new Error(`잘못된 경유지 좌표 형식: ${waypoint}`);
          }
          waypointCoords.push({ longitude, latitude });
        }
      }

      console.log('Requesting car route with coordinates:', {
        origin: originCoords,
        destination: destCoords,
        waypoints: waypointCoords,
        priority,
        carFuel,
        carHipass
      });

      const result = await client.findCarRoute({
        origin: originCoords,
        destination: destCoords,
        waypoints: waypointCoords,
        priority,
        carFuel,
        carHipass
      });
      
      return result;
    } catch (error: any) {
      console.error('Error in mcp_kakao_mobility_car_route handler:', error);
      throw error; // 에러를 다시 던져서 상위 핸들러에서 처리하도록 함
    }
  },

  async mcp_kakao_mobility_transit(params: any) {
    try {
      const { origin, destination, priority = 'RECOMMEND', departureTime } = params;
      
      // 주소가 이미 좌표 형식인지 확인
      const isCoordinates = (str: string) => /^\d+(\.\d+)?(,\d+(\.\d+)?)+$/.test(str);
      
      let originCoords;
      let destCoords;

      // 주소인 경우 좌표로 변환
      if (!isCoordinates(origin)) {
        console.log('Searching coordinates for origin:', origin);
        const result = await client.searchAddress(origin);
        if (!result) {
          throw new Error(`출발지 주소를 찾을 수 없습니다: ${origin}`);
        }
        originCoords = result;
        console.log('Origin coordinates found:', originCoords);
      } else {
        const [longitude, latitude] = origin.split(',').map(Number);
        if (isNaN(longitude) || isNaN(latitude)) {
           throw new Error(`잘못된 출발지 좌표 형식: ${origin}`);
        }
        originCoords = { longitude, latitude };
      }

      if (!isCoordinates(destination)) {
        console.log('Searching coordinates for destination:', destination);
        const result = await client.searchAddress(destination);
        if (!result) {
          throw new Error(`도착지 주소를 찾을 수 없습니다: ${destination}`);
        }
        destCoords = result;
        console.log('Destination coordinates found:', destCoords);
      } else {
        const [longitude, latitude] = destination.split(',').map(Number);
         if (isNaN(longitude) || isNaN(latitude)) {
           throw new Error(`잘못된 도착지 좌표 형식: ${destination}`);
        }
        destCoords = { longitude, latitude };
      }

      console.log('Requesting transit route with coordinates:', {
        origin: originCoords,
        destination: destCoords,
        priority,
        departureTime
      });

      const result = await client.findTransitRoute({
        origin: originCoords,
        destination: destCoords,
        priority,
        departureTime
      });
      return result;
    } catch (error: any) {
      console.error('Error in mcp_kakao_mobility_transit handler:', error);
      throw error; // 에러를 다시 던져서 상위 핸들러에서 처리하도록 함
    }
  }
};

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 