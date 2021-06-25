// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var controlKey = {
  up: ["ArrowUp", "KeyW"],
  down: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  shoot: ["KeyZ", "LeftMouse"],
  focus: ["ShiftLeft"]
}; //#region Global varibles

var canvas = document.getElementById("main-canvas");
var c = canvas.getContext("2d");
var c_width = window.screen.width;
var c_height = window.innerHeight;
canvas.width = c_width;
canvas.height = c_height;
canvas.style.background = "#000000";
c.lineWidth = 3;
c.strokeStyle = "#ffffff";
c.fillStyle = "#ffffff";
c.font = "22px pressStart";
var maxR = 400,
    //Maximun size of asteroid
minR = 40,
    //Minimun size of asteroid
minVertices = 7,
    maxVertices = 25,
    maxMapHeight = 7 * c_height,
    //Maximun scroll height
startMapLevel = 0,
    // Map's portion to start at
n_enemy = 15,
    // Number of enemy
bullet = [],
    // Array containing all bullet object
keyPressedPool = new Set(),
    // Set containing user's inputs
p_angle = 0,
    // Previous angle of player (Pointing to mouse)
angle = 0,
    // Angle of player (Pointing to mouse)
translate_x = 0,
    // Amount x to translate when player moves (Camera Follow)
translate_y = 0,
    // Amount y to translate when player moves (Camera Follow)
o_bulletTimer = 4,
    // Number of iteration before shooting bullet (bullet per 4 frames)
bulletTimer = 0,
    // Count ^
org_x = 0,
    // x of top left corner
org_y = 0,
    // y of top left corner
org_player_x = c_width / 2,
    org_player_y = c_height / 1.5,
    player_size = 30,
    player,
    enemy = [],
    score = 0,
    rounded_score = 0,
    scoremult = 1,
    popUps = [];
var isEndless = 0,
    isHardMode = 0; //#endregion
//#region Setup Functions
//#region Classes

var Bullet = /*#__PURE__*/function () {
  function Bullet(x, y, r) {
    var _dir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
      x: 0,
      y: -Bullet.bulletSpeed
    };

    _classCallCheck(this, Bullet);

    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.r = r;

    this.img = function () {
      var can = document.createElement("canvas");

      var _c = can.getContext("2d");

      can.width = r * 2;
      can.height = r * 2;
      _c.fillStyle = "#ffffff";

      _c.beginPath();

      _c.arc(r, r, r, 0, 2 * Math.PI);

      _c.fill();

      return can;
    }();

    this.dir = _dir;
    this.state = 1;
    this.damage = 1;
  }

  _createClass(Bullet, [{
    key: "update",
    value: function update() {
      this.x += this.dir.x;
      this.y += this.dir.y;
    }
  }, {
    key: "reset",
    value: function reset(x, y) {
      var _dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        x: 0,
        y: -Bullet.speed
      };

      this.x = x;
      this.y = y;
      this.px = x;
      this.py = y;
      this.dir = _dir;
      this.state = 1;
      this.damage = 1;
    }
  }]);

  return Bullet;
}();

_defineProperty(Bullet, "bulletSpeed", 14);

var bullet_start_dir = {
  x: 0,
  y: -Bullet.bulletSpeed
}; // Starting position of bullet
//#endregion
//#region Misc Fucntions

function ModifiedRandomAboveAvg() {
  var x = Math.random();
  return 4.5 * Math.pow(x, 3) - 8.3 * Math.pow(x, 2) + 4.8 * x;
}

function ModifiedRandomBelowAvg() {
  var x = Math.random();
  return 2.2 * Math.pow(x, 3) - 3 * Math.pow(x, 2) + 1.8 * x;
}

function getMaxMinCo_Enemy(_enemy) {
  var x_arr = _enemy.data.map(function (a) {
    return a.x - a.ox;
  });

  var x_max = Math.max.apply(Math, _toConsumableArray(x_arr)),
      x_min = Math.min.apply(Math, _toConsumableArray(x_arr));

  var y_arr = _enemy.data.map(function (b) {
    return b.y - b.oy;
  });

  var y_max = Math.max.apply(Math, _toConsumableArray(y_arr)),
      y_min = Math.min.apply(Math, _toConsumableArray(y_arr));
  return {
    xMax: x_max,
    xMin: x_min,
    yMax: y_max,
    yMin: y_min
  };
}

function normalizeVector(_x, _y) {
  var mag = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2));
  return {
    x: _x / mag,
    y: _y / mag
  };
}

function checkCollision(x1, y1, x2, y2, x3, y3, x4, y4) {
  var dem = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / dem;
  var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / dem;

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return {
      x: x1 + uA * (x2 - x1),
      y: y1 + uA * (y2 - y1)
    };
  }

  return false;
}

function checkCollision_Bullet_Enemy(_bullet, _enemy) {
  var xC = _bullet.x,
      yC = _bullet.y;
  var minIndex = -1,
      minDistSq = 0,
      xM = 0,
      yM = 0,
      _nx = 0,
      _ny = 0;

  for (var i = 0, l = _enemy.data.length; i !== l; i++) {
    var xA = _enemy.data[i].x,
        yA = _enemy.data[i].y,
        xB = _enemy.data[(i + 1) % l].x,
        yB = _enemy.data[(i + 1) % l].y;

    var _an = yA - yB,
        _bn = xB - xA,
        a = -_an / _bn,
        b = _an / _bn * xA + yA,
        _xM = (xC + a * yC - a * b) / (1 + a * a),
        _yM = (a * a * yC + a * xC + b) / (1 + a * a);

    var distSq = (_xM - xC) * (_xM - xC) + (_yM - yC) * (_yM - yC); // c.beginPath();
    // c.arc(_xM, _yM, 10, 0, 2*Math.PI);
    // c.stroke();

    if (_xM < xA && _xM > xB || _xM > xA && _xM < xB) {
      if (minIndex === -1) {
        minIndex = i;
        minDistSq = distSq;
        xM = _xM, yM = _yM;
        _nx = yA - yB, _ny = xB - xA;
      } else if (distSq < minDistSq) {
        minIndex = i;
        minDistSq = distSq;
        xM = _xM, yM = _yM;
        _nx = _an, _ny = _bn;
      }
    }
  }

  var n = normalizeVector(_nx, _ny),
      IM = {
    x: xM - xC,
    y: yM - yC
  };
  var dotP = IM.x * n.x + IM.y * n.y,
      m = 0;

  if (minDistSq < _bullet.r * _bullet.r) {
    m = _bullet.r - Math.sqrt(minDistSq);
    return {
      x: xC - m * n.x,
      y: yC - m * n.y,
      normal: n,
      index: minIndex
    };
  }

  return false;
}

function getCentroidOfPolygon(polygon) {
  var signedArea = 0,
      Cx = 0,
      Cy = 0;

  for (var i = 0, l = polygon.length; i !== l; i++) {
    var a = polygon[i].x * polygon[(i + 1) % l].y - polygon[(i + 1) % l].x * polygon[i].y;
    signedArea += a;
    Cx += (polygon[i].x + polygon[(i + 1) % l].x) * a;
    Cy += (polygon[i].y + polygon[(i + 1) % l].y) * a;
  }

  signedArea *= 0.5;
  var b = 1 / (6 * signedArea);
  Cx *= b;
  Cy *= b;
  return {
    x: Cx,
    y: Cy
  };
}

function checkIfPolygonSelfIntersect(polygon) {
  for (var i = 0, l = polygon.length; i !== l; i++) {
    if (checkCollision(polygon[i].x, polygon[i].y, polygon[(i + 1) % l].x, polygon[(i + 1) % l].y, polygon[(i + 2) % l].x, polygon[(i + 2) % l].y, polygon[(i + 3) % l].x, polygon[(i + 3) % l].y)) {
      return true;
    }
  }

  return false;
}

function getAreaOfPolygon(polygon) {
  var A = 0,
      sg = 1;

  for (var i = 0; i !== 2; i++) {
    for (var j = 0, l = polygon.length; j !== l; j++) {
      A += sg * polygon[(j + i) % l].x * polygon[(j + i + sg) % l].y;
    }

    sg = -1;
  }

  A = 0.5 * Math.abs(A);
  return A;
}

function addPopUp(text, x, y, frame) {
  var nf = 1;

  for (var i = 0; i < popUps.length; i++) {
    if (!popUps[i][3]) {
      popUps[i][0] = text;
      popUps[i][1] = x;
      popUps[i][2] = y;
      popUps[i][3] = frame;
      nf = 0;
      break;
    }
  }

  if (nf) popUps.push([text, x, y, frame]);
} //#endregion
//#region Creating Enemy


function Enemy(o_x, o_y) {
  var min_v = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var max_v = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var min_r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
  var max_r = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 40;

  var _dir = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {
    _x: 0,
    _y: 0
  };

  var nVertices = min_v + ~~(Math.random() * (max_v - min_v));

  var _a = 2 * Math.PI / nVertices;

  var EnemyPositionData = [];
  var _maxR = 0;

  for (var i = 0; i < nVertices; i++) {
    var _r = min_r + Math.random() * (max_r - min_r);

    if (_r > _maxR) _maxR = _r;
    EnemyPositionData.push({
      ox: o_x,
      oy: o_y,
      x: o_x + _r * Math.cos(i * _a),
      y: o_y + _r * Math.sin(i * _a)
    });
  }

  var newCenter = getCentroidOfPolygon(EnemyPositionData);

  for (var _i = 0; _i < EnemyPositionData.length; _i++) {
    EnemyPositionData[_i].ox = newCenter.x;
    EnemyPositionData[_i].oy = newCenter.y;
  }

  return {
    data: EnemyPositionData,
    dir: {
      x: _dir._x,
      y: _dir._y
    },
    maxR: _maxR,
    health: ~~(_maxR / 3),
    o_health: ~~(_maxR / 3),
    state: 1
  };
}

function EnemyFromData(positon_data) {
  var _dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    x: 2,
    y: 0
  };

  var _enemy = {
    data: positon_data,
    dir: _dir,
    state: 1
  };
  var a = getMaxMinCo_Enemy(_enemy);
  _enemy.top = a.yMin + _enemy.data[0].oy;
  _enemy.bottom = a.yMax + _enemy.data[0].oy;
  _enemy.right = a.xMax + _enemy.data[0].ox;
  _enemy.left = a.xMin + _enemy.data[0].ox;
  _enemy.maxR = Math.sqrt(Math.pow((a.xMax - a.xMin) / 2, 2) + Math.pow((a.yMax - a.yMin) / 2, 2));
  _enemy.health = ~~(_enemy.maxR / 3);
  _enemy.o_health = ~~(_enemy.maxR / 3);
  return _enemy;
}

function newEnemy() {
  var _r = minR + ModifiedRandomBelowAvg() * (maxR - minR);

  var e = new Enemy(maxR + Math.random() * (c_width - maxR), -(maxMapHeight - startMapLevel * c_height) + maxMapHeight * Math.random(), minVertices, maxVertices, _r / 4, _r, {
    _x: -6 + Math.random() * 12,
    _y: -6 + Math.random() * 12
  });
  var a = getMaxMinCo_Enemy(e);
  e.top = a.yMin + e.data[0].oy;
  e.bottom = a.yMax + e.data[0].oy;
  e.right = a.xMax + e.data[0].ox;
  e.left = a.xMin + e.data[0].ox;
  return e;
} //#endregion
//#region Creating Player


function createPlayer() {
  return {
    px: org_player_x,
    py: org_player_y,
    x: org_player_x,
    y: org_player_y,
    ax: 0,
    vx: 0,
    ay: 0,
    vy: 0,
    max_v: 8,
    size: player_size,
    update: function update() {
      this.vx += this.ax * (Math.abs(this.vx) <= this.max_v);
      this.x += this.vx * ((this.x > org_x || this.vx > 0) && (this.x < org_x + c_width || this.vx < 0));
      this.vy += this.ay * (Math.abs(this.vy) <= this.max_v);
      this.y += this.vy;
      this.vx *= 0.8;
      this.vy *= 0.8;
    },
    img: function () {
      var can = document.createElement("canvas");

      var _c = can.getContext("2d");

      can.width = player_size;
      can.height = player_size;
      _c.fillStyle = "#ffffff";
      _c.strokeStyle = "#ffffff";

      _c.beginPath();

      _c.moveTo(can.width / 2, 0);

      _c.lineTo(can.width, can.height);

      _c.lineTo(can.width / 2, can.height / 2);

      _c.lineTo(0, can.height);

      _c.closePath();

      _c.stroke();

      _c.fill();

      return can;
    }()
  };
}

function resetPlayer() {
  var px = player.x;
  var py = player.y;
  player = createPlayer();
  player.px = px;
  player.py = py;
} //#endregion
//#endregion
//#region Update and Drawing Functions


function drawEnemy(_enemy) {
  c.beginPath();
  c.moveTo(_enemy.data[0].x, _enemy.data[0].y);

  for (var i = 1; i < _enemy.data.length; i++) {
    c.lineTo(_enemy.data[i].x, _enemy.data[i].y);
  }

  c.closePath();
  c.stroke(); // c.fill();
}

function updateEnemy(_enemy) {
  var a = _enemy.dir.x,
      b = _enemy.dir.y;

  for (var i = 0; i < _enemy.data.length; i++) {
    _enemy.data[i].x += a;
    _enemy.data[i].y += b;
    _enemy.data[i].ox += a;
    _enemy.data[i].oy += b;
  }

  _enemy.right += a;
  _enemy.top += b;
  _enemy.left += a;
  _enemy.bottom += b;
  _enemy.dir.x *= 0.9999;
  _enemy.dir.y *= 0.9999;
}

function drawPlayer(_player) {
  c.save();
  c.translate(_player.x, _player.y);
  c.rotate(angle);
  c.drawImage(_player.img, -_player.size / 2, -_player.size / 2);
  c.restore();
}

function drawBullet(_bullet) {
  c.drawImage(_bullet.img, _bullet.x - _bullet.r, _bullet.y - _bullet.r);
} //#endregion
//#region Event Handling


canvas.addEventListener("mousemove", function (event) {
  p_angle = angle;
  angle = Math.atan2(event.clientY + org_y - player.y, event.clientX + org_x - player.x) + Math.PI / 2;
  bullet_start_dir.x = Bullet.bulletSpeed * Math.sin(angle);
  bullet_start_dir.y = -Bullet.bulletSpeed * Math.cos(angle); // console.log(angle * 180 / Math.PI);
});
var playerAccel = 2;
document.addEventListener("keydown", function (event) {
  keyPressedPool.add(event.code);
});
document.addEventListener("keyup", function (event) {
  keyPressedPool.delete(event.code);
  if (controlKey.left.includes(event.code) || controlKey.right.includes(event.code)) player.ax = 0;
  if (controlKey.up.includes(event.code) || controlKey.down.includes(event.code)) player.ay = 0;
});
document.addEventListener("mousedown", function (event) {
  if (event.button === 0) keyPressedPool.add("LeftMouse");
});
document.addEventListener("mouseup", function (event) {
  if (event.button === 0) keyPressedPool.delete("LeftMouse");
});
document.addEventListener("visibilitychange", function () {
  keyPressedPool.clear();
  player.ax = 0;
  player.ay = 0;
});

document.oncontextmenu = function () {
  return false;
};

window.addEventListener("resize", function () {
  if (window.innerHeight !== c_height) {
    location.reload();
  }
}); //#endregion
//#region Set up

function setup() {
  score = 0;
  rounded_score = 0;
  enemy = [function () {
    var _r = minR + ModifiedRandomBelowAvg() * (maxR - minR);

    var e = Enemy(c_width / 2, c_height / 5, minVertices, maxVertices, _r / 4, _r, {
      _x: -1 + Math.random() * 2,
      _y: -1 + Math.random() * 2
    });
    var a = getMaxMinCo_Enemy(e);
    e.top = a.yMin + e.data[0].oy;
    e.bottom = a.yMax + e.data[0].oy;
    e.right = a.xMax + e.data[0].ox;
    e.left = a.xMin + e.data[0].ox;
    return e;
  }()];

  for (var i = 1; i < n_enemy; i++) {
    enemy.push(newEnemy());
  }

  player = createPlayer();
}

setup(); //#endregion
//#region Main Loop
// _________________MAIN_LOOP_________________

function draw() {
  player.py = player.y;
  player.px = player.x;
  player.update();
  c.clearRect(org_x, org_y, c_width, c_height); //#region Draw Stuffs

  for (var i = 0; i < enemy.length; i++) {
    if (enemy[i].state) updateEnemy(enemy[i]);
  }

  for (var _i2 = 0; _i2 < enemy.length; _i2++) {
    if (enemy[_i2].state) {
      drawEnemy(enemy[_i2]);
    }
  }

  drawPlayer(player);
  rounded_score = ~~score;
  c.fillText("Score(x".concat(scoremult, "):").concat(rounded_score), org_x + 10, org_y + 32); //#endregion
  //#region Enemy Wrap Around

  for (var _i3 = 0; _i3 !== enemy.length; _i3++) {
    var left = enemy[_i3].left;
    var right = enemy[_i3].right;
    var top = enemy[_i3].top;
    var bottom = enemy[_i3].bottom;

    if (left > org_x + c_width) {
      var a = right - org_x;
      enemy[_i3].left -= a;
      enemy[_i3].right -= a;

      for (var j = 0; j !== enemy[_i3].data.length; j++) {
        enemy[_i3].data[j].x -= a;
        enemy[_i3].data[j].ox -= a;
      }
    } else if (right < org_x) {
      var _a2 = c_width + org_x - left;

      enemy[_i3].left += _a2;
      enemy[_i3].right += _a2;

      for (var _j = 0; _j !== enemy[_i3].data.length; _j++) {
        enemy[_i3].data[_j].x += _a2;
        enemy[_i3].data[_j].ox += _a2;
      }
    }

    if (bottom < -maxMapHeight) {
      var _a3 = c_height - top;

      enemy[_i3].top += _a3;
      enemy[_i3].bottom += _a3;

      for (var _j2 = 0; _j2 !== enemy[_i3].data.length; _j2++) {
        enemy[_i3].data[_j2].y += _a3;
        enemy[_i3].data[_j2].oy += _a3;
      }
    } else if (top > c_height) {
      var _a4 = maxMapHeight + bottom;

      enemy[_i3].top -= _a4;
      enemy[_i3].bottom -= _a4;

      for (var _j3 = 0; _j3 !== enemy[_i3].data.length; _j3++) {
        enemy[_i3].data[_j3].y -= _a4;
        enemy[_i3].data[_j3].oy -= _a4;
      }
    }
  } //#endregion
  //#region Draw bullets & Collision detection between bullets & others


  for (var _i4 = 0; _i4 < bullet.length; _i4++) {
    if (bullet[_i4].state) {
      drawBullet(bullet[_i4]);
      bullet[_i4].px = bullet[_i4].x;
      bullet[_i4].py = bullet[_i4].y;

      bullet[_i4].update();

      var b_x = bullet[_i4].x,
          b_y = bullet[_i4].y; //#region Player Collision Detection

      if (isHardMode) {
        var squareDist = Math.pow(player.x - b_x, 2) + Math.pow(player.y - b_y, 2);

        if (squareDist <= Math.pow(player.size / 3 + bullet[_i4].r, 2)) {
          resetPlayer(player);
        }
      } //#endregion
      //#region Enemy Collsion Detection


      for (var m = 0, __l = enemy.length; m !== __l; m++) {
        if (!enemy[m].state) continue;

        if (b_x > enemy[m].left - 10 && b_x < enemy[m].right + 10 && b_y < enemy[m].bottom + 10 && b_y > enemy[m].top - 10) {
          var inter_x = void 0,
              inter_y = void 0,
              inter_count = 0,
              inter_index = 0,
              n = void 0; // let inter = checkCollision_Bullet_Enemy(bullet[i], enemy[m]);
          // if (inter) {
          //   inter_index = inter.index;
          //   inter_count++;
          //   n = inter.normal;
          //   inter_x = inter.x;
          //   inter_y = inter.y;
          //   c.beginPath()
          //   c.moveTo(inter_x, inter_y);
          //   c.lineTo(inter.x + n.x * 100, inter_y + n.y * 100);
          //   c.stroke();
          // }

          for (var _j4 = 0, l = enemy[m].data.length; _j4 !== l; _j4++) {
            var x3 = enemy[m].data[_j4].x,
                y3 = enemy[m].data[_j4].y,
                x4 = enemy[m].data[(_j4 + 1) % l].x,
                y4 = enemy[m].data[(_j4 + 1) % l].y; //#region Check how many collision

            var inter = checkCollision(b_x, b_y, bullet[_i4].px + enemy[m].dir.x, bullet[_i4].py + enemy[m].dir.y, x3, y3, x4, y4);

            if (inter) {
              inter_index = _j4;
              inter_count++;
              n = normalizeVector(y3 - y4, x4 - x3);
              inter_x = inter.x;
              inter_y = inter.y; // c.beginPath()
              // c.moveTo(inter_x, inter_y);
              // c.lineTo(inter.x + y3 - y4, inter_y + x4 - x3);
              // c.stroke();
            } //#endregion

          }

          if (inter_count % 2 !== 0) {
            //#region IF HIT
            //#region OLD collision
            var xd = bullet[_i4].dir.x,
                yd = bullet[_i4].dir.y;
            var t = n.x * xd + n.y * yd;

            if (t >= 0) {
              bullet[_i4].dir.x -= 2 * n.x * t - enemy[m].dir.x;
              bullet[_i4].dir.y -= 2 * n.y * t - enemy[m].dir.y;
            } else {
              bullet[_i4].dir.x += enemy[m].dir.x;
              bullet[_i4].dir.y += enemy[m].dir.y;
            }

            enemy[m].dir.x += (enemy[m].dir.x < player.max_v - 2) * (xd - bullet[_i4].dir.x) * (50 / Math.pow(enemy[m].maxR, 2));
            enemy[m].dir.y += (enemy[m].dir.y < player.max_v - 2) * (yd - bullet[_i4].dir.y) * (50 / Math.pow(enemy[m].maxR, 2)); //#endregion
            //#region Oof
            // let xd = bullet[i].dir.x,
            //   yd = bullet[i].dir.y,
            //   xe = enemy[m].dir.x,
            //   ye = enemy[m].dir.y;
            // let v1 = Math.sqrt(xd ** 2 + yd ** 2),
            //   m1 = 1,
            //   phi1 = Math.atan2(yd, xd);
            // let v2 = Math.sqrt(xe ** 2 + ye ** 2),
            //   m2 = enemy[m].maxR,
            //   phi2 = Math.atan2(ye, xe);
            // let __n = normalizeVector(bullet[i].dir.x, bullet[i].dir.y);
            // let small_phi = Math.atan2(
            //   inter_y - inter_y*__n.x,
            //   inter_x - inter_x*__n.y
            // );
            // let a =
            //     (v1 * (m1 - m2) * Math.cos(phi1 - small_phi) +
            //       2 * m2 * v2 * Math.cos(phi2 - small_phi)) /
            //     (m1 + m2),
            //   a1 =
            //     v1 *
            //     Math.sin(phi1 - small_phi) ;
            // bullet[i].dir.x =
            //   a * Math.cos(small_phi) + a1 * Math.cos(small_phi + Math.PI / 2);
            // bullet[i].dir.y =
            //   a * Math.sin(small_phi) + a1 * Math.sin(small_phi + Math.PI / 2);
            // let b =
            //     (v2 * (m2 - m1) * Math.cos(phi2 - small_phi) +
            //       2 * m1 * v1 * Math.cos(phi1 - small_phi)) /
            //     (m1 + m2),
            //   b1 =
            //     v2 *
            //     Math.sin(phi2 - small_phi);
            // enemy[m].dir.x =
            //   b * Math.cos(small_phi) + b1 * Math.cos(small_phi + Math.PI / 2);
            // enemy[m].dir.y =
            //   b * Math.sin(small_phi) + b1 * Math.sin(small_phi + Math.PI / 2);
            //#endregion

            var _n = normalizeVector(bullet[_i4].dir.x, bullet[_i4].dir.y);

            1;
            bullet[_i4].x = inter_x + _n.x;
            bullet[_i4].y = inter_y + _n.y; // bullet[i].x += enemy[m].dir.x * _n.x;
            // bullet[i].y += enemy[m].dir.y * _n.y;
            // bullet[i].dir.x *= 0.9;
            // bullet[i].dir.y *= 0.9;

            enemy[m].health -= bullet[_i4].damage;
            score += bullet[_i4].damage * scoremult;
            bullet[_i4].damage *= Math.sqrt((Math.pow(bullet[_i4].dir.x, 2) + Math.pow(bullet[_i4].dir.y, 2)) / (Math.pow(xd, 2) + Math.pow(yd, 2))); //#region Enemy die and split

            if (enemy[m].health < 1) {
              enemy[m].state = 0;
              score += enemy[m].o_health * scoremult;
              var spawned = 0;

              var _t = (inter_index + 1 + ~~(enemy[m].data.length / 2)) % enemy[m].data.length;

              var _a5 = inter_index + 1,
                  b = _t,
                  e1 = void 0;

              var arr = enemy[m].data;
              var oldCenterX = arr[0].ox,
                  oldCenterY = arr[0].oy;

              var copy_of_b = _objectSpread({}, arr[b]);

              if (_a5 < b) {
                e1 = arr.splice(_a5, b - _a5 + 1, {
                  ox: arr[0].ox,
                  oy: arr[0].oy,
                  x: arr[0].ox,
                  y: arr[0].oy
                }, copy_of_b);
              } else {
                e1 = arr.splice(b, _a5 - b, copy_of_b, {
                  ox: arr[0].ox,
                  oy: arr[0].oy,
                  x: arr[0].ox,
                  y: arr[0].oy
                });
              }

              e1.push({
                ox: arr[0].ox,
                oy: arr[0].oy,
                x: arr[0].ox,
                y: arr[0].oy
              }); // console.log(e1.slice());

              if (e1.length > 3 && !checkIfPolygonSelfIntersect(e1)) {
                var newCenter = getCentroidOfPolygon(e1);

                for (var v = 0; v < e1.length; v++) {
                  e1[v].ox = newCenter.x;
                  e1[v].oy = newCenter.y;
                }

                var q = 1;

                for (var z = 0; z < enemy.length; z++) {
                  if (!enemy[z].state) {
                    enemy[z] = new EnemyFromData(e1, {
                      x: enemy[m].dir.x + 2 * (e1[0].ox - oldCenterX) / enemy[m].maxR,
                      y: enemy[m].dir.y + 2 * (e1[0].oy - oldCenterY) / enemy[m].maxR
                    });

                    if (getAreaOfPolygon(enemy[z].data) < 1800) {
                      enemy[z].state = 0;
                      spawned--;
                    }

                    q = 0;
                    break;
                  }
                }

                if (q) {
                  enemy.push(new EnemyFromData(e1, {
                    x: enemy[m].dir.x + 2 * (e1[0].ox - oldCenterX) / enemy[m].maxR,
                    y: enemy[m].dir.y + 2 * (e1[0].oy - oldCenterY) / enemy[m].maxR
                  }));

                  if (getAreaOfPolygon(enemy[enemy.length - 1].data) < 1800) {
                    enemy[enemy.length - 1].state = 0;
                    spawned--;
                  }
                }

                spawned++;
              }

              var e2 = arr;

              if (e2.length > 3 && !checkIfPolygonSelfIntersect(e2)) {
                var _newCenter = getCentroidOfPolygon(e2);

                for (var _v = 0; _v < e2.length; _v++) {
                  e2[_v].ox = _newCenter.x;
                  e2[_v].oy = _newCenter.y;
                }

                var _q = 1;

                for (var _z = 0; _z < enemy.length; _z++) {
                  if (!enemy[_z].state) {
                    enemy[_z] = new EnemyFromData(e2, {
                      x: enemy[m].dir.x + 2 * (e2[0].ox - oldCenterX) / enemy[m].maxR,
                      y: enemy[m].dir.y + 2 * (e2[0].oy - oldCenterY) / enemy[m].maxR
                    });

                    if (getAreaOfPolygon(enemy[_z].data) < 1800) {
                      enemy[_z].state = 0;
                      spawned--;
                    }

                    _q = 0;
                    break;
                  }
                }

                if (_q) {
                  enemy.push(new EnemyFromData(e2, {
                    x: enemy[m].dir.x + 2 * (e2[0].ox - oldCenterX) / enemy[m].maxR,
                    y: enemy[m].dir.y + 2 * (e2[0].oy - oldCenterY) / enemy[m].maxR
                  }));

                  if (getAreaOfPolygon(enemy[enemy.length - 1].data) < 1800) {
                    enemy[enemy.length - 1].state = 0;
                    spawned--;
                  }
                }

                spawned++;
              }

              if (isEndless && !spawned) {
                var _q2 = 1;

                for (var _z2 = 0; _z2 < enemy.length; _z2++) {
                  if (!enemy[_z2].state) {
                    enemy[_z2] = newEnemy();
                    _q2 = 0;
                    break;
                  }
                }

                if (_q2) enemy.push(newEnemy());
              }

              break;
            } //#endregion

          } else if (inter_count !== 0) {
            bullet[_i4].state = 0;
            enemy[m].health -= bullet[_i4].damage;
            score += bullet[_i4].damage * scoremult;
          } //#endregion

        }
      } //#endregion


      if (b_y < org_y - bullet[_i4].r || b_y > org_y + c_height || b_x < org_x || b_x > org_x + c_width || Math.sqrt(Math.pow(bullet[_i4].dir.x, 2) + Math.pow(bullet[_i4].dir.y, 2)) < 0.65) {
        bullet[_i4].state = 0;
        continue;
      } // drawBullet(bullet[i]);

    }
  } //#endregion
  //#region Player collision with enemies


  for (var _m = 0, _l = enemy.length; _m !== _l; _m++) {
    if (!enemy[_m].state) continue;
    var player_x = player.x,
        player_y = player.y;

    if (player_x > enemy[_m].left - 10 && player_x < enemy[_m].right + 10 && player_y < enemy[_m].bottom + 10 && player_y > enemy[_m].top - 10) {
      for (var _j5 = 0, _l2 = enemy[_m].data.length; _j5 !== _l2; _j5++) {
        var _x2 = enemy[_m].data[_j5].x,
            _y2 = enemy[_m].data[_j5].y,
            _x3 = enemy[_m].data[(_j5 + 1) % _l2].x,
            _y3 = enemy[_m].data[(_j5 + 1) % _l2].y;

        if (checkCollision(player_x, player_y, player.px + enemy[_m].dir.x, player.py + enemy[_m].dir.y, _x2, _y2, _x3, _y3)) {
          resetPlayer(player);
        }
      }
    }
  } //#endregion
  //#region Camera moves with player


  if (player.py !== player.y || player.px !== player.x) {
    translate_x = (player.px - player.x) * 0.1;
    translate_y = player.py - player.y;
    org_x -= translate_x;
    if (player.y >= org_player_y) translate_y = org_y;else if (player.y <= -maxMapHeight + org_player_y) translate_y = org_y + maxMapHeight;
    org_y -= translate_y;
    c.translate(translate_x, translate_y);
  } //#endregion
  //#region Input check


  if (keyPressedPool.size) {
    if (controlKey.focus.filter(function (x) {
      return keyPressedPool.has(x);
    }).length) {
      player.max_v = 4;
      o_bulletTimer = 2;
    } else {
      player.max_v = 8;
      o_bulletTimer = 4;
    }

    if (controlKey.up.filter(function (x) {
      return keyPressedPool.has(x);
    }).length) player.ay = -playerAccel;
    if (controlKey.down.filter(function (x) {
      return keyPressedPool.has(x);
    }).length) player.ay = playerAccel;
    if (controlKey.left.filter(function (x) {
      return keyPressedPool.has(x);
    }).length) player.ax = -playerAccel;
    if (controlKey.right.filter(function (x) {
      return keyPressedPool.has(x);
    }).length) player.ax = playerAccel;

    if (controlKey.shoot.filter(function (x) {
      return keyPressedPool.has(x);
    }).length) {
      if (!bulletTimer) {
        var _n2 = 1;

        for (var _i5 = 0; _i5 < bullet.length; _i5++) {
          if (!bullet[_i5].state) {
            bullet[_i5].reset(player.x + player.size / 2 * Math.cos(angle - Math.PI / 2), player.y + player.size / 2 * Math.sin(angle - Math.PI / 2), _objectSpread({}, bullet_start_dir));

            _n2 = 0;
            break;
          }
        }

        if (_n2) bullet.push(new Bullet(player.x + player.size / 2 * Math.cos(angle - Math.PI / 2), player.y + player.size / 2 * Math.sin(angle - Math.PI / 2), 5, _objectSpread({}, bullet_start_dir)));
        bulletTimer = o_bulletTimer;
      } else bulletTimer--;
    }
  } //#endregion


  requestAnimationFrame(draw);
}

draw(); //#endregion
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60613" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map