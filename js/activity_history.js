document.addEventListener("DOMContentLoaded", () => {
  /* ===== 공통 엘리먼트 ===== */
  const rangeBtn = document.getElementById("rangeBtn");
  const rangeMenu = document.getElementById("rangeMenu");
  const rangeItems = Array.from(
    rangeMenu?.querySelectorAll(".range-item") || []
  );
  const listWrap = document.querySelector(".list-set");
  const items = Array.from(listWrap?.querySelectorAll(".recipes_list") || []);
  const latestTab = document.querySelector(".search-filter .lately");
  const alphaTab = document.querySelector(".search-filter .abc");

  if (!rangeBtn || !rangeMenu || !items.length || !latestTab || !alphaTab)
    return;

  /* ===== 유틸: 날짜/제목 파싱 ===== */
  const parseDate = (str) => {
    // 예: "2025.08.13 15:00"
    const m = String(str || "")
      .trim()
      .match(/(\d{4})[.\-\/](\d{2})[.\-\/](\d{2})\s+(\d{2}):(\d{2})/);
    if (!m) return 0;
    const [, y, M, d, h, min] = m;
    return new Date(`${y}-${M}-${d}T${h}:${min}:00`).getTime();
  };
  const getTitle = (el) =>
    el.querySelector(".menu_name")?.textContent.trim() || "";
  const getTime = (el) => {
    // 캐시(없으면 menu_date에서 읽어와 data-ts로 저장)
    let ts = el.dataset.ts ? Number(el.dataset.ts) : NaN;
    if (Number.isNaN(ts)) {
      ts = parseDate(el.querySelector(".menu_date")?.textContent);
      el.dataset.ts = String(ts);
    }
    return ts;
  };

  // 초기 DOM 순서 기억(안전한 재배치용)
  items.forEach((el, i) => (el._idx = i));

  /* ===== 1) 범위 드롭다운 ===== */

  // 메뉴 열고/닫기
  const openMenu = () => {
    rangeMenu.hidden = false;
    rangeBtn.setAttribute("aria-expanded", "true");
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEscClose);
  };
  const closeMenu = () => {
    rangeMenu.hidden = true;
    rangeBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onDocClick);
    document.removeEventListener("keydown", onEscClose);
  };
  const toggleMenu = () => (rangeMenu.hidden ? openMenu() : closeMenu());

  // 바깥 클릭 시 닫기
  const onDocClick = (e) => {
    if (e.target.closest(".range-dropdown")) return;
    closeMenu();
  };
  const onEscClose = (e) => {
    if (e.key === "Escape") closeMenu();
  };

  rangeBtn.addEventListener("click", toggleMenu);

  // 범위 → 기준 시각 계산
  const calcSince = (value) => {
    const now = new Date();
    const since = new Date(now);
    switch (value) {
      case "1m":
        since.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        since.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        since.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        since.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return 0; // 전체
      default:
        return 0;
    }
    return since.getTime();
  };

  // 메뉴 항목 선택
  const selectRange = (li) => {
    rangeItems.forEach((el) => {
      const on = el === li;
      el.classList.toggle("is-selected", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
    });
    // 버튼 라벨 업데이트
    rangeBtn.childNodes[0].nodeValue = (li.textContent || "").trim() + " ";
    rangeBtn.dataset.value = li.dataset.value || "";

    // 필터 적용
    applyRangeFilter(li.dataset.value || "all");
    closeMenu();
  };

  // 실제 필터링
  const applyRangeFilter = (value) => {
    const sinceTs = calcSince(value);
    items.forEach((el) => {
      const ts = getTime(el);
      const visible = value === "all" ? true : ts >= sinceTs;
      el.style.display = visible ? "" : "none";
    });
  };

  // 메뉴 항목 클릭 바인딩
  rangeItems.forEach((li) =>
    li.addEventListener("click", () => selectRange(li))
  );

  // 초기 상태(현재 is-selected된 값으로)
  const initialRange =
    rangeItems.find((el) => el.classList.contains("is-selected")) ||
    rangeItems[0];
  if (initialRange) selectRange(initialRange);

  /* ===== 2) 최신순 / 가나다순 정렬 ===== */

  const setActiveTab = (btn) => {
    [latestTab, alphaTab].forEach((el) =>
      el.classList.toggle("is-active", el === btn)
    );
  };

  const sortList = (mode) => {
    // 현재 display:none인 항목은 그대로 두고, 보이는 항목만 정렬
    const visible = items.filter((el) => el.style.display !== "none");
    const hidden = items.filter((el) => el.style.display === "none");

    const sorted = visible.slice().sort((a, b) => {
      if (mode === "alpha") {
        return getTitle(a).localeCompare(getTitle(b), "ko", {
          sensitivity: "base",
          numeric: true,
        });
      }
      // 최신순(내림차순)
      return getTime(b) - getTime(a);
    });

    // DOM 재배치: 보이는 것들 먼저 순서대로, 그 뒤에 감춰진 것들 원래 순서대로
    sorted.forEach((el) => listWrap.appendChild(el));
    hidden
      .sort((a, b) => a._idx - b._idx)
      .forEach((el) => listWrap.appendChild(el));
  };

  latestTab.addEventListener("click", () => {
    setActiveTab(latestTab);
    sortList("latest");
  });
  alphaTab.addEventListener("click", () => {
    setActiveTab(alphaTab);
    sortList("alpha");
  });

  // 초기: 최신순
  setActiveTab(latestTab);
  sortList("latest");
});
