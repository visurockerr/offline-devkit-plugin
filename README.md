# DevKit — Developer Toolbox for Microsoft Edge

A handy browser toolbox of everyday developer utilities, all in one popup. No sign-up, no servers, no tracking.

> **🔒 100% offline.** DevKit runs entirely inside your browser. It makes **no network requests**, has **no background scripts**, and requires **no special permissions**. Nothing you type ever leaves your machine. You can use every tool with your internet disconnected.

---

## Getting started

Follow these steps to get DevKit running in Microsoft Edge:

1. **Get the files** — Download or clone this repository to a folder you'll keep (Edge loads the extension from this folder, so don't delete it later).
2. **Open the extensions page** — In Edge, type **`edge://extensions`** into the address bar and press Enter.
3. **Enable Developer mode** — Turn on the **Developer mode** toggle in the bottom-left corner.
4. **Load the extension** — Click **Load unpacked**, then select the project folder that contains `manifest.json`.
5. **Pin it (optional)** — Click the **Extensions** (puzzle piece) icon in the toolbar, find **DevKit**, and click the **pin** icon for one-click access.
6. **Start using it** — Click the **DevKit** icon, pick a tool, and go. No accounts, no configuration, no internet needed.

> Detailed instructions for each step are in the sections below.

## Features

| Tool | What it does |
| --- | --- |
| 🔗 **URL Encoder / Decoder** | Encode and decode URL / URI component strings. |
| 🆔 **UUID Generator** | Generate v4 UUIDs, one at a time or in bulk. |
| 🌿 **Git Branch Name** | Produce random, readable branch names with optional type prefix, custom separator, and ticket IDs. |
| 🎨 **JSON Pretty Print** | Format, indent, and colorize JSON for easy reading. |
| 🔀 **Diff / Text Compare** | Compare two blocks of text side by side. |
| 🔄 **JSON ↔ YAML** | Convert between JSON and YAML in both directions. |
| 🔑 **Password Generator** | Generate strong random passwords using the browser's cryptographic RNG, with character-set controls, ambiguous-character exclusion, and a live entropy/strength meter. |

Each tool opens in place inside the popup, with a **← Back** button to return to the tool list.

---

## Why offline matters

- **Privacy** — Sensitive data (passwords, JSON payloads, tokens in URLs) is processed locally and never transmitted anywhere.
- **Security** — With no network access and no host permissions, there is no attack surface for data exfiltration.
- **Reliability** — Works on a plane, behind a strict firewall, or on an air-gapped machine.

The extension's `manifest.json` declares no `permissions` and no `host_permissions` for network access. All logic lives in local HTML/JS files bundled with the extension.

---

## Download

1. Download or clone this repository to your computer:
   ```
   git clone <this-repo-url>
   ```
   Or download the ZIP and extract it to a folder you'll keep (don't delete it later — Edge loads the extension from this folder).

2. Make sure the extracted folder contains `manifest.json` at its top level.

---

## Install in Microsoft Edge

DevKit is loaded as an **unpacked extension** (developer mode). This is the standard way to run a local, offline extension that isn't published to a store.

1. Open Edge and go to **`edge://extensions`** (type it into the address bar and press Enter).
2. Turn on **Developer mode** using the toggle in the bottom-left corner.
3. Click **Load unpacked**.
4. In the file picker, select the folder that contains `manifest.json` (the root of this project).
5. DevKit now appears in your extensions list. ✅

### Pin it to the toolbar

1. Click the **Extensions** (puzzle piece) icon in the Edge toolbar.
2. Find **DevKit** and click the **pin** icon next to it.
3. The DevKit icon stays visible in your toolbar for one-click access.
---

### No install? Just open it in your browser

You don't have to load the extension at all. Because every tool is a plain local HTML page, you can run the whole toolbox straight from the files:

1. Go to the project folder on your computer.
2. Open **`dev-tools/index.html`** in any browser (double-click it, or drag it into a browser window).
3. The DevKit tool grid opens as a normal web page — pick a tool and use it right there.

This works fully offline, with no extension and no setup.

---

## Usage

1. Click the **DevKit** icon in the toolbar.
2. Pick a tool from the grid.
3. Use the tool, then click **← Back** to choose another.

That's it — no accounts, no configuration, no internet needed.

---

## Updating

If you pull new changes or edit the files:

1. Go to **`edge://extensions`**.
2. Find **DevKit** and click the **reload** (↻) icon on its card.

---

## Project structure

```
.
├── manifest.json              # Manifest V3 extension manifest
├── popup.html                 # Popup shell + tool list
├── popup.js                   # Loads each tool into an in-popup iframe
├── icons/                     # Extension icons (16/32/48/128 + svg)
└── dev-tools/
    └── tools/
        ├── url-encoder.html / .js
        ├── uuid-generator.html / .js
        ├── branch-name.html / .js
        ├── json-pretty.html / .js
        ├── diff.html / .js
        ├── json-yaml.html / .js
        ├── password.html / .js
        └── common.js          # Shared helpers (e.g. copy-to-clipboard)
```

---

## Compatibility

Built on **Manifest V3**, so it also works in other Chromium-based browsers (Chrome, Brave, Opera, Vivaldi) using the same "Load unpacked" steps on their respective extensions pages.
