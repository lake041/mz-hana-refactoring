import { playAnimation, calcValues } from "./animate.js";

let prevScrollHeight = 0; // currentScene 이전까지의 모든 scrollHeight 합
let enterNewScene = false; // 새로운 scene이 시작된 순간 true
let acc = 0.2; // delayedYOffset이 yOffset에 가까워지는 속도 값
let delayedYOffset = 0; // 부드러운 스크롤 효과를 주기 위해서 yOffset을 현재 스크롤 값으로 바로 반영하지 않고 천천히 증가시킨다.

// local navigator의 sticky 속성을 설정한다.
export function checkNavSticky(yOffset) {
  if (yOffset > 44) {
    document.body.classList.add("local-nav-sticky");
  } else {
    document.body.classList.remove("local-nav-sticky");
  }
}

// eventListner
export function scrollLoop(state) {
  let { sceneInfo, yOffset, currentScene } = state;

  checkNavSticky();
  enterNewScene = false;
  prevScrollHeight = 0;

  // currentScene 이전까지의 모든 scrollHeight 합
  for (let i = 0; i < currentScene; i++) {
    prevScrollHeight += sceneInfo[i].scrollHeight;
  }

  // scroll section 영역에서는 scroll section 요소들을 보이게 한다.
  // .scroll-effect-end .fixed-box { display: none; }
  if (
    delayedYOffset <
    prevScrollHeight + sceneInfo[currentScene].scrollHeight
  ) {
    document.body.classList.remove("scroll-effect-end");
  }

  // scrollHeight + currentScene의 scrollHeight보다
  // delayedYOffset이 크다면 현재 scene을 벗어났다는 의미다.
  if (
    delayedYOffset >
    prevScrollHeight + sceneInfo[currentScene].scrollHeight
  ) {
    enterNewScene = true;
    // scroll section이 모두 끝나면 scroll section 요소들을 안 보이게 한다.
    if (currentScene === sceneInfo.length - 1) {
      document.body.classList.add("scroll-effect-end");
    }
    if (currentScene < sceneInfo.length - 1) {
      state.currentScene++;
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  if (delayedYOffset < prevScrollHeight) {
    enterNewScene = true;
    // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
    if (state.currentScene === 0) return;
    state.currentScene--;
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  if (enterNewScene) return;

  playAnimation(sceneInfo, currentScene, yOffset, prevScrollHeight);
}

export function loop(state) {
  let { sceneInfo, yOffset, currentScene, rafId, rafState } = state;

  // 부드러운 스크롤 효과를 주기 위해서 yOffset을 현재 스크롤 값으로 바로 반영하지 않고 천천히 증가시킨다.
  // scroll할 때마다 scrollLoop => loop 계속 호출되므로 조금씩 더해지면서 yOffset에 가까워진다.
  delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

  if (!enterNewScene) {
    // 이미지 시퀀스 비디오가 포함된 씬만 처리
    if (currentScene === 0) {
      const currentYOffset = delayedYOffset - prevScrollHeight;
      const info = sceneInfo[currentScene];
      const objs = sceneInfo[currentScene].objs;
      let sequence = Math.round(calcValues(info.imageSequence, currentYOffset));
      if (objs.videoImages[sequence]) {
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      }
    }
  }

  // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
  // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
  if (delayedYOffset < 1) {
    scrollLoop(state);
    sceneInfo[0].objs.canvas.style.opacity = 1;
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  }
  // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
  if (document.body.offsetHeight - window.innerHeight - delayedYOffset < 1) {
    let tempYOffset = yOffset;
    scrollTo(0, tempYOffset - 1);
  }
  // requestAnimationFrame 함수가 반환하는 애니메이션 핸들을 저장한다.
  // 이 변수를 통해 언제든지 애니메이션을 취소할 수 있다.
  state.rafId = requestAnimationFrame(() => loop(state));

  // delayedOffset이 yOffset과 충분히 가까워져서 절댓값이 1보다 작으면 애니메이션을 취소한다.
  if (Math.abs(yOffset - delayedYOffset) < 1) {
    cancelAnimationFrame(state.rafId);
    state.rafState = false;
  }
}
