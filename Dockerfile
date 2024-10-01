FROM node:18-alpine

# yarn이 설치되어 있는지 확인하고 없으면 설치
RUN if [ ! -x "$(command -v yarn)" ]; then npm install --global yarn; fi

WORKDIR /usr/src/app

# package.json과 yarn.lock을 복사
COPY package*.json ./

# 종속성 설치
RUN yarn install

# 소스 코드 복사
COPY . .

# 빌드 명령어 실행
RUN yarn build

# 프로덕션 모드로 서버 실행
CMD ["yarn", "start:prod"]
