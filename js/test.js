// 로그인 상태를 확인하는 변수
const isLoggedIn = localStorage.getItem('isLoggedIn');

// 페이지 로드 시 로그인 상태 확인
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    updateNavLogin();
  } else {
    updateNavLogout();
  }
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});

// 로그인 상태일 때 네비게이션 업데이트
function updateNavLogin() {
  const loginLink = document.getElementById('loginBtn');
  const cartLink = document.getElementById('cartBtn');
  const loginBtn = document.getElementById('loginBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginImg = loginBtn.querySelector('img');

  loginBtn.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    changeColor();
    // 드롭다운 박스의 표시 상태를 토글
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  // 이미지 클릭 시 부모 앵커 요소의 클릭 이벤트 트리거
  loginImg.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    loginBtn.click();
  });

  // 두 아이콘 공통 스타일 적용
  function iconStyle(element) {
    const img = element.getElementsByTagName('img')[0];
    if (img) {
      img.style.paddingLeft = '12px';
      img.style.width = '32px';
      img.style.height = '32px';
    }
    if (element === cartLink) {
      img.style.paddingLeft = '3px';
    }
    // "마이페이지" 텍스트
    element.style.fontSize = '12px';
    element.style.fontWeight = '400';
    element.style.width = '56px';
    element.style.height = '14px';
  }

  // 마이페이지 아이콘
  if (loginLink) {
    // a 요소의 href와 내용 변경
    loginLink.href = '#';

    loginLink.innerHTML = '<img src="./assets/icon-user.svg" alt="마이페이지" /> 마이페이지';

    iconStyle(loginLink);

    // 클릭 시 아이콘과 텍스트 색상 변경 이벤트 리스너 추가
    loginLink.addEventListener('click', changeColor);
  }

  // 장바구니 아이콘
  if (cartLink) {
    cartLink.href = './cart.html';
    cartLink.innerHTML = '<img src="./assets/icon-shopping-cart.svg" alt="장바구니" /> 장바구니';

    iconStyle(cartLink);
  }
}

// 로그아웃 상태일때 네비게이션 업데이트
function updateNavLogout() {
  const loginLink = document.getElementById('loginBtn');
  const cartLink = document.getElementById('cartBtn');
  const loginBtn = document.getElementById('loginBtn');
  // 두 아이콘 공통 스타일 적용
  function iconStyle(element) {
    const img = element.getElementsByTagName('img')[0];
    if (img) {
      // img.style.paddingLeft = '2px';
      img.style.width = '32px';
      img.style.height = '32px';
    }
    if (element === cartLink) {
      img.style.paddingLeft = '5px';
    }
    // "마이페이지" 텍스트
    element.style.fontSize = '12px';
    element.style.fontWeight = '400';
    element.style.width = '56px';
    element.style.height = '14px';
  }

  loginBtn.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    // 로그인 페이지로 리디렉션
    window.location.href = 'login.html';
  });

  // 마이페이지 아이콘
  if (loginLink) {
    // a 요소의 href와 내용 변경
    loginLink.href = './login.html';
    loginLink.innerHTML = '<img src="./assets/icon-user.svg" alt="로그인" /> 로그인';

    iconStyle(loginLink);
  }

  // 장바구니 아이콘
  if (cartLink) {
    cartLink.href = './cart.html';
    cartLink.innerHTML = '<img src="./assets/icon-shopping-cart.svg" alt="장바구니" /> 장바구니';

    iconStyle(cartLink);
  }
}

// 로그인 상태에서 마이페이지 아이콘 클릭 시 색상 변경 함수
function changeColor() {
  const loginLink = document.getElementById('loginBtn');
  const img = loginLink.getElementsByTagName('img')[0];
  if (img) {
    img.src = './assets/icon-user-2.svg';
  }
  loginLink.style.color = 'rgba(33, 191, 72, 1)';
}

function reChangeColor() {
  const loginLink = document.getElementById('loginBtn');
  const img = loginLink.getElementsByTagName('img')[0];
  if (img) {
    img.src = './assets/icon-user.svg';
  }
  loginLink.style.color = 'rgba(118, 118, 118, 1)';
}

const loginBtn = document.getElementById('loginBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const loginImg = loginBtn.querySelector('img');
const logoutBtn = document.getElementById('logoutBtn');

loginBtn.addEventListener('click', (e) => {
  e.preventDefault(); // 기본 링크 동작을 막음
  changeColor();
  // 드롭다운 박스의 표시 상태를 토글
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

loginImg.addEventListener('click', (event) => {
  event.preventDefault(); // 기본 링크 동작을 막음
  loginBtn.click();
});

// 외부 클릭 시 드롭다운 박스 닫기
window.addEventListener('click', (event) => {
  if (!event.target.closest('#loginBtn')) {
    reChangeColor();
    if (dropdownMenu.style.display === 'block') {
      dropdownMenu.style.display = 'none';
    }
  }
});

// 드롭다운 박스 클릭 시 이벤트 버블링 방지
dropdownMenu.addEventListener('click', (event) => {
  event.stopPropagation();
});

// 로그아웃 버튼 클릭 시 로그아웃 처리
logoutBtn.addEventListener('click', () => {
  // 스토리지에서 토큰과 isLoggedIn 제거
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  // 로그인 페이지로 리디렉션 (예: login.html)
  window.location.href = 'index.html';
});
