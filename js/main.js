console.log('main.js');

document.addEventListener('DOMContentLoaded', () => {
  // 페이지 로드 시 로그인 상태 확인
  checkLoginStatus();
});
function checkLoginStatus() {
  // 예시로 로컬 스토리지를 사용하여 로그인 상태 관리
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    updateNavToLoggedInState();
  }
}

function updateNavToLoggedInState() {
  const $navList = document.getElementById('navList');
  if ($navList) {
    $navList.textContent = '마이페이지';
    $navList.href = '/mypage';
    $navList.id = 'mypageLink';
  }
}
