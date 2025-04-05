FROM node:18-alpine

WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# TypeScript 컴파일
RUN npm run build

# 환경 변수 설정
ENV NODE_ENV=production

# 서버 실행
CMD ["npm", "start"] 