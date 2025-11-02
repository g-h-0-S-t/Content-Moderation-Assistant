javascript:(function() {
  'use strict';

  console.clear();
  console.log(`
═══════════════════════════════════════════════════════════════════════════════════════
           🛡️  CONTENT MODERATION ASSISTANT ACTIVE
═══════════════════════════════════════════════════════════════════════════════════════
`, 'color: #008080; font-weight: bold;');

  console.log('%c[MODERATION ASSISTANT] 🛡️ Enhanced Modal Recovery Edition.', 'color: #008080; font-weight: bold; font-size: 14px;');

  /* FAST SCROLL CODE - Exposed to window for manual control */
  window.startScroll = setInterval(function(){ window.scrollBy(0, 1000000); }, 1);
  
  /* STOP SCROLL FUNCTION - Exposed as global control */
  window.stopScroll = function() {
    clearInterval(window.startScroll);
    console.log('%c⏸️ SCROLL STOPPED', 'color: #008080; font-weight: bold; font-size: 14px;');
  };
  
  /* RESET COUNTER FUNCTION - Exposed for manual reset */
  window.resetProcessCount = function() {
    try {
      localStorage.setItem('moderationAssistantCount', '0');
      console.log('%c🔄 PROCESS COUNT RESET TO 0', 'color: #0088aa; font-weight: bold; font-size: 14px;');
    } catch(e) {
      console.log('%c⚠️ localStorage not available, counter reset', 'color: #0088aa; font-weight: bold;');
    }
  };
  
  console.log('%c[MODERATION ASSISTANT] 💡 Commands: stopScroll() | resetProcessCount()', 'color: #00aaaa; font-weight: bold;');

  /* ======== AUTO REPORTING ROUTINE ======== */
  const TEST_MODE = false;

  /* Get initial count from localStorage */
  let totalProcessed = 0;
  try {
    const saved = localStorage.getItem('moderationAssistantCount');
    totalProcessed = saved ? parseInt(saved, 10) : 0;
    if (totalProcessed > 0) {
      console.log(`%c[MODERATION ASSISTANT] 📊 Resuming from previous session: ${totalProcessed} already processed`, 'color: #00aaaa; font-weight: bold;');
    }
  } catch(e) {
    console.log('%c[MODERATION ASSISTANT] ⚠️ localStorage not available, using in-memory counter', 'color: #0088aa; font-weight: bold;');
  }

  /* Save count to localStorage */
  function saveCount(count) {
    try {
      localStorage.setItem('moderationAssistantCount', count.toString());
    } catch(e) {
      /* Silent fail if localStorage not available */
    }
  }

  /* Utility: Wait and click an element containing specific text */
  async function waitForAndClick(selector, matchText = null, timeout = 1100) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const items = document.querySelectorAll(selector);
      for (let item of items) {
        if (!matchText || (item.innerText && item.innerText.toLowerCase().includes(matchText))) {
          item.click();
          return item;
        }
      }
      await new Promise(r => setTimeout(r, 30));
    }
    return null;
  }

  /* Modal utility: Try [Back], then [Close], then [Escape] */
  async function clickBackOrClose() {
    let didNavigate = false;
    const backBtn = document.querySelector('[aria-label="Back"]');
    if (backBtn) {
      backBtn.click();
      console.log('%c⬅️ BACK clicked - retrying navigation', 'color: #0088aa; font-weight: bold;');
      await new Promise(r => setTimeout(r, 180));
      didNavigate = true;
    }
    const closeBtn = document.querySelector('[aria-label="Close"]');
    if (closeBtn) {
      closeBtn.click();
      console.log('%c❌ CLOSE clicked - closing modal', 'color: #008080; font-weight: bold;');
      await new Promise(r => setTimeout(r, 180));
      didNavigate = true;
    }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise(r => setTimeout(r, 80));
    return didNavigate;
  }

  /* Process reporting flow with retry and navigation recovery */
  async function processReportingFlow(id = '', maxRetries = 2) {
    let successful = false, retryCount = 0;
    while (retryCount <= maxRetries && document.querySelector('[aria-labelledby="dialog_title"]')) {
      if (retryCount > 0)
        console.log(`%c♻️ Retry attempt ${retryCount} for #${id}`, 'color: #0088aa; font-weight: bold;');

      /* Navigate through reporting categories */
      let categoryStep1 = await waitForAndClick('[aria-labelledby="dialog_title"] [role="listitem"] span', 'hate', 1000);
      if (!categoryStep1) { await clickBackOrClose(); retryCount++; continue; }
      await new Promise(r => setTimeout(r, 180));

      let categoryStep2 = await waitForAndClick('[aria-labelledby="dialog_title"] [role="listitem"] span', 'promot', 1000);
      if (!categoryStep2) { await clickBackOrClose(); retryCount++; continue; }
      await new Promise(r => setTimeout(r, 180));

      let categoryStep3 = await waitForAndClick('[aria-labelledby="dialog_title"] [role="listitem"] span', 'posting', 1000);
      if (!categoryStep3) { await clickBackOrClose(); retryCount++; continue; }
      await new Promise(r => setTimeout(r, 80));

      /* Submit report */
      let submit = await waitForAndClick('[aria-label="Submit"]', null, 800);
      await new Promise(r => setTimeout(r, 80));
      let next = await waitForAndClick('[aria-label="Next"]', null, 800);
      await new Promise(r => setTimeout(r, 80));
      let done = await waitForAndClick('[aria-label="Done"]', null, 800);
      if (done) {
        successful = true;
        console.log(`%c✓ REPORT SUBMITTED #${id}`, 'color: #00aa00; font-weight: bold;');
      }
      break;
    }
    await clickBackOrClose();
    return successful;
  }

  async function processPost(button, id) {
    if (button.hasAttribute('data-processed')) return false;
    button.setAttribute('data-processed', 'true');

    button.scrollIntoView({ behavior: 'auto', block: 'center' });
    await new Promise(r => setTimeout(r, 120));

    await processReportingFlow(`PRE-${id}`, 1);

    button.click();
    await new Promise(r => setTimeout(r, 180));

    if (!await waitForAndClick('div:not([hidden]) [aria-label="Feed story"] [role="menuitem"] span', 'report', 1000)) return false;

    await new Promise(r => setTimeout(r, 180));
    const success = await processReportingFlow(id, 2);
    return success;
  }

  async function processingLoop() {
    let cycles = 0;
    
    while (true) {
      let buttons = Array.from(document.querySelectorAll('[aria-label="Actions for this post"]:not([data-processed])'));
      if (buttons.length > 0) {
        let successCount = 0;
        for (let i = 0; i < buttons.length; ++i) {
          const success = await processPost(buttons[i], totalProcessed + successCount + 1);
          if (success) successCount++;
        }
        
        totalProcessed += successCount;
        saveCount(totalProcessed); /* Save to localStorage */
        
        console.log(`%c[📊] Cycle #${++cycles} | Total processed: ${totalProcessed}`, 'color: #008080; font-weight: bold;');
        if (TEST_MODE && totalProcessed >= 1) break;
      } else {
        await processReportingFlow(`BG-${cycles}`, 1);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  /* START THE ASSISTANT */
  processingLoop();

})();
