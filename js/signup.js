// 예시로 로컬 스토리지를 사용하여 로그인 상태 관리
const telInput = document.getElementsByClassName('.tel-group');

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    window.history.back();
  }
}
// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  const agreeChk = document.getElementById('agreeChk');
  agreeChk.checked = true;
  isAgreeChecked = agreeChk.checked;
  // console.log('isAgreeChecked', isAgreeChecked);

  // 체크박스 상태 변경 시 변수 업데이트
  agreeChk.addEventListener('change', () => {
    isAgreeChecked = agreeChk.checked;
  });
  checkLoginStatus();
});

// 구매회원, 판매회원 판별하여 로그인 항목 변경
let currentLoginType = 'BUYER';
function openTab(tabName) {
  const addBusiness = document.getElementById('add-Business');
  const addStoreName = document.getElementById('add-storeName');
  const tabLeft = document.querySelector('.tabLeft');
  const tabRight = document.querySelector('.tabRight');
  const wrapForm = document.getElementsByClassName('wrap-form');

  if (tabName === 'buyer') {
    currentLoginType = 'BUYER';
    addBusiness.style.display = 'none';
    addStoreName.style.display = 'none';
    tabLeft.classList.add('active');
    tabRight.classList.remove('active');
    wrapForm[0].style.height = '586px';
  } else if (tabName === 'seller') {
    currentLoginType = 'SELLER';
    addBusiness.style.display = 'block';
    addStoreName.style.display = 'block';
    tabRight.classList.add('active');
    tabLeft.classList.remove('active');
    wrapForm[0].style.height = '820px';
  }
  const $tabLeft = document.querySelector('.tabLeft');
  const $tabRight = document.querySelector('.tabRight');
  // const $sellerId = document.getElementById('sellerId');

  // 탭선택에 따른 칼라변경
  if (tabName === 'buyer') {
    $tabLeft.classList.add('active');
    $tabRight.classList.remove('active');
  } else if (tabName === 'seller') {
    $tabRight.classList.add('active');
    $tabLeft.classList.remove('active');
  }
}
openTab('buyer');

// 아이디 중복확인 버튼 클릭 시
document.getElementById('duplicateChkButton').addEventListener('click', async function () {
  // 폼 데이터를 가져옴
  const username = document.getElementById('userId').value;

  // 요청을 보낼 URL
  const url = 'https://openmarket.weniv.co.kr/accounts/signup/valid/username/';

  // 요청할 데이터
  const data = {
    username: username,
  };

  try {
    // 비동기 요청 보내기
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // 응답을 JSON으로 변환
    const result = await response.json();

    // 메시지 요소에 결과 표시
    const messageElement = document.getElementById('idChkMessage');
    if (result.Success) {
      messageElement.textContent = result.Success;
      messageElement.style.color = '#21bf48ff';
    } else if (result.FAIL_Message) {
      messageElement.textContent = result.FAIL_Message;
      messageElement.style.color = '#eb5757ff';
    }
  } catch (error) {
    // 에러가 발생할 경우
    console.error('Error:', error);
  }
});

// 비밀번호 유효성 검사
document.addEventListener('DOMContentLoaded', (event) => {
  const password = document.getElementById('userPw');
  const confirmPassword = document.getElementById('userRepw');
  const pwChkMessage = document.getElementById('pwChkMessage');

  // 첫번째 비밀번호 입력시 검사
  function validatePassword() {
    // 비밀번호 유효성 검사: 8자 이상, 영소문자 포함 여부
    const isValidPassword = (pw) => pw.length >= 8 && /[a-z]/.test(pw);

    // 첫 번째 비밀번호 필드가 비어 있는지 확인
    if (password.value === '') {
      confirmPassword.disabled = true;
      confirmPassword.value = ''; // 비번확인 값을 초기화 확인
      pwChkMessage.style.display = 'none';
      return;
    } else {
      confirmPassword.disabled = false; // 첫번째 비번이 있으면 두번째 개시
    }

    // 비밀번호 유효성 검사
    if (!isValidPassword(password.value)) {
      //통과하지 못하면
      password.classList.remove('valid-bg');
      password.classList.add('invalid-bg');
      pwChkMessage.textContent = '비밀번호는 8자 이상이어야 하며 영소문자를 포함해야 합니다.';
      pwChkMessage.style.display = 'block';
    } else {
      // 통과했을때
      password.classList.add('valid-bg');
      password.classList.remove('invalid-bg');
      pwChkMessage.style.display = 'none';
    }
  }
  // 두번재 비밀번호 입력시 검사
  function validateConfirmPassword() {
    // 비밀번호 유효성 검사: 8자 이상, 영소문자 포함 여부
    const isValidPassword = (pw) => pw.length >= 8 && /[a-z]/.test(pw);

    // 두 비밀번호가 일치하는지 검사
    if (password.value !== confirmPassword.value || !isValidPassword(password.value)) {
      pwChkMessage.textContent = '비밀번호가 일치하지 않습니다.';
      pwChkMessage.style.display = 'block';
      confirmPassword.classList.remove('valid-bg');
      confirmPassword.classList.add('invalid-bg');
    } else {
      pwChkMessage.style.display = 'none';
      confirmPassword.classList.add('valid-bg');
      confirmPassword.classList.remove('invalid-bg');
    }
  }

  // input 이벤트 핸들러로 blur이벤트가 생길때까지 에러메시지,배경이미지 정지
  function handlePasswordInput() {
    pwChkMessage.style.display = 'none';
    password.classList.remove('invalid-bg');
  }

  // 페이지가 로드될 때 유효성 검사 초기화
  pwChkMessage.style.display = 'none';
  password.classList.remove('valid-bg', 'invalid-bg');
  confirmPassword.classList.remove('valid-bg', 'invalid-bg');

  // 이벤트 리스너 설정
  password.addEventListener('blur', validatePassword);
  password.addEventListener('input', handlePasswordInput);
  confirmPassword.addEventListener('blur', validateConfirmPassword);
  confirmPassword.addEventListener('input', validateConfirmPassword);
});

// ########################################################

// 로그인 요청
async function login(id, pw, pw2, cellphone, name) {
  try {
    const res = await fetch('https://openmarket.weniv.co.kr/accounts/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: id,
        password: pw,
        password2: pw2,
        phone_number: cellphone,
        name: name,
      }),
      credentials: 'include', // CORS를 지원할 경우 쿠키 포함
    });

    // JSON 파싱 전에 content-type 확인
    if (res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      if (res.ok) {
        // console.log('로그인 성공:', data);

        // 로그인 성공 후 상태 저장 (예시로 로컬 스토리지 사용)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token); // 예시로 토큰 저장

        // 로그인 성공 시 이전 페이지로 이동
        window.history.back();
      } else {
        console.error('로그인 실패:', data);
        document.getElementById('pwChkMessage').textContent = '로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.';

        // 비밀번호 입력창에 포커스하고, 입력값 비움
        const $pwInput = document.getElementById('buyerPw');
        $pwInput.value = '';
        $pwInput.focus();
      }
    } else {
      console.error('서버 응답이 JSON 형식이 아님');
      document.getElementById('pwChkMessage').textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
    }
  } catch (error) {
    console.error('로그인 요청 중 오류 발생:', error);
    document.getElementById('pwChkMessage').textContent = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    console.log(document.getElementById('pwChkMessage'));
  }
}

// ########################################################

// 폼 제출 이벤트 핸들러
const $loginForm = document.getElementById('loginForm');
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
});
