javascript:(function() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           CONFIGURATION & CONSTANTS
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  /* Test Mode Configuration */
  const TEST_MODE = false; /* Set to true to stop after 1 successful report */

  /* Reporting Path Configuration */
  const REPORTING_PATH = {
    step1: { 
      selector: '[aria-labelledby="dialog_title"] [role="listitem"] span', 
      text: 'violent, hateful or disturbing' 
    },
    step2: { 
      selector: '[aria-labelledby="dialog_title"] [role="listitem"] span', 
      text: 'promoting hate' 
    },
    step3: { 
      selector: '[aria-labelledby="dialog_title"] [role="listitem"] span', 
      text: 'posting hateful speech' 
    }
  };

  /* Selectors */
  const SELECTORS = {
    actionsButton: '[aria-label="Actions for this post"]',
    dialogTitle: '[aria-labelledby="dialog_title"]',
    menuItem: '[role="menuitem"]',
    menuItemSpan: '[role="menuitem"] span',
    tooltip: '[role="tooltip"]',
    backButton: '[aria-label="Back"]',
    closeButton: '[aria-label="Close"]',
    submitButton: '[aria-label="Submit"]',
    nextButton: '[aria-label="Next"]',
    doneButton: '[aria-label="Done"]'
  };

  /* Search Text */
  const SEARCH_TEXT = {
    report: 'report'
  };

  /* Retry Configuration */
  const RETRY_CONFIG = {
    elementWaitTimeout: 30000,   /* 30 seconds to wait for element before retry */
    actionRetryDelay: 10000,     /* 10 seconds before retrying failed action */
    maxFullRetries: 5            /* Max full flow retries before giving up on post */
  };

  /* Timing Configuration (milliseconds) */
  const TIMING = {
    recursiveCheck: 0,           /* Zero delay for recursive checks - blazing fast */
    postClickWait: 500,          /* Wait after clicking for UI to respond */
    afterSubmit: 800,            /* Wait after submit for next screen */
    scrollForContent: 600,       /* Wait after scrolling for content to load */
    contentSettle: 1000,         /* Wait for content to settle after scroll */
    scrollInterval: 100,         /* Interval for manual scroll */
    scrollAmount: 1000           /* Pixels to scroll per interval */
  };

  /* Scroll Configuration */
  const SCROLL_CONFIG = {
    maxScrollAttempts: 15,       /* Max scroll attempts to load new content */
    scrollBehavior: 'smooth',    /* Scroll behavior */
    scrollBlock: 'center'        /* Scroll block alignment */
  };

  /* Attribute Names */
  const ATTRIBUTES = {
    processed: 'data-processed'  /* Attribute to mark processed posts */
  };

  /* Console Styles */
  const CONSOLE_STYLES = {
    header: 'color: #008080; font-weight: bold;',
    title: 'color: #008080; font-weight: bold; font-size: 14px;',
    path: 'color: #ff6b6b; font-weight: bold; font-size: 12px;',
    commands: 'color: #00aaaa; font-weight: bold;',
    success: 'color: #00aa00; font-weight: bold;',
    successSmall: 'color: #00aa00; font-size: 11px;',
    warning: 'color: #ff8800;',
    error: 'color: #ff6b6b;',
    errorBold: 'color: #ff0000; font-weight: bold;',
    info: 'color: #0088aa; font-weight: bold;',
    infoLight: 'color: #00aaaa;',
    cycle: 'color: #008080; font-weight: bold; font-size: 14px;',
    stats: 'color: #008080; font-weight: bold;',
    complete: 'color: #008080; font-weight: bold; font-size: 16px;',
    debug: 'color: #9370db; font-style: italic;'
  };

  /* Banner Text */
  const BANNER = `
═══════════════════════════════════════════════════════════════════════════════════════
           🛡️  CONTENT MODERATION ASSISTANT ACTIVE
      REPORTING: Violent/Hateful Content → Promoting Hate → Hateful Speech
                    ⚡ SMART WAIT | PROPER RETRIES ⚡
═══════════════════════════════════════════════════════════════════════════════════════
`;

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           INITIALIZATION
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  console.clear();
  console.log(BANNER, CONSOLE_STYLES.header);
  console.log('%c[MODERATION ASSISTANT] 🛡️ Smart Wait | Proper Retry Edition', CONSOLE_STYLES.title);
  console.log('%c[REPORTING PATH] Violent, hateful or disturbing content → Promoting hate → Posting hateful speech', CONSOLE_STYLES.path);

  /* In-memory counter */
  let totalProcessed = 0;

  /* Scroll control */
  let scrollInterval = null;

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           GLOBAL CONTROLS
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  window.startScroll = function() {
    if (scrollInterval) return;
    scrollInterval = setInterval(function(){ 
      window.scrollBy(0, TIMING.scrollAmount); 
    }, TIMING.scrollInterval);
    console.log('%c▶️ SCROLL STARTED', CONSOLE_STYLES.title);
  };
  
  window.stopScroll = function() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
      console.log('%c⏸️ SCROLL STOPPED', CONSOLE_STYLES.title);
    }
  };
  
  window.resetProcessCount = function() {
    totalProcessed = 0;
    console.log('%c🔄 PROCESS COUNT RESET TO 0', CONSOLE_STYLES.info);
  };
  
  window.getProcessCount = function() {
    console.log(`%c[📊] Current processed count: ${totalProcessed}`, CONSOLE_STYLES.info);
    return totalProcessed;
  };
  
  console.log('%c[MODERATION ASSISTANT] 💡 Commands: startScroll() | stopScroll() | resetProcessCount() | getProcessCount()', CONSOLE_STYLES.commands);

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           UTILITY FUNCTIONS
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  /* Check if element is actually visible and clickable */
  function isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0'
    );
  }

  /* Wait for element to appear with timeout - returns null if timeout exceeded */
  async function waitForElement(selector, matchText = null, timeoutMs = RETRY_CONFIG.elementWaitTimeout) {
    const startTime = Date.now();
    let attempt = 0;
    
    while (Date.now() - startTime < timeoutMs) {
      const items = document.querySelectorAll(selector);
      
      for (let item of items) {
        if (!isElementVisible(item)) continue;
        
        if (!matchText) {
          return item;
        }
        
        const itemText = (item.innerText || item.textContent || '').trim().toLowerCase();
        const searchText = matchText.trim().toLowerCase();
        
        if (itemText.includes(searchText)) {
          return item;
        }
      }
      
      /* Log progress every 5 seconds */
      if (attempt % 500 === 0 && attempt > 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`%c[⏳] Waiting for element... ${elapsed}s elapsed`, CONSOLE_STYLES.infoLight);
      }
      
      await new Promise(r => setTimeout(r, TIMING.recursiveCheck));
      attempt++;
    }
    
    return null; /* Timeout exceeded */
  }

  /* AGGRESSIVE MULTI-METHOD CLICK */
  async function aggressiveClick(element) {
    /* Method 1: Standard click */
    try {
      element.click();
      return true;
    } catch(e) { /* Ignore and try next */ }
    
    /* Method 2: MouseEvent with coordinates */
    try {
      const rect = element.getBoundingClientRect();
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });
      element.dispatchEvent(clickEvent);
      return true;
    } catch(e) { /* Ignore and try next */ }
    
    /* Method 3: MouseDown + MouseUp */
    try {
      const rect = element.getBoundingClientRect();
      const mouseDown = new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });
      const mouseUp = new MouseEvent('mouseup', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });
      element.dispatchEvent(mouseDown);
      element.dispatchEvent(mouseUp);
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return true;
    } catch(e) { /* Ignore and try next */ }
    
    /* Method 4: Focus + Enter key */
    try {
      element.focus();
      const enterDown = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true });
      const enterUp = new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true });
      element.dispatchEvent(enterDown);
      element.dispatchEvent(enterUp);
      return true;
    } catch(e) { /* Ignore and try next */ }
    
    return false;
  }

  /* Wait for element and click it - with timeout */
  async function waitForAndClick(selector, matchText = null, timeoutMs = RETRY_CONFIG.elementWaitTimeout) {
    const element = await waitForElement(selector, matchText, timeoutMs);
    
    if (!element) {
      return null; /* Element not found within timeout */
    }
    
    /* Scroll element into view */
    element.scrollIntoView({ 
      behavior: SCROLL_CONFIG.scrollBehavior, 
      block: SCROLL_CONFIG.scrollBlock 
    });
    await new Promise(r => setTimeout(r, 100));
    
    /* Click the element */
    const clicked = await aggressiveClick(element);
    
    if (!clicked) {
      console.log('%c[⚠️] Click failed on element', CONSOLE_STYLES.warning);
      return null;
    }
    
    /* Wait for UI to respond after click */
    await new Promise(r => setTimeout(r, TIMING.postClickWait));
    
    return element;
  }

  /* Click actions button and wait for menu to appear */
  async function clickActionsButton(button) {
    if (!isElementVisible(button)) {
      console.log('%c[⚠️] Actions button not visible', CONSOLE_STYLES.warning);
      return false;
    }
    
    button.scrollIntoView({ 
      behavior: SCROLL_CONFIG.scrollBehavior, 
      block: SCROLL_CONFIG.scrollBlock 
    });
    await new Promise(r => setTimeout(r, 100));
    
    /* Remove tooltips */
    const tooltips = document.querySelectorAll(SELECTORS.tooltip);
    tooltips.forEach(tooltip => tooltip.style.display = 'none');
    
    /* Click the button */
    const clicked = await aggressiveClick(button);
    
    if (!clicked) {
      console.log('%c[⚠️] Failed to click Actions button', CONSOLE_STYLES.warning);
      return false;
    }
    
    /* Wait for menu to appear */
    await new Promise(r => setTimeout(r, TIMING.postClickWait));
    
    const menu = await waitForElement(SELECTORS.menuItem, null, 5000);
    
    if (menu) {
      console.log('%c✓ Actions menu opened', CONSOLE_STYLES.successSmall);
      return true;
    } else {
      console.log('%c[⚠️] Menu did not appear', CONSOLE_STYLES.warning);
      return false;
    }
  }

  /* Find and click "Report post" option in menu - ENHANCED DEBUG VERSION */
  async function clickReportOption() {
    console.log('%c[🔍] Searching for "Report post" option...', CONSOLE_STYLES.debug);
    
    /* Strategy 1: Search in visible menu items with span */
    const menuItemSpans = document.querySelectorAll(SELECTORS.menuItemSpan);
    console.log(`%c[🔍] Found ${menuItemSpans.length} menu item spans`, CONSOLE_STYLES.debug);
    
    for (let span of menuItemSpans) {
      if (!isElementVisible(span)) continue;
      
      const text = (span.innerText || span.textContent || '').trim().toLowerCase();
      console.log(`%c[🔍] Checking span text: "${text}"`, CONSOLE_STYLES.debug);
      
      if (text.includes('report')) {
        console.log(`%c[✓] Found "Report" in span: "${text}"`, CONSOLE_STYLES.successSmall);
        
        /* Click the parent menu item, not just the span */
        let menuItem = span.closest('[role="menuitem"]');
        if (menuItem) {
          menuItem.scrollIntoView({ 
            behavior: SCROLL_CONFIG.scrollBehavior, 
            block: SCROLL_CONFIG.scrollBlock 
          });
          await new Promise(r => setTimeout(r, 100));
          
          const clicked = await aggressiveClick(menuItem);
          if (clicked) {
            console.log('%c✓ Report option clicked successfully', CONSOLE_STYLES.successSmall);
            await new Promise(r => setTimeout(r, TIMING.postClickWait));
            return true;
          }
        }
      }
    }
    
    /* Strategy 2: Search directly in menu items */
    const menuItems = document.querySelectorAll(SELECTORS.menuItem);
    console.log(`%c[🔍] Found ${menuItems.length} total menu items`, CONSOLE_STYLES.debug);
    
    for (let item of menuItems) {
      if (!isElementVisible(item)) continue;
      
      const text = (item.innerText || item.textContent || '').trim().toLowerCase();
      console.log(`%c[🔍] Checking menu item text: "${text}"`, CONSOLE_STYLES.debug);
      
      if (text.includes('report')) {
        console.log(`%c[✓] Found "Report" in menu item: "${text}"`, CONSOLE_STYLES.successSmall);
        
        item.scrollIntoView({ 
          behavior: SCROLL_CONFIG.scrollBehavior, 
          block: SCROLL_CONFIG.scrollBlock 
        });
        await new Promise(r => setTimeout(r, 100));
        
        const clicked = await aggressiveClick(item);
        if (clicked) {
          console.log('%c✓ Report option clicked successfully', CONSOLE_STYLES.successSmall);
          await new Promise(r => setTimeout(r, TIMING.postClickWait));
          return true;
        }
      }
    }
    
    /* Strategy 3: Use waitForAndClick with broader selector */
    console.log('%c[🔍] Trying waitForAndClick method...', CONSOLE_STYLES.debug);
    const reportElement = await waitForAndClick(SELECTORS.menuItemSpan, SEARCH_TEXT.report, 5000);
    
    if (reportElement) {
      console.log('%c✓ Report option found and clicked via waitForAndClick', CONSOLE_STYLES.successSmall);
      return true;
    }
    
    console.log('%c[❌] Failed to find or click "Report post" option', CONSOLE_STYLES.errorBold);
    return false;
  }

  /* Modal utility: Try [Back], then [Close], then [Escape] */
  async function clickBackOrClose() {
    /* Try Back button */
    const backBtn = await waitForElement(SELECTORS.backButton, null, 2000);
    if (backBtn) {
      await aggressiveClick(backBtn);
      console.log('%c⬅️ BACK clicked', CONSOLE_STYLES.info);
      await new Promise(r => setTimeout(r, TIMING.postClickWait));
    }
    
    /* Try Close button */
    const closeBtn = await waitForElement(SELECTORS.closeButton, null, 2000);
    if (closeBtn) {
      await aggressiveClick(closeBtn);
      console.log('%c❌ CLOSE clicked', CONSOLE_STYLES.stats);
      await new Promise(r => setTimeout(r, TIMING.postClickWait));
    }
    
    /* Send Escape key */
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    await new Promise(r => setTimeout(r, TIMING.postClickWait));
  }

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           REPORTING FUNCTIONS
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  /* Process reporting flow with proper retry logic */
  async function processReportingFlow(id = '') {
    let retryCount = 0;
    
    while (retryCount < RETRY_CONFIG.maxFullRetries) {
      try {
        /* Check for dialog */
        const dialog = await waitForElement(SELECTORS.dialogTitle, null, 10000);
        
        if (!dialog) {
          console.log(`%c[⚠️] No dialog for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
          await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
          retryCount++;
          continue;
        }
        
        if (retryCount > 0) {
          console.log(`%c♻️ Reporting flow retry ${retryCount + 1} for #${id}`, CONSOLE_STYLES.info);
        }

        /* Step 1: Click and wait for next screen */
        const step1 = await waitForAndClick(REPORTING_PATH.step1.selector, REPORTING_PATH.step1.text);
        if (!step1) {
          console.log(`%c[⚠️] Step 1 failed for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
          await clickBackOrClose();
          await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
          retryCount++;
          continue;
        }
        console.log(`%c✓ Step 1: "${REPORTING_PATH.step1.text}"`, CONSOLE_STYLES.successSmall);

        /* Step 2: Click and wait for next screen */
        const step2 = await waitForAndClick(REPORTING_PATH.step2.selector, REPORTING_PATH.step2.text);
        if (!step2) {
          console.log(`%c[⚠️] Step 2 failed for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
          await clickBackOrClose();
          await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
          retryCount++;
          continue;
        }
        console.log(`%c✓ Step 2: "${REPORTING_PATH.step2.text}"`, CONSOLE_STYLES.successSmall);

        /* Step 3: Click and wait for next screen */
        const step3 = await waitForAndClick(REPORTING_PATH.step3.selector, REPORTING_PATH.step3.text);
        if (!step3) {
          console.log(`%c[⚠️] Step 3 failed for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
          await clickBackOrClose();
          await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
          retryCount++;
          continue;
        }
        console.log(`%c✓ Step 3: "${REPORTING_PATH.step3.text}"`, CONSOLE_STYLES.successSmall);

        /* Submit */
        const submit = await waitForAndClick(SELECTORS.submitButton, null);
        if (submit) {
          console.log('%c✓ Submit clicked', CONSOLE_STYLES.successSmall);
        }
        
        /* Next */
        const next = await waitForAndClick(SELECTORS.nextButton, null);
        if (next) {
          console.log('%c✓ Next clicked', CONSOLE_STYLES.successSmall);
        }
        
        /* Done */
        const done = await waitForAndClick(SELECTORS.doneButton, null);
        if (done) {
          console.log(`%c✓ REPORT SUBMITTED #${id}`, CONSOLE_STYLES.success);
          await clickBackOrClose();
          return true; /* Success */
        } else {
          console.log(`%c[⚠️] Done button not found for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
          await clickBackOrClose();
          await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
          retryCount++;
          continue;
        }
        
      } catch(e) {
        console.log(`%c[⚠️] Error in flow for #${id}: ${e.message}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
        await clickBackOrClose();
        await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
        retryCount++;
      }
    }
    
    console.log(`%c[❌] Failed to report #${id} after ${RETRY_CONFIG.maxFullRetries} attempts`, CONSOLE_STYLES.errorBold);
    await clickBackOrClose();
    return false; /* Failed after max retries */
  }

  async function processPost(button, id) {
    if (button.hasAttribute(ATTRIBUTES.processed)) return false;
    button.setAttribute(ATTRIBUTES.processed, 'true');

    let retryCount = 0;
    
    while (retryCount < RETRY_CONFIG.maxFullRetries) {
      /* Try to open actions menu */
      const menuOpened = await clickActionsButton(button);
      
      if (!menuOpened) {
        console.log(`%c[⚠️] Failed to open menu for post #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
        await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
        retryCount++;
        continue;
      }

      /* Wait for "Report post" option and click it - ENHANCED VERSION */
      const reportClicked = await clickReportOption();
      
      if (!reportClicked) {
        console.log(`%c[⚠️] Report option not found for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
        await clickBackOrClose();
        await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
        retryCount++;
        continue;
      }

      /* Main reporting flow */
      const success = await processReportingFlow(id);
      
      if (success) {
        return true; /* Success */
      } else {
        console.log(`%c[⚠️] Reporting flow failed for #${id}, waiting 10s before retry...`, CONSOLE_STYLES.warning);
        await new Promise(r => setTimeout(r, RETRY_CONFIG.actionRetryDelay));
        retryCount++;
      }
    }
    
    console.log(`%c[❌] Giving up on post #${id} after ${RETRY_CONFIG.maxFullRetries} attempts`, CONSOLE_STYLES.errorBold);
    return false; /* Failed */
  }

  /* Smart scroll: scroll until new content appears */
  async function scrollForNewContent() {
    console.log('%c[📜] Scrolling to load more content...', CONSOLE_STYLES.info);
    
    const initialHeight = document.body.scrollHeight;
    let scrollAttempts = 0;
    let newContentLoaded = false;
    
    while (scrollAttempts < SCROLL_CONFIG.maxScrollAttempts && !newContentLoaded) {
      window.scrollBy({ 
        top: TIMING.scrollAmount, 
        behavior: SCROLL_CONFIG.scrollBehavior 
      });
      await new Promise(r => setTimeout(r, TIMING.scrollForContent));
      
      const newHeight = document.body.scrollHeight;
      if (newHeight > initialHeight) {
        newContentLoaded = true;
        console.log('%c[📜] New content loaded!', CONSOLE_STYLES.success);
      }
      
      scrollAttempts++;
    }
    
    if (!newContentLoaded) {
      console.log('%c[📜] No new content - might be at end', CONSOLE_STYLES.warning);
    }
    
    await new Promise(r => setTimeout(r, TIMING.contentSettle));
  }

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           MAIN PROCESSING LOOP
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  async function processingLoop() {
    let cycles = 0;
    
    while (true) {
      cycles++;
      console.log(`%c\n[🔄] ═══ CYCLE #${cycles} START ═══`, CONSOLE_STYLES.cycle);
      
      let buttons = Array.from(document.querySelectorAll(
        `${SELECTORS.actionsButton}:not([${ATTRIBUTES.processed}])`
      ));
      buttons = buttons.filter(btn => isElementVisible(btn));
      
      if (buttons.length > 0) {
        console.log(`%c[📋] Found ${buttons.length} visible unprocessed posts`, CONSOLE_STYLES.info);
        
        let successCount = 0;
        for (let i = 0; i < buttons.length; ++i) {
          console.log(`%c[${i + 1}/${buttons.length}] Processing post...`, CONSOLE_STYLES.infoLight);
          const success = await processPost(buttons[i], totalProcessed + successCount + 1);
          if (success) successCount++;
        }
        
        totalProcessed += successCount;
        
        console.log(`%c[📊] Cycle #${cycles} | Processed: ${successCount} | Total: ${totalProcessed}`, CONSOLE_STYLES.stats);
        
        if (TEST_MODE && totalProcessed >= 1) {
          console.log('%c[TEST MODE] Stopping after 1 report', CONSOLE_STYLES.error);
          break;
        }
        
        await scrollForNewContent();
        
      } else {
        console.log('%c[📋] No visible unprocessed posts found', CONSOLE_STYLES.warning);
        
        await scrollForNewContent();
        
        buttons = Array.from(document.querySelectorAll(
          `${SELECTORS.actionsButton}:not([${ATTRIBUTES.processed}])`
        ));
        buttons = buttons.filter(btn => isElementVisible(btn));
        
        if (buttons.length === 0) {
          console.log('%c[✓] All posts processed or reached end of feed', CONSOLE_STYLES.success);
          break;
        }
      }
    }
    
    console.log(`%c\n[🏁] ═══ PROCESSING COMPLETE ═══\n[📊] Total Reports Submitted: ${totalProcessed}`, CONSOLE_STYLES.complete);
  }

  /* ═══════════════════════════════════════════════════════════════════════════════════
   *                           START EXECUTION
   * ═══════════════════════════════════════════════════════════════════════════════════ */

  console.log('%c[MODERATION ASSISTANT] 🚀 Starting with enhanced Report detection...', CONSOLE_STYLES.stats);
  processingLoop();

})();
