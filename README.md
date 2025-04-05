# Kakao Mobility & Kakao Map MCP 서버

[![MCP](https://img.shields.io/badge/MCP-Compliant-blue)](https://github.com/cursor-ai/model-context-protocol)

## 소개

본 레포지토리는 Model Context Protocol (MCP)을 준수하여 카카오 모빌리티 및 카카오맵 API와 연동되는 서버를 제공합니다. 국내 환경에 적합한 길찾기 서비스를 제공하는 것을 목표로 합니다.

## 주요 기능

### 1. 위치 검색 (지오코딩)
- 주소나 장소명을 좌표(위도/경도)로 변환
- 정확한 위치 정보 제공

### 2. 길찾기 서비스
- 출발지에서 목적지까지의 최적 경로 검색
- 도보, 자동차 등 다양한 이동 수단 지원
- 실시간 교통 정보 반영

## 제공 도구

본 서버는 다음과 같은 MCP 도구들을 제공합니다:

- `geocode`: 주소를 좌표 정보로 지오코딩
- `direction_search_by_names`: 출발지와 목적지 주소로 길찾기
- `direction_search_by_coordinates`: 출발지와 목적지 좌표로 길찾기

## 배포 정보

본 서버의 배포 정보 및 최신 업데이트는 Smithery에서 확인하실 수 있습니다.

---
Made with ❤️ using Model Context Protocol
