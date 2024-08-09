<div class="product-container">
  <img id="product-image" src="" alt="상품 이미지" />
  <div class="wrap">
    <div class="product-meta">
      <p id="store-name">상점 이름</p>
      <h1 id="product-name">상품 이름</h1>
      <div class="priceWon">
        <p id="product-price">
          <span id="price"></span>
          <span id="currency">원</span>
        </p>
      </div>
      <p id="deliver">택배배송 / 무료배송</p>
    </div>
    <div class="quantity-selector">
      <button id="decrease-qty">
        <span id="minus">-</span>
      </button>
      <input type="text" id="quantity" value="1" />
      <button id="plus">+</button>
    </div>
    <div class="price">
      <span id="sumMoney">총 상품 금액</span>
      <span>
        총수량
        <input type="text" id="quantity" value="1" readonly />개
      </span>
      <p id="sum-price">
        <span id="sumPrice"></span>
        <span id="currency">원</span>
      </p>
    </div>
    <div class="buyButtons">
      <button id="buy-now">바로 구매</button>
      <button id="add-to-cart">장바구니</button>
    </div>
  </div>
</div>;
