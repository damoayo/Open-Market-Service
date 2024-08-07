

// 로그인 상태일 때 네비게이션 업데이트
function updateNavLogin() {
  const loginLink = document.getElementById('loginBtn');
  const cartLink = document.getElementById('cartBtn');

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
    loginLink.href = './mypage.html';
    loginLink.innerHTML = '<img src="./assets/icon-user.svg" alt="마이페이지" /> 마이페이지';

    iconStyle(loginLink);
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