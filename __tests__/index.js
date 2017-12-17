const term = require('terminal-kit').terminal

describe('async-describe', () => {
  test('demo', (done) => {
    require('../demo');
    setTimeout(() => {
      expect(term.getActions()).toMatchSnapshot();
      term.resetActions();
      done();
    }, 1000)
  });
});
