function checkLoginStatus() {
  // 예시로 로컬 스토리지를 사용하여 로그인 상태 관리
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn === 'true') {
    window.history.back();
  }
}
// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});



// 구매회원, 판매회원 판별
let currentLoginType = 'BUYER';
function openTab(tabName) {
  if (tabName === 'buyer') {
    currentLoginType = 'BUYER';
    document.getElementById('buyerId').placeholder = '구매회원 아이디';
  } else if (tabName === 'seller') {
    currentLoginType = 'SELLER';
    document.getElementById('buyerId').placeholder = '판매회원 아이디';
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

// 로그인 요청
async function login(id, pw, login_type) {
  try {
    const res = await fetch('https://openmarket.weniv.co.kr/accounts/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: id,
        password: pw,
        login_type: login_type,
      }),
      credentials: 'include', // CORS를 지원할 경우 쿠키 포함
    });

    // JSON 파싱 전에 content-type 확인
    if (res.headers.get('content-type')?.includes('application/json')) {
      const data = await res.json();
      if (res.ok) {
        // console.log('로그인 성공:', data);

        // 로그인 성공 후 상태 저장
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', data.token); 

        // 로그인 성공 시 이전 페이지로 이동
        window.history.back();
      } else {
        console.error('로그인 실패:', data);
        document.getElementById('errMessage').textContent = '로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.';

        // 비밀번호 입력창에 포커스하고, 입력값 비움
        const $pwInput = document.getElementById('buyerPw');
        $pwInput.value = '';
        $pwInput.focus();
      }
    } else {
      console.error('서버 응답이 JSON 형식이 아님');
      document.getElementById('errMessage').textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
    }
  } catch (error) {
    console.error('로그인 요청 중 오류 발생:', error);
    document.getElementById('errMessage').textContent = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    console.log(document.getElementById('errMessage'));
  }
}

// 폼 제출 이벤트 핸들러
const $loginForm = document.getElementById('loginForm');
$loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); // 폼 기본 제출기능 제한

  const errMessageElement = document.getElementById('errMessage');
  const errMessage = errMessageElement.textContent.trim();

  // 에러 메시지가 있으면 폼 제출 중단
  if (errMessage !== '') {
    console.error('로그인 요청이 중단되었습니다: 에러 메시지가 존재합니다.');
    errMessageElement.textContent = '로그인 요청이 중단되었습니다: 에러 메시지가 존재합니다.';
    return;
  }

  // 사용자 입력 값 가져오기
  const $idInput = document.getElementById('buyerId').value;
  const $pwInput = document.getElementById('buyerPw').value;

  // 입력 값 검증
  if (!$idInput || !$pwInput) {
    console.error('로그인 정보가 없습니다.');
    return;
  }

  const id = $idInput.trim(); // $idInput.value.trim()로 하면 안됌.
  const pw = $pwInput.trim();

  // 입력 값 검증
  if (!id) {
    $idInput.focus();
    errMessageElement.textContent = '이 필드는 필수 항목입니다.';
    return;
  }

  if (!pw) {
    $pwInput.focus();
    errMessageElement.textContent = '이 필드는 필수 항목입니다.';
    return;
  }
  // 로그인 함수 호출
  const login_type = currentLoginType;
  login(id, pw, login_type);
});
