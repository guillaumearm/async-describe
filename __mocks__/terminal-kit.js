const termkit = jest.genMockFromModule('terminal-kit');

let actions = [];

const createAction = type => (...args) => {
  actions.push({ type, payload: args });
}

const terminal = createAction('TERM_NORMAL');
terminal.red = (...args) => {
  createAction('TERM_RED')(...args.map(() => '[ERROR]'));
};
terminal.green = createAction('TERM_GREEN');
terminal.yellow = createAction('TERM_YELLOW')
terminal.clear = createAction('TERM_CLEAR');
terminal.up = createAction('TERM_UP') ;
terminal.column = createAction('TERM_COLUMN');
terminal.deleteLine = createAction('TERM_DELETE_LINE');

terminal.bold = createAction('TERM_BOLD');
terminal.bold.green = createAction('TERM_BOLD_GREEN');
terminal.bold.red = createAction('TERM_BOLD_RED');

terminal.processExit = createAction('TERM_EXIT_PROCESS');

terminal.getActions = () => actions;
terminal.resetActions = () => { actions = [] }

module.exports = { ...termkit, terminal }
