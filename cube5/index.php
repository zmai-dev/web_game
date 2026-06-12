<?php
// 简单PHP入口，输出与 index.html 相同结构，便于在仅支持PHP的主机部署
?><!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <title>五宫格 T 字谜题</title>
    <link rel="stylesheet" href="styles.css?v=<?php echo filemtime(__DIR__ . '/styles.css'); ?>" />
  </head>
  <body>
    <div class="app">
      <h1 class="title">五宫格 T 字谜题</h1>
      <div class="workspace" aria-label="工作区">
        <div class="grid" role="grid" aria-label="T字形五宫格">
          <div class="cell" id="r1c1" role="gridcell" aria-label="行1列1"><span class="label"></span></div>
          <div class="cell" id="r1c2" role="gridcell" aria-label="行1列2"><span class="label"></span></div>
          <div class="cell" id="r1c3" role="gridcell" aria-label="行1列3"><span class="label"></span></div>
          <div class="cell" id="r2c2" role="gridcell" aria-label="行2列2"><span class="label"></span></div>
          <div class="cell" id="r3c2" role="gridcell" aria-label="行3列2"><span class="label"></span></div>
        </div>
        <aside class="sidebar" aria-label="侧栏控制">
          <div class="controls">
            <button id="btnNext" class="btn" aria-label="下一个题目">下一个题目</button>
            <button id="btnAnswer" class="btn secondary" aria-label="显示答案">显示答案</button>
            <button id="btnFullscreen" class="btn" aria-label="全屏显示">全屏显示</button>
          </div>
        </aside>
      </div>
    </div>
    <script src="app.js?v=<?php echo filemtime(__DIR__ . '/app.js'); ?>"></script>
  </body>
  </html>
