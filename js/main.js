import { setSceneInfo } from "./scene-info.js";
import { playAnimation, calcValues } from "./animate.js";
import { initiate, setLayout } from "./initiate.js";

export const main = () => {
  let sceneInfo; // 각 섹션별 애니메이션의 타이밍과 시작 및 목표값을 정의한 배열 값
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.2; // delayedYOffset이 yOffset에 가까워지는 속도 값
  let delayedYOffset = 0; // 부드러운 스크롤 효과를 주기 위해서 yOffset을 현재 스크롤 값으로 바로 반영하지 않고 천천히 증가시킨다.
  let rafId; // requestAnimationFrame 함수가 반환하는 애니메이션 핸들
  let rafState; // 현재 애니메이션이 진행 중인지 중지된 상태인지 나타내는 상태 값

  // local navigator의 sticky 속성을 설정한다.
  function checkNavSticky() {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  }

  // eventListner
  function scrollLoop() {
    checkNavSticky();
    enterNewScene = false;
    prevScrollHeight = 0;

    // currentScene 이전까지의 모든 scrollHeight 합
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    
    // scroll section 영역에서는 scroll section 요소들을 보이게 한다.
    // .scroll-effect-end .fixed-box { display: none; }
    if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      document.body.classList.remove("scroll-effect-end");
    }

    // scrollHeight + currentScene의 scrollHeight보다
    // delayedYOffset이 크다면 현재 scene을 벗어났다는 의미다.
    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
    // scroll section이 모두 끝나면 scroll section 요소들을 안 보이게 한다.
    if (currentScene === sceneInfo.length - 1) {
        document.body.classList.add("scroll-effect-end");
      }
      if (currentScene < sceneInfo.length - 1) {
        currentScene++;
      }
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;
      // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation(sceneInfo, currentScene, yOffset, prevScrollHeight);
  }

  function loop() {
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
      scrollLoop();
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
    rafId = requestAnimationFrame(loop);

    // delayedOffset이 yOffset과 충분히 가까워져서 절댓값이 1보다 작으면 애니메이션을 취소한다. 
    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  function onLoad() {
    // window가 로드 되면 body의 before-load 클래스를 제거한다.
    // .before-load .container => display: none; 
    document.body.classList.remove("before-load");
  
    sceneInfo = setSceneInfo();
    initiate(sceneInfo);
    
    // 이미지 시퀀스 비디오가 있는 씬의 캔버스에 첫 장면 그려주기
    // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
    let tempYOffset = yOffset;
    let tempScrollCount = 0;
    if (tempYOffset > 0) {
      let siId = setInterval(() => {
        scrollTo(0, tempYOffset);
        tempYOffset += 5;
  
        if (tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20);
    }
  
    window.addEventListener("scroll", () => {
      yOffset = window.scrollY;
      scrollLoop();
  
      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });
  
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setLayout();
      }
    });
  
    window.addEventListener("orientationchange", () => {
      setTimeout(setLayout, 500);
    });
  
    // 로딩 완료 후 로딩 제거
    document.querySelector(".loading").addEventListener("transitionend", (e) => {
      document.body.removeChild(e.currentTarget);
    });
  }
  
  // 페이지가 이미 로드되었는지 확인
  if (document.readyState === "complete") {
    onLoad();
  } else {
    // 페이지가 아직 로드되지 않았다면, 로드 완료 시 실행할 이벤트 핸들러를 등록
    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        onLoad();
      }
    };
  }
}
