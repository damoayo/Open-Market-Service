function openTab(tabName) {
  console.log(tabName);
  // const addBusiness = document.getElementById('add-Business');
  // const addStoreName = document.getElementById('add-storeName');
  const tabLeft = document.querySelector('.tabLeft');
  const tabRight = document.querySelector('.tabRight');
  const sellerId = document.getElementById('sellerId');

  if (tabName === 'buyer') {
    tabLeft.classList.add('active');
    tabRight.classList.remove('active');
    sellerId.placeholder = '구매회원 ID';
  } else if (tabName === 'seller') {
    tabRight.classList.add('active');
    tabLeft.classList.remove('active');
    sellerId.placeholder = '판매회원 ID';
  }
}
openTab('buyer');
