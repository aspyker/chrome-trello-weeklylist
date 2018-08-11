const apikey = "bd688ee47090e2429b7b70720ba5551b";
const apiapp = "ChromeTrelloWeeklyList"

window.onload = function () {
  console.log("loading popup.js")
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
  console.log("showing login.html");
  chrome.windows.create({
    url: "https://trello.com/1/authorize?" +
    "response_type=token" +
    "&key=" + apikey +
    "&response_type=token" +
//    "&return_url=" + encodeURI(returnUrl) +
    "&scope=read,write,account&expiration=never" +
    "&name=" + apiapp,
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
    key: apikey
  },
  function (res) {
    console.log("got boards = " + res);
    getBoard(res[3].id); // TODO: Get the name and index of board from user configuration
  },
  function(res) {
    console.log("Failed to load boards" + res);
  });
}

function getBoard(id) {
  Trello.get("/boards/" + id + "/lists", {
    key: apikey
  },
  function (res) {
    console.log("got board = " + res);
      getListCards(res[1].id); // TODO: Get the name and list of the list from user configuration
  },
  function(res) {
    console.log("Failed to load board" + res);
  });
}

function getListCards(id) {
  Trello.get("/lists/" + id + "/cards", {
    key: apikey
  },
  function (res) {
    console.log("got list cards = " + res);
    // $.map(res, function(item) { return item.name; }).join();
    var names = $.map(res, function(item) {
      return item.name;
    }).join();
    console.log("names = " + names);
    updateWeeklyList(res);
  },
  function (res) {
    console.log("Failed to load list cards" + res);
  });
}

function updateWeeklyList(cards) {
  chrome.browserAction.setBadgeText({text: cards.length.toString()});
  // clear the existing list
  $('#weeklyItems .list-group li').remove();

  $.each(cards, function(index, card) {
    $('#weeklyItems .list-group').append('<li class="list-group-item">'+card.name+'</li>');
  });
}