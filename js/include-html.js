export const includeHTML = async () => {
  const elements = document.querySelectorAll("[include-html]");

  for (const element of elements) {
    const file = element.getAttribute("include-html");

    if (file) {
      try {
        const response = await fetch(file);
        if (response.status === 200) {
          const html = await response.text();
          const tagName = element.tagName;
          if (tagName === "HEADER" || tagName === "FOOTER") {
            element.innerHTML = html;
            element.removeAttribute("include-html");
          } else {
            element.outerHTML = html;
          }
        } else if (response.status === 404) {
          element.innerHTML = "페이지를 찾을 수 없습니다.";
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error("오류가 발생했습니다:", error);
      }
    }
  }
};
