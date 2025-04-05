// 공통 타입
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 자동차 길찾기 관련 타입
export interface CarRouteParams {
  origin: Coordinates;
  destination: Coordinates;
  priority?: 'RECOMMENDED' | 'TIME' | 'DISTANCE';
  carFuel?: 'GASOLINE' | 'DIESEL' | 'LPG' | 'ELECTRIC';
  carHipass?: boolean;
}

export interface CarRouteSummary {
  distance: number;
  duration: number;
  tollFee: number;
  fuelPrice: number;
}

// 대중교통 길찾기 관련 타입
export interface TransitRouteParams {
  origin: Coordinates;
  destination: Coordinates;
  priority?: 'RECOMMEND' | 'MINIMUM_TIME' | 'MINIMUM_TRANSFER';
  departureTime?: string;
}

export interface TransitRouteSummary {
  distance: number;
  duration: number;
  transfers: number;
  fare: number;
}

export interface TransitStep {
  type: 'BUS' | 'SUBWAY' | 'WALK';
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