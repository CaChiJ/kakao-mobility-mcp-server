// 공통 타입
export interface Coordinates {
  longitude: number;
  latitude: number;
}

// 자동차 길찾기 관련 타입
export interface CarRouteParams {
  origin: Coordinates;
  destination: Coordinates;
  waypoints?: Coordinates[];  // 최대 5개의 경유지 지원
  priority?: 'RECOMMEND' | 'TIME' | 'DISTANCE';
  carFuel?: 'GASOLINE' | 'DIESEL' | 'LPG' | 'HYBRID' | 'ELECTRIC';
  carHipass?: boolean;
}

export interface CarRouteSummary {
  distance: number;
  duration: number;
  tollFee: number;
  fuelPrice?: number;
}

// 대중교통 길찾기 관련 타입
export interface TransitRouteParams {
  origin: Coordinates;
  destination: Coordinates;
  priority?: 'RECOMMEND' | 'MINIMUM_TIME' | 'MINIMUM_WALK' | 'MINIMUM_TRANSFER';
  departureTime?: string;
}

export interface TransitRouteSummary {
  distance: number;
  duration: number;
  transfers: number;
  fare: number;
}

export interface TransitStep {
  type: string;
  distance: number;
  duration: number;
  routeName?: string;
  stationName?: string;
}

// 자전거 길찾기 관련 타입
export interface BicycleRouteParams {
  origin: Coordinates;
  destination: Coordinates;
  priority?: 'RECOMMEND' | 'SAFE' | 'DISTANCE';
}

export interface BicycleRouteSummary {
  distance: number;
  duration: number;
  ascent: number;
  descent: number;
}

// 도보 길찾기 관련 타입
export interface WalkRouteParams {
  origin: Coordinates;
  destination: Coordinates;
}

export interface WalkRouteSummary {
  distance: number;
  duration: number;
} 