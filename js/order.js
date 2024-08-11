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

/* ################ cart 상품목록 가져오기 ################ */

async function fetchCart() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      document.getElementById('productMessage').textContent = '로그인이 필요합니다!';
      window.history.back();
      return; // 함수 실행 중단
    }

    const res = await fetch('https://openmarket.weniv.co.kr/cart/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }

    const data = await res.json();
    handleCartData(data);
  } catch (error) {
    console.error('제품 목록 요청 중 오류 발생:', error);
    document.getElementById('productMessage').textContent = '제품 목록 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

function displayEmptyCartMessage() {
  const productMessage = document.getElementById('productMessage');
  productMessage.innerHTML = '';
  const emptyCartMessage = document.createElement('div');
  emptyCartMessage.innerHTML = `
    <div id="productMessage">
      <p>장바구니에 담긴 상품이 없습니다.</p>
      <a href="./index.html">원하는 상품을 장바구니에 담아보세요!</a>
    </div>
  `;
  cartList.appendChild(emptyCartMessage);
}

// 로컬스토리지와 서버에서 가져온 데이터를 확인
function handleCartData(data) {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartItemsQuan = cartItems.length;
  const cartData = data.results || [];

  if (!(cartData.length === 0 && cartItemsQuan === 0)) {
    displayCartItems(cartItems, cartData);
  } else {
    displayEmptyCartMessage();
    /* document.getElementById('productMessage').innerHTML = `
      <p></p>장바구니에 담긴 상품이 없습니다.</p>
    `; */
  }
}

async function fetchProductDetails(product_id) {
  try {
    const res = await fetch(`https://openmarket.weniv.co.kr/products/${product_id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      if (res.ok) {
        return data;
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

// 카트와 서버의 데이터를 합치고, 상품 정보를 가져와 화면에 표시
async function displayCartItems(cartItems, cartData) {
  const items = [...cartItems, ...cartData];
  const productMessage = document.getElementById('productMessage');
  productMessage.innerHTML = '';

  // 합친 데이터를 기반으로 상품 정보를 Promise로 가져옴
  const productDetailsPromises = items.map((item) => fetchProductDetails(item.productId));

  // 비동기작업을 병렬로 실행하여 모두완료가 된후에 배열로 반환
  const productDetails = await Promise.all(productDetailsPromises); // Promise.all()은 모든 Promise가 완료될 때까지 기다림

  const cartList = document.getElementById('cartList');
  let totalProductAmount = 0;

  // 총 금액을 표시할 요소
  const totalProductAmountElement = document.getElementById('totalProductAmount');
  const finalAmountElement = document.getElementById('finalAmount');

  productDetails.forEach((product, index) => {
    if (product) {
      const item = items[index];
      const itemElement = document.createElement('div');
      const localPrice = product.price.toLocaleString();
      const totalPrice = item.quantity * product.price;
      const checkboxId = `check${index}`; // 고유한 체크박스 ID 생성

      // 초기 총 상품 금액 계산
      totalProductAmount += totalPrice;

      itemElement.innerHTML = `
      <div class="cart-item">
        <div class="cartFront">
          <div class="custom">
            <input type="checkbox" id="${checkboxId}" class="chk">
            <label for="${checkboxId}"><em></em></label>
          </div>
          <img src="${product.image}" alt="단독! 개발자 무료 담요" />
          <div class="cartItemInfo">
            <p class="cart-item-store">${product.store_name}</p>
            <p class="cart-item-title">${product.product_name}</p>
            <p class="cart-item-price">${localPrice}<span>원</span></p>
            <p class="delivery">택배배송 / 무료배송</p>
          </div>
        </div>
        <div class="cartWrapRight">
          <div class="quantity-selector">
            <button class="minus">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="plus">+</button>
          </div>
          <div class="buyButtons">
            <p class="sum-price">${totalPrice.toLocaleString()}원</p>
            <button class="buy-now">주문하기</button>
          </div>
        </div>
      </div>
    `;

      cartList.appendChild(itemElement);

      // 요소 선택
      const checkbox = itemElement.querySelector('.chk');
      const deleteModal = document.getElementById('deleteModal');
      const confirmDeleteBtn = document.getElementById('confirmDelete');
      const cancelDeleteBtn = document.getElementById('cancelDelete');
      const decreaseQtyBtn = itemElement.querySelector('.minus');
      const increaseQtyBtn = itemElement.querySelector('.plus');
      const quantitySpan = itemElement.querySelector('.quantity');
      const sumPriceElement = itemElement.querySelector('.sum-price');

      let currentQuantity = item.quantity;

      // 수량 감소 이벤트
      decreaseQtyBtn.addEventListener('click', function () {
        if (currentQuantity > 1) {
          currentQuantity--;
          quantitySpan.innerText = currentQuantity;
          updateTotalPrice(product.price, currentQuantity, sumPriceElement);
          updateCartTotals();
        }
      });

      // 수량 증가 이벤트
      increaseQtyBtn.addEventListener('click', function () {
        if (currentQuantity < product.stock) {
          currentQuantity++;
          quantitySpan.innerText = currentQuantity;
          updateTotalPrice(product.price, currentQuantity, sumPriceElement);
          updateCartTotals();
        }
      });

      // 체크박스 클릭 시 삭제 모달 띄우기
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          deleteModal.style.display = 'flex';

          confirmDeleteBtn.onclick = function () {
            items.splice(index, 1); // items 배열에서 해당 항목 제거
            localStorage.setItem('cartItems', JSON.stringify(items)); // 로컬 스토리지 업데이트
            cartList.removeChild(itemElement); // DOM에서 요소 제거
            deleteModal.style.display = 'none';
            updateCartTotals(); // 총 금액 업데이트
            if (items.length === 0) {
              displayEmptyCartMessage();
            }
          };

          cancelDeleteBtn.onclick = function () {
            deleteModal.style.display = 'none';
            checkbox.checked = false;
          };
        }
      });

      // 각 상품의 합계 금액을 업데이트하는 함수
      function updateTotalPrice(price, quantity, element) {
        const totalPrice = price * quantity;
        element.innerText = `${totalPrice.toLocaleString()}원`;
      }

      // 장바구니 총 금액을 업데이트하는 함수
      function updateCartTotals() {
        totalProductAmount = 0;

        // 모든 cart-item 요소를 순회하면서 각 항목의 가격을 합산
        document.querySelectorAll('.sum-price').forEach((sumPriceElement) => {
          const itemTotal = parseInt(sumPriceElement.innerText.replace(/,/g, '').replace('원', '')); // 문자열을 숫자로 변환
          totalProductAmount += itemTotal;
        });

        // 총 상품 금액 및 결제 예정 금액을 계산하여 업데이트
        totalProductAmountElement.innerText = `${totalProductAmount.toLocaleString()}원`;
        finalAmountElement.innerText = `${totalProductAmount.toLocaleString()}원`; // 여기서는 할인이나 배송비가 없다고 가정
      }
    }
    // 페이지 로드 시 초기 총 금액 설정
    updateCartTotals();
  });
}

// 로그인 상태 확인 및 네비게이션 업데이트
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    updateNavLogin();
    fetchCart();
  } else {
    window.location.href = 'login.html';
    return;
  }
}
// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});
