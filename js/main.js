import { setSceneInfo } from "./scene-info.js";
import { initiate, setLayout } from "./initiate.js";
import { scrollLoop, loop, checkNavSticky } from './scroll.js';

export const main = () => {
  let state = {
    sceneInfo: null, // 각 섹션별 애니메이션의 타이밍과 시작 및 목표값을 정의한 배열 값
    yOffset: 0, // 현재 window.scrollY 값
    currentScene: 0, // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    rafId: null, // requestAnimationFrame 함수가 반환하는 애니메이션 핸들
    rafState: false, // 현재 애니메이션이 진행 중인지 중지된 상태인지 나타내는 상태 값
  }

  function onLoad() {
    // window가 로드 되면 body의 before-load 클래스를 제거한다.
    // .before-load .container => display: none; 
    document.body.classList.remove("before-load");
  
    state.sceneInfo = setSceneInfo();
    initiate(state.sceneInfo);
    
    // 이미지 시퀀스 비디오가 있는 씬의 캔버스에 첫 장면 그려주기
    // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
    let tempYOffset = state.yOffset;
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
      checkNavSticky(state.yOffset);
      state.yOffset = window.scrollY;
      scrollLoop(state);
    
      if (!state.rafState) {
        state.rafId = requestAnimationFrame(() => {
          loop(state);  // 여기에 state를 추가합니다.
        });
        state.rafState = true;
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
