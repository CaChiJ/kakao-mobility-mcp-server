import axios, { AxiosInstance } from 'axios';
import {
  CarRouteParams,
  CarRouteSummary,
  TransitRouteParams,
  TransitRouteSummary,
  TransitStep,
  BicycleRouteParams,
  BicycleRouteSummary,
  WalkRouteParams,
  WalkRouteSummary,
  Coordinates
} from '../types';

export class KakaoMobilityClient {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    console.log('Initializing KakaoMobilityClient with API key:', apiKey);
    this.client = axios.create({
      baseURL: 'https://apis-navi.kakaomobility.com/v1',
      headers: {
        'Authorization': `KakaoAK ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  private formatCoords(coords: Coordinates): string {
    return `${coords.longitude},${coords.latitude}`;
  }

  async findCarRoute(params: CarRouteParams): Promise<{ summary: CarRouteSummary }> {
    try {
      console.log('Calling Kakao API with params:', params);
      const requestConfig = {
        params: {
          origin: this.formatCoords(params.origin),
          destination: this.formatCoords(params.destination),
          priority: params.priority,
          car_fuel: params.carFuel,
          car_hipass: params.carHipass
        }
      };
      console.log('Request config:', requestConfig);
      
      const response = await this.client.get('/directions', requestConfig);
      console.log('Kakao API response:', response.data);

      const route = response.data.routes[0];
      return {
        summary: {
          distance: route.summary.distance,
          duration: route.summary.duration,
          tollFee: route.summary.fare.toll,
          fuelPrice: route.summary.fare.fuel
        }
      };
    } catch (error: any) {
      console.error('Error calling Kakao API:', error.response?.data || error.message);
      console.error('Full error:', error);
      throw error;
    }
  }

  async findTransitRoute(params: TransitRouteParams): Promise<{
    summary: TransitRouteSummary;
    steps: TransitStep[];
  }> {
    const response = await this.client.get('/directions/transit', {
      params: {
        origin: this.formatCoords(params.origin),
        destination: this.formatCoords(params.destination),
        priority: params.priority,
        departure_time: params.departureTime
      }
    });

    const route = response.data.routes[0];
    return {
      summary: {
        distance: route.summary.distance,
        duration: route.summary.duration,
        transfers: route.summary.transfers,
        fare: route.summary.fare.regular.total
      },
      steps: route.sections.map((section: any) => ({
        type: section.type,
        distance: section.distance,
        duration: section.duration,
        routeName: section.route?.name,
        stationName: section.station?.name
      }))
    };
  }

  async findBicycleRoute(params: BicycleRouteParams): Promise<{
    summary: BicycleRouteSummary;
  }> {
    const response = await this.client.get('/directions/bicycle', {
      params: {
        origin: this.formatCoords(params.origin),
        destination: this.formatCoords(params.destination),
        priority: params.priority
      }
    });

    const route = response.data.routes[0];
    return {
      summary: {
        distance: route.summary.distance,
        duration: route.summary.duration,
        ascent: route.summary.ascent,
        descent: route.summary.descent
      }
    };
  }

  async findWalkRoute(params: WalkRouteParams): Promise<{
    summary: WalkRouteSummary;
  }> {
    const response = await this.client.get('/directions/walk', {
      params: {
        origin: this.formatCoords(params.origin),
        destination: this.formatCoords(params.destination)
      }
    });

    const route = response.data.routes[0];
    return {
      summary: {
        distance: route.summary.distance,
        duration: route.summary.duration
      }
    };
  }
} 