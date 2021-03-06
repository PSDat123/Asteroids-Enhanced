//#region Global varibles
let { sin, cos, atan2, PI, random, abs, sqrt, log } = Math;

let controlKey = {
  up: ["ArrowUp", "KeyW"],
  down: ["ArrowDown", "KeyS"],
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  shoot: ["KeyZ", "LeftMouse"],
  focus: ["ShiftLeft"],
  burst: ["RightMouse"],
};

let canvas = document.getElementById("main-canvas");
let c = canvas.getContext("2d");

let c_width = window.screen.width;
let c_height = window.innerHeight;
canvas.width = c_width;
canvas.height = c_height;
canvas.style.background = "#000000";
c.lineWidth = 3;
c.strokeStyle = "#ffffff";
c.fillStyle = "#ffffff";
c.font = "22px pressStart";

let maxR = 300, //Maximun size of asteroid
  minR = 40, //Minimun size of asteroid
  minVertices = 7, // Minimun vertices of asteroid
  maxVertices = 25, // Maximun vertices of asteroid
  maxMapHeight = 7 * c_height, //Maximun scroll height
  spawnPortion = 0, // Map's portion to start at
  enemyNum = 15, // Number of enemies
  bullet = [], // Array containing all bullet object
  keyPressedPool = new Set(), // Set containing user's inputs
  p_angle = 0, // Previous angle of player (Pointing to mouse)
  angle = 0, // Angle of player (Pointing to mouse)
  translate_x = 0, // Amount x to translate when player moves (Camera Follow)
  translate_y = 0, // Amount y to translate when player moves (Camera Follow)
  o_bulletTimer = 4, // Number of iteration before shooting bullet (bullet per 4 frames)
  bulletTimer = 0, // Count ^
  org_x = 0, // x of top left corner
  org_y = 0, // y of top left corner
  org_player_x = c_width / 2, // Starting X position
  org_player_y = c_height / 1.5, // Starting Y position
  upperBound = (2 / 5) * c_height, // Upper camera bound
  lowerBound = (1 - 2 / 5) * c_height, // Lower camera bound
  player_size = 30, // Player width
  player = {}, // Player object
  enemy = [], // Array containing enemies
  score = 0, // Total score
  scoremult = 1, // Current score multiplier
  enemyInView = new Set(), // Enemies currently in view (for optimisation purpose)
  maxBurstAmmount = 60, // Maximun burst ammount
  curBurstAmmount = 0, // Current possible burst ammount
  whiteRGB = { r: 255, g: 255, b: 255 }, // WHITE
  bulletDamage = 1; //Current damage of bullet

// MODE
let isEndless = 0,
  isHardMode = 0;
//#endregion

//#region Classes
class Bullet {
  static bulletSpeed = 14;
  constructor(
    x,
    y,
    r,
    _dir = { x: 0, y: -Bullet.bulletSpeed },
    _damage = bulletDamage
  ) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.r = r;
    this.img = (() => {
      let can = document.createElement("canvas");
      let _c = can.getContext("2d");
      can.width = r * 2;
      can.height = r * 2;
      _c.fillStyle = "#ffffff";
      _c.beginPath();
      _c.arc(r, r, r, 0, 2 * PI);
      _c.fill();
      return can;
    })();
    this.dir = _dir;
    this.state = 1;
    this.damage = _damage;
  }
  update() {
    this.x += this.dir.x;
    this.y += this.dir.y;
  }
  reset(x, y, _dir = { x: 0, y: -Bullet.bulletSpeed }, _damage = bulletDamage) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.dir = _dir;
    this.state = 1;
    this.damage = _damage;
  }
}
let bullet_start_dir = { x: 0, y: -Bullet.bulletSpeed }; // Starting position of bullet
//#endregion

//#region Misc Fucntions
function ModifiedRandomAboveAvg() {
  let x = random();
  return 4.5 * x ** 3 - 8.3 * x ** 2 + 4.8 * x;
}
function ModifiedRandomBelowAvg() {
  let x = random();
  return 2.2 * x ** 3 - 3 * x ** 2 + 1.8 * x;
}
function getMaxMinCo_Enemy(_enemy) {
  let x_arr = _enemy.data.map((a) => a.x);
  let x_max = Math.max(...x_arr),
    x_min = Math.min(...x_arr);
  let y_arr = _enemy.data.map((b) => b.y);
  let y_max = Math.max(...y_arr),
    y_min = Math.min(...y_arr);

  return {
    xMax: x_max,
    xMin: x_min,
    yMax: y_max,
    yMin: y_min,
  };
}
function normalizeVector(_x, _y) {
  let mag = sqrt(_x ** 2 + _y ** 2);
  return {
    x: _x / mag,
    y: _y / mag,
  };
}
function checkCollision(x1, y1, x2, y2, x3, y3, x4, y4) {
  let dem = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  let uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / dem;
  let uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / dem;
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return {
      x: x1 + uA * (x2 - x1),
      y: y1 + uA * (y2 - y1),
    };
  }
  return null;
}
function checkCollision_Bullet_Enemy(_bullet, _enemy) {
  let xC = _bullet.x,
    yC = _bullet.y;
  let minIndex = -1,
    minDistSq = 0,
    xM = 0,
    yM = 0,
    _nx = 0,
    _ny = 0;
  for (let i = 0, l = _enemy.data.length; i !== l; i++) {
    let xA = _enemy.data[i].x,
      yA = _enemy.data[i].y,
      xB = _enemy.data[(i + 1) % l].x,
      yB = _enemy.data[(i + 1) % l].y;
    let _an = yA - yB,
      _bn = xB - xA,
      a = -_an / _bn,
      b = (_an / _bn) * xA + yA,
      _xM = (xC + a * yC - a * b) / (1 + a * a),
      _yM = (a * a * yC + a * xC + b) / (1 + a * a);
    let distSq = (_xM - xC) * (_xM - xC) + (_yM - yC) * (_yM - yC);
    // c.beginPath();
    // c.arc(_xM, _yM, 10, 0, 2*PI);
    // c.stroke();
    if ((_xM < xA && _xM > xB) || (_xM > xA && _xM < xB)) {
      if (minIndex === -1) {
        minIndex = i;
        minDistSq = distSq;
        (xM = _xM), (yM = _yM);
        (_nx = yA - yB), (_ny = xB - xA);
      } else if (distSq < minDistSq) {
        minIndex = i;
        minDistSq = distSq;
        (xM = _xM), (yM = _yM);
        (_nx = _an), (_ny = _bn);
      }
    }
  }
  let n = normalizeVector(_nx, _ny),
    IM = {
      x: xM - xC,
      y: yM - yC,
    };
  let dotP = IM.x * n.x + IM.y * n.y,
    m = 0;
  if (minDistSq < _bullet.r * _bullet.r) {
    m = _bullet.r - sqrt(minDistSq);
    return {
      x: xC - m * n.x,
      y: yC - m * n.y,
      normal: n,
      index: minIndex,
    };
  }
  return false;
}
function getCentroidOfPolygon(polygon) {
  let signedArea = 0,
    Cx = 0,
    Cy = 0;
  for (let i = 0, l = polygon.length; i !== l; i++) {
    let a =
      polygon[i].x * polygon[(i + 1) % l].y -
      polygon[(i + 1) % l].x * polygon[i].y;
    signedArea += a;
    Cx += (polygon[i].x + polygon[(i + 1) % l].x) * a;
    Cy += (polygon[i].y + polygon[(i + 1) % l].y) * a;
  }
  signedArea *= 0.5;
  let b = 1 / (6 * signedArea);
  Cx *= b;
  Cy *= b;
  return {
    x: Cx,
    y: Cy,
  };
}
function checkIfPolygonSelfIntersect(polygon) {
  for (let i = 0, l = polygon.length; i !== l; i++) {
    if (
      checkCollision(
        polygon[i].x,
        polygon[i].y,
        polygon[(i + 1) % l].x,
        polygon[(i + 1) % l].y,
        polygon[(i + 2) % l].x,
        polygon[(i + 2) % l].y,
        polygon[(i + 3) % l].x,
        polygon[(i + 3) % l].y
      )
    ) {
      return true;
    }
  }
  return false;
}
function getAreaOfPolygon(polygon) {
  let A = 0,
    sg = 1;
  for (let i = 0; i !== 2; i++) {
    for (let j = 0, l = polygon.length; j !== l; j++) {
      A += sg * polygon[(j + i) % l].x * polygon[(j + i + sg) % l].y;
    }
    sg = -1;
  }
  A = 0.5 * abs(A);
  return A;
}

//#endregion

//#region Important Functions
function handleEnemyDeathAndSplit(_enemy, inter_index) {
  //#region Enemy die and split
  if (_enemy.data[inter_index].health > 0) return;
  _enemy.state = 0;
  _enemy.data[inter_index].health = _enemy.o_health;
  _enemy.data[inter_index].g = 255;
  _enemy.data[inter_index].b = 255;
  addPopUp(~~_enemy.o_health, _enemy.data[0].ox, _enemy.data[0].oy, 60);
  score += _enemy.o_health * scoremult;
  let spawned = 0;
  let t = (inter_index + 1 + ~~(_enemy.data.length / 2)) % _enemy.data.length;
  let a = inter_index + 1,
    b = t,
    e1;
  let arr = _enemy.data;
  let oldCenterX = arr[0].ox,
    oldCenterY = arr[0].oy;
  let copy_of_b = { ...arr[b] };
  if (a < b) {
    e1 = arr.splice(
      a,
      b - a + 1,
      {
        ox: arr[0].ox,
        oy: arr[0].oy,
        x: arr[0].ox,
        y: arr[0].oy,
        health: _enemy.o_health,
        ...whiteRGB,
      },
      copy_of_b
    );
  } else {
    e1 = arr.splice(b, a - b, copy_of_b, {
      ox: arr[0].ox,
      oy: arr[0].oy,
      x: arr[0].ox,
      y: arr[0].oy,
      health: _enemy.o_health,
      ...whiteRGB,
    });
  }
  e1.push({
    ox: arr[0].ox,
    oy: arr[0].oy,
    x: arr[0].ox,
    y: arr[0].oy,
    health: _enemy.o_health,
    ...whiteRGB,
  });
  if (e1.length > 3 && !checkIfPolygonSelfIntersect(e1)) {
    let newCenter = getCentroidOfPolygon(e1);
    for (let i = 0; i < e1.length; i++) {
      e1[i].ox = newCenter.x;
      e1[i].oy = newCenter.y;
    }
    let q = 1;
    for (let j = 0; j < enemy.length; j++) {
      if (!enemy[j].state) {
        enemy[j] = new EnemyFromData(e1, _enemy.o_health, {
          x: _enemy.dir.x + (2 * (e1[0].ox - oldCenterX)) / _enemy.maxR,
          y: _enemy.dir.y + (2 * (e1[0].oy - oldCenterY)) / _enemy.maxR,
        });
        if (getAreaOfPolygon(enemy[j].data) < 1800) {
          enemy[j].state = 0;
          spawned--;
        }
        q = 0;
        break;
      }
    }
    if (q) {
      enemy.push(
        new EnemyFromData(e1, _enemy.o_health, {
          x: _enemy.dir.x + (2 * (e1[0].ox - oldCenterX)) / _enemy.maxR,
          y: _enemy.dir.y + (2 * (e1[0].oy - oldCenterY)) / _enemy.maxR,
        })
      );
      if (getAreaOfPolygon(enemy[enemy.length - 1].data) < 1800) {
        enemy[enemy.length - 1].state = 0;
        spawned--;
      }
    }
    spawned++;
  }
  let e2 = arr;
  if (e2.length > 3 && !checkIfPolygonSelfIntersect(e2)) {
    let newCenter = getCentroidOfPolygon(e2);
    for (let i = 0; i < e2.length; i++) {
      e2[i].ox = newCenter.x;
      e2[i].oy = newCenter.y;
    }
    let q = 1;
    for (let j = 0; j < enemy.length; j++) {
      if (!enemy[j].state) {
        enemy[j] = new EnemyFromData(e2, _enemy.o_health, {
          x: _enemy.dir.x + (2 * (e2[0].ox - oldCenterX)) / _enemy.maxR,
          y: _enemy.dir.y + (2 * (e2[0].oy - oldCenterY)) / _enemy.maxR,
        });
        if (getAreaOfPolygon(enemy[j].data) < 1800) {
          enemy[j].state = 0;
          spawned--;
        }
        q = 0;
        break;
      }
    }
    if (q) {
      enemy.push(
        new EnemyFromData(e2, _enemy.o_health, {
          x: _enemy.dir.x + (2 * (e2[0].ox - oldCenterX)) / _enemy.maxR,
          y: _enemy.dir.y + (2 * (e2[0].oy - oldCenterY)) / _enemy.maxR,
        })
      );
      if (getAreaOfPolygon(enemy[enemy.length - 1].data) < 1800) {
        enemy[enemy.length - 1].state = 0;
        spawned--;
      }
    }
    spawned++;
  }

  if (isEndless && !spawned) {
    let q = 1;
    for (let j = 0; j < enemy.length; j++) {
      if (!enemy[j].state) {
        enemy[j] = newRandomEnemy();
        q = 0;
        break;
      }
    }
    if (q) enemy.push(newRandomEnemy());
  }
  //#endregion
}
function handleCollision_Bullet_Enemy(bullet, _enemy) {
  let b_x = bullet.x,
    b_y = bullet.y;
  let inter_x,
    inter_y,
    inter_count = 0,
    inter_index = 0,
    n;
  for (let j = 0, l = _enemy.data.length; j !== l; j++) {
    let x3 = _enemy.data[j].x,
      y3 = _enemy.data[j].y,
      x4 = _enemy.data[(j + 1) % l].x,
      y4 = _enemy.data[(j + 1) % l].y;
    //#region Check how many collision
    let inter = checkCollision(
      b_x,
      b_y,
      bullet.px + _enemy.dir.x,
      bullet.py + _enemy.dir.y,
      x3,
      y3,
      x4,
      y4
    );
    if (inter) {
      inter_index = j;
      inter_count++;
      n = normalizeVector(y3 - y4, x4 - x3);
      inter_x = inter.x;
      inter_y = inter.y;
    }
    //#endregion
  }
  //#region IF HIT
  if (inter_count === 1) {
    let xd = bullet.dir.x,
      yd = bullet.dir.y;
    let t = n.x * xd + n.y * yd;
    if (t >= 0) {
      bullet.dir.x -= 2 * n.x * t - _enemy.dir.x;
      bullet.dir.y -= 2 * n.y * t - _enemy.dir.y;
    } else {
      bullet.dir.x += _enemy.dir.x;
      bullet.dir.y += _enemy.dir.y;
    }
    if (sqrt(_enemy.dir.x ** 2 + _enemy.dir.y ** 2) < player.max_v - 2) {
      _enemy.dir.x += (xd - bullet.dir.x) * (10 / _enemy.maxR ** 2);
      _enemy.dir.y += (yd - bullet.dir.y) * (10 / _enemy.maxR ** 2);
    }
    let _n = normalizeVector(bullet.dir.x, bullet.dir.y);
    1;
    bullet.x = inter_x + _n.x * 0.1;
    bullet.y = inter_y + _n.y * 0.1;
    // bullet.dir.x *= 0.9;
    // bullet.dir.y *= 0.9;

    _enemy.data[inter_index].health -= bullet.damage;
    _enemy.data[inter_index].g = ~~(
      (255 * _enemy.data[inter_index].health) /
      _enemy.o_health
    );
    _enemy.data[inter_index].b = _enemy.data[inter_index].g;
    score += bullet.damage * scoremult;
    bloom(inter_x, inter_y, 12 * (log(bullet.damage) + 1), 10);
    bullet.damage *= sqrt(
      (bullet.dir.x ** 2 + bullet.dir.y ** 2) / (xd ** 2 + yd ** 2)
    );

    handleEnemyDeathAndSplit(_enemy, inter_index);
  } else if (inter_count !== 0) {
    bullet.state = 0;
    _enemy.data[inter_index].health -= bullet.damage;
    _enemy.data[inter_index].g = ~~(
      (255 * _enemy.data[inter_index].health) /
      _enemy.o_health
    );
    _enemy.data[inter_index].b = _enemy.data[inter_index].g;
    score += bullet.damage * scoremult;
    bloom(inter_x, inter_y, 12 * (log(bullet.damage) + 1), 10);
    handleEnemyDeathAndSplit(_enemy, inter_index);
  }
  //#endregion
}
function shootBullet() {
  if (!bulletTimer) {
    let n = 1;
    for (let i = 0; i < bullet.length; i++) {
      if (!bullet[i].state) {
        bullet[i].reset(
          player.x + (player.size / 2) * cos(angle - PI / 2),
          player.y + (player.size / 2) * sin(angle - PI / 2),
          { ...bullet_start_dir }
        );
        n = 0;
        break;
      }
    }
    if (n)
      bullet.push(
        new Bullet(
          player.x + (player.size / 2) * cos(angle - PI / 2),
          player.y + (player.size / 2) * sin(angle - PI / 2),
          5,
          { ...bullet_start_dir }
        )
      );
    player.ax -= bullet_start_dir.x / player_size; // Note: multiply with bullet damage later
    player.ay -= bullet_start_dir.y / player_size; // Note: multiply with bullet damage later
    bulletTimer = o_bulletTimer;
  } else {
    bulletTimer--;
  }
}
function burstBullet() {
  let n = 0,
    randomAngle = 0,
    randomSpeedMult = 1;
  curBurstAmmount = ~~curBurstAmmount;
  for (let i = 0; i < bullet.length; ++i) {
    if (!bullet[i].state) {
      if (n === curBurstAmmount) break;
      randomAngle = PI * (-1 / 6 + random() * (1 / 3));
      randomSpeedMult = 1 + random();
      let newDirX =
          (bullet_start_dir.x * cos(randomAngle) -
            bullet_start_dir.y * sin(randomAngle)) *
          randomSpeedMult,
        newDirY =
          (bullet_start_dir.x * sin(randomAngle) +
            bullet_start_dir.y * cos(randomAngle)) *
          randomSpeedMult;
      bullet[i].reset(
        player.x + (player.size / 2) * cos(angle - PI / 2),
        player.y + (player.size / 2) * sin(angle - PI / 2),
        {
          x: newDirX,
          y: newDirY,
        },
        (bulletDamage * sqrt(newDirX ** 2 + newDirY ** 2)) / Bullet.bulletSpeed
      );
      ++n;
      player.ax -= bullet_start_dir.x / player_size; // Note: multiply with bullet damage later
      player.ay -= bullet_start_dir.y / player_size; // Note: multiply with bullet damage later
    }
  }
  for (let i = n; i < curBurstAmmount; ++i) {
    randomAngle = PI * (random() / 2 - 0.25);
    randomSpeedMult = 1 + random();
    let newDirX =
        (bullet_start_dir.x * cos(randomAngle) -
          bullet_start_dir.y * sin(randomAngle)) *
        randomSpeedMult,
      newDirY =
        (bullet_start_dir.x * sin(randomAngle) +
          bullet_start_dir.y * cos(randomAngle)) *
        randomSpeedMult;
    bullet.push(
      new Bullet(
        player.x +
          (player.size / 2) * cos(angle - PI / 2 + random() * 2 * PI - PI),
        player.y +
          (player.size / 2) * sin(angle - PI / 2 + random() * 2 * PI - PI),
        5,
        {
          x: newDirX,
          y: newDirY,
        },
        (bulletDamage * sqrt(newDirX ** 2 + newDirY ** 2)) / Bullet.bulletSpeed
      )
    );
    player.ax -= bullet_start_dir.x / player_size; // Note: multiply with bullet damage later
    player.ay -= bullet_start_dir.y / player_size; // Note: multiply with bullet damage later
  }
  curBurstAmmount = 0;
}
//#endregion

//#region Creating Enemy
function Enemy(
  o_x,
  o_y,
  min_v = 5,
  max_v = 10,
  min_r = 20,
  max_r = 40,
  _dir = { _x: 0, _y: 0 }
) {
  let nVertices = min_v + ~~(random() * (max_v - min_v));
  let _a = (2 * PI) / nVertices;
  let EnemyData = [];
  let _maxR = 0;
  for (let i = 0; i < nVertices; i++) {
    let _r = min_r + ModifiedRandomAboveAvg() * (max_r - min_r);
    if (_r > _maxR) _maxR = _r;
    EnemyData.push({
      ox: o_x,
      oy: o_y,
      x: o_x + _r * cos(i * _a),
      y: o_y + _r * sin(i * _a),
      ...whiteRGB,
    });
  }
  let newCenter = getCentroidOfPolygon(EnemyData);
  let _health = ~~(getAreaOfPolygon(EnemyData) / (150 * (nVertices / 2)));
  for (let i = 0; i < EnemyData.length; i++) {
    EnemyData[i].ox = newCenter.x;
    EnemyData[i].oy = newCenter.y;
    EnemyData[i].health = _health;
  }

  return {
    data: EnemyData,
    dir: {
      x: _dir._x,
      y: _dir._y,
    },
    maxR: _maxR,
    o_health: _health,
    state: 1,
  };
}
function EnemyFromData(positon_data, _health, _dir = { x: 2, y: 0 }) {
  let _enemy = {
    data: positon_data,
    dir: _dir,
    state: 1,
  };
  let a = getMaxMinCo_Enemy(_enemy);
  _enemy.top = a.yMin;
  _enemy.bottom = a.yMax;
  _enemy.right = a.xMax;
  _enemy.left = a.xMin;
  _enemy.maxR = sqrt(
    ((a.xMax - a.xMin) / 2) ** 2 + ((a.yMax - a.yMin) / 2) ** 2
  );
  _enemy.o_health = _health;
  // for(let i = 0; i < _enemy.data.length; ++i){
  //   let h = _enemy.data[i].health;
  //   _enemy.data[i].health = (h > _health ? _health : h);
  // }
  return _enemy;
}
function newRandomEnemy() {
  let _r = minR + ModifiedRandomBelowAvg() * (maxR - minR);
  let e = new Enemy(
    maxR + random() * (c_width - maxR),
    -(maxMapHeight - spawnPortion * c_height) + maxMapHeight * random(),
    minVertices,
    maxVertices,
    _r * 0.3,
    _r,
    {
      _x: -6 + random() * 12,
      _y: -6 + random() * 12,
    }
  );
  let a = getMaxMinCo_Enemy(e);
  e.top = a.yMin;
  e.bottom = a.yMax;
  e.right = a.xMax;
  e.left = a.xMin;
  return e;
}
//#endregion

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
    update: function () {
      this.vx += this.ax * (abs(this.vx) <= this.max_v);
      this.x +=
        this.vx *
        ((this.x > org_x || this.vx > 0) &&
          (this.x < org_x + c_width || this.vx < 0));
      this.vy += this.ay * (abs(this.vy) <= this.max_v);
      this.y += this.vy;

      this.ax = 0;
      this.ay = 0;
      this.vx *= 0.8;
      this.vy *= 0.8;
    },
    img: (() => {
      let can = document.createElement("canvas");
      let _c = can.getContext("2d");
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
    })(),
  };
}
function resetPlayer() {
  let px = player.x;
  let py = player.y;

  player = createPlayer();
  player.px = px;
  player.py = py;
}
//#endregion

//#region Update and Drawing Functions
function drawEnemy(_enemy) {
  let l = _enemy.data.length;
  c.beginPath();
  c.moveTo(_enemy.data[0].x, _enemy.data[0].y);
  for (let i = 1; i < l; i++) {
    c.lineTo(_enemy.data[i].x, _enemy.data[i].y);
  }
  c.closePath();
  c.stroke();

  for (let i = 0; i < l; i++) {
    if (_enemy.data[i].g !== 255 && _enemy.data[i].b !== 255) {
      c.beginPath();
      c.strokeStyle = `rgb(255,${_enemy.data[i].g},${_enemy.data[i].b})`;
      c.moveTo(_enemy.data[i].x, _enemy.data[i].y);
      c.lineTo(_enemy.data[(i + 1) % l].x, _enemy.data[(i + 1) % l].y);
      c.stroke();
    }
  }
  c.strokeStyle = "#ffffff";
  // c.fill();
}
function updateEnemy(_enemy) {
  let a = _enemy.dir.x,
    b = _enemy.dir.y;
  for (let i = 0; i < _enemy.data.length; i++) {
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
}

//#region SFX
function addPopUp(text, x, y, frame, alpha = 1) {
  if (frame === 0) return;
  c.globalAlpha = alpha;
  c.fillText(text, x, y);
  requestAnimationFrame(() => {
    addPopUp(text, x, y - 1, frame - 1, alpha * 0.99);
  });
}
function bloom(x, y, r, frame, alpha = 1) {
  if (frame === 0 || r < 0) return;
  c.globalAlpha = alpha;
  c.beginPath();
  c.arc(x, y, r, 0, 2 * PI);
  c.fill();
  requestAnimationFrame(() => {
    bloom(x, y, r - 1, frame - 1, alpha * 0.9);
  });
}
//#endregion

//#endregion

//#region Event Handling
canvas.addEventListener("mousemove", (event) => {
  p_angle = angle;
  angle =
    atan2(event.clientY + org_y - player.y, event.clientX + org_x - player.x) +
    PI / 2;
  bullet_start_dir.x = Bullet.bulletSpeed * sin(angle);
  bullet_start_dir.y = -Bullet.bulletSpeed * cos(angle);
});
let playerAccel = 2;
document.addEventListener("keydown", (event) => {
  keyPressedPool.add(event.code);
});
document.addEventListener("keyup", (event) => {
  keyPressedPool.delete(event.code);
});
document.addEventListener("mousedown", (event) => {
  if (event.button === 0) keyPressedPool.add("LeftMouse");
  else if (event.button === 2) keyPressedPool.add("RightMouse");
});
document.addEventListener("mouseup", (event) => {
  if (event.button === 0) keyPressedPool.delete("LeftMouse");
  else if (event.button === 2) keyPressedPool.delete("RightMouse");
});
document.addEventListener("visibilitychange", () => {
  keyPressedPool.clear();
});
document.oncontextmenu = () => false;
window.addEventListener("resize", () => {
  if (window.innerHeight !== c_height) {
    location.reload();
  }
});

//#endregion

//#region Set up
function setup() {
  score = 0;
  enemy = [
    (() => {
      let _r = minR + ModifiedRandomBelowAvg() * (maxR - minR);
      let e = Enemy(
        c_width / 2,
        c_height / 5,
        minVertices,
        maxVertices,
        _r / 4,
        _r,
        {
          _x: -1 + random() * 2,
          _y: -1 + random() * 2,
        }
      );
      let a = getMaxMinCo_Enemy(e);
      e.top = a.yMin;
      e.bottom = a.yMax;
      e.right = a.xMax;
      e.left = a.xMin;
      return e;
    })(),
  ];
  for (let i = 1; i < enemyNum; i++) {
    enemy.push(newRandomEnemy());
  }
  player = createPlayer();
}
setup();
//#endregion

//#region Main Loop
// __________________________________________MAIN_LOOP__________________________________________
function draw() {
  requestAnimationFrame(draw);
  player.py = player.y;
  player.px = player.x;
  c.globalAlpha = 1;
  c.clearRect(org_x, org_y, c_width, c_height);

  curBurstAmmount += 0.4;
  if (curBurstAmmount > maxBurstAmmount) curBurstAmmount = maxBurstAmmount;

  player.update();
  for (let i = 0; i < enemy.length; i++) {
    if (enemy[i].state) {
      updateEnemy(enemy[i]);
      if (enemy[i].bottom > org_y - 10 && enemy[i].top < org_y + c_height + 10)
        enemyInView.add(i);
      else enemyInView.delete(i);
    } else enemyInView.delete(i);
  }
  //#region Draw Stuffs
  for (let i of enemyInView) {
    drawEnemy(enemy[i]);
  }
  drawPlayer(player);
  c.fillText(`Score(x${scoremult}):${~~score}`, org_x + 10, org_y + 32);
  //#endregion

  //#region Enemy Wrap Around
  for (let i = 0; i !== enemy.length; i++) {
    let left = enemy[i].left;
    let right = enemy[i].right;
    let top = enemy[i].top;
    let bottom = enemy[i].bottom;
    if (left > org_x + c_width) {
      let a = right - org_x;
      enemy[i].left -= a;
      enemy[i].right -= a;
      for (let j = 0; j !== enemy[i].data.length; j++) {
        enemy[i].data[j].x -= a;
        enemy[i].data[j].ox -= a;
      }
    } else if (right < org_x) {
      let a = c_width + org_x - left;
      enemy[i].left += a;
      enemy[i].right += a;
      for (let j = 0; j !== enemy[i].data.length; j++) {
        enemy[i].data[j].x += a;
        enemy[i].data[j].ox += a;
      }
    }
    if (bottom < -maxMapHeight) {
      let a = c_height - top;
      enemy[i].top += a;
      enemy[i].bottom += a;
      for (let j = 0; j !== enemy[i].data.length; j++) {
        enemy[i].data[j].y += a;
        enemy[i].data[j].oy += a;
      }
    } else if (top > c_height) {
      let a = maxMapHeight + bottom;
      enemy[i].top -= a;
      enemy[i].bottom -= a;
      for (let j = 0; j !== enemy[i].data.length; j++) {
        enemy[i].data[j].y -= a;
        enemy[i].data[j].oy -= a;
      }
    }
  }
  //#endregion

  //#region Draw bullets & Collision detection between bullets & others
  for (let i = 0; i < bullet.length; i++) {
    if (bullet[i].state) {
      drawBullet(bullet[i]);
      bullet[i].px = bullet[i].x;
      bullet[i].py = bullet[i].y;
      bullet[i].update();

      let b_x = bullet[i].x,
        b_y = bullet[i].y;
      //#region Player Collision Detection
      if (isHardMode) {
        let squareDist = (player.x - b_x) ** 2 + (player.y - b_y) ** 2;
        if (squareDist <= (player.size / 3 + bullet[i].r) ** 2) {
          resetPlayer(player);
        }
      }
      //#endregion

      //#region Enemy Collsion Detection
      for (let m of enemyInView) {
        if (!enemy[m].state) continue;
        if (
          !(
            b_x > enemy[m].left - 10 &&
            b_x < enemy[m].right + 10 &&
            b_y < enemy[m].bottom + 10 &&
            b_y > enemy[m].top - 10
          )
        )
          continue;
        // enemiesToShowHealth[m] = 10;
        handleCollision_Bullet_Enemy(bullet[i], enemy[m]);
      }
      //#endregion

      if (
        b_y < org_y - bullet[i].r ||
        b_y > org_y + c_height ||
        b_x < org_x ||
        b_x > org_x + c_width ||
        sqrt(bullet[i].dir.x ** 2 + bullet[i].dir.y ** 2) < 0.65
      ) {
        bullet[i].state = 0;
        continue;
      }
      // drawBullet(bullet[i]);
    }
  }
  //#endregion

  //#region Player collision with enemies
  for (let m of enemyInView) {
    if (!enemy[m].state) continue;
    let player_x = player.x,
      player_y = player.y;
    if (
      player_x > enemy[m].left - 10 &&
      player_x < enemy[m].right + 10 &&
      player_y < enemy[m].bottom + 10 &&
      player_y > enemy[m].top - 10
    ) {
      for (let j = 0, l = enemy[m].data.length; j !== l; j++) {
        let x3 = enemy[m].data[j].x,
          y3 = enemy[m].data[j].y,
          x4 = enemy[m].data[(j + 1) % l].x,
          y4 = enemy[m].data[(j + 1) % l].y;
        if (
          checkCollision(
            player_x,
            player_y,
            player.px + enemy[m].dir.x,
            player.py + enemy[m].dir.y,
            x3,
            y3,
            x4,
            y4
          )
        ) {
          resetPlayer(player);
          break;
        }
      }
    }
  }
  //#endregion

  //#region Camera moves with player
  if (player.py !== player.y || player.px !== player.x) {
    translate_x = (player.px - player.x) * 0.1;

    if (player.y < org_y + upperBound || player.y > org_y + lowerBound) {
      translate_y = player.py - player.y;
    } else {
      translate_y = 0;
    }
    if (player.y >= lowerBound) translate_y = org_y;
    else if (player.y <= -maxMapHeight + upperBound)
      translate_y = org_y + maxMapHeight;
    org_x -= translate_x;
    org_y -= translate_y;
    c.translate(translate_x, translate_y);
  }
  //#endregion

  //#region Input check
  if (keyPressedPool.size) {
    if (controlKey.focus.some((x) => keyPressedPool.has(x))) {
      player.max_v = 4;
      o_bulletTimer = 2;
    } else {
      player.max_v = 8;
      o_bulletTimer = 4;
    }

    if (controlKey.up.some((x) => keyPressedPool.has(x)))
      player.ay = -playerAccel;
    if (controlKey.down.some((x) => keyPressedPool.has(x)))
      player.ay = playerAccel;
    if (controlKey.left.some((x) => keyPressedPool.has(x))) {
      player.ax = -playerAccel;
    }
    if (controlKey.right.some((x) => keyPressedPool.has(x)))
      player.ax = playerAccel;
    if (controlKey.shoot.some((x) => keyPressedPool.has(x))) {
      shootBullet();
    }
    if (controlKey.burst.some((x) => keyPressedPool.has(x))) {
      burstBullet();
    }
  }
  //#endregion
}
draw();
//#endregion
