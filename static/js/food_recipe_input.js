// 음식 추천 스크롤 부분
const slider = document.querySelector('.recommendFood');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active'); // 필요하면 스타일용
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    slider.scrollLeft = scrollLeft - walk;
});


// 입력될 때 키보드 생성

const input = document.querySelector('.gptInput');
const defaultContent = document.querySelector('.contentArea');
const newContent = document.querySelector('.contentArea-newContent');
const gptBox = document.getElementById('gptBox');
const keyboardBottom = document.querySelector('.keyboard-icon');

input.addEventListener('focus', () => {
    // 키보드 이미지 보이기
    keyboardBottom.style.display = 'block';

    // 기본 contentArea 숨기기
    defaultContent.style.display = 'none';

    // 새 contentArea 보이기
    newContent.style.display = 'flex';  // flex 혹은 block 필요에 맞게

    // gptBox 위로 올리기
    gptBox.classList.add('keyboard-visible');
});

input.addEventListener('blur', () => {
    setTimeout(() => {
    // 키보드 이미지 숨기기
    keyboardBottom.style.display = 'none';

    // 기본 contentArea 보이기
    defaultContent.style.display = 'flex';

    // 새 contentArea 숨기기
    newContent.style.display = 'none';

    // gptBox 원위치
    gptBox.classList.remove('keyboard-visible');
  }, 200); // 약간의 딜레이로 깜빡임 방지
});
