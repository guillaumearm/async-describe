const stdMocks = require('std-mocks');
const term = require( 'terminal-kit' ).terminal ;

const identity = x => x;

const OK = '✓';
const KO = '✕';

let error;
let errorPrinted = false;
let describeLevel = 0;

/* ************************************************************************** */
/* describe() */
/* ************************************************************************** */
const describe = async (text, fn = identity) => {
  if (error) return;
  term.bold(`${'  '.repeat(describeLevel)}${text}\n`);
  describeLevel++;
  try {
    await fn();
  } catch (e) {
    if (!errorPrinted) {
      error = e;
      term.red(`${e.stack}\n`)
    }
  }
  describeLevel--;
};

/* ************************************************************************** */
/* test() */
/* ************************************************************************** */
let testRunning = false;
const test = async (text, fn = identity) => {
  if (error) return;
  if (testRunning) {
    throw new Error('tests cannot be nested')
  }
  term(`${'  '.repeat(describeLevel)} ${text}`);
  testRunning = true;
  stdMocks.use();
  try {
    await fn();
  } catch (e) {
    error = e
  }
  stdMocks.restore();
  testRunning = false
  if (error) term.red(` ${KO}`)
  else term.green(` ${OK}`);
  term('\n')
  const output = stdMocks.flush()
  output.stderr.forEach(x => term.red(x))
  output.stdout.forEach(x => term.yellow(x))
  if (error && !errorPrinted) {
    term.red(`${error.stack}\n`)
    errorPrinted = true;
    throw error;
  }
}

/* ************************************************************************** */
module.exports = { describe, test }
