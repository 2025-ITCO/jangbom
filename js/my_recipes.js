document.addEventListener("DOMContentLoaded", () => {
  const latestTab = document.querySelector(".search-filter .lately");
  const alphaTab = document.querySelector(".search-filter .abc");
  const list = document.querySelector(".list-set");

  if (!latestTab || !alphaTab || !list) return;

  // 카드(아이템) 수집
  const items = Array.from(list.querySelectorAll(".recipes_list"));
  // 최초 DOM 순서 기억(필요 시 복구용)
  items.forEach((el, i) => (el._idx = i));

  // 유틸: 제목/날짜 파싱
  const getTitle = (el) =>
    el.querySelector(".menu_name")?.textContent.trim() || "";

  const getDate = (el) => {
    const raw = el.querySelector(".menu_date")?.textContent.trim() || "";
    const m = raw.match(/(\d{4})[.\-/](\d{2})[.\-/](\d{2})/); // 2025.08.13 저장
    return m ? new Date(`${m[1]}-${m[2]}-${m[3]}`).getTime() : 0;
  };

  // 탭 상태 토글(하이라이트)
  const setActive = (activeEl) => {
    [latestTab, alphaTab].forEach((el) => {
      const on = el === activeEl;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
      el.setAttribute("role", "tab");
    });
    // 탭 리스트 접근성
    latestTab.parentElement.setAttribute("role", "tablist");
  };

  // 정렬 & DOM 재배치
  const sortList = (mode) => {
    const sorted = items.slice().sort((a, b) => {
      if (mode === "alpha") {
        return getTitle(a).localeCompare(getTitle(b), "ko", {
          sensitivity: "base",
          numeric: true,
        });
      }
      // 최신순(내림차순)
      return getDate(b) - getDate(a);
    });
    sorted.forEach((el) => list.appendChild(el));
  };

  // 이벤트 바인딩
  latestTab.addEventListener("click", () => {
    setActive(latestTab);
    sortList("latest");
  });
  alphaTab.addEventListener("click", () => {
    setActive(alphaTab);
    sortList("alpha");
  });

  // 초기: 최신순
  setActive(latestTab);
  sortList("latest");
});
