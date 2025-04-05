# Kakao Mobility MCP Server

카카오 모빌리티 API를 사용하는 MCP(Mobility Cloud Platform) 서버입니다.

## 기능

- 자동차 경로 검색
- 대중교통 경로 검색
- 자전거 경로 검색
- 도보 경로 검색

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가합니다:
```
KAKAO_REST_API_KEY=your_api_key_here
```

3. 서버 실행
```bash
npm run dev
```

## API 엔드포인트

### 자동차 경로 검색
```
POST /mcp_kakao_mobility_car_route
```

요청 예시:
```json
{
  "origin": "126.9780,37.5665",
  "destination": "127.1052,37.3595",
  "priority": "TIME",
  "carFuel": "GASOLINE",
  "carHipass": true
}
```

### 대중교통 경로 검색
```
POST /mcp_kakao_mobility_transit
```

### 자전거 경로 검색
```
POST /mcp_kakao_mobility_bicycle
```

### 도보 경로 검색
```
POST /mcp_kakao_mobility_walk
```

## Smithery 설정

`smithery.yaml` 파일에서 다음 설정이 필요합니다:

```yaml
kakaoRestApiKey: "your_api_key_here"
```

## 라이선스

MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 🤝 기여하기

버그를 발견하셨거나 새로운 기능을 제안하고 싶으신가요? 언제든 Issue나 Pull Request를 환영합니다!

---

Made with ❤️ by [CaChiJ](https://github.com/CaChiJ) 