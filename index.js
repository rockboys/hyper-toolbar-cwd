exports.onWindow = win => {
  win.rpc.on('GO_TO_DIRECTORY', ({ dir, session }) => {
    win.sessions.get(session).write('cd ' + dir + '\r');
  });
};

exports.mapHyperState = ({ sessions }, map) => {
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

exports.decorateConfig = (config) => {
  return Object.assign({}, config, {
    css: `
      ${config.css || ''}
      .hyper-cwd-container .folder-icon {
        width: 20px;
      }
      .hyper-cwd-container .path-name {
        position: relative;
        top: -5px;
        margin-left: 5px;
      }
    `
  })
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
      return React.createElement('div', { className: 'hyper-cwd-container'},
        React.createElement('img', { className: 'folder-icon', src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAACFlBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////29vb////////////////////////////////////////////////////////6+vr////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7////////////////////////+/v7////////////////9/f3+/v7////////9/f3////+/v7+/v7////////////////+/v7////////////////+/v7////////+/v7////////+/v7////////////+/v7+/v7+/v7////+/v7////+/v7////+/v7////+/v7////////+/v7+/v7////+/v7+/v7////+/v7+/v7+/v7+/v7////////////////+/v7+/v7+/v7+/v7////////////////////////////////////+/v7///////9pQyAwAAAAsXRSTlMAAQIDBAUGBwgKCwwNDg8SExQWFxkbHB4gIiMkJicoKSovMTI2Nzg4OTo9P0JDREVGSU1PUlNVV1hZW11eYGFiY2dpamtsbW5vcXR3eXx+f4CFhoeIiYuMj5CRkpaXmJmam5ydnp+hoqOkpaanp6qtrq6xsrO0tba3vL3AwsPExcbHyMnKy8zQ0tTW2NjZ29zd3+Dh4uPl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v4v524tAAADc0lEQVR42u3dx1cTURTH8ZdkNChogl0sKGIXxYINFVQELCgodrECitgFuyIiVhRFhSBJCE0TncS8/9Djaq6b8WWOi/s4v+8695z55M4kWeUJhBBCCCGEEEIIIYT+ZEzZfKG9P2mf2dm8d/4YF2NG2tJLQ1KxV2UTuFKMOVdMmUJfisawdGRsDcgUuzuVocNXbcqU68pxc3P466SDkqE8Zg9KerV0VPLjfFYOo9CUzoq3ZXKCzA5Ip8WOGXwc3svSccm+xXwguaZ03o8bXi4Oo17SErGBUNCm/pGEpIVWc4FMGqS3SvRD88HdO2zaV/t6kFJ+3k9nAtlIHcP38j3/GphxrIdKwoVMIOekVbQ5S2HCVdGftGbMFj8PSDtZSEe+2udc00+6kjIXC0iIfCvc9KjN5PWSlcRfTGcBIZcUOqA6dJGuJLLfYAYJlKgO5XTTlbycxwzSXaw8ddKUVgNHvNpCsrrIXPLdQm0hooKuZKhmnLaQyR2S9H6lthCxk67kW+NETpDwqQL1ir5L0uc9Bf+/NSsWTBvrAMKu4Q8PTmxd7HNrC6F9f1yxbLy+EFq8ZedMt74QWqQm19AXQovfzjM0htAeLXFrDKHdmuUaHZD48XSNIbSBdS6NIbSnmaMEktisDIl1PGTUk5fBuKQ9NFQhwcPLGZW3trTxa4JAotkOfsazyD234hOVlOoFoWUeDRPINX0hYt5z8py80RjiPj9sXd+IxhCxr09a6QzZ3jNKIMXdgAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAaAEJ7OIHKQk4gIQq+UEqQ6oQ8sLYdQ83h+dGjLzRwq62v//cm1n5b39Z1/dM2HVWWkWbsng5sm5HpVWNsGuDtEoO31nlYXRfrbwzlJRW6+2PJIhQSbSzqap8B4vKq5o6o9TR77dn10laIhYJ9rEoGIklJK3OrXJsB//MXGGft0EPSINX5Wgb/gVmi39lbDH5O8xCQ+H4p4P8IVUZQiFfLXdHrV8o5TtkcmaYh3xCsYxtjJ/43m0ZQjkj+6rJdB2N2YZIpbRF9RF+jEj9ojSRai7/pjOtYT6IcOvpTX6XQAghhBBCCCGEEEIIIYS06zeG3g1gkXpVxAAAAABJRU5ErkJggg==' }, null),
        React.createElement('a', { className: 'path-name', onMouseDown: this.onMouseDownHandler }, `${this.props.cwd}`)
      );
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
