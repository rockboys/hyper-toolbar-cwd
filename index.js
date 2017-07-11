exports.onWindow = win => {
  win.rpc.on('GO_TO_DIRECTORY', ({ dir, session }) => {
    win.sessions.get(session).write('cd ' + dir + '\r');
  });
};

exports.mapHyperState = ({ sessions }, map) => {
  console.log(map)
  return Object.assign({}, map, {
    toolbar: {
      state: {
        cwd: {
          directory: sessions.activeUid && sessions.sessions && sessions.sessions[sessions.activeUid] ? sessions.sessions[sessions.activeUid].cwd : null,
          activeSessionId: sessions.activeUid
        }
      }
    }
  });
};

exports.decorateHyperToolbar = (HyperToolbar, { React }) => {
  const { dialog } = require('electron').remote;
  const { shell } = require('electron');
  const tildify = require('tildify');

  class HyperToolbarCwd extends React.Component {
    constructor (props) {
      super(props);

      this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
    }

    onMouseDownHandler (event) {
      switch (event.nativeEvent.which) {
        case 1:
          this.props.onSelectDirectory();
          break;
        case 3:
          this.props.onOpenDirectory();
          break;
        default:
          break;
      }
    }

    render () {
      return React.createElement('a', { onMouseDown: this.onMouseDownHandler }, `${this.props.cwd}`);
    }
  }

  HyperToolbarCwd.displayName = 'hyper-toolbar-cwd';

  return class extends React.Component {
    constructor (props) {
      super(props);

      this.changeDirectory = this.changeDirectory.bind(this);
      this.onOpenDirectory = this.onOpenDirectory.bind(this);
      this.onSelectDirectory = this.onSelectDirectory.bind(this);
    }

    changeDirectory (dir) {
      window.rpc.emit('GO_TO_DIRECTORY', { dir: dir, session: this.props.state.cwd.activeSessionId });
    }

    onSelectDirectory () {
      dialog.showOpenDialog({
        title: 'Choose a directory',
        properties: ['openDirectory', 'createDirectory']
      }, (paths) => {
        if (paths !== undefined && paths.length > 0) {
          this.changeDirectory(paths[0]);
        }
      });
    }

    onOpenDirectory () {
      const dir = this.props.state.cwd.directory;
      shell.openExternal('file://' + dir);
    }

    render () {
      this.props.plugins = (this.props.plugins || [])
        .concat(React.createElement(
          HyperToolbarCwd, 
          { 
            onSelectDirectory: this.onSelectDirectory,
            onOpenDirectory: this.onOpenDirectory,
            cwd: tildify(this.props.state.cwd.directory || '') }
        )
      );

      return React.createElement(HyperToolbar, this.props);
    }
  }
};
