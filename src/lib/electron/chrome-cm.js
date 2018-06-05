/* globals CryptoJS, utils, config, icon */
'use strict';

var app = new utils.EventEmitter();

if (!Object.values) {
  Object.values = function (obj) {
    let tmp = [];
    for (let n in obj) {
      tmp.push(obj[n]);
    }
    return tmp;
  };
}


app.globals = {
  browser: 'chrome',
  extension: false,
  open: false,
  reveal: false,
  folder: true,
  referrer: 'X-Referer'
};

if (!Promise.defer) {
  Promise.defer = function () {
    let deferred = {};
    let promise = new Promise(function (resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject  = reject;
    });
    deferred.promise = promise;
    return deferred;
  };
}
app.Promise = Promise;
app.XMLHttpRequest = window.XMLHttpRequest;
app.fetch = (url, props) => fetch(url, props);
app.EventEmitter = utils.EventEmitter;
app.timer = window;
app.URL = window.URL;

app.canvas = () => null;

app.storage = (function () {
  let objs = {};
  chrome.storage.local.get(null, function (o) {
    objs = o;
    app.emit('load');
  });
  return {
    read: (id) => objs[id],
    write: function (id, data) {
      objs[id] = data;
      let tmp = {};
      tmp[id] = data;
      chrome.storage.local.set(tmp, function () {});
    },
    on: (name, callback) => chrome.storage.onChanged.addListener(function (obj) {
      if (name in obj) {
        callback();
      }
    })
  };
})();

app.button = {
  onCommand: function () {},
  icon: null,
  label: null,
  badge: null
};

app.tab = {
  open: function () {},
  list: () => Promise.resolve([]),
  reload: () => Promise.resolve(),
  activate: () => Promise.resolve()
};

app.menu = function () {};

(function (cache) {
  let req = new XMLHttpRequest();
  req.open('GET', '../../data/assets/mime.json');
  req.responseType = 'json';
  req.onloadend = function () {
    cache = req.response || cache;
  };
  req.send();
  Object.defineProperty(app, 'mimes', {
    get: function () {
      return cache;
    }
  });
})({});

app.getURL = (path) => chrome.runtime.getURL('/data/' + path);

app.version = () => Promise.resolve(chrome.runtime.getManifest().version);

app.platform = function () {
  let v1 = /Chrome\/[\d\.]*/.exec(navigator.userAgent);
  let v2 = /OPR\/[\d\.]*/.exec(navigator.userAgent);
  let version = v2 ? v2[0].replace('OPR/', 'OPR ') : v1[0].replace('Chrome/', 'Chrome ');
  return `${version} on ${navigator.platform}`;
};

// manager
app.manager = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@ui',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@ui' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// add
app.add = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@ad',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@ad' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// info
app.info = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@if',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@if' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// modify
app.modify = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@md',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@md' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// triggers
app.triggers = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@tr',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@tr' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// about
app.about = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@ab',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@ab' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// extract
app.extract = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@ex',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@ex' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// preview
app.preview = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@pr',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@pr' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// config
app.config = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@cf',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@cf' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

// logs
app.logs = (function () {
  return {
    send: (id, data) => chrome.runtime.sendMessage({
      method: id + '@lg',
      data
    }),
    receive: (id, callback) => chrome.runtime.onMessage.addListener(function (message, sender) {
      if (id + '@lg' === message.method && sender.url !== document.location.href) {
        callback.call(sender.tab, message.data);
      }
    })
  };
})();

app.disk = {
  browse: function () {
    return new Promise(function (resolve, reject) {
      let wins = chrome.app.window.getAll();
      if (wins && wins.length) {
        let win = wins[0].contentWindow;
        win.chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function (folder) {
          chrome.storage.local.set({
            folder: chrome.fileSystem.retainEntry(folder)
          });
          resolve(folder.name);
        });
      }
      else {
        reject();
      }
    });
  }
};
/* app.play */
app.play = (src) => {
  let audio = new Audio(chrome.runtime.getURL('/data/' + src));
  audio.play();
};
/* app.arguments */
app.arguments = (function () {
  let callbacks = [];
  let requests = [];
  if (chrome.runtime && chrome.runtime.onMessageExternal) {
    chrome.runtime.onMessageExternal.addListener(function (request, sender) {
      if (request.cmd === 'register') {
        app.runtime.register(sender.id);
        if (request.support && request.support.indexOf('icon') !== -1) {
          // allow icon module to generate icons
          app.canvas = () => document.createElement('canvas');
          icon.register();
        }
      }
      else {
        if (callbacks.length) {
          callbacks.forEach(c => c(request));
        }
        else {
          requests.push(request);
        }
      }
    });
  }
  // request helper extension to register itself (other applications need to request registration)
  // Chrome Only
  chrome.runtime.sendMessage('gnaepfhefefonbijmhcmnfjnchlcbnfc', {cmd: 'register'});

  return function (c) {
    callbacks.push(c);
    requests.forEach(request => c(request));
    requests = [];
  };
})();
/* app.fileSystem */
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
app.fileSystem = {
  file: {
    exists: function (root, name) {
      return new Promise(function (resolve) {
        root.getFile(name, {create: true, exclusive: true}, () => resolve(false), () => resolve(true));
      });
    },
    create: function (root, name) {
      return new Promise(function (resolve, reject) {
        root.getFile(
          name,  // a unique name
          {create: true, exclusive: false},
          (fe) => resolve(fe),
          (e) => reject(e)
        );
      });
    },
    truncate: function (file, bytes) {
      return new Promise(function (resolve, reject) {
        file.createWriter(function (fileWriter) {
          fileWriter.onwrite = () => resolve();
          fileWriter.onerror = (e) => reject(e);
          fileWriter.truncate(bytes);
        });
      });
    },
    write: function (file, offset, arr) {
      return new Promise(function (resolve, reject) {
        file.createWriter(function (fileWriter) {
          let blob = new Blob(arr, {type: 'application/octet-stream'});
          fileWriter.onerror = (e) => reject(e);
          fileWriter.onwrite = () => resolve();
          fileWriter.seek(offset);
          fileWriter.write(blob);
        }, (e) => reject(e));
      });
    },
    md5: function (file, bytes) {
      return new Promise(function (resolve, reject) {
        if (!file) {
          return resolve('file is not found');
        }
        if (bytes > 50 * 1024 * 1024) {
          return resolve('MD5 calculation is skipped');
        }
        file.file(function (file) {
          let reader = new FileReader();
          reader.onloadend = function () {
            resolve(CryptoJS.MD5(CryptoJS.enc.Latin1.parse(this.result)).toString());
          };
          reader.readAsBinaryString(file);
        }, (e) => reject(e));
      });
    },
    rename: function (file, root, name) {
      return new Promise((resolve, reject) => file.moveTo(root, name, resolve, reject));
    },
    remove: function (file) {
      return new Promise((resolve, reject) => file.remove(resolve, reject));
    },
    launch: () => Promise.reject(new Error('not implemented')),
    reveal: () => Promise.reject(new Error('not implemented')),
    close: () => Promise.resolve(),
    toURL: (file) => {
      return new Promise(function (resolve, reject) {
        file.file(f => resolve(URL.createObjectURL(f)), (e) => reject(e));
      });
    }
  },
  root: {
    internal: function (bytes) {
      return new Promise(function (resolve, reject) {
        navigator.webkitTemporaryStorage.requestQuota(bytes, function (grantedBytes) {
          if (grantedBytes === bytes) {
            window.requestFileSystem(
              window.TEMPORARY, bytes, function (fs) {
                resolve(fs.root);
              },
              (e) => reject(e)
            );
          }
          else {
            reject(new Error('cannot allocate space in the internal storage'));
          }
        });
      });
    },
    external: function () {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(null, function (storage) {
          if (storage.folder && config.wget.directory) {
            try {
              chrome.fileSystem.restoreEntry(storage.folder, function (root) {
                if (root) {
                  resolve(root);
                }
                else {
                  reject(new Error('storage.folder is undefined'));
                }
              });
            }
            catch (e) {
              reject(e);
            }
          }
          else {
            reject(new Error('either storage.folder or config.wget.directory is undefined'));
          }
        });
      });
    }
  }
};
/* app.process */
app.process = () => Promise.reject('not supported');
/* app.webRequest */
app.webRequest = (function () {
  let callbacks = {
    media: function () {}
  };
  app.extract.receive('media', (obj) => callbacks.media(obj));
  return {
    media: (c) => callbacks.media = c
  };
})();
/* app.crequire */
app.crequire = function (name, arr) {
  return new Promise(function (resolve, reject) {
    let script = document.createElement('script');
    script.src = app.getURL('') + '../lib/' + arr[0] + '.js';
    script.onload = () => resolve(window[name]);
    script.onerorr = () => reject();
    document.body.appendChild(script);
  });
};
