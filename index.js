window.addEventListener("load", function () {

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-workers/CacheServiceWorker.js").then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
        }).catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
    }

    //< WebApp Expand
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    //< Disable Vertical Swipes
    //Telegram.WebApp.disableVerticalSwipes();

    //< Version Check
    //var version = Telegram.WebApp.version;
    //var versionFloat = parseFloat(version);
});

var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var warningBanner = document.querySelector("#unity-warning");


if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
}

var config = {
    arguments: [],
    dataUrl: "Build/834caf12ce0701b7b887e0f57f48fa20.data",
    frameworkUrl: "Build/c995577daacc0e5de1ccd9bacd055f54.framework.js",
    codeUrl: "Build/9921fe74ef6f2db985b863cca195e440.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "solzam",
    productName: "PuzzleCoin",
    productVersion: "1.0",
    showBanner: unityShowBanner,
    // matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
};

canvas.style.background = "url('Build/Build.jpg') center / cover";
loadingBar.style.display = "block";

console.log("Unity createUnityInstance!");
window.unityInstance = createUnityInstance(canvas, config, (progress) => {

    progressBarFull.style.width = 100 * progress + "%";

}).then((unityInstance) => {

    console.log("Unity createUnityInstance Complete");
    window.unityInstance = unityInstance;
    loadingBar.style.display = "none";

}).catch((message) => {

    alert(message);

});

// Unity�� �� �ε� �Ϸ� �� ȣ���� �Լ�
function OnUnityWebGLBridgeStart() {
    // Telegram ������ ���� ����
    if (isTelegramWebView()) {
        SendToUnity_TelegramUserData(Telegram.WebApp.initDataUnsafe.user);
    } else {
        SendToUnity_TelegramUserData(null);
    }
}

// functions ---------------------------------------------------------------------------------------------------------------------------------------
//
// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

// Resize canvas to fit the browser window
function resizeCanvas() {
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    container.style.width = window.innerWidth + "px";
    container.style.height = window.innerHeight + "px";
}
// Apply initial resize and attach the resize event listener
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function isTelegramWebView() {
    return Telegram.WebApp.initDataUnsafe.user != null;
}

function AppQuit() {
    Telegram.WebApp.close();
}

function SendToUnity_TelegramUserData(telegramUserData) {

    var telegramUserDataJson = null;
    if (telegramUserData != null) {
        telegramUserDataJson = JSON.stringify(telegramUserData);
    } else {
        telegramUserDataJson = "";
    }
    
    window.unityInstance.SendMessage('WebGLBridge', 'ReceiveTelegramUserData', telegramUserDataJson);
}
//
// functions ---------------------------------------------------------------------------------------------------------------------------------------

console.log("Welcome!");
