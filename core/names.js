// Allow some special characters
Blockly.Names.prototype.safeName_ = function(name) {
  if (!name) {
    return 'unnamed';
  } else {
    var newname = '';
    for(var i=0; i<name.length; i++) {
      if(i == 0 && '0123456789'.indexOf(name[i]) != -1) {
      // Most languages don't allow names with leading numbers.
        newname = 'my_';
      }
      if(name[i] == ' ')  {
        newname += '_';
      } else if('àâçéèêëïîôùü'.indexOf(name[i]) != -1) {
        newname += name[i];
      } else {
        newname += encodeURI(name[i]).replace(/[^\w]/g, '_');
      }
    }
    return newname;
  }
};
