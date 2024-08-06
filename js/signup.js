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

function openTab(tabName) {
  const addBusiness = document.getElementById('add-Business');
  const addStoreName = document.getElementById('add-storeName');
  const tabLeft = document.querySelector('.tabLeft');
  const tabRight = document.querySelector('.tabRight');
  const wrapForm = document.getElementsByClassName('wrap-form');

  if (tabName === 'buyer') {
    addBusiness.style.display = 'none';
    addStoreName.style.display = 'none';
    tabLeft.classList.add('active');
    tabRight.classList.remove('active');
    wrapForm[0].style.height = '586px';
  } else if (tabName === 'seller') {
    addBusiness.style.display = 'block';
    addStoreName.style.display = 'block';
    tabRight.classList.add('active');
    tabLeft.classList.remove('active');
    wrapForm[0].style.height = '820px';
  }
}
openTab('buyer');
