document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('#bottomTab a');

  // 현재 경로 예: '/home.html', '/profile.html' 등
    const currentPath = window.location.pathname;

    tabs.forEach(tab => {
        const href = tab.getAttribute('href');

        // 단순 비교 (실제 경로에 맞게 조절 필요)
        if (href === currentPath) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }

        // 클릭 시 활성 탭 변경 (SPA가 아니면 필요 없을 수도)
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});
