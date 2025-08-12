document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.gptInput');
    const keyboardIcon = document.querySelector('.keyboard-icon');
    const foodBtn = document.querySelector('.foodBtn');
    const selectBtn = document.querySelector('.selectBtn');
    const gptBox = document.getElementById('gptBox');
    
    // 초기 숨김 상태
    keyboardIcon.style.display = 'none';
    foodBtn.style.display = 'none';

    input.addEventListener('input', () => {
        if (input.value.trim() !== "") {
            keyboardIcon.style.display = 'block';
            foodBtn.style.display = 'flex'; // 보여주기
            selectBtn.classList.add('hidden');
            gptBox.classList.add('up');
        } else {
            keyboardIcon.style.display = 'none';
            foodBtn.style.display = 'none'; // 숨기기
            selectBtn.classList.remove('hidden');
            gptBox.classList.remove('up');
        }
    });
});
