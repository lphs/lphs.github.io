function doGet(e) {
  const spreadsheetId = '1eLOxQelerrYAJctwBTf6_-EsvH11xvsl4F_Q8tlRVP4';
  const met = e.parameter.met;
  if(met == 0){ // GET Visits
    try {
      const count = Sheets.Spreadsheets.Values.get(spreadsheetId, 'Stats!B1').values;
      if (!count){
        return ContentService.createTextOutput("ERROR");
      }
      var range = SpreadsheetApp.openById(spreadsheetId).getRange("Stats!B1");
      range.setValue(Number(count[0][0])+1);
      SpreadsheetApp.flush();
      return ContentService.createTextOutput(Number(count[0][0])+1);
    } catch (err) {
      console.log(err.message);
    }
  }else if(met == 1){ // GET Devices
    try {
      const max = Sheets.Spreadsheets.Values.get(spreadsheetId, "Stats!C3").values;
      if (!max) {
        return ContentService.createTextOutput("ERROR");
      }
      try {
        var ss = SpreadsheetApp.openById(spreadsheetId);
        var sheet = ss.getSheetByName('Stats');
        var range = sheet.getRange(4, 1, Number(max[0][0])+2, 2);
        const device_uids = range.getValues();
        const uid = e.parameter.uid;
        var date = new Date();
        var updated = false;
        for(var i = 0; i < device_uids.length-1; i++){
          if(device_uids[i][0] != undefined){
            if(device_uids[i][0] == uid){
              device_uids[i][1] = Utilities.formatDate(date, "Pacific/Auckland", "M/d/YYYY HH:mm:ss");
              updated = true;
            }
          }
        }
        if(!updated){
          device_uids[device_uids.length-1][0] = uid;
          device_uids[device_uids.length-1][1] = Utilities.formatDate(date, "Pacific/Auckland", "M/d/YYYY HH:mm:ss");
        }
        range.setValues(device_uids);
        SpreadsheetApp.flush();
        const devices = Sheets.Spreadsheets.Values.get(spreadsheetId, "Stats!B2").values;
        if (!devices) {
          return ContentService.createTextOutput("ERROR");
        }
        return ContentService.createTextOutput(devices);
      } catch (err) {
        console.log('Failed with error %s', err.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  return ContentService.createTextOutput("ERROR");
}
