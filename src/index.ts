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
  } catch (error) {
    console.error('Car route error:', error);
    res.status(500).json({ error: 'Failed to find car route' });
  }
});

app.post('/mcp_kakao_mobility_transit', async (req, res) => {
  try {
    const result = await handlers.mcp_kakao_mobility_transit(req.body);
    res.json(result);
  } catch (error) {
    console.error('Transit route error:', error);
    res.status(500).json({ error: 'Failed to find transit route' });
  }
});

app.post('/mcp_kakao_mobility_bicycle', async (req, res) => {
  try {
    const result = await handlers.mcp_kakao_mobility_bicycle(req.body);
    res.json(result);
  } catch (error) {
    console.error('Bicycle route error:', error);
    res.status(500).json({ error: 'Failed to find bicycle route' });
  }
});

app.post('/mcp_kakao_mobility_walk', async (req, res) => {
  try {
    const result = await handlers.mcp_kakao_mobility_walk(req.body);
    res.json(result);
  } catch (error) {
    console.error('Walk route error:', error);
    res.status(500).json({ error: 'Failed to find walk route' });
  }
});

// 핸들러 정의
export const handlers = {
  async mcp_kakao_mobility_car_route(params: any) {
    const { origin, destination, priority, carFuel, carHipass } = params;
    const [originLng, originLat] = origin.split(',').map(Number);
    const [destLng, destLat] = destination.split(',').map(Number);
    const result = await client.findCarRoute({
      origin: {
        longitude: originLng,
        latitude: originLat
      },
      destination: {
        longitude: destLng,
        latitude: destLat
      },
      priority,
      carFuel,
      carHipass
    });
    return result;
  },

  async mcp_kakao_mobility_transit(params: any) {
    const { origin, destination, priority, departureTime } = params;
    const [originLng, originLat] = origin.split(',').map(Number);
    const [destLng, destLat] = destination.split(',').map(Number);
    const result = await client.findTransitRoute({
      origin: {
        longitude: originLng,
        latitude: originLat
      },
      destination: {
        longitude: destLng,
        latitude: destLat
      },
      priority,
      departureTime
    });
    return result;
  },

  async mcp_kakao_mobility_bicycle(params: any) {
    const { origin, destination, priority } = params;
    const [originLng, originLat] = origin.split(',').map(Number);
    const [destLng, destLat] = destination.split(',').map(Number);
    const result = await client.findBicycleRoute({
      origin: {
        longitude: originLng,
        latitude: originLat
      },
      destination: {
        longitude: destLng,
        latitude: destLat
      },
      priority
    });
    return result;
  },

  async mcp_kakao_mobility_walk(params: any) {
    const { origin, destination } = params;
    const [originLng, originLat] = origin.split(',').map(Number);
    const [destLng, destLat] = destination.split(',').map(Number);
    const result = await client.findWalkRoute({
      origin: {
        longitude: originLng,
        latitude: originLat
      },
      destination: {
        longitude: destLng,
        latitude: destLat
      }
    });
    return result;
  }
};

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 