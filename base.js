FioiBlockly = {};
FioiBlockly.Msg = {};
FioiBlockly.OriginalBlocks = {};

FioiBlockly.defaultLang = 'fr';

FioiBlockly.langErrorDisplayed = {};

FioiBlockly.maxListSize = 100;

// Import messages for a language
FioiBlockly.loadLanguage = function(lang) {
  if(!FioiBlockly.Msg[lang] && !FioiBlockly.langErrorDisplayed[lang]) {
    console.error("Language "+lang+" doesn't exist in fioi-blockly!");
    FioiBlockly.langErrorDisplayed[lang] = true; // Avoid spamming console
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
