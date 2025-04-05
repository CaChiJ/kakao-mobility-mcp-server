# 🚗 카카오 모빌리티 MCP 서버

카카오 모빌리티 API를 사용해서 길찾기 정보를 제공하는 MCP 서버입니다. 차량, 대중교통, 자전거, 도보 등 다양한 이동 수단의 경로를 찾아드립니다!

## ✨ 주요 기능

### 🚘 자동차 길찾기
```typescript
const result = await mcp.invoke("mcp_kakao_mobility_car_route", {
  origin: "37.5665,126.9780",      // 서울시청
  destination: "37.3595,127.1052", // 판교역
  priority: "TIME",                // 시간 우선
  carFuel: "GASOLINE",            // 휘발유 차량
  carHipass: true                 // 하이패스 사용
});
```

### 🚇 대중교통 길찾기
```typescript
const result = await mcp.invoke("mcp_kakao_mobility_transit", {
  origin: "37.5665,126.9780",
  destination: "37.3595,127.1052",
  priority: "MINIMUM_TRANSFER",    // 환승 최소화
  departureTime: "2024-03-19T09:00:00+09:00"
});
```

### 🚲 자전거 길찾기
```typescript
const result = await mcp.invoke("mcp_kakao_mobility_bicycle", {
  origin: "37.5665,126.9780",
  destination: "37.3595,127.1052",
  priority: "SAFE"                // 안전 우선
});
```

### 🚶 도보 길찾기
```typescript
const result = await mcp.invoke("mcp_kakao_mobility_walk", {
  origin: "37.5665,126.9780",
  destination: "37.3595,127.1052"
});
```

## 🚀 시작하기

1. **저장소 클론하기**
   ```bash
   git clone https://github.com/CaChiJ/kakao-mobility-mcp-server.git
   cd kakao-mobility-mcp-server
   ```

2. **의존성 설치하기**
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. **환경 변수 설정하기**
   ```bash
   cp .env.example .env
   # .env 파일을 열어서 KAKAO_REST_API_KEY를 설정해주세요
   ```

4. **서버 실행하기**
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

## 📝 응답 예시

### 자동차 길찾기
```json
{
  "summary": {
    "distance": 25000,        // 거리 (미터)
    "duration": 1800,         // 소요 시간 (초)
    "tollFee": 2000,         // 통행료 (원)
    "fuelPrice": 3500        // 연료비 (원)
  }
}
```

### 대중교통 길찾기
```json
{
  "summary": {
    "distance": 23000,
    "duration": 2700,
    "transfers": 1,          // 환승 횟수
    "fare": 1450            // 요금 (원)
  },
  "steps": [
    {
      "type": "SUBWAY",
      "distance": 15000,
      "duration": 1200,
      "routeName": "2호선"
    },
    // ... 더 많은 단계들
  ]
}
```

## 🤔 자주 묻는 질문

**Q: 카카오 API 키는 어디서 받나요?**  
A: [카카오 개발자 센터](https://developers.kakao.com)에서 애플리케이션을 등록하고 REST API 키를 발급받으세요!

**Q: 위도/경도는 어떻게 알 수 있나요?**  
A: [카카오맵](https://map.kakao.com)에서 원하는 위치를 우클릭하면 좌표를 복사할 수 있어요!

**Q: 실시간 교통정보도 반영되나요?**  
A: 네! 자동차 길찾기에는 실시간 교통정보가 반영됩니다. 🚦

## 📜 라이선스

MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 🤝 기여하기

버그를 발견하셨거나 새로운 기능을 제안하고 싶으신가요? 언제든 Issue나 Pull Request를 환영합니다!

---

Made with ❤️ by [CaChiJ](https://github.com/CaChiJ) 