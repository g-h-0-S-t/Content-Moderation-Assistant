# Content Moderation Assistant 🛡️

**An Automated Reporting Tool for Facebook Policy Violations**

---

## Overview

**Content Moderation Assistant** is a browser automation script designed to streamline the reporting process for policy-violating content on Facebook. When you encounter accounts repeatedly posting content that violates community standards, this tool helps you efficiently submit reports through Facebook's official reporting interface.

This script automates the manual clicking process, saving time when reporting multiple policy violations from a single source.

**Key Characteristics:**
- **Efficient**: Processes multiple posts quickly through automated navigation
- **Persistent**: Includes retry logic to handle UI inconsistencies
- **Thorough**: Systematically reviews content on profile walls
- **Precise**: Targets specific violation categories through Facebook's native reporting flow
- **Self-Correcting**: Handles modal dialogs and navigation errors automatically
- **Session Persistence**: Remembers progress across browser sessions using localStorage

Built with modern JavaScript and browser automation techniques, it features asynchronous task management, intelligent DOM traversal, automatic scroll loading, and modal state recovery.

---

## Functionality

The script navigates through posts on a Facebook profile, opens the reporting interface for each post, selects appropriate violation categories (e.g., "Policy Violation → Harmful Content → Specific Subcategory"), submits reports, and continues to the next item. It automatically scrolls to load additional content and includes error recovery for common UI issues.

**Streamlined Reporting for Community Safety**

---

## Features

- **Fast Processing**: Efficient scrolling mechanism loads content rapidly
- **Error Recovery**: Automatically handles stuck dialogs and UI inconsistencies
- **Smart Retry System**: Reprocesses items if incorrect options are selected
- **Continuous Operation**: Runs until all loaded content is processed
- **Session Persistence**: Remembers processed count across browser restarts
- **Manual Controls**: Expose `stopScroll()` and `resetProcessCount()` functions
- **Isolated Execution**: IIFE pattern prevents conflicts with page scripts
- **Detailed Logging**: Console output tracks progress and actions
- **Visual Feedback**: ASCII banner and formatted logs for monitoring
- **Bookmarklet Support**: One-click activation from bookmarks bar

---

## Technical Details

- **Language**: Vanilla JavaScript (ES6+)
- **Architecture**: Immediately Invoked Function Expression (IIFE) with async/await
- **Selector Strategy**: ARIA label targeting for robust element selection
- **Error Handling**: Multi-tier retry with fallback navigation (Back → Close → Escape)
- **Scroll Implementation**: Viewport manipulation via `window.scrollBy()` with interval control
- **State Tracking**: DOM attributes (`data-processed`) prevent duplicate operations
- **Persistence**: localStorage for cross-session counter maintenance
- **Platform**: Facebook Web Interface

---

## Usage Guide

### Requirements
- Desktop web browser (Chrome, Firefox, Edge, or Safari)
- Active Facebook account
- Browser Developer Tools access (Console Method) OR Bookmarks Bar (Bookmarklet Method)

---

### Method 1: Bookmarklet (Recommended)

**One-click activation from your bookmarks bar**

#### Chrome / Edge / Brave:
1. Press **Ctrl+Shift+O** (Windows) or **Cmd+Option+B** (Mac) to open Bookmarks Manager
2. Click **"⋮"** (three dots) → **"Add new bookmark"**
3. **Name:** `🛡️ Moderation Assistant`
4. **URL:** Copy and paste the bookmarklet code from `bookmarklet.js`
5. Click **Save**

#### Firefox:
1. Press **Ctrl+Shift+B** to show Bookmarks Toolbar
2. Right-click toolbar → **"New Bookmark"**
3. **Name:** `🛡️ Moderation Assistant`
4. **Location:** Copy and paste the bookmarklet code from `bookmarklet.js`
5. Click **Add**

#### Safari:
1. Show Favorites Bar: **View** → **Show Favorites Bar**
2. Drag any link to Favorites Bar (temporary placeholder)
3. Right-click the bookmark → **Edit Address**
4. Replace URL with the bookmarklet code from `bookmarklet.js`
5. Rename to `🛡️ Moderation Assistant`
6. Save

#### Using the Bookmarklet:
1. **Navigate to the target Facebook profile**
2. **Click the bookmarklet** from your bookmarks bar
3. **Monitor progress** through console logs (press `F12` to open Developer Tools)
4. Use console commands:
   - `stopScroll()` - Stop auto-scrolling
   - `resetProcessCount()` - Reset the counter

---

### Method 2: Developer Console

**Traditional manual execution**

1. **Navigate to the target Facebook profile**
2. **Open Developer Tools Console** (`F12` or `Ctrl+Shift+I` / `Cmd+Option+I` on Mac)
3. **Copy and paste the script** from `moderation-assistant.js` into the console
4. **Press Enter** to execute
5. **Monitor progress** through console logs
   - Use `stopScroll()` to halt the process
   - Use `resetProcessCount()` to reset counter
   - Track processing count and status updates

---

### Sample Console Output

