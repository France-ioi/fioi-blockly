FioiBlockly = {};
FioiBlockly.Msg = {};
FioiBlockly.OriginalBlocks = {};

FioiBlockly.defaultLang = 'fr';

// Import messages for a language
FioiBlockly.loadLanguage = function(lang) {
  if(!FioiBlockly.Msg[lang]) {
    console.error("Language '+lang+' doesn't exist in fioi-blockly!");
    return;
  }

  for(var msgName in FioiBlockly.Msg[lang]) {
    Blockly.Msg[msgName] = FioiBlockly.Msg[lang][msgName];
  }
};

// Get back original Blockly blocks
FioiBlockly.reimportOriginalBlocks = function(blockNames) {
  for(var blockName in FioiBlockly.OriginalBlocks) {
    if(!blockNames || blockNames.indexOf(blockName) != -1) {
      Blockly.Blocks[blockName] = FioiBlockly.OriginalBlocks[blockName];
    }
  }
};
