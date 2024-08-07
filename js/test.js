
// ########################################################
//사업자등록번호 유효성 검사
/* document.addEventListener('DOMContentLoaded', (event) => {
  const businessNumber = document.getElementById('businessNumber');
  const businessNumberChk = document.getElementById('businessNumberChk');

  function validateBusinessNumber() {
    // 사업자등록번호 유효성 검사: 10자리 숫자
    const isValidBusinessNumber = (bn) => bn.length === 10 && /^\d{10}$/.test(bn);

    // 사업자등록번호 유효성 검사
    if (isValidBusinessNumber(businessNumber.value)) {
      businessNumber.classList.add('valid-bg');
      businessNumber.classList.remove('invalid-bg');
      businessNumberChk.style.display = 'none';
    } else {
      businessNumber.classList.remove('valid-bg');
      businessNumber.classList.add('invalid-bg');
      businessNumberChk.style.display = 'block';
    }
  }

  // input 이벤트 핸들러로 blur이벤트가 생길때까지 에러메시지,배경이미지 정지
  function handleBusinessNumInput() {
    businessNumberChk.style.display = 'none';
    businessNumber.classList.remove('invalid-bg');
  }

  // 페이지가 로드될 때 유효성 검사 초기화
  businessNumberChk.style.display = 'none';
  businessNumber.classList.remove('valid-bg', 'invalid-bg');

  // 이벤트 리스너 설정
  businessNumber.addEventListener('blur', validateBusinessNumber);
  businessNumber.addEventListener('input', handleBusinessNumInput);
}); */

// ########################################################