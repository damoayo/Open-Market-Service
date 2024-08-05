function openTab(tabName) {
  const addBusiness = document.getElementById('add-Business');
  const addStoreName = document.getElementById('add-storeName');
  const tabLeft = document.querySelector('.tabLeft');
  const tabRight = document.querySelector('.tabRight');
  const wrapForm = document.getElementsByClassName('wrap-form');

  if (tabName === 'buyer') {
    addBusiness.style.display = 'none';
    addStoreName.style.display = 'none';
    tabLeft.classList.add('active');
    tabRight.classList.remove('active');
    wrapForm[0].style.height = '586px';
  } else if (tabName === 'seller') {
    addBusiness.style.display = 'block';
    addStoreName.style.display = 'block';
    tabRight.classList.add('active');
    tabLeft.classList.remove('active');
    wrapForm[0].style.height = '820px';
  }
}
openTab('buyer');
