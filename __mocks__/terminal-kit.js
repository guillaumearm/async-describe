let actions = [];

const createAction = type => (...args) => {
  actions.push({ type, payload: args });
}

const terminal = createAction('NORMAL');
terminal.bold = createAction('BOLD');
terminal.red = (...args) => {
  createAction('RED')(...args.map(() => '[ERROR]'));
};
terminal.green = createAction('YELLOW');
terminal.getActions = () => actions;
terminal.resetActions = () => { actions = [] }

module.exports = { terminal }
