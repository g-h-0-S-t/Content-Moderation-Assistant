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
- **Isolated Execution**: IIFE pattern prevents conflicts with page scripts
- **Detailed Logging**: Console output tracks progress and actions
- **Visual Feedback**: ASCII banner and formatted logs for monitoring

---

## Technical Details

- **Language**: Vanilla JavaScript (ES6+)
- **Architecture**: Immediately Invoked Function Expression (IIFE) with async/await
- **Selector Strategy**: ARIA label targeting for robust element selection
- **Error Handling**: Multi-tier retry with fallback navigation (Back → Close → Escape)
- **Scroll Implementation**: Viewport manipulation via `window.scrollBy()` with interval control
- **State Tracking**: DOM attributes (`data-processed`) prevent duplicate operations
- **Platform**: Facebook Web Interface

---

## Usage Guide

### Requirements
- Desktop web browser (Chrome, Firefox, Edge, or Safari)
- Active Facebook account
- Browser Developer Tools access

### Installation Steps

1. **Navigate to the target Facebook profile**
2. **Open Developer Tools Console** (`F12` or `Ctrl+Shift+I` / `Cmd+Option+I` on Mac)
3. **Copy and paste the script** into the console
4. **Press Enter** to execute
5. **Monitor progress** through console logs
   - Use `stopScroll()` to halt the process
   - Track processing count and status updates

### Sample Console Output

```
🛡️ MODERATION ASSISTANT ACTIVE
[📊] Cycle #7 | Total processed: 511
⬅️ Navigation retry initiated
✓ Report submitted #512
```

---

## Development Roadmap

- **Multi-Platform Support**: Extend to Instagram, Twitter/X, Reddit, LinkedIn
- **Automation Framework**: Puppeteer/Playwright integration for headless operation
- **Management Interface**: Desktop application with analytics dashboard
- **Export Capabilities**: CSV logging of reported items with metadata
- **Batch Operations**: Multi-profile processing workflow

---

## Important Disclaimer

This tool is intended for **legitimate reporting of genuine policy violations** in accordance with Facebook's Community Standards and Terms of Service.

**Responsible Use Guidelines:**
- Only report content that genuinely violates platform policies
- Review Facebook's Community Standards before use
- Understand that false reporting may violate Terms of Service
- Be aware that automated actions may trigger platform security measures
- Use human judgment to verify violations before deployment

**The author assumes no responsibility for misuse or consequences arising from use of this script.** Users are solely responsible for ensuring compliance with all applicable platform policies, terms of service, and local laws.

---

## Philosophy

Effective content moderation requires both human judgment and efficient tools. This script serves as a force multiplier for users who regularly encounter policy violations and want to contribute to platform safety through proper reporting channels.

**Automation amplifies impact.**  
**Efficiency enables action.**  
**Community standards matter.**

---

## Contributing

Contributions welcome! Please ensure all modifications:
- Maintain ethical use focus
- Comply with platform terms of service
- Include proper error handling
- Document changes clearly

---

## License

Open source - use responsibly and ethically.

---

**Built for safer online communities through efficient moderation assistance.**

🛡️ *Content Moderation Assistant — Streamlined Reporting for Platform Safety*
