import { setSceneInfo } from "./scene-info.js";
import { playAnimation } from "./animate.js";

export const main = () => {
  let sceneInfo;
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.2;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

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

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      document.body.classList.remove("scroll-effect-end");
    }

    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
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
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      // 이미지 시퀀스 비디오가 포함된 씬만 처리
      if (currentScene === 0) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const info = sceneInfo[currentScene];
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
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
    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  // 레이아웃 설정
  function setLayout() {
    // sceneInfo에 정의된 heightNum에 따라 실제 height와 scrollHeight를 설정한다.
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.scrollY;

    // totalScrollHeight을 계산해서 body에 currentScene을 설정한다.
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    // 브라우저 비율에 따라 video scale 값을 조정한다.
    const widthRatio = window.innerWidth / 1280;
    const heightRatio = window.innerHeight / 720;
    const scaleRatio = Math.max(widthRatio, heightRatio)
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${scaleRatio})`;

    const s5video = document.querySelector(".s5-video");
    const s5videoWidthRatio = window.innerWidth / 1920;
    const s5videoHeightRatio = window.innerHeight / 1080;
    const s5scaleRatio = Math.max(s5videoWidthRatio, s5videoHeightRatio);
    s5video.style.transform = `translate3d(-50%, -50%, 0) scale(${s5scaleRatio})`;

    const s7video = document.querySelector(".s7-video");
    const s7videoWidthRatio = window.innerWidth / 1920;
    const s7videoHeightRatio = window.innerHeight / 1080;
    const s7scaleRatio = Math.max(s7videoWidthRatio, s7videoHeightRatio);
    s7video.style.transform = `translate3d(-50%, -50%, 0) scale(${s7scaleRatio})`;  
  }

  // 이미지 시퀀스 로딩
  function setCanvasImages() {
    for (let i = 0; i < sceneInfo[0].videoImageCount; i++) {
      const imgElem = new Image();
      const sequenceNum = String(1 + i).padStart(3, "0");
      imgElem.src = `./assets/sequence/${sequenceNum}.jpg`;
      // imgElem.src = `./assets/sequence_high/${sequenceStr}.png`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
  }

  // 첫 로딩 시 "MZ 하나은행" 투명도 조절
  function setTitleOpacity() {
    yOffset = window.scrollY;
    const title = document.querySelector("#s0-message-box-0");
    if (title.style.opacity === 1) {
      title.style.opacity = 0;
    } else if (yOffset === 0) {
      title.style.opacity = 1;
    }
  }

  function onLoad() {
    // 로드 되면 body의 before-load 클래스를 제거한다.
    // .before-load .container => display: none; 
    document.body.classList.remove("before-load");
  
    sceneInfo = setSceneInfo();
    setLayout();
    setCanvasImages();
    setTitleOpacity();
    
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
