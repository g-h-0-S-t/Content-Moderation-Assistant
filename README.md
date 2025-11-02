# Content Moderation Tool

A browser-based automation tool for efficiently reporting policy-violating content on Facebook. This bookmarklet provides a streamlined interface for batch processing violation reports through Facebook's official reporting system.

## 🎯 Purpose

This tool assists content moderators and concerned users in reporting content that violates Facebook's Community Standards, specifically focusing on:
- Violent, hateful, or disturbing content
- Hate speech promotion
- Harassment and bullying

## ✨ Features

### Core Functionality
- **🔄 Automated Batch Processing** - Process multiple posts simultaneously
- **📊 Real-time Statistics** - Track reports, cycles, and performance metrics
- **🎨 Light/Dark Mode** - Toggle between light and dark themes
- **📈 Progress Tracking** - Visual progress indicators for each cycle
- **🔍 Intelligent Scrolling** - Automatically loads more content
- **⚡ Parallel Processing** - Handles multiple reports in one cycle

### User Interface
- **Clean Design** - Professional, distraction-free interface
- **Side Panel** - Non-intrusive left-side panel that doesn't block content
- **Hide/Show Toggle** - Minimize panel when not needed
- **Performance Metrics** - Actions per second, uptime, peak batch size
- **Activity Log** - Timestamped log of all actions

## 🚀 Installation

### Step 1: Create a Bookmarklet

1. **Show your browser's bookmarks bar:**
   - Chrome/Edge: `Ctrl+Shift+B` (Windows) or `Cmd+Shift+B` (Mac)
   - Firefox: `Ctrl+Shift+B` (Windows) or `Cmd+Shift+B` (Mac)
   - Safari: `Cmd+Shift+B` (Mac)

2. **Create a new bookmark:**
   - Right-click on the bookmarks bar
   - Select "Add page" or "Add bookmark"

3. **Configure the bookmark:**
   - **Name:** `Content Moderation Tool`
   - **URL:** Copy the entire bookmarklet code (starts with `javascript:(function()...`)

4. **Save the bookmark**

### Step 2: Usage

1. Navigate to the target platform in your browser
2. Browse to the content area where moderation is needed
3. Click the bookmarklet in your bookmarks bar
4. The tool panel will appear on the left side of your screen

## 📖 How to Use

### Starting the Tool

1. **Click the bookmarklet** - The moderation panel appears on the left
2. **Review the interface** - Check that statistics show "ACTIVE" status
3. **Let it run** - The tool automatically:
   - Finds posts with Actions buttons
   - Opens report dialogs
   - Selects appropriate violation categories
   - Submits reports
   - Scrolls to load more content

### Controls

- **🌙/☀️ Theme Toggle** - Switch between dark and light modes
- **◀ Hide Button** - Minimize the panel (click the side tab to show again)
- **⏹️ Stop Process** - Stop the automation immediately

### Understanding the Statistics

- **Reported** - Total number of posts reported
- **Cycles** - Number of batch processing cycles completed
- **Last Batch** - Number of posts in the most recent cycle
- **Status** - Current state (ACTIVE, STOPPED, COMPLETE)
- **Actions/s** - Average automation actions per second
- **Uptime** - Total running time
- **Peak** - Largest batch size processed
- **Scrolls** - Number of page scrolls performed

## ⚙️ How It Works

### Processing Flow

1. **Discovery Phase**
   - Scans the page for unprocessed posts
   - Identifies posts with "Actions" buttons
   - Filters out already-processed items

2. **Batch Processing**
   - Opens Actions menus for all discovered posts
   - Initiates reporting workflow for each item
   - Navigates through platform's standard reporting interface:
     - Category selection based on policy violation type
     - Subcategory refinement as per platform guidelines
     - Reason specification according to Community Standards
   - Submits reports through official channels

3. **Cleanup Phase**
   - Closes all open dialogs
   - Waits for Facebook to process submissions
   - Marks posts as processed

4. **Content Loading**
   - Scrolls page to load more posts
   - Waits for new content to render
   - Repeats the cycle

### Safety Features

- **Sequential Processing** - Completes one batch before starting another
- **Dialog Cleanup** - Ensures all dialogs are closed between cycles
- **Duplicate Prevention** - Tracks processed posts to avoid double-reporting
- **Rate Limiting** - Includes delays between actions to avoid overloading

## 🛡️ Best Practices

### Responsible Use

1. **Review Before Reporting** - Ensure content genuinely violates policies
2. **Monitor the Tool** - Stay present while the tool is running
3. **Stop When Needed** - Use the stop button if you need to intervene
4. **Check Accuracy** - Periodically verify reports are categorized correctly

### Performance Tips

1. **Stable Connection** - Use a stable internet connection
2. **Keep Tab Active** - Keep the Facebook tab in focus
3. **Avoid Interference** - Don't manually interact while tool is running
4. **Browser Updates** - Keep your browser up to date

## 🔧 Technical Details

### Compatibility

- **Browsers:** Chrome, Edge, Firefox, Safari (modern versions)
- **Platform:** Social media web interfaces with standard reporting flows
- **Requirements:** JavaScript enabled, bookmarklets allowed

### Architecture

- **Client-side Only** - All processing happens in your browser
- **No External Servers** - No data is sent to third parties
- **Platform Interface Integration** - Interacts with official platform reporting workflows
- **DOM Automation** - Automates navigation through standard platform UI elements

### Limitations

- **Requires Active Tab** - Browser must be focused for automation
- **Platform Updates** - May require updates if platform modifies their reporting UI
- **Rate Limits** - Platforms may implement rate limits on report submissions
- **Network Dependent** - Requires stable internet connection

## ⚠️ Disclaimer

This tool is intended for legitimate content review and platform moderation assistance only:

- **Follow Platform Terms** - Use in accordance with the platform's Terms of Service and Community Standards
- **Report Policy Violations** - Only submit reports for content that genuinely violates documented platform policies
- **Responsible Usage** - Tool is designed for assisting legitimate moderation workflows, not for coordinated mass reporting
- **User Accountability** - Users are fully responsible for their actions and report accuracy

**Important:** This tool automates interaction with official platform reporting interfaces. All submissions are subject to platform review processes. Inappropriate use may result in account restrictions per platform policies.

## 🤝 Contributing

Contributions are welcome! Please ensure:

- Code follows existing style conventions
- Changes are well-documented
- Testing is performed before submitting
- Commits have clear, descriptive messages

## 📄 License

This project is provided as-is for educational and legitimate moderation purposes.

## 🆘 Troubleshooting

### Tool Not Starting
- **Check Browser Console** - Look for JavaScript errors
- **Verify Bookmarklet** - Ensure entire code was copied
- **Try Reloading** - Refresh Facebook page and try again

### Reports Not Submitting
- **Check Platform Status** - Ensure the platform is operational
- **Verify Categories** - Platform may have updated their reporting options
- **Clear Cache** - Clear browser cache and cookies
- **Update Browser** - Ensure browser is up to date

### Performance Issues
- **Close Other Tabs** - Reduce browser memory usage
- **Disable Extensions** - Some extensions may interfere
- **Check Network** - Verify internet connection is stable
- **Restart Browser** - Close and reopen browser

## 📮 Support

For issues, questions, or suggestions:
- Check the documentation first
- Review troubleshooting section
- Open an issue on GitHub

---

**Made for responsible content moderation** | **Use ethically and responsibly** | **Version 1.0**
