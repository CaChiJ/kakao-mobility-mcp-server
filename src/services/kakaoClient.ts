import axios, { AxiosInstance } from 'axios';
import {
  CarRouteParams,
  CarRouteSummary,
  BicycleRouteParams,
  BicycleRouteSummary,
  WalkRouteParams,
  WalkRouteSummary,
  Coordinates,
  FutureRouteParams
} from '../types';

export class KakaoMobilityClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    console.log('Initializing KakaoMobilityClient with API key:', apiKey);
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://apis-navi.kakaomobility.com',
      headers: {
        'Authorization': `KakaoAK ${apiKey}`,
        // GET 요청에는 Content-Type: application/json 불필요
      }
    });
  }

  private formatCoords(coords: string | Coordinates): string {
    if (typeof coords === 'string') {
      // 좌표 형식(lon,lat)인지 확인 후 그대로 반환, 아니면 주소로 간주 (이 부분은 현재 로직 유지)
      if (/^\d+(\.\d+)?\,\d+(\.\d+)?$/.test(coords)) {
          return coords;
      }
      // 주소인 경우 추가 처리 없이 반환 (searchAddress에서 처리됨)
      // 실제 API 호출 시에는 좌표만 사용됨
      // 다만, CarRouteParams 등 타입 정의가 Coordinates이므로, 호출 전에 변환 필요
      // 여기서는 API 전송 형식에 맞게 문자열화만 담당
      console.warn('formatCoords received non-coordinate string, returning as is:', coords);
      return coords; 
    }
    return `${coords.longitude},${coords.latitude}`;
  }

  // 자동차 길찾기 API 호출 메서드 (GET으로 변경)
  async findCarRoute(params: CarRouteParams): Promise<{ summary: CarRouteSummary } | { status: string; message: string }> {
    try {
      console.log('Calling Kakao Car Route API (GET) with params:', params);
      const queryParams = {
        origin: this.formatCoords(params.origin),
        destination: this.formatCoords(params.destination),
        waypoints: params.waypoints?.map(wp => this.formatCoords(wp)).join('|'), // 구분자 | 사용
        priority: params.priority || 'RECOMMEND',
        car_fuel: params.carFuel || 'GASOLINE',
        car_hipass: params.carHipass !== undefined ? params.carHipass : false, // 기본값 false
        alternatives: false,
        summary: true // 경로 요약 정보만 받도록 설정
      };
      console.log('Request query params:', queryParams);
      const response = await this.client.get('/v1/directions', { params: queryParams });
      console.log('Kakao Car Route API response:', response.data);

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        if (route.result_code === 0) {
          const summary = route.summary;
          return {
            summary: {
              distance: summary.distance,
              duration: summary.duration,
              tollFee: summary.fare.toll,
              fuelPrice: summary.fare.fuel
            }
          };
        } else {
          console.warn(`Kakao API returned result_code ${route.result_code}: ${route.result_msg}`);
          return { status: 'API_WARN', message: `(${route.result_code}) ${route.result_msg}` };
        }
      } else {
        console.warn('Kakao API response missing routes array.');
        return { status: 'NO_ROUTE', message: '해당 구간의 자동차 경로를 찾을 수 없습니다. (No routes array)' };
      }
    } catch (error: any) {
      console.error('Error calling Kakao Car Route API.');
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:');
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
        console.error('Data:', error.response?.data);
        // NO_ROUTE는 성공 응답 내에서 처리되므로, 여기서는 실제 오류만 처리
        return { status: 'ERROR', message: `API request failed with status ${error.response?.status}: ${error.response?.data?.msg || error.message}` };
      } else {
        console.error('Non-Axios error:', error);
        return { status: 'ERROR', message: 'An unexpected error occurred' };
      }
    }
  }

  // 미래 운행 정보 길찾기 API 호출 메서드 (GET으로 변경)
  async findFutureRoute(params: FutureRouteParams): Promise<{ summary: CarRouteSummary } | { error: string }> {
      try {
          console.log('Calling Kakao Future Route API (GET) with params:', params);
          const queryParams = {
              origin: this.formatCoords(params.origin),
              destination: this.formatCoords(params.destination),
              departure_time: params.departureTime, // 필수 파라미터
              priority: params.priority || 'RECOMMEND',
              car_fuel: params.carFuel || 'GASOLINE',
              car_hipass: params.carHipass !== undefined ? params.carHipass : false, // 기본값 false
              prediction_type: params.predictionType || 'TRAFFIC',
              alternatives: params.alternatives || false,
              summary: true // 요약 정보만 받도록 설정
          };
          console.log('Requesting future route with query params:', queryParams);
          const response = await this.client.get('/v1/future/directions', { params: queryParams });
          console.log('Kakao Future Route API raw response status:', response.status);
          console.log('Kakao Future Route API raw response headers:', response.headers);
          console.log('Kakao Future Route API raw response data:', response.data);

          if (response.data.routes && response.data.routes.length > 0) {
              const route = response.data.routes[0];
              if (route.result_code === 0) {
                const routeSummary = route.summary;
                return {
                    summary: {
                        distance: routeSummary.distance,
                        duration: routeSummary.duration,
                        tollFee: routeSummary.fare.toll,
                    }
                };
              } else {
                 console.warn(`Kakao Future API returned result_code ${route.result_code}: ${route.result_msg}`);
                 return { error: `API Error (${route.result_code}): ${route.result_msg || 'Unknown API error'}` };
              }
          } else {
              console.warn('Kakao Future API response missing routes array.');
              return { error: 'Failed to find future route or no routes available (No routes array)' };
          }
      } catch (error: any) {
          console.error('Error calling Kakao Future Route API.');
          if (axios.isAxiosError(error)) {
            console.error('Axios error details:');
            console.error('Status:', error.response?.status);
            console.error('Headers:', error.response?.headers);
            console.error('Data:', error.response?.data);
            // 에러 메시지에 카카오 API 응답 포함 (msg 필드 확인)
            return { error: `API request failed with status ${error.response?.status}: ${error.response?.data?.msg || error.message}` };
          } else {
            console.error('Non-Axios error:', error);
            return { error: 'An unexpected error occurred' };
          }
      }
  }

  // 주소 검색 메서드 (변경 없음)
  async searchAddress(query: string): Promise<Coordinates | null> {
    try {
      console.log(`Searching address: ${query}`);
      const searchClient = axios.create({
        baseURL: 'https://dapi.kakao.com',
        headers: {
          'Authorization': `KakaoAK ${this.apiKey}`
        }
      });

      const response = await searchClient.get('/v2/local/search/keyword.json', {
        params: { query }
      });

      console.log('Address search response:', JSON.stringify(response.data, null, 2));

      if (response.data.documents.length > 0) {
        const doc = response.data.documents[0];
        const coords: Coordinates = {
          longitude: parseFloat(doc.x),
          latitude: parseFloat(doc.y)
        };
        console.log('Coordinates found:', coords);
        return coords;
      } else {
        console.log('Address not found');
        return null;
      }
    } catch (error: any) {
      console.error('Error searching address:', error.response?.data || error.message);
      throw new Error('Failed to search address');
    }
  }
} 