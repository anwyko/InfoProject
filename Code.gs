var url ="https://docs.google.com/spreadsheets/d/1MHSmqBP1UujdSghSKNV1SSHqAdkDhanzRBO84zsn5Ac/edit#gid=0";
var Route = {};
Route.path = function(route, callback) {
  Route[route] = callback;
}

function doGet(e) {
  Route.path("index", loadIndex);
  Route.path("estimator", loadEstimator);
  Route.path("checkout", loadCheckOut);
  Route.path("about", loadAbout);

  if (Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  } else {
    return render("testmenu");
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function render(page, data) {
  var tmp = HtmlService.createTemplateFromFile(page);
  if(data) {
    var keys = Object.keys(data);
    keys.forEach(function(key) {
      tmp[key] = data[key];
    });
  }
  
  //return tmp.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return tmp.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function loadOptions() {
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("DATA");
  var lr = ws.getLastRow()-1;
  var list2 = ws.getRange(2,1,lr,1).getValues();
  return list2;
}

function loadIndex() {
  return render("index");
}

function loadEstimator() {
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("DATA");
  var lr = ws.getLastRow()-1;
  var oplist = ws.getRange(2,1,lr,1).getValues();
  return render("estimator", {options: oplist, last: lr});
}

function loadCheckOut() {
  return render("checkout");
}

function loadAbout() {
  return render("about");
}
