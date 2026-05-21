# AI Mini Game Maker

Gemini 또는 OpenAI API로 자연어 아이디어를 즉시 실행 가능한 HTML5 미니 게임 프로토타입으로 바꾸는 Vue 3 기반 제작 도구입니다.

## 주요 기능

- 자연어로 단일 HTML5 미니 게임 생성
- 기존 게임 코드를 바탕으로 대화형 수정 및 업그레이드
- 빠른 시작/빠른 개선 프리셋
- 기능 추가, 버그 수정, 밸런스 조정, 디자인 개선, 모바일 최적화 모드
- 이미지 업로드, 역할 지정, base64 내장 에셋 기반 게임 생성
- iframe 기반 게임 실행, 안전한 부모 제어 리셋
- 버전 히스토리와 이전 버전 복구
- iframe 실행 실패 감지 후 1회 자동 수리 요청
- localStorage 기반 작업 자동 저장/복구
- 프로젝트 JSON 내보내기/불러오기
- 무료티어 절약 모드와 추정 API 호출 횟수 표시
- 코드 품질 경고와 게임 제목 기반 HTML 내보내기
- Gemini/OpenAI provider 전환 지원

## 로컬 실행

1. 의존성 설치

```bash
npm install
```

2. `.env.example`을 복사해서 `.env` 생성

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. `.env`에 사용할 provider와 API 키 입력

Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

OpenAI:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-5-mini
PORT=8787
```

4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

## 프로덕션 빌드

```bash
npm run build
npm start
```

빌드 후에는 `http://localhost:8787`에서 앱을 볼 수 있습니다.

## 배포

Render, Railway, Fly.io 같은 Node 서버 배포 플랫폼에 올릴 수 있습니다.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables:
  - `AI_PROVIDER`
  - `GEMINI_API_KEY`, `GEMINI_MODEL`
  - 또는 `OPENAI_API_KEY`, `OPENAI_MODEL`
  - `PORT`는 플랫폼이 자동 제공하면 생략 가능

## 보안

`.env` 파일은 API 키가 들어있는 비밀 파일입니다. 절대 GitHub에 올리지 마세요. 이 프로젝트는 `.gitignore`로 `.env`, `node_modules`, `dist`를 제외합니다.

다른 컴퓨터에서 작업하려면 `.env.example`을 복사해 새 `.env`를 만들고 API 키를 다시 입력하세요. 작업 히스토리는 앱의 JSON 내보내기/불러오기 기능으로 옮길 수 있습니다.
