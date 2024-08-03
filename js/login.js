const $tabLeft = document.querySelector('.tabLeft');
const $tabRight = document.querySelector('.tabRight');

$tabLeft.addEventListener('click', () => {
  $tabLeft.classList.add('active');
  $tabRight.classList.remove('active');
});
$tabRight.addEventListener('click', () => {
  $tabRight.classList.add('active');
  $tabLeft.classList.remove('active');
});
console.log('login.js');
