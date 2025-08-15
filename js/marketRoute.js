// marketRoute.js
// CSS의 .open 전환(max-height / padding / margin / opacity)을 사용.
// display 속성은 건드리지 않음.

document.addEventListener("DOMContentLoaded", () => {
  // market / mart 둘 다 지원 (재사용성)
  document
    .querySelectorAll(".market-dropdown, .mart-dropdown")
    .forEach((section) => {
      const header = section.querySelector(".bar-title");
      const icon = section.querySelector(".more-icon");
      // 이 페이지는 .mat-block-set만 있지만, 재사용 고려해 모두 대응
      const content = section.querySelector(
        ".market-info, .market-info2, .mart-info, .mart-info2, .mat-block-set"
      );
      if (!header || !content) return;

      // 접근성
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.setAttribute("aria-expanded", "false");

      // 초기: 접힘(CSS 기본값이 접힘 상태여야 함)
      section.classList.remove("open");

      const setIconState = (open) => {
        if (!icon) return;
        icon.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
        icon.style.filter = open ? "brightness(0) saturate(100%)" : "";
        // 아이콘 파일 교체 원하면 아래 사용
        // icon.src = open ? "../img/chevron-down-black.svg" : "../img/chevron-down.svg";
      };

      const setState = (open) => {
        section.classList.toggle("open", open);
        header.setAttribute("aria-expanded", open ? "true" : "false");
        setIconState(open);
      };

      const toggle = () => setState(!section.classList.contains("open"));

      header.addEventListener("click", toggle);
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });

      // 이미지가 나중에 로드되어 높이가 바뀌면(썸네일 등) 열려 있을 때 자연스럽게 늘어나도록
      content.querySelectorAll("img").forEach((img) => {
        img.addEventListener("load", () => {
          if (section.classList.contains("open")) {
            // max-height를 크게 잡아두는 CSS라면 이 줄은 불필요하지만 안전하게 둠
            // (별도 inline 높이는 주지 않음: 트랜지션은 CSS가 담당)
            // noop
          }
        });
      });
    });
});
