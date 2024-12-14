// Telegram �α��� �ݹ�
function onTelegramAuth(user) {

    const userData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        auth_date: user.auth_date,
        hash: user.hash,
    };

    // Unity�� �α��� ��� ����
    if (window.parent.unityInstance) {
        window.parent.unityInstance.SendMessage('WebGLBridge', 'OnTelegramLogin', JSON.stringify(userData));
    }
}

// Google �α��� �ݹ�
function onGoogleSignIn(response) {
    console.log("Google Sign-In Response:", response.credential);

    // JWT ���ڵ�
    const user = parseJwt(response.credential);

    console.log("Google User Info:", user);

    // Unity�� �α��� ��� ����
    if (window.parent.unityInstance) {
        window.parent.unityInstance.SendMessage('WebGLBridge', 'OnGoogleLogin', JSON.stringify(user));
    }
}

// JWT ���ڵ� �Լ�
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload);
}

// �ʱ�ȭ
document.addEventListener("DOMContentLoaded", () => {
    console.log("Login page loaded.");
});
