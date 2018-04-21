const Renderer = require('./Renderer');

const renderer = new Renderer();

const term = renderer.terminal;
const render = renderer.render;




process.on('SIGINT', renderer.processExit);
process.on('exit', renderer.processExit);

const printWith = f => text => render(() => f(text));

const printError = (error, indent = 0) => {
  const message = error.stack ? (
    error.stack.toString()
      .split('    ')
      .map(x => x.trim())
      .join(`\n    ${indent}`)
  ) : error;
  printWith(term.red)(`${indent}  ${message}\n`)
}

const identity = x => x;

const OK = '✓';
const KO = '✕';

let indentLevel = 0;

/* ************************************************************************** */
/* test() */
/* ************************************************************************** */

const createTest = ({ describe }) => async (text, fn = identity) => {
  let status = '';
  let testError;
  const indent = '  '.repeat(indentLevel);

  // renderer.unfreeze();
  renderer.flush();
  render(() => {
    let print = term.bold;
    if (status === OK && !describe) {
      print = print.green;
    } else if (status === KO) {
      print = print.red;
    }
    print(`${indent}${text} ${describe ? '' : status}\n`)
  })


  indentLevel++;
  renderer.freeze();
  try {
    await (typeof fn === 'function' ? fn() : fn);
  } catch (e) {
    process.exitCode = 1;
    testError = e
  }
  renderer.unfreeze();
  renderer.flush();

  if (testError) {
    status = KO;
  } else {
    status = OK;
  }
  if (testError && !testError.printed) {
    testError.printed = true;
    printError(testError, indent)
  }
  indentLevel--;
  if (testError && indentLevel) {
    throw testError;
  }
}

/* ************************************************************************** */
module.exports = {
  test: createTest({ describe: false }),
  describe: createTest({ describe: true }),
}
