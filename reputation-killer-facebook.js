// ════════════════════════════════════════════════════════════════════════════════════
//           ☠️  REPUTATION KILLER JS ENGAGED! ☠️
//      MASS REPORTER · ULTRA-FAST SCROLL · MODAL RECOVER · BACK + CLOSE
// ════════════════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  console.clear();
  console.log(`
%c
                                           .:-+***+=-:..                                            
                                        :+%@@@@@@@@@@@@@#=.                                         
                                      :%@@@@@@@@@@@@@@@@@@@#:                                       
                                    .*@@@@@@@@@@@@@@@@@@@@@@@#:.                                    
                                   :%@@@@@@@@@@@@@@@@@@@@@@@@@@-                                    
                                  .%@@@@@@@@@@@@@@@@@@@@@@@@@@@@=.                                  
                                 .+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-                                  
                                .-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#.                                 
                                .*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-                                 
                                .%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+.                                
                                .@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+.                                
                                .#@@@@@*-::-+%@@@@@@@%=::::+@@@@@@=.                                
                                .=@@@*.       .@@@@@-.       +@@@#:                                 
                                 .*@%:        .%@@@%:.       :#@@:                                  
                                 :#@%:        *@@@@@+.       :%@@.                                  
                                 :%@@%-.....-%@@@*#@@@=.....+@@@@-                                  
                           .::.  .=@@@@@@@@@@@@@=..%@@@@@@@@@@@@%.  .:-:.                           
                         .:%@@@-  ..-*@@@@@@@@@#. .+@@@@@@@@@@#:.   *@@@%:                          
                      .-*%@@@@@%.       :%@@@@@%++-#@@@@@*.        :@@@@@@@*-..                     
                      #@@@@@@@@@%=:.     +@@@@@@@@@@@@@@@.      .-+@@@@@@@@@@#.                     
                      =@@@@@@@@@@@@@%*-. :@@@@@@@@@@@@@@@   .=#%@@@@@@@@@@@@%-.                     
                            ..+%@@@@@@@@@@%#:..#%=-%#.-@%*@@@@@@@@@@#=.                             
                                ..-*#@@@@@@@@@#=:..-+#@@@@@@@@@#+-.                                 
                                    ..:-*@@@@@@@@@@@@@@@@@%+-..                                     
                                        ..-#@@@@@@@@@@@@*:...                                       
                                    .-+#@@@@@@@@%##@@@@@@@@@#+-.                                    
                               .-*#%@@@@@@@@%+:..  ..-*%@@@@@@@@@%*-.                               
                    .-@@###%@@@@@@@@@@@@#=.             ..=%@@@@@@@@@@@@@%#%@@=                     
                    .@@@@@@@@@@@@@%#+-.                      .-*#@@@@@@@@@@@@@@                     
                    .:*@@@@@@@@*-..                              ..-*@@@@@@@@*:                     
                       .*@@@@%=                                     .=@@@@@*.                       
                         :+##=.                                      .+##*:
═══════════════════════════════════════════════════════════════════════════════════════
           ☠️  REPUTATION KILLER JS ENGAGED! ☠️
═══════════════════════════════════════════════════════════════════════════════════════
`, 'color: #ff0000; font-weight: bold;');

  console.log('%c[REPUTATION KILLER] ☠️ Ultra-Fast Modal Recovery Edition.', 'color: #ff0000; font-weight: bold; font-size: 14px;');

  // ULTRA-FAST SCROLL CODE - Exposed to window for manual control
  window.startScroll = setInterval(function(){ window.scrollBy(0, 1000000); }, 1);
  
  // STOP SCROLL FUNCTION - Exposed as global switch
  window.stopScroll = function() {
    clearInterval(window.startScroll);
    console.log('%c⏸️ SCROLL STOPPED', 'color: #ff0000; font-weight: bold; font-size: 14px;');
  };
  
  // RESET COUNTER FUNCTION - Exposed for manual reset
  window.resetKillCount = function() {
    try {
      localStorage.setItem('reputationKillerCount', '0');
      console.log('%c🔄 KILL COUNT RESET TO 0', 'color: #ffaa00; font-weight: bold; font-size: 14px;');
    } catch(e) {
      console.log('%c⚠️ localStorage not available, counter reset', 'color: #ffaa00; font-weight: bold;');
    }
  };
  
  console.log('%c[REPUTATION KILLER] 💡 Commands: stopScroll() | resetKillCount()', 'color: #00ffff; font-weight: bold;');

  // ======== MASS REPORTING ROUTINE ========
  const TEST_MODE = false;

  // Get initial count from localStorage
  let totalDestroyed = 0;
  try {
    const saved = localStorage.getItem('reputationKillerCount');
    totalDestroyed = saved ? parseInt(saved, 10) : 0;
    if (totalDestroyed > 0) {
      console.log(`%c[REPUTATION KILLER] 📊 Resuming from previous session: ${totalDestroyed} already destroyed`, 'color: #00ffff; font-weight: bold;');
    }
  } catch(e) {
    console.log('%c[REPUTATION KILLER] ⚠️ localStorage not available, using in-memory counter', 'color: #ffaa00; font-weight: bold;');
  }

  // Save count to localStorage
  function saveCount(count) {
    try {
      localStorage.setItem('reputationKillerCount', count.toString());
    } catch(e) {
      // Silent fail if localStorage not available
    }
  }

  // Utility: Wait and click an element containing specific text
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

  // Modal utility: Try [Back], then [Close], then [Escape]
  async function clickBackOrClose() {
    let didBack = false;
    const backBtn = document.querySelector('[aria-label="Back"]');
    if (backBtn) {
      backBtn.click();
      console.log('%c⬅️ BACK clicked - retrying', 'color: #ffaa00; font-weight: bold;');
      await new Promise(r => setTimeout(r, 180));
      didBack = true;
    }
    const closeBtn = document.querySelector('[aria-label="Close"]');
    if (closeBtn) {
      closeBtn.click();
      console.log('%c❌ CLOSE clicked - forcing modal close', 'color: #ff0000; font-weight: bold;');
      await new Promise(r => setTimeout(r, 180));
      didBack = true;
    }
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise(r => setTimeout(r, 80));
    return didBack;
  }

  // Try all click routines, with retry, back and force-close
  async function flushActiveModal(id = '', maxRetries = 2) {
    let didWork = false, retryCount = 0;
    while (retryCount <= maxRetries && document.querySelector('[aria-labelledby="dialog_title"]')) {
      if (retryCount > 0)
        console.log(`%c♻️ Retry attempt ${retryCount} for #${id}`, 'color: #ffff00; font-weight: bold;');

      let hateful = await waitForAndClick('[aria-labelledby="dialog_title"] [role="listitem"] span', 'hate', 1000);
      if (!hateful) { await clickBackOrClose(); retryCount++; continue; }
      await new Promise(r => setTimeout(r, 180));

      let promoting = await waitForAndClick('[aria-labelledby="dialog_title"] [role="listitem"] span', 'promot', 1000);
      if (!promoting) { await clickBackOrClose(); retryCount++; continue; }
      await new Promise(r => setTimeout(r, 180));

      let posting = await waitForAndClick('[aria-labelledby="dialog_title"] [role="listitem"] span', 'posting', 1000);
      if (!posting) { await clickBackOrClose(); retryCount++; continue; }
      await new Promise(r => setTimeout(r, 80));

      let submit = await waitForAndClick('[aria-label="Submit"]', null, 800);
      await new Promise(r => setTimeout(r, 80));
      let next = await waitForAndClick('[aria-label="Next"]', null, 800);
      await new Promise(r => setTimeout(r, 80));
      let done = await waitForAndClick('[aria-label="Done"]', null, 800);
      if (done) {
        didWork = true;
        console.log(`%c☠️ REPUTATION DESTROYED #${id}`, 'color: #00ff00; font-weight: bold;');
      }
      break;
    }
    await clickBackOrClose();
    return didWork;
  }

  async function processPost(button, id) {
    if (button.hasAttribute('data-processed')) return false;
    button.setAttribute('data-processed', 'true');

    button.scrollIntoView({ behavior: 'auto', block: 'center' });
    await new Promise(r => setTimeout(r, 120));

    await flushActiveModal(`FLUSH-${id}`, 1);

    button.click();
    await new Promise(r => setTimeout(r, 180));

    if (!await waitForAndClick('div:not([hidden]) [aria-label="Feed story"] [role="menuitem"] span', 'report', 1000)) return false;

    await new Promise(r => setTimeout(r, 180));
    const success = await flushActiveModal(id, 2);
    return success;
  }

  async function killerLoop() {
    let cycles = 0;
    
    while (true) {
      let buttons = Array.from(document.querySelectorAll('[aria-label="Actions for this post"]:not([data-processed])'));
      if (buttons.length > 0) {
        let successCount = 0;
        for (let i = 0; i < buttons.length; ++i) {
          const success = await processPost(buttons[i], totalDestroyed + successCount + 1);
          if (success) successCount++;
        }
        
        totalDestroyed += successCount;
        saveCount(totalDestroyed); // Save to localStorage
        
        console.log(`%c[☠️] Cycle #${++cycles} | Total destroyed: ${totalDestroyed}`, 'color: #ff0000; font-weight: bold;');
        if (TEST_MODE && totalDestroyed >= 1) break;
      } else {
        await flushActiveModal(`BG-${cycles}`, 1);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }

  // RUN THE DESTROYER
  killerLoop();

})();
