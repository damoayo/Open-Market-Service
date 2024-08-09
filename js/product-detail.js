// 로그인 상태 확인 및 네비게이션 업데이트
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

/* ########################################### */
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
// 로그인 상태 icon 함수
function reChangeColor(element) {
  const text = document.getElementById(element.id);
  const img = text.getElementsByTagName('img')[0];
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
  console.log(img);
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

/* ############################################ */

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

/* ############################################ */

// 제품 상세 요청

document.addEventListener('DOMContentLoaded', function () {
  // 상품 상세 정보 요청
  async function productDetail(product_id) {
    try {
      const res = await fetch(`https://openmarket.weniv.co.kr/products/${product_id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // CORS를 지원할 경우 쿠키 포함
      });

      if (res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
          console.log('상품 정보 가져오기 성공:', data);
          return data; // 상품 정보를 반환
        } else {
          console.error('상품 정보 가져오기 실패:', data);
          return null;
        }
      } else {
        console.error('서버 응답이 JSON 형식이 아님');
        return null;
      }
    } catch (error) {
      console.error('상품 정보 요청 중 오류 발생:', error);
      return null;
    }
  }

  // 상품 데이터를 페이지에 반영하는 함수
  function loadProduct(product) {
    console.log(product);
    document.getElementById('store-name').innerText = product.store_name;
    document.getElementById('product-name').innerText = product.product_name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('price').innerText = product.price.toLocaleString(); // 숫자를 통화 형식으로 변환 toLocaleString()사용
    document.getElementById('stock').innerText = product.stock;
    document.getElementById('total-price').innerText = product.price;

    // 이벤트 핸들러 설정
    const decreaseQtyBtn = document.getElementById('decrease-qty');
    const increaseQtyBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity');

    decreaseQtyBtn.addEventListener('click', function () {
      let quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
        updateTotalPrice(product.price, quantity);
      }
    });

    increaseQtyBtn.addEventListener('click', function () {
      let quantity = parseInt(quantityInput.value);
      if (quantity < product.stock) {
        quantity++;
        quantityInput.value = quantity;
        updateTotalPrice(product.price, quantity);
      }
    });
  }

  // 수량 변경 시 총 가격을 업데이트하는 함수
  function updateTotalPrice(price, quantity) {
    document.getElementById('total-price').innerText = price * quantity;
  }

  // 현재 URL에서 쿼리 스트링을 가져옴
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get('product_id');

  if (product_id) {
    productDetail(product_id).then((product) => {
      if (product) {
        loadProduct(product);
      } else {
        console.error('상품 정보를 불러오지 못했습니다.');
      }
    });
  } else {
    console.error('product_id가 URL에 존재하지 않습니다.');
  }
});

// ########################################################

// 폼 제출 이벤트 핸들러
/* const $productsForm = document.getElementById('loginForm');
$loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); // 폼 기본 제출기능 제한

  // 체크박스 체크여부 확인
  const $agree = document.getElementById('agreeChk');
  $agree.checked = true;

  // 사용자 입력 값 가져오기
  const $idInput = document.getElementById('userId').value;
  const $pwInput = document.getElementById('userPw').value;
  const $repwInput = document.getElementById('userRepw').value;
  const $userName = document.getElementById('userName').value;
  const $phonePrefix = document.getElementById('phone-prefix').value;
  const $phone1 = document.getElementById('userTel1').value;
  const $phone2 = document.getElementById('userTel2').value;
  const $cellphone = `${$phonePrefix}${$phone1}${$phone2}`;

  // 입력 값 검증 및 체크박스 확인
  if (!$idInput || !$pwInput || !$repwInput || !$cellphone || !$userName) {
    pwChkMessage.textContent = '모든 항목을 필수로 작성해야 합니다.';
    return;
  } else if (!isAgreeChecked) {
    pwChkMessage.textContent = '약관에 동의해야 가입할 수 있습니다.';
    return;
  }

  // 입력이 모두 있는지 확인
  const id = $idInput.trim(); // $idInput.value.trim()로 하면 안됌.
  const pw = $pwInput.trim();
  const pw2 = $repwInput.trim();
  const cellphone = $cellphone.trim();
  const name = $userName.trim();

  const arr = [id, pw, pw2, cellphone, name];

  arr.forEach((item) => {
    if (!item) {
      errMessageElement.textContent = '모든 항목을 필수로 작성해야 합니다.';
      return;
    }
  });

  // 로그인 타입확인
  const login_type = currentLoginType;

  // 판매회원가입시 추가항목은 기재에서 제외

  if (login_type === 'SELLER') {
    const $businessUserId = document.getElementById('businessUserId');
    const $storName = document.getElementById('storeName');
    $storName.setAttribute('required', 'required');
    $businessUserId.setAttribute('required', 'required');
  }

  login(id, pw, pw2, cellphone, name);
}); */
