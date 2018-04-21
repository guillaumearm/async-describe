const { terminal, stringWidth, truncateString, stripEscapeSequences } = require('terminal-kit');

const ObservableState = require('./utils/ObservableState');
const { flatten } = require('./utils/flatten');


const clearScreen = () => {
  const h = terminal.height;
  terminal.up(h);
  terminal.column(1);
  terminal.deleteLine(h)
};


function Renderer() {
  const state = new ObservableState({ components: [] });
  let exited = false;
  terminal.clear();


  const stdoutWrite = process.stdout.write.bind(process.stdout)
  const stderrWrite = process.stderr.write.bind(process.stdout)

  let outputQueue = [];

  this.freeze = () => {
    process.stdout.write = (msg) => {
      outputQueue.push({ type: 'stdout', msg: msg === '\n' ? ' \n' : msg });
    };
    process.stderr.write = (msg) => {
      outputQueue.push({ type: 'stderr', msg: msg === '\n' ? ' \n' : msg });
    };
  }

  this.unfreeze = () => {
    process.stdout.write = stdoutWrite;
    process.stderr.write = stderrWrite;
  }

  const computeNbMessages = (messages) => {
    let nbMessages = 0;
    let nbFullMessages = 0;
    let i = messages.length - 1;
    while (messages[i] && nbFullMessages < terminal.height - 1) {
      if (stripEscapeSequences(messages[i])) {
        nbFullMessages++;
      }
      nbMessages++;
      i--;
    }
    return nbMessages;
  }

  const getMessages = () => {
    const messages = flatten(
      outputQueue.map(({ msg }) => {
        return msg.split('\n').map(m => !m ? ' ' : m);
      })
    );

    return messages
      .slice(-Math.max(computeNbMessages(messages), terminal.height))
      .map(msg => {
        if (stringWidth(msg)) {
          return truncateString(msg, terminal.width) + '\n';
        }
        if (!msg) {
          return '\n'
        }
        return msg;
      })
  }

  this.flush = () => {
    const nextComponents = outputQueue.map(({ type, msg }) => {
      const print = type === 'stdout' ? terminal.yellow : terminal.red;
      return () => print(msg)
    })
    this.update(components => [...components, ...nextComponents])
    const previousQueue = outputQueue;
    outputQueue = [];
    return previousQueue;
  }

  this.terminal = terminal;
  this.state = state;

  this.update = f => { this.state.components = f(this.state.components) };

  this.render = (component) => {
    this.update(components => [...components, component]);
  };

  let previousComponents;
  this.repaint = () => {
    if (state.components !== previousComponents) {
      clearScreen();
      this.freeze();
      state.components.forEach(c => c())
      this.unfreeze();

      const messages = getMessages();
      outputQueue = [];
      messages.forEach(process.stdout.write)

      previousComponents = state.component;
    }
  }

  this.processExit = (exitCode) => {
    if (!exited) {
      exited = true;
      this.stop()
      terminal.processExit(exitCode);
    }
  }

  const unsubscribe = this.state.subscribe(this.repaint);
  this.stop = () => {
    this.unfreeze();
    this.flush();
    clearScreen();
    state.components.forEach(c => c())
    unsubscribe();
  }
}

module.exports = Renderer;
