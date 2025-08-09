const chooseBoard = document.getElementById('chooseBoard');

let isDown = false;   // 마우스 눌림 상태
let startY;           // 마우스 클릭 시작 Y 좌표
let scrollTop;        // 스크롤 시작 위치

chooseBoard.addEventListener('mousedown', (e) => {
  isDown = true;
  chooseBoard.classList.add('active'); // 필요하면 커서 변경용
  startY = e.pageY - chooseBoard.offsetTop;
  scrollTop = chooseBoard.scrollTop;
});

chooseBoard.addEventListener('mouseleave', () => {
  isDown = false;
  chooseBoard.classList.remove('active');
});

chooseBoard.addEventListener('mouseup', () => {
  isDown = false;
  chooseBoard.classList.remove('active');
});

chooseBoard.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const y = e.pageY - chooseBoard.offsetTop;
  const walk = (y - startY) * 1; // 스크롤 속도 조절 (1은 기본)
  chooseBoard.scrollTop = scrollTop - walk;
});
