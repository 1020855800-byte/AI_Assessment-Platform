/**
 * 翰闻人工智能考评系统 - 公共侧边栏组件
 * 使用方法：在每个页面中定义一个全局变量 `CURRENT_PAGE` 为页面对应的 key，
 * 然后引入此脚本，侧边栏和顶部导航会自动渲染。
 *
 * 例如：<script>const CURRENT_PAGE = 'dashboard';</script>
 *       <script src="../shared/sidebar.js"></script>
 */

// ===== 菜单配置 =====
// 根据 "side" 属性区分不同端的菜单
const MENU_CONFIGS = {
  system: {
    logo: '翰闻考评管理后台',
    breadcrumb: '系统管理',
    siteName: '翰闻人工智能考评管理后台',
    menuGroups: [
      {
        title: '概览',
        items: [
          { key: 'dashboard', label: '首页', icon: 'fa-solid fa-chart-pie', href: 'dashboard.html' }
        ]
      },
      {
        title: '账号管理',
        items: [
          { key: 'tenants', label: '租户管理', icon: 'fa-solid fa-building', href: 'tenants.html' }
        ]
      }
    ]
  },
  school: {
    logo: '翰闻数据标注实训管理后台',
    breadcrumb: '机构管理',
    siteName: '翰闻数据标注实训管理后台',
    menuGroups: [
      {
        title: '概览',
        items: [
          { key: 'dashboard', label: '首页', icon: 'fa-solid fa-chart-pie', href: 'dashboard.html' }
        ]
      },
      {
        title: '考试管理',
        items: [
          { key: 'exam-plans', label: '考试计划', icon: 'fa-solid fa-pen-to-square', href: 'exam-plans.html' }
        ]
      },
      {
        title: '系统设置',
        items: [
          { key: 'settings', label: '账号设置', icon: 'fa-solid fa-gear', href: 'settings.html' }
        ]
      }
    ]
  }
};

// ===== 根据当前页面推断所属端 =====
function detectSide() {
  const path = window.location.pathname;
  if (path.includes('/system/')) return 'system';
  if (path.includes('/school/')) return 'school';
  return null;
}

// ===== 工具函数 =====
function getCurrentPage() {
  if (typeof CURRENT_PAGE !== 'undefined') return CURRENT_PAGE;
  // fallback: 从 URL 文件名推断
  const file = window.location.pathname.split('/').pop() || '';
  const map = {
    'dashboard.html': 'dashboard',
    'tenants.html': 'tenants',
    'exam-plans.html': 'exam-plans',
    'exam-plan-detail.html': 'exam-plan-detail',
    'settings.html': 'settings'
  };
  return map[file] || 'dashboard';
}

function getConfig() {
  const side = detectSide();
  return MENU_CONFIGS[side] || MENU_CONFIGS.system;
}

// ===== 渲染侧边栏 =====
function renderSidebar() {
  const config = getConfig();
  const currentPage = getCurrentPage();

  let menuHTML = '';
  config.menuGroups.forEach(group => {
    menuHTML += `<div class="menu-section">${group.title}</div>`;
    group.items.forEach(item => {
      const active = item.key === currentPage ? ' active' : '';
      menuHTML += `<a class="menu-item${active}" href="${item.href}">
        <i class="${item.icon}"></i>
        <span>${item.label}</span>
      </a>`;
    });
  });

  const sidebarHTML = `
    <div class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <i class="fa-solid fa-robot"></i>
        </div>
        <span class="logo-text">${config.logo}</span>
      </div>
      <div class="sidebar-menu">
        ${menuHTML}
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

// ===== 渲染顶部导航 =====
function renderTopbar() {
  const config = getConfig();

  // 页面名称映射
  const pageNameMap = {
    dashboard: '首页',
    tenants: '租户管理',
    'exam-plans': '考试计划',
    'exam-plan-detail': '考试计划详情',
    settings: '账号设置'
  };
  const currentPage = getCurrentPage();
  const pageName = pageNameMap[currentPage] || '首页';

  const topbarHTML = `
    <div class="topbar">
      <div class="topbar-left">
        <div class="breadcrumb">
          ${config.siteName} / <span>${pageName}</span>
        </div>
      </div>
      <div class="topbar-right">
        ${detectSide() === 'school' ? `
        <div class="account-expiry" title="账号到期时间">
          <i class="fa-regular fa-calendar-check"></i>
          <span class="expiry-date">2026-06-12</span>
          <span class="expiry-remain">剩余 <strong>2</strong> 天到期</span>
        </div>` : ''}
        <button class="notification-btn" title="消息通知">
          <i class="fa-regular fa-bell"></i>
          <span class="notification-dot"></span>
        </button>
        <div class="topbar-user" onclick="toggleUserMenu(event)">
          <div class="avatar">A</div>
          <span class="user-name">管理员</span>
          <i class="fa-solid fa-chevron-down" style="font-size:10px;color:#888;"></i>
        </div>
        <div class="user-dropdown" id="userDropdown">
          <div class="dropdown-header">
            <div class="dropdown-avatar">A</div>
            <div class="dropdown-user-info">
              <div class="dropdown-user-name">管理员</div>
              <div class="dropdown-user-role">系统管理员</div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item dropdown-item-danger" href="javascript:void(0)" onclick="handleLogout()">
            <i class="fa-solid fa-right-from-bracket"></i> 退出登录
          </a>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', topbarHTML);
}

// ===== 用户下拉菜单切换 =====
function toggleUserMenu(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');

  // 点击其他地方关闭
  if (dropdown.classList.contains('show')) {
    document.addEventListener('click', closeUserMenuOnOutside);
  } else {
    document.removeEventListener('click', closeUserMenuOnOutside);
  }
}

function closeUserMenuOnOutside(e) {
  const dropdown = document.getElementById('userDropdown');
  const userBtn = document.querySelector('.topbar-user');
  if (!dropdown || (!dropdown.contains(e.target) && !userBtn?.contains(e.target))) {
    dropdown.classList.remove('show');
    document.removeEventListener('click', closeUserMenuOnOutside);
  }
}

function handleMenuClick(label) {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) dropdown.classList.remove('show');
  document.removeEventListener('click', closeUserMenuOnOutside);
  showToast('功能开发中：' + label, 'info');
}

function handleLogout() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) dropdown.classList.remove('show');
  document.removeEventListener('click', closeUserMenuOnOutside);
  // 退出登录：跳转到登录页
  window.location.href = 'index.html';
}

// ===== 模拟 toast（供 handleMenuClick 使用） =====
function showToast(msg, type) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  const colors = { success: '#52c41a', error: '#ff4d4f', info: '#1677ff', warning: '#fa8c16' };
  el.style.cssText = `padding:10px 20px;border-radius:6px;background:${colors[type] || '#1677ff'};color:#fff;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:slideIn 0.3s ease;`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 2500);
}

// ===== 初始化 =====
(function init() {
  renderSidebar();
  renderTopbar();

  // 计算账号到期剩余天数
  const expiryEls = document.querySelectorAll('.account-expiry');
  if (expiryEls.length) {
    const expiryStr = '2026-06-12';
    const now = new Date();
    const expiry = new Date(expiryStr + 'T23:59:59');
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    expiryEls.forEach(el => {
      el.querySelector('.expiry-date').textContent = expiryStr;
      el.querySelector('.expiry-remain').innerHTML = diff > 0
        ? `剩余 <strong>${diff}</strong> 天到期`
        : diff === 0
          ? '<strong>今天到期</strong>'
          : '<strong>已过期</strong>';
    });
  }
})();
