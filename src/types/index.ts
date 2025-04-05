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

// 미래 운행 정보 길찾기 관련 타입
export interface FutureRouteParams {
  origin: Coordinates;
  destination: Coordinates;
  departureTime: string; // YYYYMMDDHHMM 형식
  priority?: 'RECOMMEND' | 'TIME' | 'DISTANCE'; // 기본값 RECOMMEND
  carFuel?: 'GASOLINE' | 'DIESEL' | 'LPG' | 'HYBRID' | 'ELECTRIC'; // 기본값 GASOLINE
  carHipass?: boolean; // 기본값 true
  predictionType?: 'TRAFFIC' | 'NONE'; // 예측 유형, 기본값 TRAFFIC
  alternatives?: boolean; // 대안 경로 제공 여부, 기본값 false
} 