let sceneInfo;
let currentScene = 0;
let yOffset;

// 레이아웃 설정
export const setLayout = () => {
  // sceneInfo에 정의된 heightNum에 따라 실제 height와 scrollHeight를 설정한다.
  for (let i = 0; i < sceneInfo.length; i++) {
    if (sceneInfo[i].type === "sticky") {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
    } else if (sceneInfo[i].type === "normal") {
      sceneInfo[i].scrollHeight =
        sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
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
  const scaleRatio = Math.max(widthRatio, heightRatio);
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
};

// 이미지 시퀀스 로딩
const setCanvasImages = () => {
  for (let i = 0; i < sceneInfo[0].videoImageCount; i++) {
    const imgElem = new Image();
    const sequenceNum = String(1 + i).padStart(3, "0");
    imgElem.src = `./assets/sequence/${sequenceNum}.jpg`;
    // imgElem.src = `./assets/sequence_high/${sequenceStr}.png`;
    sceneInfo[0].objs.videoImages.push(imgElem);
  }
};

// 첫 로딩 시 "MZ 하나은행" 투명도 조절
const setTitleOpacity = () => {
  yOffset = window.scrollY;
  const title = document.querySelector("#s0-message-box-0");
  if (title.style.opacity === 1) {
    title.style.opacity = 0;
  } else if (yOffset === 0) {
    title.style.opacity = 1;
  }
};

export const initiate = (sceneInfoParam) => {
  sceneInfo = sceneInfoParam;

  setLayout();
  setCanvasImages();
  setTitleOpacity();
};
