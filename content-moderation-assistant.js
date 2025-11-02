javascript:(function() {
  'use strict';

  const TEST_MODE = false;

  const REPORTING_PATH = {
    step1: { 
      selector: '[aria-labelledby="dialog_title"] [role="listitem"] span', 
      text: 'Violent, hateful or disturbing content'
    },
    step2: { 
      selector: '[aria-labelledby="dialog_title"] [role="listitem"] span', 
      text: 'Promoting hate'
    },
    step3: { 
      selector: '[aria-labelledby="dialog_title"] [role="listitem"] span', 
      text: 'Posting hateful speech'
    }
  };

  const SELECTORS = {
    actionsButton: '[aria-label="Actions for this post"]',
    dialog: '[role="dialog"]',
    menuItem: '[role="menuitem"]',
    menuItemSpan: '[role="menuitem"] span',
    tooltip: '[role="tooltip"]',
    closeButton: '[aria-label="Close"]',
    submitButton: '[aria-label="Submit"]',
    nextButton: '[aria-label="Next"]',
    doneButton: '[aria-label="Done"]'
  };

  const TIMING = {
    afterClickAll: 1000,
    betweenSteps: 1200,
    afterDone: 2000,
    finalWait: 2500,
    dialogCleanup: 3000,
    scrollForContent: 600,
    contentSettle: 1000,
    scrollAmount: 1500,
    betweenCycles: 3000
  };

  const SCROLL_CONFIG = {
    scrollBehavior: 'smooth',
    continuousScrollAttempts: 5
  };

  const ATTRIBUTES = {
    processed: 'data-processed'
  };

  const stats = {
    startTime: Date.now(),
    totalClicks: 0,
    peakBatchSize: 0,
    batchSizes: [],
    scrollCount: 0,
    successCount: 0,
    cycleCount: 0
  };

  let isDarkMode = true;

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'moderation-assistant-overlay';
    overlay.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --bg-primary: #1a1d29;
          --bg-secondary: #0f1419;
          --bg-card: rgba(255, 255, 255, 0.03);
          --bg-card-hover: rgba(255, 255, 255, 0.05);
          --border-color: rgba(255, 255, 255, 0.08);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.6);
          --text-tertiary: rgba(255, 255, 255, 0.4);
          --accent-primary: #3b82f6;
          --accent-success: #10b981;
          --accent-error: #ef4444;
          --accent-warning: #f59e0b;
          --shadow-color: rgba(0, 0, 0, 0.5);
          --log-success-bg: rgba(16, 185, 129, 0.1);
          --log-error-bg: rgba(239, 68, 68, 0.1);
          --log-warning-bg: rgba(245, 158, 11, 0.1);
          --log-info-bg: rgba(59, 130, 246, 0.1);
          --log-cycle-bg: rgba(168, 85, 247, 0.1);
        }
        
        .light-mode {
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --bg-card: rgba(0, 0, 0, 0.02);
          --bg-card-hover: rgba(0, 0, 0, 0.04);
          --border-color: rgba(0, 0, 0, 0.08);
          --text-primary: #111827;
          --text-secondary: rgba(0, 0, 0, 0.6);
          --text-tertiary: rgba(0, 0, 0, 0.4);
          --accent-primary: #2563eb;
          --accent-success: #059669;
          --accent-error: #dc2626;
          --accent-warning: #d97706;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --log-success-bg: rgba(16, 185, 129, 0.15);
          --log-error-bg: rgba(239, 68, 68, 0.15);
          --log-warning-bg: rgba(245, 158, 11, 0.15);
          --log-info-bg: rgba(59, 130, 246, 0.15);
          --log-cycle-bg: rgba(168, 85, 247, 0.15);
        }
        
        #moderation-assistant-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 999999;
          pointer-events: none;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        #moderation-assistant-panel {
          position: fixed;
          top: 0;
          left: 0;
          width: 420px;
          height: 100vh;
          background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          box-shadow: 4px 0 24px var(--shadow-color);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-color);
          overflow: hidden;
          pointer-events: auto;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        
        #moderation-assistant-panel.hidden {
          transform: translateX(-100%);
        }
        
        #toggle-button {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-left: none;
          border-radius: 0 8px 8px 0;
          padding: 20px 10px;
          cursor: pointer;
          z-index: 1000000;
          pointer-events: auto;
          transition: all 0.3s ease;
          writing-mode: vertical-rl;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: none;
        }
        
        #toggle-button.visible {
          display: block;
        }
        
        #toggle-button:hover {
          background: var(--bg-card);
          transform: translateY(-50%) translateX(5px);
        }
        
        #moderation-assistant-header {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-content {
          flex: 1;
        }
        
        #moderation-assistant-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .title-icon {
          font-size: 18px;
        }
        
        #moderation-assistant-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }
        
        .header-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .theme-toggle {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 8px 10px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 16px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .theme-toggle:hover {
          background: var(--bg-card-hover);
        }
        
        .hide-button {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .hide-button:hover {
          background: var(--bg-card-hover);
        }
        
        #moderation-assistant-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 20px 24px;
          background: rgba(0, 0, 0, 0.02);
          border-bottom: 1px solid var(--border-color);
        }
        
        .stat-item {
          text-align: center;
          padding: 16px;
          background: var(--bg-card);
          border-radius: 8px;
          border: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }
        
        .stat-item:hover {
          background: var(--bg-card-hover);
          transform: translateY(-2px);
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--accent-primary);
          display: block;
          font-variant-numeric: tabular-nums;
        }
        
        .stat-label {
          font-size: 11px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 6px;
          display: block;
          font-weight: 600;
        }
        
        #performance-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          padding: 16px 24px;
          background: rgba(0, 0, 0, 0.015);
          border-bottom: 1px solid var(--border-color);
        }
        
        .perf-item {
          text-align: center;
          font-size: 10px;
          color: var(--text-tertiary);
          padding: 10px;
          background: var(--bg-card);
          border-radius: 6px;
        }
        
        .perf-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--accent-success);
          display: block;
        }
        
        #progress-bars {
          padding: 16px 24px;
          background: rgba(0, 0, 0, 0.015);
          border-bottom: 1px solid var(--border-color);
        }
        
        .progress-bar-container {
          margin-bottom: 0;
        }
        
        .progress-label {
          font-size: 11px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          font-weight: 600;
        }
        
        .progress-bar {
          height: 6px;
          background: var(--bg-card);
          border-radius: 3px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), #2563eb);
          border-radius: 3px;
          transition: width 0.5s ease;
        }
        
        #moderation-assistant-log {
          flex: 1;
          overflow-y: auto;
          padding: 16px 24px;
          font-size: 12px;
          line-height: 1.6;
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.01);
        }
        
        #moderation-assistant-log::-webkit-scrollbar {
          width: 6px;
        }
        
        #moderation-assistant-log::-webkit-scrollbar-track {
          background: var(--bg-card);
        }
        
        #moderation-assistant-log::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
        
        .log-entry {
          padding: 8px 12px;
          margin-bottom: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .log-entry.success {
          background: var(--log-success-bg);
        }
        
        .log-entry.error {
          background: var(--log-error-bg);
        }
        
        .log-entry.warning {
          background: var(--log-warning-bg);
        }
        
        .log-entry.info {
          background: var(--log-info-bg);
        }
        
        .log-entry.cycle {
          background: var(--log-cycle-bg);
          font-weight: 600;
        }
        
        .log-entry.loading {
          background: var(--log-info-bg);
        }
        
        .log-timestamp {
          color: var(--text-tertiary);
          font-size: 10px;
          font-weight: 500;
          min-width: 70px;
        }
        
        .log-icon {
          font-size: 12px;
          min-width: 16px;
          text-align: center;
        }
        
        .log-icon.spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .log-message {
          flex: 1;
          font-size: 12px;
        }
        
        .log-dots::after {
          content: '';
          animation: dots 1.5s steps(4, end) infinite;
        }
        
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
        
        #moderation-assistant-controls {
          padding: 20px 24px;
          background: rgba(0, 0, 0, 0.02);
          border-top: 1px solid var(--border-color);
        }
        
        .control-btn {
          width: 100%;
          padding: 14px 20px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(239, 68, 68, 0.1);
          color: var(--accent-error);
          font-family: 'Inter', sans-serif;
        }
        
        .control-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
        }
      </style>
      
      <div id="moderation-assistant-panel">
        <div id="moderation-assistant-header">
          <div class="header-content">
            <div id="moderation-assistant-title">
              <span class="title-icon">🛡️</span>
              Content Moderation Tool
            </div>
            <div id="moderation-assistant-subtitle">
              Automated violation reporting assistant
            </div>
          </div>
          <div class="header-controls">
            <button class="theme-toggle" id="theme-toggle-btn" title="Toggle theme">
              <span id="theme-icon">🌙</span>
            </button>
            <button class="hide-button" id="hide-panel-btn">◀</button>
          </div>
        </div>
        
        <div id="moderation-assistant-stats">
          <div class="stat-item">
            <span class="stat-value" id="stat-processed">0</span>
            <span class="stat-label">Reported</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" id="stat-cycle">0</span>
            <span class="stat-label">Cycles</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" id="stat-batch">0</span>
            <span class="stat-label">Last Batch</span>
          </div>
          <div class="stat-item">
            <span class="stat-value" id="stat-status">ACTIVE</span>
            <span class="stat-label">Status</span>
          </div>
        </div>
        
        <div id="performance-stats">
          <div class="perf-item">
            <span class="perf-value" id="perf-cps">0.0</span>
            <span>Actions/s</span>
          </div>
          <div class="perf-item">
            <span class="perf-value" id="perf-uptime">0s</span>
            <span>Uptime</span>
          </div>
          <div class="perf-item">
            <span class="perf-value" id="perf-peak">0</span>
            <span>Peak</span>
          </div>
          <div class="perf-item">
            <span class="perf-value" id="perf-scrolls">0</span>
            <span>Scrolls</span>
          </div>
        </div>
        
        <div id="progress-bars">
          <div class="progress-bar-container">
            <div class="progress-label">
              <span>Current Cycle</span>
              <span id="cycle-progress-percent">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="cycle-progress-fill" style="width: 0%"></div>
            </div>
          </div>
        </div>
        
        <div id="moderation-assistant-log"></div>
        
        <div id="moderation-assistant-controls">
          <button class="control-btn" id="stop-btn">
            ⏹️ Stop Process
          </button>
        </div>
      </div>
      
      <div id="toggle-button">
        Show Panel
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('stop-btn').addEventListener('click', () => window.moderationAssistant.stop());
    document.getElementById('hide-panel-btn').addEventListener('click', () => window.moderationAssistant.togglePanel());
    document.getElementById('toggle-button').addEventListener('click', () => window.moderationAssistant.togglePanel());
    document.getElementById('theme-toggle-btn').addEventListener('click', () => window.moderationAssistant.toggleTheme());
    
    return overlay;
  }

  const UILogger = {
    log(message, type = 'info', isLoading = false) {
      const logContainer = document.getElementById('moderation-assistant-log');
      if (!logContainer) return;
      
      const timestamp = new Date().toLocaleTimeString();
      const icons = { 
        success: '✓', 
        error: '✗', 
        warning: '⚠', 
        info: '→', 
        cycle: '⟳',
        loading: '◉'
      };
      
      const entry = document.createElement('div');
      entry.className = `log-entry ${isLoading ? 'loading' : type}`;
      
      const iconClass = isLoading ? 'log-icon spinner' : 'log-icon';
      const messageClass = isLoading ? 'log-message log-dots' : 'log-message';
      
      entry.innerHTML = `
        <span class="log-timestamp">${timestamp}</span>
        <span class="${iconClass}">${icons[isLoading ? 'loading' : type] || '•'}</span>
        <span class="${messageClass}">${message}</span>
      `;
      
      logContainer.appendChild(entry);
      logContainer.scrollTop = logContainer.scrollHeight;
      
      const entries = logContainer.querySelectorAll('.log-entry');
      if (entries.length > 100) entries[0].remove();
      
      console.log(`[${type.toUpperCase()}] ${message}`);
      
      return entry;
    },
    
    loading(msg) { return this.log(msg, 'info', true); },
    success(msg) { this.log(msg, 'success'); },
    error(msg) { this.log(msg, 'error'); },
    warning(msg) { this.log(msg, 'warning'); },
    info(msg) { this.log(msg, 'info'); },
    cycle(msg) { this.log(msg, 'cycle'); },
    
    updateLoading(entry, message, complete = false, type = 'success') {
      if (!entry) return;
      
      const icon = entry.querySelector('.log-icon');
      const messageSpan = entry.querySelector('.log-message');
      
      if (complete) {
        entry.className = `log-entry ${type}`;
        icon.className = 'log-icon';
        icon.textContent = type === 'success' ? '✓' : (type === 'error' ? '✗' : '⚠');
        messageSpan.className = 'log-message';
      }
      
      messageSpan.textContent = message;
    },
    
    updateStats(processed, cycle, batchSize, status) {
      document.getElementById('stat-processed').textContent = processed;
      document.getElementById('stat-cycle').textContent = cycle;
      document.getElementById('stat-batch').textContent = batchSize;
      document.getElementById('stat-status').textContent = status;
    },
    
    updatePerformance() {
      const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
      const aps = uptime > 0 ? (stats.totalClicks / uptime).toFixed(1) : 0;
      
      document.getElementById('perf-cps').textContent = aps;
      document.getElementById('perf-uptime').textContent = uptime + 's';
      document.getElementById('perf-peak').textContent = stats.peakBatchSize;
      document.getElementById('perf-scrolls').textContent = stats.scrollCount;
    },
    
    updateProgress(percent) {
      const fill = document.getElementById('cycle-progress-fill');
      const label = document.getElementById('cycle-progress-percent');
      
      if (fill) fill.style.width = percent + '%';
      if (label) label.textContent = Math.round(percent) + '%';
    }
  };

  createOverlay();
  
  UILogger.success('System initialized');
  UILogger.info('Continuous processing mode enabled');

  let totalProcessed = 0;
  let currentCycle = 0;
  let isStopped = false;
  let isPanelHidden = false;

  setInterval(() => {
    if (!isStopped) {
      UILogger.updatePerformance();
    }
  }, 1000);

  window.moderationAssistant = {
    stop() {
      isStopped = true;
      UILogger.error('Process stopped');
      UILogger.updateStats(totalProcessed, currentCycle, 0, 'STOPPED');
      setTimeout(() => {
        const overlay = document.getElementById('moderation-assistant-overlay');
        if (overlay) overlay.remove();
      }, 2000);
    },
    
    togglePanel() {
      isPanelHidden = !isPanelHidden;
      const panel = document.getElementById('moderation-assistant-panel');
      const toggleBtn = document.getElementById('toggle-button');
      
      if (isPanelHidden) {
        panel.classList.add('hidden');
        toggleBtn.classList.add('visible');
      } else {
        panel.classList.remove('hidden');
        toggleBtn.classList.remove('visible');
      }
    },
    
    toggleTheme() {
      isDarkMode = !isDarkMode;
      const panel = document.getElementById('moderation-assistant-panel');
      const themeIcon = document.getElementById('theme-icon');
      
      if (isDarkMode) {
        panel.classList.remove('light-mode');
        themeIcon.textContent = '🌙';
      } else {
        panel.classList.add('light-mode');
        themeIcon.textContent = '☀️';
      }
    }
  };

  function isButtonValid(element) {
    if (!element) return false;
    const ariaHidden = element.getAttribute('aria-hidden') === 'true';
    return !ariaHidden;
  }

  function clickAll(selector, matchText = null) {
    const items = document.querySelectorAll(selector);
    let clicked = 0;
    
    for (let item of items) {
      const ariaHidden = item.getAttribute('aria-hidden') === 'true';
      if (ariaHidden) continue;
      
      if (matchText) {
        const itemText = (item.innerText || item.textContent || '').trim().toLowerCase();
        if (!itemText.includes(matchText.toLowerCase())) continue;
      }
      
      try {
        item.click();
        clicked++;
        stats.totalClicks++;
      } catch(e) {
        try {
          const parent = item.closest('[role="listitem"]') || item.closest('[role="menuitem"]');
          if (parent) {
            parent.click();
            clicked++;
            stats.totalClicks++;
          }
        } catch(e2) { }
      }
    }
    
    return clicked;
  }

  /**
   * Enhanced report menu click handler supporting multiple menu text variations.
   */
  function clickAllReportMenus() {
    const reportMenuVariations = [
      'report post',
      'report photo',
      'find support or report',
      'find support or report video'
    ];
    
    const items = document.querySelectorAll(SELECTORS.menuItemSpan);
    let clicked = 0;
    
    for (let item of items) {
      const ariaHidden = item.getAttribute('aria-hidden') === 'true';
      if (ariaHidden) continue;
      
      const itemText = (item.innerText || item.textContent || '').trim().toLowerCase();
      
      const matchesReportMenu = reportMenuVariations.some(variation => 
        itemText.includes(variation)
      );
      
      if (matchesReportMenu) {
        try {
          item.click();
          clicked++;
          stats.totalClicks++;
        } catch(e) {
          try {
            const parent = item.closest('[role="listitem"]') || item.closest('[role="menuitem"]');
            if (parent) {
              parent.click();
              clicked++;
              stats.totalClicks++;
            }
          } catch(e2) { }
        }
      }
    }
    
    return clicked;
  }

  async function wait(ms) {
    await new Promise(r => setTimeout(r, ms));
  }

  async function closeAllDialogs() {
    const loadingEntry = UILogger.loading('Ensuring all dialogs closed');
    
    let closedCount = 0;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      const dialogs = document.querySelectorAll(SELECTORS.dialog);
      
      if (dialogs.length === 0) {
        UILogger.updateLoading(loadingEntry, 'All dialogs confirmed closed', true, 'success');
        return;
      }
      
      for (let dialog of dialogs) {
        const closeBtn = dialog.querySelector(SELECTORS.closeButton);
        if (closeBtn) {
          try {
            closeBtn.click();
            closedCount++;
          } catch(e) { }
        }
        
        const doneBtn = dialog.querySelector(SELECTORS.doneButton);
        if (doneBtn) {
          try {
            doneBtn.click();
            closedCount++;
          } catch(e) { }
        }
      }
      
      for (let i = 0; i < 3; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', keyCode: 27, bubbles: true }));
      }
      
      await wait(1500);
      attempts++;
    }
    
    UILogger.updateLoading(loadingEntry, `${closedCount} dialogs closed (${attempts} attempts)`, true, 'success');
  }

  async function scrollForNewContent() {
    const loadingEntry = UILogger.loading('Scrolling feed');
    
    for (let i = 0; i < SCROLL_CONFIG.continuousScrollAttempts; i++) {
      if (isStopped) return;
      
      window.scrollBy({ top: TIMING.scrollAmount, behavior: SCROLL_CONFIG.scrollBehavior });
      stats.scrollCount++;
      await wait(TIMING.scrollForContent);
    }
    
    UILogger.updateLoading(loadingEntry, `Scrolled ${SCROLL_CONFIG.continuousScrollAttempts} times`, true, 'success');
    await wait(TIMING.contentSettle);
  }

  async function parallelBatchProcess() {
    currentCycle++;
    UILogger.cycle(`Cycle #${currentCycle} started`);
    
    UILogger.updateProgress(0);
    
    let loadingEntry = UILogger.loading('Finding posts');
    document.querySelectorAll(SELECTORS.tooltip).forEach(t => t.style.display = 'none');
    
    const actionButtons = document.querySelectorAll(SELECTORS.actionsButton);
    let buttonsClicked = 0;
    
    for (let btn of actionButtons) {
      if (btn.hasAttribute(ATTRIBUTES.processed)) continue;
      if (!isButtonValid(btn)) continue;
      
      try {
        btn.scrollIntoView({ behavior: 'instant', block: 'center' });
        await wait(50);
        btn.click();
        btn.setAttribute(ATTRIBUTES.processed, 'true');
        buttonsClicked++;
        stats.totalClicks++;
      } catch(e) { }
    }
    
    stats.batchSizes.push(buttonsClicked);
    if (buttonsClicked > stats.peakBatchSize) stats.peakBatchSize = buttonsClicked;
    
    UILogger.updateLoading(loadingEntry, `Found ${buttonsClicked} posts`, true, 'success');
    UILogger.updateStats(totalProcessed, currentCycle, buttonsClicked, 'ACTIVE');
    UILogger.updateProgress(14);
    await wait(TIMING.afterClickAll);
    
    loadingEntry = UILogger.loading('Opening report dialogs');
    const reportClicked = clickAllReportMenus();
    UILogger.updateLoading(loadingEntry, `${reportClicked} dialogs opened`, true, 'success');
    UILogger.updateProgress(28);
    await wait(TIMING.betweenSteps);
    
    loadingEntry = UILogger.loading('Step 1: Selecting category');
    const step1Clicked = clickAll(REPORTING_PATH.step1.selector, REPORTING_PATH.step1.text);
    UILogger.updateLoading(loadingEntry, `Step 1: ${step1Clicked} selected`, true, 'success');
    UILogger.updateProgress(42);
    await wait(TIMING.betweenSteps);
    
    loadingEntry = UILogger.loading('Step 2: Selecting subcategory');
    const step2Clicked = clickAll(REPORTING_PATH.step2.selector, REPORTING_PATH.step2.text);
    UILogger.updateLoading(loadingEntry, `Step 2: ${step2Clicked} selected`, true, 'success');
    UILogger.updateProgress(56);
    await wait(TIMING.betweenSteps);
    
    loadingEntry = UILogger.loading('Step 3: Selecting reason');
    const step3Clicked = clickAll(REPORTING_PATH.step3.selector, REPORTING_PATH.step3.text);
    UILogger.updateLoading(loadingEntry, `Step 3: ${step3Clicked} selected`, true, 'success');
    UILogger.updateProgress(70);
    await wait(TIMING.betweenSteps);
    
    loadingEntry = UILogger.loading('Submitting reports');
    const submitClicked = clickAll(SELECTORS.submitButton);
    UILogger.updateLoading(loadingEntry, `${submitClicked} reports submitted`, true, 'success');
    UILogger.updateProgress(84);
    await wait(TIMING.betweenSteps);
    
    const nextClicked = clickAll(SELECTORS.nextButton);
    if (nextClicked > 0) {
      UILogger.info(`${nextClicked} continuation steps`);
      await wait(TIMING.betweenSteps);
    }
    
    loadingEntry = UILogger.loading('Completing reports');
    const doneClicked = clickAll(SELECTORS.doneButton);
    UILogger.updateLoading(loadingEntry, `${doneClicked} reports completed`, true, 'success');
    UILogger.updateProgress(95);
    await wait(TIMING.afterDone);
    
    totalProcessed += buttonsClicked;
    stats.successCount += buttonsClicked;
    UILogger.updateStats(totalProcessed, currentCycle, buttonsClicked, 'ACTIVE');
    
    UILogger.updateProgress(100);
    await closeAllDialogs();
    await wait(TIMING.dialogCleanup);
    
    if (buttonsClicked > 0) {
      UILogger.success(`Cycle complete: ${buttonsClicked} posts | Total: ${totalProcessed}`);
    } else {
      UILogger.warning('No posts found in cycle');
    }
    
    return buttonsClicked;
  }

  async function processingLoop() {
    UILogger.info('Continuous mode: Running until stopped');
    
    while (!isStopped) {
      const unprocessed = Array.from(document.querySelectorAll(SELECTORS.actionsButton)).filter(btn => {
        return !btn.hasAttribute(ATTRIBUTES.processed) && isButtonValid(btn);
      });
      
      if (unprocessed.length > 0) {
        UILogger.info(`${unprocessed.length} posts found`);
        await parallelBatchProcess();
      } else {
        UILogger.info('Loading more content');
        await scrollForNewContent();
      }
      
      await wait(TIMING.betweenCycles);
      
      if (TEST_MODE) {
        UILogger.warning('Test mode - stopping after one cycle');
        break;
      }
    }
    
    UILogger.cycle(`Process completed`);
    UILogger.success(`Total: ${totalProcessed} posts processed`);
    UILogger.success(`Cycles: ${currentCycle}`);
    UILogger.updateStats(totalProcessed, currentCycle, 0, 'COMPLETE');
  }

  processingLoop();

})();
