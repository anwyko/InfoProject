function doGet(){

  var tmp = HtmlService.createTemplateFromFile("index");
  return tmp.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  console.log("test");

}
