# CRA 개발환경 테스트
CRA + Testing 환경을 체크하기 위한 TODO 어플리케이션입니다.

## 시작하기
CRA 를 사용하여 기본 환경을 구성하였습니다. node version은 `.nvmrc` 를 참고해주세요.
테스트 서버 실행 후, [로컬 서버]([http:localhost:3000])로 접근하여 확인해주세요.

```bash
# package.json 에 있는 목록을 받습니다.
npm i
```

```bash
# Testing 코드를 실행합니다.
npm run test
```

```bash
# 테스트 서버를 실행합니다.
npm run start 
```

## 프로젝트 구조

```txt
src
├─components # 공용 스타일 컴포넌트 관리 디렉토리
├─defines # .d.ts 관리 디렉토리
├─hooks # pages에서 사용하는 훅 디렉토리
├─libs #
├─mocks # mock 서버 디렉토리
│  └─__origin__ # mock 기본 데이터 디렉토리
├─pages # 메인 페이지 디렉토리
└─__test__ # pages 테스트 코드 디렉토리
.nvmrc
babel.config.js # @emotion/react 를 사용하기 위한 babel 설정
config-overrides.js
jest.config.js
jest.setup.js # mock를 실행하기 위한 기본 설정
```