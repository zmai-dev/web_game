// 应用主逻辑（中文注释，控制台日志使用英文）

// 常量：颜色与位置
const COLORS = ['red', 'yellow', 'blue'];
const COLOR_LABELS = { red: '红', yellow: '黄', blue: '蓝' };
const TOP_ROW = ['r1c1', 'r1c2', 'r1c3'];
const MID_COL = ['r1c2', 'r2c2', 'r3c2'];
const ALL_POS = ['r1c1', 'r1c2', 'r1c3', 'r2c2', 'r3c2'];

// 状态容器
let solution = new Map(); // 位置 -> 颜色
let mask = new Set();     // 被隐藏的3个位置
let current = new Map();  // 位置 -> 颜色或 undefined（隐藏）


// 工具：生成颜色排列
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 生成满足约束的完整解：顶行与中列分别三色全排列，且交叉一致
function generateFullSolution() {
  const rowTop = shuffle(COLORS);
  let colMid;
  // 保证交叉一致：中列第一个位置(r1c2)颜色等于顶行中间格颜色(rowTop[1])
  do {
    colMid = shuffle(COLORS);
  } while (colMid[0] !== rowTop[1]);

  const sol = new Map();
  sol.set('r1c1', rowTop[0]);
  sol.set('r1c2', rowTop[1]);
  sol.set('r1c3', rowTop[2]);
  sol.set('r2c2', colMid[1]);
  sol.set('r3c2', colMid[2]);
  return sol;
}

// 生成掩码：随机隐藏2格，保证顶行与中列各至少1格可见
function chooseMask() {
  const all = ALL_POS.slice();
  const allMasks = [];
  // 组合选择：所有从5个位置中选2个的集合
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const m = new Set([all[i], all[j]]);
      const visibleTop = TOP_ROW.filter(p => !m.has(p)).length;
      const visibleMid = MID_COL.filter(p => !m.has(p)).length;
      if (visibleTop >= 1 && visibleMid >= 1) {
        allMasks.push(m);
      }
    }
  }
  const picked = allMasks[Math.floor(Math.random() * allMasks.length)];
  return picked;
}

// 回溯求解：统计满足约束的解数（唯一性校验）
function countSolutions(partial) {
  // partial: Map 位置 -> 颜色或 undefined
  const hidden = ALL_POS.filter(p => partial.get(p) == null);
  let count = 0;

  function allowedColors(pos, assignMap) {
    // 行/列约束：同一行或列不可重复
    const used = new Set();
    if (TOP_ROW.includes(pos)) {
      for (const p of TOP_ROW) {
        const c = assignMap.get(p);
        if (c) used.add(c);
      }
    }
    if (MID_COL.includes(pos)) {
      for (const p of MID_COL) {
        const c = assignMap.get(p);
        if (c) used.add(c);
      }
    }
    return COLORS.filter(c => !used.has(c));
  }

  function dfs(idx, assignMap) {
    if (idx === hidden.length) {
      count++;
      return;
    }
    const pos = hidden[idx];
    const candidates = allowedColors(pos, assignMap);
    for (const c of candidates) {
      assignMap.set(pos, c);
      dfs(idx + 1, assignMap);
      if (count > 1) return; // 早停：超过1个解即可停止
      assignMap.set(pos, undefined);
    }
  }

  dfs(0, new Map(partial));
  return count;
}

// 渲染到UI
function render() {
  for (const pos of ALL_POS) {
    const el = document.getElementById(pos);
    el.classList.remove('red', 'yellow', 'blue', 'hidden');
    const color = current.get(pos);
    const labelEl = el.querySelector('.label');
    if (color) {
      el.classList.add(color);
      if (labelEl) labelEl.textContent = COLOR_LABELS[color] || '';
    } else {
      el.classList.add('hidden');
      if (labelEl) labelEl.textContent = '?';
    }
  }
}

// 生成唯一题目并应用掩码
function generatePuzzle() {
  console.log('Generating new puzzle...');
  let trials = 0;
  while (true) {
    trials++;
    const sol = generateFullSolution();
    const m = chooseMask();
    const partial = new Map();
    for (const p of ALL_POS) {
      partial.set(p, m.has(p) ? undefined : sol.get(p));
    }
    const solutions = countSolutions(partial);
    console.log('Trial', trials, 'solutions:', solutions);
    if (solutions === 1) {
      solution = sol;
      mask = m;
      current = partial;
      render();
      console.log('Generated new puzzle with unique solution.');
      return;
    }
    if (trials > 50) {
      // 容错：若多次未找到唯一题目，仍选当前并继续
      solution = sol;
      mask = m;
      current = partial;
      render();
      console.warn('Fallback: could not guarantee uniqueness within 50 trials.');
      return;
    }
  }
}

// 显示答案：揭示被隐藏的颜色
function revealAnswer() {
  console.log('Reveal answer');
  for (const p of mask) {
    current.set(p, solution.get(p));
  }
  render();
}

// 绑定事件
function bindEvents() {
  const btnNext = document.getElementById('btnNext');
  const btnAnswer = document.getElementById('btnAnswer');
  const btnFullscreen = document.getElementById('btnFullscreen');
  btnNext.addEventListener('click', generatePuzzle);
  btnAnswer.addEventListener('click', revealAnswer);
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
  }
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
  console.log('App init');
  bindEvents();
  // 监听全屏状态变化以更新按钮文案
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
  generatePuzzle();
  updateFullscreenButton();
});

// 全屏相关逻辑
function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function enterFullscreen() {
  const el = document.querySelector('.app') || document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
  console.log('Enter fullscreen');
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  console.log('Exit fullscreen');
}

function toggleFullscreen() {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
}

function updateFullscreenButton() {
  const btn = document.getElementById('btnFullscreen');
  if (!btn) return;
  if (isFullscreen()) {
    btn.textContent = '退出全屏';
    btn.setAttribute('aria-label', '退出全屏');
    document.body.classList.add('is-fullscreen');
  } else {
    btn.textContent = '全屏显示';
    btn.setAttribute('aria-label', '全屏显示');
    document.body.classList.remove('is-fullscreen');
  }
}
