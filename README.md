# The Reputation Killer ☠️

**My New Weapon: A Hate Speech Auto Reporter for Facebook**

---

## Introducing My Arsenal's Latest Addition

I present to you **The Reputation Killer** — a relentless, automated hate speech reporting script born from frustration with unchecked toxicity on social platforms. When I encounter hate-mongers spreading venom on Facebook, I don't just scroll past. I deploy this weapon on their profile wall and watch as every hate-filled post gets systematically reported and dismantled.

This isn't a polite nudge to moderators. This is **scorched earth automation**.

**The Reputation Killer is:**
- **Non-lenient**: Zero tolerance. Every post gets scrutinized and reported.
- **Ruthless**: No second chances. No mercy. No escape.
- **Relentless**: Infinite loops, auto-retries, modal force-closing — it never stops until the job is done.
- **Surgical**: Precision-targeting hate speech categories with sub-type drilling and error recovery.
- **Unstoppable**: Stuck dialogs? Wrong menu loaded? It self-corrects, navigates back, and tries again.

Built with browser automation mastery, it leverages ultra-fast DOM traversal, asynchronous task queuing, aggressive scroll injection, and modal state-machine recovery. This script doesn't just report — it **eradicates**.

When you run The Reputation Killer on a hate-spreader's profile, you're not playing defense. You're going on the offensive.

---

## What It Does

The Reputation Killer opens every post on a user's Facebook wall, navigates the reporting UI with machine precision, selects "Hateful Speech → Promoting Hate → Posting Hateful Speech," submits the report, and moves to the next target — all in milliseconds per post. It scrolls infinitely to load the entire feed, handles UI errors with retry logic, and logs every annihilation to your browser console in dramatic, color-coded glory.

**Target Acquired. Reputation Destroyed.**

---

## Features

- **Blazing Fast Execution**: Ultra-aggressive scrolling (`setInterval` at 1ms) loads thousands of posts instantly.
- **Modal Recovery Engine**: Auto-detects stuck dialogs and force-closes using Back/Close/Escape sequences.
- **Smart Retry Logic**: Wrong category selected? It navigates back and retries up to 2 times per post.
- **Infinite Loop Architecture**: Runs indefinitely until every post on the wall is reported.
- **IIFE Encapsulation**: Zero global namespace pollution, no conflicts with existing page scripts.
- **Color-Coded Battle Logs**: Real-time console output shows every destroyed post, retry, and recovery action.
- **Skull & Crossbones Banner**: ASCII art header announces script activation with style.

---

## Technical Specs

- **Language**: Vanilla JavaScript (ES6+)
- **Execution Model**: Immediately Invoked Function Expression (IIFE) with async/await task queue
- **DOM Selectors**: ARIA label targeting for accessibility-compliant UI automation
- **Error Handling**: Multi-tier retry with exponential fallback (Back → Close → Escape)
- **Scroll Strategy**: Infinite viewport injection via `window.scrollBy(0, 1000000)` @ 1ms intervals
- **State Management**: DOM attribute marking (`data-processed`) prevents duplicate processing
- **Target Platform**: Facebook (Web) — Mobile and other platforms coming soon

---

## Usage

### Prerequisites
- Desktop browser (Chrome, Firefox, Edge recommended)
- Facebook account with reporting permissions
- DevTools console access

### Deployment

1. **Navigate to the hate-spreader's Facebook profile.**
2. **Open DevTools Console** (`F12` or `Ctrl+Shift+I` / `Cmd+Option+I` on Mac).
3. **Paste the entire Reputation Killer script** into the console and press `Enter`.
4. **Watch the annihilation unfold** in real-time as posts are auto-reported.
   - To stop the scroll prematurely: `stopScroll()`
   - Monitor destruction count and recovery actions in the console logs.

### Example Console Output

```
☠️ REPUTATION KILLER JS ENGAGED! ☠️
[☠️] Cycle #7 | Total destroyed: 511
⬅️ BACK clicked - retrying
❌ CLOSE clicked - forcing modal close
☠️ REPUTATION DESTROYED #512
```

---

## Roadmap

- **Platform Expansion**: Instagram, Twitter/X, Reddit, LinkedIn hate speech reporters
- **Headless Mode**: Puppeteer/Playwright integration for background execution
- **GUI Dashboard**: Electron-based control panel with real-time stats and targeting
- **Report Analytics**: Export CSV logs of reported posts with timestamps and categories
- **Multi-Profile Targeting**: Batch processing for coordinated reporting campaigns

---

## Disclaimer

The Reputation Killer is an automation tool for combating hate speech and assisting content moderation. It is designed for **ethical use by individuals reporting genuinely harmful content** in accordance with Facebook's Community Standards.

**Use at your own risk.** Ensure compliance with platform policies and local laws. Auto reporting of non-violating content may result in account suspension. The author assumes no liability for misuse, abuse, or consequences arising from deployment of this script.

**This tool does not replace human judgment.** Verify content violates platform rules before deploying.

---

## Philosophy

Hate speech thrives in silence and inaction. The Reputation Killer is my answer to those who weaponize social platforms to spread bigotry, violence, and harm.

**Every line of code is a line of defense.**  
**Every execution is an act of resistance.**  
**Every report is a step toward a cleaner internet.**

When moderation fails, automation prevails.

---

**Because every hate post deserves annihilation.**  
**Be legendary. Be relentless. Be the reckoning.**

☠️ *The Reputation Killer — Justice, Automated.* 🦴
