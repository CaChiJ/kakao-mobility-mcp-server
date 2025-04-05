# kakao-mobility-mcp-server

카카오 모빌리티의 자동차 길찾기 MCP 서버입니다. Model Context Protocol(MCP) 형태로 카카오 모빌리티의 다양한 자동차 길찾기 기능을 제공합니다.

## 주요 기능

- **자동차 길찾기:** 출발지, 도착지, 경유지(최대 5개)를 기반으로 자동차 경로 정보를 제공합니다.
    - 경로 우선순위 (시간, 거리 등) 설정 가능
    - 차량 연료 종류 (휘발유, 경유 등) 및 하이패스 유무 설정 가능
    - 주소 또는 좌표(`경도,위도`) 형식으로 입력 가능 (주소 입력 시 좌표로 자동 변환)
- **미래 운행 정보 길찾기:** 특정 출발 시각을 기준으로 미래의 교통 상황을 예측하여 경로 정보를 제공합니다.
    - 경로 우선순위, 차량 연료, 하이패스 유무 설정 가능
    - 교통 예측 유형 (실시간 교통 정보 반영 여부) 설정 가능
    - 대안 경로 제공 여부 설정 가능
    - 주소 또는 좌표 형식으로 입력 가능

## API 엔드포인트

모든 엔드포인트는 `POST` 메서드를 사용하며, 요청 본문은 JSON 형식입니다.
주소 또는 좌표는 문자열 형태로 전달합니다 (예: `"서울시청"` 또는 `"126.9780,37.5665"`).

### 1. 자동차 길찾기

- **URL:** `/mcp_kakao_mobility_car_route`
- **Request Body:**

  ```json
  {
    "origin": "string",
    "destination": "string",
    "waypoints": ["string", ...], // Optional, 최대 5개
    "priority": "string (TIME | DISTANCE)", // Optional, 기본값: TIME
    "carFuel": "string (GASOLINE | DIESEL | ...)", // Optional, 기본값: GASOLINE
    "carHipass": "boolean" // Optional, 기본값: true
  }
  ```

- **Response Body (Success):**

  ```json
  {
    "summary": {
      "distance": "number (미터)",
      "duration": "number (초)",
      "tollFee": "number (원)",
      "fuelPrice": "number (원)"
    }
  }
  ```

- **Response Body (No Route / Error):**

  ```json
  // 경로 없음
  {
    "status": "NO_ROUTE",
    "message": "해당 구간의 자동차 경로를 찾을 수 없습니다."
  }
  // 기타 오류
  {
    "error": "Error message..."
  }
  ```

### 2. 미래 운행 정보 길찾기

- **URL:** `/mcp_kakao_mobility_future_route`
- **Request Body:**

  ```json
  {
    "origin": "string", // 필수
    "destination": "string", // 필수
    "departureTime": "string (YYYYMMDDHHMM)", // 필수, 출발 시각
    "priority": "string (RECOMMEND | TIME | DISTANCE)", // Optional, 기본값: RECOMMEND
    "carFuel": "string (GASOLINE | DIESEL | ...)", // Optional, 기본값: GASOLINE
    "carHipass": "boolean", // Optional, 기본값: true
    "predictionType": "string (TRAFFIC | NONE)", // Optional, 예측 유형, 기본값: TRAFFIC
    "alternatives": "boolean" // Optional, 대안 경로 제공 여부, 기본값: false
  }
  ```

- **Response Body (Success):** 자동차 길찾기 응답과 동일 (단, `alternatives=true` 시 여러 경로 중 첫 번째만 반환)

  ```json
  {
    "summary": {
      "distance": "number (미터)",
      "duration": "number (초)",
      "tollFee": "number (원)",
      "fuelPrice": "number (원)"
    }
  }
  ```
- **Response Body (Error):**

  ```json
  {
    "error": "Error message..."
  }
  ```

## 실행 방법

1.  **.env 파일 설정:**
    - `.env` 파일을 생성하고 `KAKAO_REST_API_KEY` 환경 변수에 카카오 REST API 키를 설정합니다.

    ```
    KAKAO_REST_API_KEY=YOUR_KAKAO_REST_API_KEY
    ```

2.  **의존성 설치:**

    ```bash
    npm install
    ```

3.  **빌드:**

    ```bash
    npm run build
    ```

4.  **서버 실행:**

    ```bash
    npm start
    ```

    또는 개발 모드로 실행:

    ```bash
    npm run dev
    ```

기본적으로 서버는 `http://localhost:3000` 에서 실행됩니다.

## Docker 로 실행

1.  **Docker 이미지 빌드:**

    ```bash
    docker build -t kakao-mobility-mcp-server .
    ```

2.  **Docker 컨테이너 실행:**

    ```bash
    docker run -p 3000:3000 -e KAKAO_REST_API_KEY=YOUR_KAKAO_REST_API_KEY kakao-mobility-mcp-server
    ```

## 라이선스

MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 🤝 기여하기

버그를 발견하셨거나 새로운 기능을 제안하고 싶으신가요? 언제든 Issue나 Pull Request를 환영합니다!

---

Made with ❤️ by [CaChiJ](https://github.com/CaChiJ) 