document.addEventListener("DOMContentLoaded", () => {
  const pwBox = document.querySelector(".pw-nums");
  const btnNext = document.querySelector(".completenumBtn");
  const dialpad = document.getElementById("dialpad");
  const boxes = Array.from(document.querySelectorAll(".pw-num"));
  const root = document.documentElement;

  // 숨은 네이티브 입력창(모바일 키보드용)
  let hidden = document.getElementById("pinHidden");
  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "tel";
    hidden.inputMode = "numeric";
    hidden.autocomplete = "one-time-code";
    hidden.maxLength = 4;
    hidden.id = "pinHidden";
    Object.assign(hidden.style, {
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
      width: "1px",
      height: "1px",
      left: "-9999px",
      top: "0",
    });
    document.body.appendChild(hidden);
  }

  const setBtnFloating = () => {
    const h = dialpad?.getBoundingClientRect().height || 0;
    root.style.setProperty("--dialpad-h", `${h}px`);
    btnNext.classList.add("lifted");
    document.body.classList.add("keyboard-open");
  };

  const resetBtnFloating = () => {
    btnNext.classList.remove("lifted");
    document.body.classList.remove("keyboard-open");
    root.style.removeProperty("--dialpad-h");
  };

  const openDialpad = () => {
    if (dialpad) dialpad.classList.remove("hidden");
    setBtnFloating();
    hidden.focus({ preventScroll: true }); // 모바일 키보드
  };

  const closeDialpad = () => {
    if (dialpad) dialpad.classList.add("hidden");
    resetBtnFloating();
    hidden.blur();
  };

  const renderBoxes = (val) => {
    const digits = (val || "").replace(/\D/g, "").slice(0, 4);
    boxes.forEach((b, i) => {
      b.textContent = digits[i] ? "•" : "";
    });
    hidden.value = digits;
    btnNext.disabled = digits.length !== 4;
  };

  // 입력 반영
  hidden.addEventListener("input", () => renderBoxes(hidden.value));

  // ✅ 초기 상태는 "무조건 닫힘"
  closeDialpad();
  renderBoxes("");
  btnNext.disabled = true;

  // pw-nums 클릭 → 열기
  pwBox.addEventListener("click", openDialpad);

  // 바깥 클릭 시 닫기(선택)
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("keyboard-open")) return;
    const within =
      e.target.closest(".pw-nums") ||
      e.target.closest("#dialpad") ||
      e.target.closest(".completenumBtn");
    if (!within) closeDialpad();
  });

  // iOS 키보드 높이 반영(있을 때)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      if (!document.body.classList.contains("keyboard-open")) return;
      const kb = Math.max(0, window.innerHeight - window.visualViewport.height);
      const h = kb || dialpad?.getBoundingClientRect().height || 0;
      root.style.setProperty("--dialpad-h", `${h}px`);
    });
  }

  // 다음 버튼
  btnNext.addEventListener("click", () => {
    if (btnNext.disabled) return;
    // TODO: 검증/전송
    closeDialpad();
    // document.getElementById('confirmSuccess').classList.remove('hidden');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const pwBox = document.querySelector(".pw-nums");
  const btnNext = document.querySelector(".completenumBtn");
  const dialpad = document.getElementById("dialpad");
  const boxes = Array.from(document.querySelectorAll(".pw-num"));
  const pinError = document.getElementById("pinError");
  const success = document.getElementById("confirmSuccess");
  const okBtn = document.getElementById("confirmOkBtn");
  const root = document.documentElement;

  // 기대 핀은 data-pin에서 가져오고 없으면 1234
  const pinHost = document.querySelector(".request-pw");
  const EXPECT = (pinHost?.dataset?.pin || "1234")
    .replace(/\D/g, "")
    .slice(0, 4);

  // 숨은 입력(모바일 네이티브 키보드용)
  let hidden = document.getElementById("pinHidden");
  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "tel";
    hidden.inputMode = "numeric";
    hidden.autocomplete = "one-time-code";
    hidden.maxLength = 4;
    hidden.id = "pinHidden";
    Object.assign(hidden.style, {
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
      width: "1px",
      height: "1px",
      left: "-9999px",
      top: "0",
    });
    document.body.appendChild(hidden);
  }

  // --- 다이얼패드 열기/닫기 (버튼 함께 떠오름) ---
  const setDialpadHeight = () => {
    const kb = window.visualViewport
      ? Math.max(0, window.innerHeight - window.visualViewport.height)
      : 0;
    const ph = dialpad?.getBoundingClientRect().height || 0;
    root.style.setProperty("--dialpad-h", `${kb || ph}px`);
  };

  const openDialpad = () => {
    dialpad?.classList.remove("hidden");
    document.body.classList.add("keyboard-open");
    btnNext.classList.add("lifted");
    requestAnimationFrame(() => {
      setDialpadHeight();
      hidden.focus({ preventScroll: true });
    });
  };

  const closeDialpad = () => {
    dialpad?.classList.add("hidden");
    document.body.classList.remove("keyboard-open");
    btnNext.classList.remove("lifted");
    root.style.setProperty("--dialpad-h", "0px");
    hidden.blur();
  };

  // --- 박스 렌더링: 점(•) 말고 숫자 그대로 표기 ---
  const renderBoxes = (val) => {
    const digits = (val || "").replace(/\D/g, "").slice(0, 4);
    boxes.forEach((b, i) => {
      b.textContent = digits[i] ?? "";
    });
    hidden.value = digits;

    // 4자리면 버튼 활성화, 아니면 비활성화
    btnNext.disabled = digits.length !== 4;

    // 입력 중엔 에러 문구 숨김
    if (!pinError.hasAttribute("hidden")) pinError.setAttribute("hidden", "");
  };

  // 입력 반영
  hidden.addEventListener("input", () => renderBoxes(hidden.value));

  // 초기 상태: 닫힘 + 빈 값 + 버튼 비활성
  closeDialpad();
  renderBoxes("");
  btnNext.disabled = true;

  // PIN 박스 클릭 → 다이얼패드 열기
  pwBox.addEventListener("click", openDialpad);

  // 바깥 클릭 시 닫기(원치 않으면 제거)
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("keyboard-open")) return;
    const within =
      e.target.closest(".pw-nums") ||
      e.target.closest("#dialpad") ||
      e.target.closest(".completenumBtn");
    if (!within) closeDialpad();
  });

  // 키보드 높이 변할 때 보정(iOS)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      if (document.body.classList.contains("keyboard-open")) setDialpadHeight();
    });
  }

  // 다음 버튼: 검증 → 성공 모달 OR 에러
  btnNext.addEventListener("click", () => {
    if (btnNext.disabled) return;

    const val = hidden.value;
    if (val === EXPECT) {
      // 성공
      closeDialpad();
      success?.setAttribute("aria-hidden", "false");
      success?.classList.add("open"); // CSS에서 표시 처리
    } else {
      // 실패: 에러 노출 + 버튼 비활성화 유지
      pinError?.removeAttribute("hidden");
      btnNext.disabled = true;
      // (선택) 흔들기
      boxes.forEach((b) => {
        b.classList.add("shake");
        setTimeout(() => b.classList.remove("shake"), 300);
      });
      // 재입력 쉽게 포커스 유지
      hidden.focus({ preventScroll: true });
      hidden.select?.();
    }
  });

  // 성공 모달 닫기
  okBtn?.addEventListener("click", () => {
    success?.classList.remove("open");
    success?.setAttribute("aria-hidden", "true");
  });
});

// 기대 PIN (없으면 1234). 필요하면 <div class="request-pw" data-pin="5678">로 바꿔도 됨
const pinHost = document.querySelector(".request-pw");
const EXPECT = (pinHost?.dataset?.pin || "1234").replace(/\D/g, "").slice(0, 4);

// ... (기존 코드)

// 숫자 박스 렌더 (입력 시 에러 숨기기 포함)
const renderBoxes = (val) => {
  const digits = (val || "").replace(/\D/g, "").slice(0, 4);
  boxes.forEach((b, i) => {
    b.textContent = digits[i] ?? "";
    b.classList.toggle("has-value", !!digits[i]);
    b.classList.toggle(
      "next",
      i === digits.length && digits.length < boxes.length
    );
    b.classList.remove("error"); // 에러 테두리 초기화
  });
  hidden.value = digits;
  btnNext.disabled = digits.length !== 4;

  // 입력 중엔 에러 문구 숨김
  if (!pinError.hasAttribute("hidden")) pinError.setAttribute("hidden", "");
};

// ... (기존 코드)

// ✅ 다음 버튼: 검증 로직
btnNext.addEventListener("click", () => {
  if (btnNext.disabled) return;

  const val = hidden.value;
  if (val === EXPECT) {
    // 성공 처리 (원하는 동작으로 대체)
    closeDialpad();
    success?.setAttribute("aria-hidden", "false");
    success?.classList.add("open");
  } else {
    // ❌ 실패: 에러 문구 노출 + 버튼 잠금 + 박스 강조
    pinError?.removeAttribute("hidden");
    btnNext.disabled = true;

    boxes.forEach((b) => {
      b.classList.add("error");
      b.classList.add("shake");
      setTimeout(() => b.classList.remove("shake"), 300);
    });

    // 재입력 쉽게 포커스 유지
    hidden.focus({ preventScroll: true });
    hidden.select?.();
  }
});
