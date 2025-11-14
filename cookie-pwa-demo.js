function setCookie(name, value) {
    const date = new Date();
    const days = 7;
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name) {
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookiesArray = decodedCookies.split(';');

    for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function setCookieFromInput(){
    let name = "test-cookie";
    let value = document.getElementById("cookie-demo-input").value;
    setCookie(name, value);
}

function getSavedCookie(){
    let name = "test-cookie";
    let value = getCookie(name);
    document.getElementById("cookie-demo-input").value = value;
}
