var url ="https://docs.google.com/spreadsheets/d/1MHSmqBP1UujdSghSKNV1SSHqAdkDhanzRBO84zsn5Ac/edit#gid=0";
var Route = {};
Route.path = function(route, callback) {
  Route[route] = callback;
}

function doGet(e) {
  Route.path("index", loadIndex);
  Route.path("calculator", loadCalculator);
  Route.path("checkout", loadCheckOut);
  Route.path("about", loadAbout);

  if (Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  } else {
    return render("testmenu");
  }
}

function render(page, data) {
  var tmp = HtmlService.createTemplateFromFile(page);
  if(data) {
    var keys = Object.keys(data);
    keys.forEach(function(key) {
      tmp[key] = data[key];
    });
  }
  return tmp.evaluate();
}

function loadIndex() {
  return render("index");
}

function loadCalculator() {
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("DATA");
  var lr = ws.getLastRow()-1;
  var list = ws.getRange(2,1,lr,1).getValues();
  return render("calculator", {options: list, last: lr});
}

function loadCheckOut() {
  return render("checkout");
}

function loadAbout() {
  return render("about");
}
