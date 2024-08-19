/* ################### 제품 상세 요청  ##################### */

// 상품 상세 정보 요청
async function productDetail(product_id) {
  try {
    const res = await fetch(
      `https://openmarket.weniv.co.kr/products/${product_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // CORS를 지원할 경우 쿠키 포함
      }
    );

    if (res.headers.get("content-type")?.includes("application/json")) {
      const data = await res.json();
      if (res.ok) {
        console.log("상품 정보 가져오기 성공:", data);
        return data; // 상품 정보를 반환
      } else {
        console.error("상품 정보 가져오기 실패:", data);
        return null;
      }
    } else {
      console.error("서버 응답이 JSON 형식이 아님");
      return null;
    }
  } catch (error) {
    console.error("상품 정보 요청 중 오류 발생:", error);
    return null;
  }
}

// 상품 데이터를 페이지에 반영하는 함수
function loadProduct(product) {
  document.getElementById("store-name").innerText = product.store_name;
  document.getElementById("product-name").innerText = product.product_name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("price").innerText = product.price.toLocaleString(); // 숫자를 통화 형식으로 변환 toLocaleString()사용
  document.getElementById("stock").innerText = product.stock;
  document.getElementById("sumPrice").innerText = (
    product.price * 1
  ).toLocaleString(); // 초기 합계 설정
  const total = document.getElementById("total");

  const quantityInput = document.getElementById("quantity");
  const totalPriceElement = document.getElementById("sumPrice");
  const cartDropdown = document.getElementById("cartDropdown");
  const cartLogoutBtn = document.getElementById("cartLogoutBtn");

  // 수량 조절 버튼 이벤트 핸들러 설정
  const decreaseQtyBtn = document.getElementById("minus");
  const increaseQtyBtn = document.getElementById("plus");

  let currentQuantity = 1;
  total.innerText = currentQuantity;
  updateTotalPrice(product.price, 1);

  decreaseQtyBtn.addEventListener("click", function () {
    if (currentQuantity > 1) {
      currentQuantity--;
      quantityInput.innerText = currentQuantity;
      total.innerText = currentQuantity;
      updateTotalPrice(product.price, currentQuantity);
      increaseQtyBtn.disabled = false; // 감소 시 증가 버튼 활성화
    }
  });

  increaseQtyBtn.addEventListener("click", function () {
    if (currentQuantity < product.stock) {
      currentQuantity++;
      quantityInput.innerText = currentQuantity;
      total.innerText = currentQuantity;
      updateTotalPrice(product.price, currentQuantity);

      if (currentQuantity === product.stock) {
        increaseQtyBtn.disabled = true; // 재고에 도달하면 버튼 비활성화
      }
    }
  });

  // 총 가격 업데이트 함수
  function updateTotalPrice(price, quantity) {
    const totalPrice = price * quantity;

    totalPriceElement.innerText = totalPrice.toLocaleString();
  }

  // "바로 구매" 버튼
  document.getElementById("buy-now").addEventListener("click", function () {
    // 결제 페이지로 이동
    window.location.href = "/checkout";
  });

  // "장바구니" 버튼
  const addToCartButton = document.getElementById("add-to-cart");
  addToCartButton.addEventListener("click", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!(isLoggedIn === "true")) {
      window.location.href = "/login";
    } else {
      addToCart(currentQuantity);
      cartDropdown.style.display = "block"; // 드롭다운 표시
    }
  });

  cartLogoutBtn.addEventListener("click", function () {
    cartDropdown.style.display = "none";
  });

  // 장바구니에 추가 함수 (중복 방지)
  function addToCart(quantity) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // 이미 장바구니에 있는지 확인
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === product.product_id
    );

    if (existingItemIndex > -1) {
      // 이미 장바구니에 있는 경우 수량만 업데이트
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // 장바구니에 없는 경우 새 항목 추가
      cartItems.push({ productId: product.product_id, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}
const urlParams = new URLSearchParams(window.location.search);
const product_id = urlParams.get("product_id");

if (product_id) {
  productDetail(product_id).then((product) => {
    if (product) {
      loadProduct(product);
    } else {
      console.error("상품 정보를 불러오지 못했습니다.");
    }
  });
} else {
  console.error("product_id가 URL에 존재하지 않습니다.");
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
      loginDropdown.src = "../assets/my_page_on.png";
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });
    window.addEventListener("click", (event) => {
      if (!event.target.closest("#loginBtn")) {
        if (dropdownMenu.style.display === "block") {
          dropdownMenu.style.display = "none";
          loginDropdown.src = "../assets/my_page_on.png";
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
    loginDropdown.src = "../assets/my_page.png";
    sellerButtonWrap.src = "../assets/MS_icon_button.png";

    navChange();
  } else if (isLoggedIn === "true" && loginType === "BUYER") {
    sellerButton.style.display = "none";
    cartButtonLi.src = "../assets/shopping_cart.png";
    loginDropdown.src = "../assets/my_page.png";

    navChange();
  } else {
    console.log("로그아웃 상태");
    sellerButtonWrap.style.display = "none";
    cartButtonLi.src = "../assets/shopping_cart.png";
    loginDropdown.src = "../assets/my_page_off.png";
  }
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
});
