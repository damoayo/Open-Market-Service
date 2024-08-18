/* 
URL 파라미터로 주문형식을 분기처리
1. 장바구니에서 단일 주문하기          cart_one_order : urlParams.size === 3
2. 장바구니에서 전체 주문하기          cart_order : urlParams.size === 0
3. 상세페이지에서 주문하기             direct_order : urlParams.size === 2
*/

/* ################ 단일 카트 주문   ################ */

function checkCartOneOrder() {
  const urlParams = new URLSearchParams(window.location.search);
  const product_id = urlParams.get("id");
  const quantity = urlParams.get("quantity");
  const totalPrice = urlParams.get("totalPrice");

  fetchProductDetails(product_id).then((product) => {
    if (product) {
      displayCartOneOrder(product, quantity, totalPrice);
    } else {
      console.error("상품 정보를 가져오는 데 실패했습니다.");
    }
  });
}

function displayCartOneOrder(product, quantity, totalPrice) {
  const cartList = document.getElementById("cartList");
  const itemElement = document.createElement("div");
  itemElement.innerHTML = `
    <div class="cart-item">
      <div class="cartFront">
        <img src="${product.image}" alt="단독! 개발자 무료 담요" />
        <div class="cartItemInfo">
          <p class="cart-item-store">${product.store_name}</p>
          <p class="cart-item-title">${product.product_name}</p>
          <p class="cart-item-quantity">수량 : ${quantity}개</p>
        </div>
      </div>
      <div class="cartWrapRight">
        <div class="freeDelivery"><p>무료배송</p></div>
        <div class="quantity-selector">
          <button class="minus">-</button>
          <span class="quantity">${quantity}</span>
          <button class="plus">+</button>
        </div>
        <div class="buyButtons">
          <p class="sum-price">${totalPrice.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  `;

  // 장바구니 목록에 상품 추가
  cartList.appendChild(itemElement);

  // 총 금액을 표시할 요소
  const totalProductAmountElement =
    document.getElementById("totalProductAmount");

  // 총 상품 금액 및 결제 예정 금액을 계산하여 업데이트
  totalProductAmountElement.innerText = `${totalPrice.toLocaleString()}원`;

  // 각 상품의 합계 금액을 업데이트하는 함수
  function updateTotalPrice(price, quantity, element) {
    const totalPrice = price * quantity;
    element.innerText = `${totalPrice.toLocaleString()}원`;
  }
  orderDetail(product.product_id, quantity, totalPrice);
}

/* ################ 카트 전체 주문  ################ */

async function checkCartOrder() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      document.getElementById("productMessage").textContent =
        "로그인이 필요합니다!";
      window.location.href = "login.html";
      return;
    }

    const res = await fetch("https://openmarket.weniv.co.kr/cart/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("네트워크 응답이 올바르지 않습니다.");
    }

    const data = await res.json();
    handleCartData(data);
  } catch (error) {
    console.error("제품 목록 요청 중 오류 발생:", error);
    document.getElementById("productMessage").textContent =
      "제품 목록 요청 중 오류가 발생했습니다. 다시 시도해주세요.";
  }
}

function displayEmptyCartMessage() {
  const productMessage = document.getElementById("productMessage");
  productMessage.innerHTML = "";
  const emptyCartMessage = document.createElement("div");
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
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsQuan = cartItems.length;
  const cartData = data.results || [];

  //

  if (!(cartData.length === 0 && cartItemsQuan === 0)) {
    displayCartItems(cartItems, cartData);
  } else {
    displayEmptyCartMessage();
  }
}

async function fetchProductDetails(product_id) {
  try {
    const res = await fetch(
      `https://openmarket.weniv.co.kr/products/${product_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("상품 정보를 가져오는 데 실패했습니다.");
      // return null;
    }
  } catch (error) {
    console.error("상품 정보 요청 중 오류 발생:", error);
    // return null;
  }
}

// 카트와 서버의 데이터를 합치고, 상품 정보를 가져와 화면에 표시
async function displayCartItems(cartItems, cartData) {
  const items = [...cartItems, ...cartData];

  // 제품 ID를 기준으로 중복 확인 및 수량 합산
  const uniqueItems = {};
  items.forEach((item) => {
    if (uniqueItems[item.productId]) {
      uniqueItems[item.productId].quantity += item.quantity; // 중복 시 수량 합산
    } else {
      uniqueItems[item.productId] = { ...item }; // 새로운 항목으로 추가
    }
  });
  // 중복 제거된 아이템 목록
  const filteredItems = Object.values(uniqueItems);
  const productMessage = document.getElementById("productMessage");
  productMessage.innerHTML = "";
  // 상품 ID만 추출
  const filteredArr = filteredItems.map((item) => item.productId);
  // undefined 또는 null 값 제거
  let filteredIds = filteredArr.filter((product) => product !== undefined);

  // 중복 제거된 아이템을 기반으로 상품 정보를 Promise로 가져옴
  const productDetailsPromises = filteredIds.map((item) =>
    fetchProductDetails(item)
  );
  // 비동기작업을 병렬로 실행하여 모두완료가 된후에 배열로 반환
  let productDetails = await Promise.all(productDetailsPromises); // Promise.all()은 모든 Promise가 완료될 때까지 기다림
  const cartList = document.getElementById("cartList");
  let totalProductAmount = 0;

  // 총 금액을 표시할 요소
  const totalProductAmountElement =
    document.getElementById("totalProductAmount");
  const finalAmountElement = document.getElementById("finalAmount");

  // 상품 정보와 장바구니 정보를 합쳐서 화면에 표시
  productDetails.forEach((product, index) => {
    if (product) {
      const item = filteredItems[index];
      const itemElement = document.createElement("div");
      const localPrice = product.price.toLocaleString();
      const totalPrice = item.quantity * product.price;
      const checkboxId = `check${index}`; // 고유한 체크박스 ID 생성
      // 초기 총 상품 금액 계산
      totalProductAmount += totalPrice;
      itemElement.innerHTML = `
      <div class="cart-item">
        <div class="cartFront">
          <img src="${product.image}" alt="단독! 개발자 무료 담요" />
          <div class="cartItemInfo">
            <p class="cart-item-store">${product.store_name}</p>
            <p class="cart-item-title">${product.product_name}</p>
            <p class="cart-item-quantity">수량 : ${item.quantity}개</p>
            
          </div>
        </div>
        <div class="cartWrapRight">
          <div class="freeDelivery"><p>무료배송</p></div>
          <div class="quantity-selector">
            <button class="minus">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="plus">+</button>
          </div>
          <div class="buyButtons">
            <p class="sum-price">${totalPrice.toLocaleString()}원</p>
          </div>
        </div>
      </div>
    `;

      // 장바구니 목록에 상품 추가
      cartList.appendChild(itemElement);

      // 각 상품의 합계 금액을 업데이트하는 함수
      function updateTotalPrice(price, quantity, element) {
        const totalPrice = price * quantity;
        element.innerText = `${totalPrice.toLocaleString()}원`;
      }

      // 장바구니 총 금액을 업데이트하는 함수
      function updateCartTotals() {
        totalProductAmount = 0;

        // 모든 cart-item 요소를 순회하면서 각 항목의 가격을 합산
        document.querySelectorAll(".sum-price").forEach((sumPriceElement) => {
          const itemTotal = parseInt(
            sumPriceElement.innerText.replace(/,/g, "").replace("원", "")
          ); // 문자열을 숫자로 변환
          totalProductAmount += itemTotal;
        });

        // 총 상품 금액 및 결제 예정 금액을 계산하여 업데이트
        totalProductAmountElement.innerText = `${totalProductAmount.toLocaleString()}원`;
        // finalAmountElement.innerText = `${totalProductAmount.toLocaleString()}원`; // 여기서는 할인이나 배송비가 없다고 가정
      }

      orderDetail(product.product_id, item.quantity, totalPrice);
    }
    // 페이지 로드 시 초기 총 금액 설정
    updateCartTotals();
  });
}

/* ######################################  주문 요청 */
async function order(
  id,
  quantity,
  $reciever,
  recieverPhone,
  shippingAdress,
  shippingMessage,
  totalPrice
) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("https://openmarket.weniv.co.kr/order/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        product_id: id,
        quantity: quantity,
        order_kind: "cart_order",
        reciever: $reciever,
        reciever_phone_number: recieverPhone,
        address: shippingAdress,
        address_message: shippingMessage,
        payment_method: "card",
        total_price: totalPrice,
      }),
      credentials: "include", // CORS를 지원할 경우 쿠키 포함
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      // 주문성공시 메시지
      alert("주문이 완료되었습니다.");
    } else {
      localStorage.removeItem("cartItems");
      location.reload(); // 페이지 리로드
      // console.error('로그인 실패:', data);
      document.getElementById("orderFailed").textContent =
        "주문에 실패했습니다. 입력사항을 다시 확인해 주세요.";
    }
  } catch (error) {
    console.error("주문요청 중 오류 발생:", error);
    document.getElementById("orderFailed").textContent =
      "주문요청 중 오류가 발생했습니다. 다시 시도해주세요.";
  }
}

/* ######################################  주문정보 입력부분 */
function orderDetail(id, quantity, totalPrice) {
  // console.log(id, quantity);
  const orderForm = document.getElementById("orderForm");
  const paymentButton = document.querySelector(".payment-button");
  const agreeTerms = document.getElementById("agreeTerms");
  const phoneInputs = document.querySelectorAll(
    "#ordererPhone1, #ordererPhone2, #ordererPhone3, #recipientPhone1, #recipientPhone2, #recipientPhone3"
  );
  const emailInput = document.getElementById("ordererEmail");
  const emailValidate = document.getElementById("emailValidate");
  const postalLookupButton = document.getElementById("postalLookup");
  const zipcodeInput = document.getElementById("zipcode");
  const shippingAddressInput = document.getElementById("shippingAddress");

  // phone input 필드에 숫자만 입력할 수 있도록 제한
  phoneInputs.forEach((input) => {
    input.addEventListener("input", function () {
      input.value = input.value.replace(/[^0-9]/g, ""); // 숫자가 아닌 문자는 제거
    });
  });

  // 이메일 형식 검사
  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // 폼의 모든 필드와 라디오 버튼을 확인하는 함수
  function checkFormCompletion() {
    const requiredInputs = orderForm.querySelectorAll("input[required]");
    const selectedPaymentMethod = orderForm.querySelector(
      "input[name='payment_method']:checked"
    );
    const emailValid = isValidEmail(emailInput.value.trim());

    let allFieldsFilled = true;
    requiredInputs.forEach((input) => {
      if (!input.value) {
        allFieldsFilled = false;
      }
    });

    // 체크박스가 선택되었는지 확인
    if (
      allFieldsFilled &&
      selectedPaymentMethod &&
      agreeTerms.checked &&
      emailValid
    ) {
      paymentButton.disabled = false;
      paymentButton.classList.add("enabled");
      paymentButton.classList.remove("disabled");
    } else {
      paymentButton.disabled = true;
      paymentButton.classList.add("disabled");
      paymentButton.classList.remove("enabled");
    }
  }
  // 입력 필드, 라디오 버튼, 체크박스에 이벤트 리스너 추가
  const allInputs = orderForm.querySelectorAll("input");
  allInputs.forEach((input) => {
    input.addEventListener("input", checkFormCompletion);
  });

  const paymentMethods = orderForm.querySelectorAll(
    "input[name='payment_method']"
  );

  paymentMethods.forEach((radio) => {
    radio.addEventListener("change", checkFormCompletion);
  });
  agreeTerms.addEventListener("change", checkFormCompletion);

  // 이메일 입력 필드에서 포커스 잃을 때 검사
  emailInput.addEventListener("blur", function () {
    if (!isValidEmail(emailInput.value.trim())) {
      emailValidate.innerText = "이메일 형식이 올바르지 않습니다.";
      emailInput.focus();
    } else {
      emailValidate.innerText = "";
    }
  });

  // 우편번호 조회 버튼 클릭 시 우편번호 찾기 팝업
  postalLookupButton.addEventListener("click", function () {
    new daum.Postcode({
      oncomplete: function (data) {
        zipcodeInput.value = data.zonecode; // 우편번호 입력
        shippingAddressInput.value = data.address; // 주소 입력
        document.getElementById("detailedAddress").focus(); // 상세주소 입력으로 포커스 이동
      },
    }).open();
  });

  const $reciever = document.getElementById("recipientName").value;
  const recipientPhoneInputs = document.querySelectorAll(
    "#recipientPhone1, #recipientPhone2, #recipientPhone3"
  );
  const recieverPhone =
    recipientPhoneInputs[0].value +
    recipientPhoneInputs[1].value +
    recipientPhoneInputs[2].value;
  const shippingAddress = document.getElementById("shippingAddress").value;
  const detailedAddress = document.getElementById("detailedAddress").value;
  const shippingAdress = shippingAddress + " " + detailedAddress;
  const shippingMessage = document.getElementById("shippingMessage").value;

  let payment_method = "";

  document
    .getElementById("orderButton")
    .addEventListener("click", function (event) {
      event.preventDefault(); // 폼 기본 제출 기능 제한

      // 주문 함수 호출
      order(
        id,
        quantity,
        $reciever,
        recieverPhone,
        shippingAdress,
        shippingMessage,
        totalPrice
      );
    });
}

/* ##############  icon 함수  ############### */

/* // 로그인-클릭 icon 함수
function changeColor(element) {
  const text = document.getElementById(element.id);
  // const cartLink = document.getElementById('cartBtn');
  const img = text.getElementsByTagName("img")[0];
  // const cartImg = cartLink.getElementsByTagName('img')[0];

  // "로그인-클릭" icon
  if (element.id === "loginBtn") {
    img.src = "./assets/icon-user-2.svg";
    img.style.paddingLeft = "12px";
  } else {
    img.src = "./assets/icon-shopping-cart-2.svg";
    img.style.paddingLeft = "3px";
  }
  img.style.width = "32px";
  img.style.height = "32px";

  // "로그인-클릭" 텍스트
  text.style.color = "rgba(33, 191, 72, 1)";
  text.style.fontSize = "12px";
  text.style.fontWeight = "400";
  text.style.width = "56px";
  text.style.height = "14px";
}
// 로그인 icon 함수
function reChangeColor(element) {
  const text = document.getElementById(element.id);
  const img = text.getElementsByTagName("img")[0];
  // console.log(img);
  if (element.id === "loginBtn") {
    img.src = "./assets/icon-user.svg";
    img.style.paddingLeft = "12px";
  } else {
    img.src = "./assets/icon-shopping-cart.svg";
    img.style.paddingLeft = "3px";
  }

  img.style.width = "32px";
  img.style.height = "32px";

  text.style.color = "rgba(118, 118, 118, 1)";
  text.style.fontSize = "12px";
  text.style.fontWeight = "400";
  text.style.width = "56px";
  text.style.height = "14px";
}
// 로그아웃 icon 함수
function logoutIconColor(element) {
  const text = document.getElementById(element.id);
  const img = text.getElementsByTagName("img")[0];
  // console.log(img);
  if (element.id === "loginBtn") {
    img.src = "./assets/icon-user.svg";
    img.style.paddingLeft = "2px";
  } else {
    img.src = "./assets/icon-shopping-cart.svg";
    img.style.paddingLeft = "3px";
  }

  img.style.width = "32px";
  img.style.height = "32px";

  text.style.color = "rgba(118, 118, 118, 1)";
  text.style.fontSize = "12px";
  text.style.fontWeight = "400";
  text.style.width = "56px";
  text.style.height = "14px";
}

// 로그인 상태일 때 네비게이션 업데이트
function updateNavLogin() {
  const loginLink = document.getElementById("loginBtn");
  const cartLink = document.getElementById("cartBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginImg = loginLink.querySelector("img");

  // 로그인 버튼을 마이페이지로 변경
  loginLink.innerHTML =
    '<img src="./assets/icon-user.svg" alt="마이페이지" /> 마이페이지';
  reChangeColor(loginLink);
  reChangeColor(cartLink);
  // 변경된 버튼의 style과 기본작동
  loginLink.addEventListener("click", (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    changeColor(loginLink);
    // changeColor(cartLink);
    // 드롭다운 박스의 표시 상태를 토글
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  // 이미지 클릭 시에도 버튼과 같은효과
  loginImg.addEventListener("click", (event) => {
    event.preventDefault(); // 기본 링크 동작을 막음
    loginLink.click();
  });

  // 외부 클릭 시 드롭다운 박스 닫기
  window.addEventListener("click", (event) => {
    if (!event.target.closest("#loginBtn")) {
      reChangeColor(loginLink);
      reChangeColor(cartLink);
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      }
    }
  });

  // 드롭다운 박스 클릭 시 이벤트 버블링 방지
  // 내부 클릭 시에도 드롭다운 박스가 닫히지 않도록 정상동작 보장
  dropdownMenu.addEventListener("click", (event) => {
    event.stopPropagation(); // 클릭 이벤트가 window로 전파중지 이벤트
  });

  // 로그아웃 버튼 클릭 시 로그아웃 처리
  logoutBtn.addEventListener("click", () => {
    // 스토리지에서 토큰과 isLoggedIn 제거
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    // 로그인 페이지로 리디렉션 (예: login.html)
    window.location.href = "index.html";
  });
} */

// 주문 분기처리 함수
function orderBranchProcessing() {
  // URL 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);

  // case문으로 분기처리
  switch (urlParams.size) {
    case 3:
      // 장바구니에서 단일 주문하기
      console.log("장바구니에서 단일 주문하기");
      checkCartOneOrder();
      break;
    case 0:
      // 장바구니에서 전체 주문하기
      console.log("장바구니에서 전체 주문하기");
      checkCartOrder();
      break;
    case 2:
      // 상세페이지에서 주문하기
      checkDirectOrder();
      break;
    default:
      // URL 파라미터가 없는 경우
      console.log("잘못된 접근입니다.");
      break;
  }
}

// 로그인 상태 확인 및 네비게이션 업데이트
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loginType = localStorage.getItem("loginType"); // 사용자 타입 확인

  const cartButton = document.getElementById("cartButton");
  const sellerButton = document.getElementById("sellerButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const loginDropdown = document.querySelector("#loginDropdown img");
  const sellerButtonWrap = document.querySelector("#sellerButtonWrap img");
  const cartButtonLi = document.querySelector("#cartButton img");

  // 로그아웃 버튼
  function navChange() {
    loginDropdown.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 동작을 막음
      // loginDropdown.src = "../assets/my-page-on.png";
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest("#loginBtn")) {
        if (dropdownMenu.style.display === "block") {
          dropdownMenu.style.display = "none";
          loginDropdown.src = "../assets/my-page-on.png";
        }
      }
    });
    // 드롭다운 박스 클릭 시 이벤트 버블링 방지
    // 내부 클릭 시에도 드롭다운 박스가 닫히지 않도록 정상동작 보장
    dropdownMenu.addEventListener("click", (event) => {
      event.stopPropagation(); // 클릭 이벤트가 window로 전파중지 이벤트
    });

    // 로그아웃 버튼 클릭 시 로그아웃 처리
    logoutBtn.addEventListener("click", () => {
      // 스토리지에서 토큰과 isLoggedIn 제거
      sellerButton.style.display = "none";
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loginType");
      localStorage.removeItem("cartItems");
      // 로그인 페이지로 리디렉션 (예: login.html)
      window.location.href = "index.html";
    });
  }

  // 로그인 상태에 따라 네비게이션 업데이트
  if (isLoggedIn === "true" && loginType === "SELLER") {
    cartButton.style.display = "none"; // 장바구니 버튼 숨기기
    loginDropdown.src = "../assets/my-page.png";
    sellerButtonWrap.src = "../assets/MS-icon-button.png";

    navChange();
  } else if (isLoggedIn === "true" && loginType === "BUYER") {
    sellerButton.style.display = "none";
    cartButtonLi.src = "../assets/shopping-cart-on.png";
    loginDropdown.src = "../assets/my-page.png";
    navChange();
    orderBranchProcessing(); //주문 분기처리 함수
  } else {
    sellerButtonWrap.style.display = "none";
    cartButtonLi.src = "../assets/shopping-cart.png";
    loginDropdown.src = "../assets/my-page-off.png";
    window.location.href = "login.html";
    return;
  }
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
});
