/* ##############  icon 함수  ############### */

// 로그인-클릭 icon 함수
function changeColor(element) {
  const text = document.getElementById(element.id);
  // const cartLink = document.getElementById('cartBtn');
  const img = text.getElementsByTagName('img')[0];
  // const cartImg = cartLink.getElementsByTagName('img')[0];

  // "로그인-클릭" icon
  if (element.id === 'loginBtn') {
    img.src = './assets/icon-user-2.svg';
    img.style.paddingLeft = '12px';
  } else {
    img.src = './assets/icon-shopping-cart-2.svg';
    img.style.paddingLeft = '3px';
  }
  img.style.width = '32px';
  img.style.height = '32px';

  // "로그인-클릭" 텍스트
  text.style.color = 'rgba(33, 191, 72, 1)';
  text.style.fontSize = '12px';
  text.style.fontWeight = '400';
  text.style.width = '56px';
  text.style.height = '14px';
}
// 로그인 icon 함수
function reChangeColor(element) {
  const text = document.getElementById(element.id);
  const img = text.getElementsByTagName('img')[0];
  // console.log(img);
  if (element.id === 'loginBtn') {
    img.src = './assets/icon-user.svg';
    img.style.paddingLeft = '12px';
  } else {
    img.src = './assets/icon-shopping-cart.svg';
    img.style.paddingLeft = '3px';
  }

  img.style.width = '32px';
  img.style.height = '32px';

  text.style.color = 'rgba(118, 118, 118, 1)';
  text.style.fontSize = '12px';
  text.style.fontWeight = '400';
  text.style.width = '56px';
  text.style.height = '14px';
}
// 로그아웃 icon 함수
function logoutIconColor(element) {
  const text = document.getElementById(element.id);
  const img = text.getElementsByTagName('img')[0];
  // console.log(img);
  if (element.id === 'loginBtn') {
    img.src = './assets/icon-user.svg';
    img.style.paddingLeft = '2px';
  } else {
    img.src = './assets/icon-shopping-cart.svg';
    img.style.paddingLeft = '3px';
  }

  img.style.width = '32px';
  img.style.height = '32px';

  text.style.color = 'rgba(118, 118, 118, 1)';
  text.style.fontSize = '12px';
  text.style.fontWeight = '400';
  text.style.width = '56px';
  text.style.height = '14px';
}

/* ########### Mypage icon 렌더링 ############## */

// 로그인 상태일 때 네비게이션 업데이트
function updateNavLogin() {
  const loginLink = document.getElementById('loginBtn');
  const cartLink = document.getElementById('cartBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginImg = loginLink.querySelector('img');

  // 로그인 버튼을 마이페이지로 변경
  loginLink.innerHTML = '<img src="./assets/icon-user.svg" alt="마이페이지" /> 마이페이지';
  reChangeColor(loginLink);
  reChangeColor(cartLink);
  // 변경된 버튼의 style과 기본작동
  loginLink.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    changeColor(loginLink);
    // changeColor(cartLink);
    // 드롭다운 박스의 표시 상태를 토글
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  // 이미지 클릭 시에도 버튼과 같은효과
  loginImg.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    loginLink.click();
  });

  // 외부 클릭 시 드롭다운 박스 닫기
  window.addEventListener('click', (event) => {
    if (!event.target.closest('#loginBtn')) {
      reChangeColor(loginLink);
      reChangeColor(cartLink);
      if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
      }
    }
  });

  // 드롭다운 박스 클릭 시 이벤트 버블링 방지
  // 내부 클릭 시에도 드롭다운 박스가 닫히지 않도록 정상동작 보장
  dropdownMenu.addEventListener('click', (event) => {
    event.stopPropagation(); // 클릭 이벤트가 window로 전파중지 이벤트
  });

  // 로그아웃 버튼 클릭 시 로그아웃 처리
  logoutBtn.addEventListener('click', () => {
    // 스토리지에서 토큰과 isLoggedIn 제거
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    // 로그인 페이지로 리디렉션 (예: login.html)
    window.location.href = 'index.html';
  });
}
// 로그아웃 상태일 때 네비게이션 업데이트
function updateNavLogout() {
  const loginLink = document.getElementById('loginBtn');
  const cartLink = document.getElementById('cartBtn');

  loginLink.innerHTML = '<img src="./assets/icon-user.svg" alt="로그인" /> 로그인';
  logoutIconColor(loginLink);
  logoutIconColor(cartLink);
  loginLink.addEventListener('click', (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    // 로그인 페이지로 리디렉션
    window.location.href = 'login.html';
  });
}

/* ################ cart 상품목록 가져오기 ################ */

async function fetchCart() {
  try {
    // 로컬 스토리지에서 JWT 토큰을 가져옵니다.
    const token = localStorage.getItem('token');

    // 만약 토큰이 없으면 요청을 보내지 않고 에러를 던집니다.
    if (!token) {
      throw new Error('JWT 토큰이 없습니다. 로그인이 필요합니다.');
    }

    const res = await fetch('https://openmarket.weniv.co.kr/cart/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`, // JWT 토큰을 Authorization 헤더에 추가
      },
      credentials: 'include', // CORS를 지원할 경우 쿠키 포함
    });

    if (!res.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }

    const data = await res.json();
    // 데이터를 가져오는 데 성공! 데이터 처리하는 함수를 호출
    handleCartData(data);
  } catch (error) {
    console.error('제품 목록 요청 중 오류 발생:', error);
    document.getElementById('productMessage').textContent = '제품 목록 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

// 제품이 있고 없고에 따라 분기
function handleCartData(data) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  console.log(cartItems);
  const cartItemsQuan = cartItems.length;
  const cartData = data.results;
  if (data.results.length === 0 && cartItemsQuan === 0) {
    // 장바구니에 상품이 없을 경우
    console.log('장바구니에 상품이 없습니다.');
    displayEmptyCartMessage();
  } else {
    // 장바구니에 상품이 있을 경우
    console.log('장바구니에 상품이 있습니다:', data.results);
    displayCartItems(cartItems, cartData);
  }
}

function displayEmptyCartMessage() {
  document.getElementById('productMessage').innerHTML = `
        <p>장바구니에 상품이 없습니다.</p>
    `;
}

function displayCartItems(cartItems, cartData) {
  const items = [...cartItems,...cartData]
  const productMessage = document.getElementById('productMessage');
  productMessage.innerHTML = ''; // 기존 내용을 비우고 새로 작성

  items.forEach((item) => {
    console.log('장바구니 항목:', item);
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
            <p>상품 ID: ${item.productId}</p>
            <p>수량: ${item.quantity}</p>
            <p>장바구니 항목 ID: ${item.cart_item_id}</p>
            <p>활성화 상태: ${item.is_active ? '활성화됨' : '비활성화됨'}</p>
        `;
    cartContainer.appendChild(itemElement);
  });
}

/* ############################################## */

// 로그인 상태 확인 및 네비게이션 업데이트
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    updateNavLogin();
    fetchCart();
  } else {
    updateNavLogout();
  }
}
// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});
