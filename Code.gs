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
  return render("calculator");
}

function loadCheckOut() {
  return render("checkout");
}

function loadAbout() {
  return render("about");
}
