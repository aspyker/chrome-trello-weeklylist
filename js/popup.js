window.onload = function () {
  authenticate();

  if (isLoggedIn()) {
    $("#loggedIn").show();
    $("#loggedOut").hide();
      populateWeeklyList();
  }
  else {
    $("#loggedIn").hide();
    $("#loggedOut").show();
  }
};

function authenticate() {
  if (isLoggedIn()) {
    console.log("logged in");
    console.log("token = " + isLoggedIn());
    return;
  }

  var returnUrl = chrome.extension.getURL("token.html");
  chrome.windows.create({
    url: "https://trello.com/1/authorize?" +
    "response_type=token" +
    "&key=41257716bae3f0f35422a228fbd18c97" +
    "&response_type=token" +
    "&return_url=" + encodeURI(returnUrl) +
    "&scope=read,write,account&expiration=never" +
    "&name=Chromello",
    width: 520,
    height: 620,
    type: "panel",
    focused: true
  });
}

function isLoggedIn(callback) {
  return window.localStorage.getItem("trellotoken");
}

function populateWeeklyList() {
  Trello.setToken(window.localStorage.getItem("trellotoken"));
  Trello.get("/members/me/boards/", {
    key: "41257716bae3f0f35422a228fbd18c97"
  },
  function (res) {
    console.log("got boards = " + res);
    getBoard(res[3].id); // TODO: Get this from user configuration
  },
  function(res) {
    console.log("Failed to load boards" + res);
  });
}

function getBoard(id) {
  Trello.get("/boards/" + id + "/lists", {
    key: "41257716bae3f0f35422a228fbd18c97"
  },
  function (res) {
    console.log("got board = " + res);
      getListCards(res[3].id); // TODO: Get this from user configuration
  },
  function(res) {
    console.log("Failed to load board" + res);
  });
}

function getListCards(id) {
  Trello.get("/lists/" + id + "/cards", {
    key: "41257716bae3f0f35422a228fbd18c97"
  },
  function (res) {
    console.log("got list cards = " + res);
    // $.map(res, function(item) { return item.name; }).join();
    var names = $.map(res, function(item) {
      return item.name;
    }).join();
    console.log("names = " + names);
  },
  function (res) {
    console.log("Failed to load list cards" + res);
  });
}