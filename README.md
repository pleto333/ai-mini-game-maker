# AI Mini Game Maker

Vue 3 + OpenAI API 기반 HTML5 미니 게임 생성기입니다.

## 주요 기능

- 자연어로 HTML5 미니 게임 생성
- 기존 게임 코드를 바탕으로 대화형 수정/업그레이드
- 빠른 시작/빠른 개선 프리셋
- iframe 기반 게임 실행 및 안전한 부모 제어 리셋
- 소스코드 보기와 HTML 파일 내보내기
- 버전 히스토리와 이전 버전 복구
- iframe 실행 실패 감지 후 1회 자동 수리 요청
- Gemini/OpenAI provider 전환 지원
- localStorage 기반 작업 자동 저장/복구
- 기능 추가, 버그 수정, 밸런스, 디자인, 모바일 최적화 수정 모드
- 코드 품질 경고와 AI 생성 변경 요약
- 게임 제목 기반 HTML 파일 내보내기
- 이미지 업로드, 역할 지정, base64 내장 에셋 기반 게임 생성

## 로컬 실행

1. 의존성 설치

```bash
npm install
```

2. `.env.example`을 복사해서 `.env` 생성

```bash
cp .env.example .env
```

Windows PowerShell에서는:

```powershell
Copy-Item .env.example .env
```

3. `.env`에 사용할 AI provider와 API 키 입력

Gemini로 테스트:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

OpenAI로 테스트:

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

API 키는 절대 Vue 코드에 넣지 말고, 배포 플랫폼의 환경변수에만 저장하세요.
