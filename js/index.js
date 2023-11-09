(() => {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.2;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

  // Scene Information
  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      videoImageCount: 480,
      // videoImageCount: 520,
      imageSequence: [1, 520],
      objs: {
        z: document.querySelector("#s0-message-box-0"),
        a: document.querySelector("#s0-message-box-1"),
        b: document.querySelector("#s0-message-box-2"),
        c: document.querySelector("#s0-message-box-3"),
        d: document.querySelector("#s0-message-box-4"),
        videoImages: [],
        container: document.querySelector("#scroll-section-0"),
        canvas: document.querySelector("#s0-video-canvas"),
        v: document.querySelector("#s0-video-canvas"),
        context: document.querySelector("#s0-video-canvas").getContext("2d"),
      },
      values: {
        z_opacity: [1, 1, { start: 0, end: 0.03 }, 1, 0, { start: 0.05, end: 0.08 }],
        z_transfo: [20, 0, { start: 0, end: 0.03 }, 0, -20, { start: 0.05, end: 0.08 }],
        a_opacity: [0, 1, { start: 0.1, end: 0.2 }, 1, 0, { start: 0.25, end: 0.3 }],
        a_transfo: [20, 0, { start: 0.1, end: 0.2 }, 0, -20, { start: 0.25, end: 0.3 }],
        b_opacity: [0, 1, { start: 0.45, end: 0.5 }, 1, 0, { start: 0.85, end: 0.9 }],
        b_transfo: [20, 0, { start: 0.45, end: 0.5 }, 0, -20, { start: 0.85, end: 0.9 }],
        c_opacity: [0, 1, { start: 0.52, end: 0.57 }, 1, 0, { start: 0.85, end: 0.9 }],
        c_transfo: [20, 0, { start: 0.52, end: 0.57 }, 0, -20, { start: 0.85, end: 0.9 }],
        d_opacity: [0, 1, { start: 0.59, end: 0.64 }, 1, 0, { start: 0.85, end: 0.9 }],
        d_transfo: [20, 0, { start: 0.59, end: 0.64 }, 0, -20, { start: 0.85, end: 0.9 }],
        v_opacity: [1, 0, { start: 0.9, end: 1 }, 0, 0, { start: 1, end: 1 }],
      },
    },

    {
      // 1
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
        z: document.querySelector("#s1-card-box-0"),
        a: document.querySelector("#s1-card-box-1"),
        b: document.querySelector("#s1-card-box-2"),
      },
      values: {
        z_opacity: [0, 1, { start: 0, end: 0.2 }, 1, 0, { start: 0.8, end: 0.9 }],
        z_transfo: [20, 0, { start: 0, end: 0.2 }, 0, -20, { start: 0.8, end: 0.9 }],
        a_opacity: [0, 1, { start: 0.25, end: 0.45 }, 1, 0, { start: 0.8, end: 0.9 }],
        a_transfo: [20, 0, { start: 0.25, end: 0.45 }, 0, -20, { start: 0.8, end: 0.9 }],
        b_opacity: [0, 1, { start: 0.5, end: 0.7 }, 1, 0, { start: 0.8, end: 0.9 }],
        b_transfo: [20, 0, { start: 0.5, end: 0.7 }, 0, -20, { start: 0.8, end: 0.9 }],
      },
    },

    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        z: document.querySelector("#s2-message-box-0"),
        a: document.querySelector("#s2-message-box-1"),
        b: document.querySelector("#s2-message-box-2"),
      },
      values: {
        z_opacity: [0, 1, { start: 0, end: 0.25 }, 1, 0, { start: 0.8, end: 0.85 }],
        z_transfo: [350, 0, { start: 0, end: 0.25 }, 0, 0, { start: 0.8, end: 0.85 }],
        a_opacity: [0, 1, { start: 0.35, end: 0.5 }, 1, 0, { start: 0.55, end: 0.6 }],
        a_transfo: [50, 0, { start: 0.35, end: 0.5 }, 0, 0, { start: 0.55, end: 0.6 }],
        b_opacity: [0, 1, { start: 0.65, end: 0.8 }, 1, 0, { start: 0.9, end: 0.95 }],
        b_transfo: [50, 0, { start: 0.65, end: 0.8 }, 0, 0, { start: 0.9, end: 0.95 }],
      },
    },

    {
      // 3
      type: "sticky",
      heightNum: 8,
      scrollHeight: 0,
      objs: {
        k: document.querySelector(".container"),
        container: document.querySelector("#scroll-section-3"),
        z: document.querySelector("#scroll-section-3 .card-message.z"),
        a: document.querySelector("#scroll-section-3 .card-message.a"),
        b: document.querySelector("#scroll-section-3 .card-message.b"),
        c: document.querySelector("#scroll-section-3 .card-message.c"),
      },
      values: {
        z_opacity: [0, 1, { start: 0, end: 0.05 }, 1, 0, { start: 0.2, end: 0.22 }],
        z_transfo: [1, 0, { start: 0, end: 0.05 }, 0, -1, { start: 0.2, end: 0.22 }],
        a_opacity: [0, 1, { start: 0.25, end: 0.3 }, 1, 0, { start: 0.45, end: 0.47 }],
        a_transfo: [1, 0, { start: 0.25, end: 0.3 }, 0, -1, { start: 0.45, end: 0.47 }],
        b_opacity: [0, 1, { start: 0.5, end: 0.55 }, 1, 0, { start: 0.7, end: 0.72 }],
        b_transfo: [1, 0, { start: 0.5, end: 0.55 }, 0, -1, { start: 0.7, end: 0.72 }],
        c_opacity: [0, 1, { start: 0.75, end: 0.8 }, 1, 0, { start: 0.95, end: 0.97 }],
        c_transfo: [1, 0, { start: 0.75, end: 0.8 }, 0, -1, { start: 0.95, end: 0.97 }],
        k_background: [0, 255, { start: 0.8, end: 0.95 }, 255, 255, { start: 0.95, end: 0.95 }],
      },
    },

    {
      // 4
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-4"),
        a: document.querySelector("#scroll-section-4 .main-message.a"),
        b: document.querySelector("#scroll-section-4 .main-message.b"),
        c: document.querySelector("#scroll-section-4 .main-message.c"),
        d: document.querySelector("#scroll-section-4 .main-message.d"),
        e: document.querySelector("#scroll-section-4 .main-message.e"),
        f: document.querySelector("#scroll-section-4 .main-message.f"),
        g: document.querySelector("#scroll-section-4 .main-message.g"),
        h: document.querySelector("#scroll-section-4 .main-message.h"),
      },
      values: {
        a_opacity: [0, 1, { start: 0, end: 0.13 }, 1, 0, { start: 0.13, end: 0.24 }],
        a_transfo: [300, 0, { start: 0, end: 0.13 }, 0, -300, { start: 0.13, end: 0.24 }],
        b_opacity: [0, 1, { start: 0.08, end: 0.21 }, 1, 0, { start: 0.21, end: 0.33 }],
        b_transfo: [300, 0, { start: 0.08, end: 0.21 }, 0, -300, { start: 0.21, end: 0.33 }],
        c_opacity: [0, 1, { start: 0.16, end: 0.29 }, 1, 0, { start: 0.29, end: 0.41 }],
        c_transfo: [300, 0, { start: 0.16, end: 0.29 }, 0, -300, { start: 0.29, end: 0.41 }],
        d_opacity: [0, 1, { start: 0.24, end: 0.37 }, 1, 0, { start: 0.37, end: 0.49 }],
        d_transfo: [300, 0, { start: 0.24, end: 0.37 }, 0, -300, { start: 0.37, end: 0.49 }],
        e_opacity: [0, 1, { start: 0.32, end: 0.45 }, 1, 0, { start: 0.45, end: 0.57 }],
        e_transfo: [300, 0, { start: 0.32, end: 0.45 }, 0, -300, { start: 0.45, end: 0.57 }],
        f_opacity: [0, 1, { start: 0.4, end: 0.53 }, 1, 0, { start: 0.53, end: 0.65 }],
        f_transfo: [300, 0, { start: 0.4, end: 0.53 }, 0, -300, { start: 0.53, end: 0.65 }],
        g_opacity: [0, 1, { start: 0.48, end: 0.61 }, 1, 0, { start: 0.61, end: 0.73 }],
        g_transfo: [300, 0, { start: 0.48, end: 0.61 }, 0, -300, { start: 0.61, end: 0.73 }],
        h_opacity: [0, 1, { start: 0.56, end: 0.69 }, 1, 0, { start: 0.69, end: 0.81 }],
        h_transfo: [300, 0, { start: 0.56, end: 0.69 }, 0, -300, { start: 0.69, end: 0.81 }],
      },
    },

    {
      // 5
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        k: document.querySelector(".container"),
        v: document.querySelector(".s-5-video"),
        container: document.querySelector("#scroll-section-5"),
        z: document.querySelector("#scroll-section-5 .main-message.z"),
        a: document.querySelector("#scroll-section-5 .main-message.a"),
      },
      values: {
        z_color: [0, 255, { start: 0.35, end: 0.5 }, 255, 255, { start: 0.5, end: 0.5 }],
        z_opacity: [0, 1, { start: 0, end: 0.25 }, 1, 0, { start: 0.8, end: 0.87 }],
        z_transfo: [50, 0, { start: 0, end: 0.25 }, 0, 0, { start: 0.8, end: 0.87 }],
        a_opacity: [0, 1, { start: 0.35, end: 0.5 }, 1, 0, { start: 0.8, end: 0.87 }],
        a_transfo: [50, 0, { start: 0.35, end: 0.5 }, 0, 0, { start: 0.8, end: 0.87 }],
        a_fontSize: [7, 4.5, { start: 0.35, end: 0.5 }, 4.5, 4.5, { start: 0.8, end: 0.87 }],
        v_opacity: [0, 1, { start: 0.35, end: 0.5 }, 1, 0, { start: 0.8, end: 0.87 }],
        k_background: [255, 0, { start: 0.8, end: 0.95 }, 0, 0, { start: 0.95, end: 0.95 }],
      },
    },

    {
      // 6
      type: "sticky",
      heightNum: 3,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-6"),
        z: document.querySelector("#scroll-section-6 .card-message.z"),
        a: document.querySelector("#scroll-section-6 .main-message.a"),
        b: document.querySelector("#scroll-section-6 .main-message.b"),
      },
      values: {
        z_opacity: [0, 1, { start: 0, end: 0.05 }, 1, 0, { start: 0.9, end: 0.95 }],
        z_transfo: [50, 0, { start: 0, end: 0.05 }, 0, 0, { start: 0.9, end: 0.95 }],
        a_opacity: [0, 1, { start: 0.1, end: 0.15 }, 1, 0, { start: 0.45, end: 0.5 }],
        a_transfo: [50, 0, { start: 0.1, end: 0.15 }, 0, 0, { start: 0.45, end: 0.5 }],
        b_opacity: [0, 1, { start: 0.55, end: 0.6 }, 1, 0, { start: 0.9, end: 0.95 }],
        b_transfo: [50, 0, { start: 0.55, end: 0.6 }, 0, 0, { start: 0.9, end: 0.95 }],
      },
    },

    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        v: document.querySelector(".s-7-video"),
        container: document.querySelector("#scroll-section-7"),
        a: document.querySelector("#scroll-section-7 .main-message.a"),
        b: document.querySelector("#scroll-section-7 .main-message.b"),
      },
      values: {
        a_opacity: [0, 1, { start: 0.1, end: 0.15 }, 1, 0, { start: 0.75, end: 0.85 }],
        a_transfo: [50, 0, { start: 0.1, end: 0.15 }, 0, 0, { start: 0.75, end: 0.85 }],
        b_opacity: [0, 1, { start: 0.2, end: 0.25 }, 1, 0, { start: 0.75, end: 0.85 }],
        b_transfo: [50, 0, { start: 0.2, end: 0.25 }, 0, 0, { start: 0.75, end: 0.85 }],
        v_opacity: [0, 1, { start: 0.15, end: 0.25 }, 1, 0, { start: 0.75, end: 0.85 }],
      },
    },
  ];

  // animation
  // 각 스크롤섹션에서의 스크롤 비율 구하기
  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function animation(object, type, values, currentYOffset, scrollRatio) {
    const timing = values[2].end;
    if (type === "opacity") {
      if (scrollRatio <= timing) {
        object.style.opacity = calcValues(values.slice(0, 3), currentYOffset);
      } else {
        object.style.opacity = calcValues(values.slice(-3), currentYOffset);
      }
    } else if (type === "transfo") {
      if (scrollRatio <= timing) {
        object.style.transform = `translate3d(0, ${calcValues(values.slice(0, 3), currentYOffset)}%, 0)`;
      } else {
        object.style.transform = `translate3d(0, ${calcValues(values.slice(-3), currentYOffset)}%, 0)`;
      }
    } else if (type === "color") {
      if (scrollRatio <= timing) {
        const temp = calcValues(values.slice(0, 3), currentYOffset);
        object.style.color = `rgb(${temp}, ${temp}, ${temp})`;
      } else {
        const temp = calcValues(values.slice(-3), currentYOffset);
        object.style.color = `rgb(${temp}, ${temp}, ${temp})`;
      }
    } else if (type === "background") {
      if (scrollRatio <= timing) {
        const temp = calcValues(values.slice(0, 3), currentYOffset);
        object.style.background = `rgb(${temp}, ${temp}, ${temp})`;
      } else {
        const temp = calcValues(values.slice(-3), currentYOffset);
        object.style.background = `rgb(${temp}, ${temp}, ${temp})`;
      }
    } else if (type === "fontSize") {
      if (scrollRatio <= timing) {
        object.style.fontSize = `${calcValues(values.slice(0, 3), currentYOffset)}rem`;
      } else {
        object.style.fontSize = `${calcValues(values.slice(-3), currentYOffset)}rem`;
      }
    }
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    for (var key in values) {
      animation(objs[key[0]], key.slice(2), values[key], currentYOffset, scrollRatio);
    }
    if (currentScene === 0) {
      sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    }
  }

  // layout
  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  }

  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.scrollY;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 720;
    const widthRatio = window.innerWidth / 1280;
    const scaleRatio = Math.max(heightRatio, widthRatio)
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${scaleRatio})`;
  }

  // eventListner
  function scrollLoop() {
    checkMenu();
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

    playAnimation();
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

  window.addEventListener("load", () => {
    // 로드 되면 body의 before-load 클래스를 제거한다.
    // 큰 의미는 없다.
    document.body.classList.remove("before-load");

    // 로드 되면 레이아웃을 그린다.
    setLayout();
    
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
  });

  // 첫 로딩 시 "MZ 하나은행" 투명도 조절
  function initiate() {
    yOffset = window.scrollY;
    const title = document.querySelector("#s0-message-box-0");
    if (title.style.opacity === 1) {
      title.style.opacity = 0;
    } else if (yOffset === 0) {
      title.style.opacity = 1;
    }
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

  setCanvasImages();
  initiate();
})();
