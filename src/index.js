const stdMocks = require('std-mocks');
const term = require( 'terminal-kit' ).terminal ;

const identity = x => x;

const OK = '✓';
const KO = '✕';

let describeLevel = 0;

/* ************************************************************************** */
/* describe() */
/* ************************************************************************** */
const describe = async (text, fn = identity) => {
  term.bold(`${'  '.repeat(describeLevel)}${text}\n`);
  describeLevel++;
  try {
    await fn();
  } catch (e) {
    process.exitCode = 1;
    term.red(`${e.stack}\n`)
  }
  describeLevel--;
};

/* ************************************************************************** */
/* test() */
/* ************************************************************************** */
let testRunning = false;
const test = async (text, fn = identity) => {
  let testError;
  if (testRunning) {
    throw new Error('tests cannot be nested')
  }
  term(`${'  '.repeat(describeLevel)} ${text}`);
  testRunning = true;
  stdMocks.use();
  try {
    await fn();
  } catch (e) {
    process.exitCode = 1;
    testError = e
  }
  stdMocks.restore();
  testRunning = false
  if (testError) term.red(` ${KO}`)
  else term.green(` ${OK}`);
  term('\n')
  const output = stdMocks.flush()
  output.stderr.forEach(x => term.red(x))
  output.stdout.forEach(x => term.yellow(x))
  if (testError) {
    term.red(`${testError.stack}\n`)
  }
}

/* ************************************************************************** */
module.exports = { describe, test }
