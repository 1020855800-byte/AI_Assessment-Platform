/**
 * 翰闻人工智能考评系统 - 需求说明悬浮按钮组件
 * 使用方法：在每个页面的合适位置（如 body 闭合前）定义一个全局变量 `REQUIREMENT_TEXT`，
 * 并引入此脚本，按钮和卡片面板会自动渲染。
 *
 * 例如：
 *   <script>const REQUIREMENT_TEXT = '这是本页面的需求说明...';</script>
 *   <script src="../shared/requirement.js"></script>
 *
 * 如果未定义 REQUIREMENT_TEXT，按钮不会显示。
 */

(function () {
  'use strict';

  var text = typeof REQUIREMENT_TEXT !== 'undefined' ? REQUIREMENT_TEXT : '';

  // 没有需求说明则不渲染
  if (!text) return;

  // 防止重复注入
  if (document.querySelector('.requirement-btn')) return;

  // 创建按钮
  var btn = document.createElement('button');
  btn.className = 'requirement-btn';
  btn.innerHTML = '<i class="fa-solid fa-book"></i><span class="btn-tooltip">需求说明</span>';
  btn.setAttribute('title', '需求说明');

  // 创建面板
  var panel = document.createElement('div');
  panel.className = 'requirement-panel';
  panel.innerHTML =
    '<div class="panel-header"><i class="fa-solid fa-clipboard-list"></i> 需求说明</div>' +
    '<div class="panel-body">' + escapeHtml(text) + '</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // 切换展开/关闭
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = panel.classList.toggle('open');
    btn.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i><span class="btn-tooltip">关闭</span>'
      : '<i class="fa-solid fa-book"></i><span class="btn-tooltip">需求说明</span>';
  });

  // 点击面板外部关闭
  document.addEventListener('click', function (e) {
    if (panel.classList.contains('open') &&
        !panel.contains(e.target) &&
        !btn.contains(e.target)) {
      panel.classList.remove('open');
      btn.innerHTML = '<i class="fa-solid fa-book"></i><span class="btn-tooltip">需求说明</span>';
    }
  });

  // HTML 转义（防止 XSS）
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
