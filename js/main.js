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

/* ##############  icon 함수  ############### */

// 로그인-클릭 icon 함수
function changeColor(element) {
  const text = document.getElementById(element.id);
  const img = text.getElementsByTagName('img')[0];

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

/* ################ 상품목록 ################ */

// 상품목록 가져오기
async function productsList() {
  try {
    const res = await fetch('https://openmarket.weniv.co.kr/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // CORS를 지원할 경우 쿠키 포함
    });

    // JSON 파싱 전에 content-type 확인
    if (res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      if (res.ok) {
        // 성공적으로 제품 목록을 받아온 경우
        // console.log('제품 목록:', data);

        // 제품 목록을 화면에 표시 (예시)
        displayProducts(data.results);
        console.log(data.results);
      } else {
        // 요청 실패 시
        console.error('제품 목록 요청 실패:', data);
        document.getElementById('productMessage').textContent =
          '제품 목록을 불러오는데 실패했습니다. 다시 시도해주세요.';
      }
    } else {
      console.error('서버 응답이 JSON 형식이 아님');
      document.getElementById('productMessage').textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
    }
  } catch (error) {
    console.error('제품 목록 요청 중 오류 발생:', error);
    document.getElementById('productMessage').textContent = '제품 목록 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

// 상품 목록을 화면에 렌더링
function displayProducts(products) {
  const productList = document.getElementById('productList');
  productList.innerHTML = ''; // 기존 목록 초기화

  if (products.length === 0) {
    productList.textContent = '등록된 제품이 없습니다.';
  } else {
    let article = document.createElement('article');
    article.className = 'article';

    products.forEach((product, index) => {
      const container = document.createElement('div');
      container.className = 'container';
      container.style.cursor = 'pointer'; // 커서 모양 변경
      container.onclick = () => {
        // 제품 상세 페이지로 이동, product_id를 쿼리 파라미터로 전달
        window.location.href = `product-detail.html?product_id=${product.product_id}`;
      };

      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.product_name;

      const productMeta = document.createElement('div');
      productMeta.className = 'product-meta';

      const productStore = document.createElement('p');
      productStore.className = 'product-store';
      productStore.textContent = product.store_name;

      const productName = document.createElement('h3');
      productName.className = 'product-name';
      productName.textContent = product.product_name;

      const productPrice = document.createElement('p');
      productPrice.className = 'product-price';
      productPrice.innerHTML = `${product.price.toLocaleString()}<span class="currency">원</span>`;
      // 가격의 ,쉼표를 위해 toLocaleString() 사용

      productMeta.appendChild(productStore);
      productMeta.appendChild(productName);
      productMeta.appendChild(productPrice);

      container.appendChild(image);
      container.appendChild(productMeta);

      article.appendChild(container);

      // 3개의 container를 article에 추가하고 article을 productList에 추가
      if ((index + 1) % 3 === 0 || index === products.length - 1) {
        productList.appendChild(article);
        article = document.createElement('article');
        article.className = 'article';
      }
    });
  }
}

// 페이지가 로드시 제품 목록 요청
document.addEventListener('DOMContentLoaded', productsList);
