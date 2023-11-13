let sceneInfo;
let currentScene;

export function playAnimation(sceneInfoParam, currentSceneParam, yOffset, prevScrollHeight) {
  sceneInfo = sceneInfoParam;
  currentScene = currentSceneParam;
  
  const objs = sceneInfo[currentScene].objs;
  const values = sceneInfo[currentScene].values;
  const currentYOffset = yOffset - prevScrollHeight; // 현재 섹션 안에서의 yOffset
  const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 섹션의 전체 스크롤 높이
  const scrollRatio = currentYOffset / scrollHeight; // 현재 섹션 안에서의 스크롤 비율

  for (let key in values) {
    setAnimation(objs[key[0]], key.slice(2), values[key], currentYOffset, scrollRatio);
  }
  if (currentScene === 0) {
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  }
}

// animation
// 각 스크롤섹션에서의 스크롤 비율 구하기
export function calcValues(values, currentYOffset) {
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


function setAnimation(object, type, values, currentYOffset, scrollRatio) {
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