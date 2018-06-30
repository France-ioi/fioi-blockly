# France-IOI Blockly additions

Additions and changes to [Blockly](https://github.com/google/blockly) for France-IOI.

## Requirements

Requires buttonsAndMessages from [bebras-modules](https://github.com/France-ioi/bebras-modules) for variable prompts.

Block `text_eval` requires [acorn](https://github.com/acornjs/acorn) and the associated utility acorn-walk; they're both available in the bebras-modules repository as well.

## Usage

Include the file `dist/fioi-blockly.min.js` after including Blockly javascript files, and before using Blockly.

If you modify the source, launch the command `gulp` to recompile.

## Additions

### Dicts blocks

Blocks to handle dictionnaries.

* Block `dict_get`: set element at index
* Block `dict_get_literal`: set element at index
* Block `dict_keys`: get the list of keys
* Block `dicts_create_with`: create a dictionnary

### Tables blocks

Blocks to handle 2D and 3D tables.

### Inputs blocks

Blocks to handle inputs from stdin.

* Block `input_num`: read an integer
* Block `input_char`: read a single character
* Block `input_word`: read a word (delimited by whitespaces)
* Block `input_line`: read a line

### Other blocks

* Block `lists_append`: append an element to a list
* Block `text_print_noend`: print some text without a newline at the end
* Block `text_eval`: allow user to input an expression to be evaluated, for instance `list[x+2]*5`

## Changes

### Blocks

* Block `logic_compare`: use the standard notations for blocks instead of special characters (for instance, `!=` instead of `≠`)

### Variables

* Allow only names starting with [a-zA-Z\_].
* Default name: "element"

### Generation

* Repeat blocks: start with 0
* Python procedures: stop global variables
