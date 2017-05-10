// Fill undefined Blockly.Msg messages with messages from the default language
FioiBlockly.fillLanguage = function() {
  for(var msgName in FioiBlockly.Msg[FioiBlockly.defaultLang]) {
    if(typeof Blockly.Msg[msgName] == 'undefined') {
      Blockly.Msg[msgName] = FioiBlockly.Msg[FioiBlockly.defaultLang][msgName];
    }
  }
}
FioiBlockly.fillLanguage();
