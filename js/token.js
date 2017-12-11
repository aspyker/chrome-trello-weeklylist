window.onload = function () {
    var parts = window.location.href.split("#token=");
    console.log("the token is " + parts[1]);
    window.localStorage.setItem("trellotoken", parts[1]);
}
