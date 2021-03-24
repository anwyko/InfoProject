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
  Route.path("template", loadTemplate);

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
  var oplist = ws.getRange(2,1,lr,2).getValues();
  var lr2 = 0;
  for (let i=0; oplist[i][1] != '-' ; i++) {
      lr2++;
  }
  Logger.log(lr2);
  return render("estimator", {options: oplist, last: lr, last2: lr2});
}

function loadCheckOut() {
  return render("checkout");
}

function loadAbout() {
  return render("about");
}

function loadTemplate() {
  return render("template");
}

function calculate(request){
 
  var list3;
  var index;
  var index2 = [];
  var value = {};
  var position, position2;
  var maxbprice=0, bprice=0, bbprice=0, sprice=0, cdifference=0;
  var s=0, b=0, h=0, t=0, fc=0, bc=0, cp=0;
  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("DATA");
  var lr = ws.getLastRow()-1;

  index = ws.getRange(2,1,lr,1).getValues();
  list3 = ws.getRange(2,1,lr,15).getValues();

  for(var i=0;i<index.length;i++){
    index2[i] = index[i][0];
  } 

  position = index2.indexOf(request.cd);
  position2 = index2.indexOf(request.dd);
  maxbprice = list3[position][1];
  
  if(position2!=(-1)){sprice = list3[position2][2];}
  else {sprice="-"} 

  if(request.s == "Yes - major issues"){s = list3[position][3];} else if (request.s == "Yes - minor issues"){s = list3[position][3] * 0.5;}
  if(request.b == "Yes - major issues"){b = list3[position][4];} else if (request.b == "Yes - minor issues"){b = list3[position][4] * 0.5;}
  if(request.h == "Not Mint - major wear"){h = list3[position][5];} else if (request.h == "Not Mint - minor wear"){h = list3[position][5] * 0.5;}
  if(request.t == "Yes - major issues"){t = list3[position][6];} else if (request.t == "Yes - minor issues"){t = list3[position][6] * 0.5;}
  if(request.fc == "Yes - major issues"){fc = list3[position][8];} else if (request.fc == "Yes - minor issues"){fc = list3[position][8] * 0.5;}
  if(request.bc == "Yes - major issues"){bc = list3[position][9];} else if (request.bc == "Yes - minor issues"){bc = list3[position][9] * 0.5;}
  if(request.cp == "Yes - major issues"){cp = list3[position][10];} else if (request.cp == "Yes - minor issues"){cp = list3[position][10] * 0.5;}

  if(maxbprice=="-" ||s=="-" ||b=="-" ||h=="-" ||t=="-" ||fc=="-" ||bc=="-" ||cp=="-") 
  {bprice = "No Purchase";}
  else {bprice = "$" + (maxbprice-s-b-h-t-fc-bc-cp).toFixed(2); bbprice = (maxbprice-s-b-h-t-fc-bc-cp);}

  if(bbprice < 100){bprice="No Purchase";bbprice="No Purchase";} 

  if(sprice!="-" && bprice!="No Purchase") {cdifference = "$" + (sprice-bbprice).toFixed(2);} 
  else {cdifference = "No Trade";} 

  value.bp = bprice;
  value.td = cdifference;

  return value;
  
} 
