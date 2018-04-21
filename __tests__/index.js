const term = require('terminal-kit').terminal

const originalConsole = global.console;

// const consoleLog = console.log.bind(console);

describe('async-describe', () => {
  beforeAll(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
    }
  });
  afterAll(() => {
    global.console = originalConsole;
  })

  test('demo', async () => {
    await require('../demo');
    expect(console.log.mock.calls).toMatchSnapshot();
    expect(console.error.mock.calls).toMatchSnapshot();
    expect(term.getActions()).toMatchSnapshot();
    term.resetActions();
  });
});
