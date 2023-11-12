# MZ 하나은행 리팩토링

## 1. 프로젝트 배경

### 1-1. 리팩토링을 하는 이유

MZ 하나은행은 2023년 5월 한 달 동안 진행했던 프로젝트로, 나의 첫 웹 개발 프로젝트였다. 당시 HTML/CSS/JS를 처음 배우는 단계에서 동시에 바로 시작된 프로젝트였기 때문에 굉장히 정신이 없었다. 기초를 배우기도 모자란 시간에 수준 높은 결과물을 뽑아내야만 했다. 그래서 클린 코드에 신경을 쓰지 못한 채로 얼기설기 프로젝트를 마무리했다. 다행히 결과물은 괜찮게 나와 전체 2등을 할 수 있었다. 하지만 6개월이 지난 지금까지도 가독성과 유지보수성을 무시하고 마구잡이로 작성했던 코드 때문에 불편함을 느끼고 있다. 이러한 이유로 나의 첫 웹 프로젝트, MZ 하나은행을 리팩토링하기로 결심했다.

### 1-2. 리팩토링 범위

리팩토링은 스크롤 애니메이션이 적용된 홈 화면만 진행한다. 내가 담당했던 페이지는 총 두 페이지로 홈 화면과 상품소개 페이지가 있다. 하지만 상품소개 페이지는 굳이 리팩토링을 해야할 만큼 복잡하지도 않고 퀄리티도 좋지 않기 때문에 제외한다.

### 1-3. 기존 코드의 문제점

- 파일의 길이가 매우 길다: 원본 리포지토리의 home.html은 444줄, home.js는 476줄, home.css는 679줄, home-card.css는 452줄이다. 전반적으로 파일의 길이가 매우 길어 가독성이 심각하게 떨어진다.

- 중복되거나 무의미한 HTML/CSS가 많다: 잘 모르는 상태에서 시간에 쫓기며 만들었기 때문에 CSS가 의도하고자 했던대로 작동하지 않으면 class나 id, div를 마구 추가해가며 의도대로 적용될 때까지 HTML과 CSS를 만들었다. 그래서 중복되거나 무의미하게 작성된 요소들이 굉장히 많아 어떤 부분을 수정해야 특정 요소를 조정할 수 있는지 파악하기 매우 힘든 상황이다.

- HTML/CSS 네이밍 컨벤션이 제각각이다: HTML/CSS 네이밍 컨벤션이 통일되어 있지 않아 정확히 어떤 섹션의 어떤 요소를 가르키는 건지 파악하기 어렵다.

### 1-4. 목표

- HTML/CSS 컴포넌트화: HTML과 CSS를 section 및 기타 기능별로 컴포넌트화하여 가독성과 유지보수성을 높인다. 또한, 불필요하거나 중복되는 HTML/CSS를 제거 및 통합하고 CSS 네이밍 컨벤션을 통일한다.

- JS 코드 분할: 레이아웃 및 애니메이션 함수를 기능별로 세분화하여 파일을 나누고, 각 기능에 대한 상세한 주석을 추가한다.

## 2. 리팩토링 결과

### 1차 리팩토링: HTML/CSS 컴포넌트화

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>모두의 금융, 하나은행</title>
    <link rel="icon" type="image/png" href="./assets/images/favicon.png" />
    <link rel="stylesheet" href="./css/index.css" />
  </head>
  <body class="before-load">
    <div include-html="./html/loading.html"></div>
    <header include-html="./html/header.html"></header>
    <main class="container">
      <section include-html="./html/section-0.html"></section>
      <section include-html="./html/section-1.html"></section>
      <section include-html="./html/section-2.html"></section>
      <section include-html="./html/section-3.html"></section>
      <section include-html="./html/section-4.html"></section>
      <section include-html="./html/section-5.html"></section>
      <section include-html="./html/section-6.html"></section>
      <section include-html="./html/section-7.html"></section>
      <section include-html="./html/section-8.html"></section>
    </main>
    <footer include-html="./html/footer.html"></footer>
    <script type="module" src="./js/index.js"></script>
  </body>
</html>
```

- 모든 요소를 컴포넌트화 하여 index.html을 28줄로 깔끔하게 정리했다.
- 불필요하거나 중복되는 HTML/CSS를 제거하고, 통합했다.
- CSS 네이밍 컨벤션을 통일하고 직관적인 네이밍으로 수정했다.

### 2차 리팩토링: JS 코드 분할

진행 중
