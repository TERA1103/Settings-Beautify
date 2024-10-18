import { sortJsonc } from 'sort-jsonc';
import commands from './commands';
import { readTextEditor } from './settingsJson';

const getFunc = (command: string) => {
  switch (command) {
    case commands[0]:
      return beautify;
    default:
      throw new Error('Invalid command');
  }
};

const beautify = () => {
  const source = readTextEditor();
  if (source === undefined) {
    return;
  }
  const target = sortJsonc(source);
  console.log(target);
};

export { beautify, getFunc };
