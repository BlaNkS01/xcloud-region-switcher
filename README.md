<div align="center">

# 🌍 xCloud Region Switcher

### Choose your preferred Xbox Cloud Gaming region

**A lightweight, unofficial Chrome & Edge extension for experimenting with xCloud region selection.**  
Manual region selection · Automatic selection modes · Local settings · No built-in VPN

![Version](https://img.shields.io/badge/version-1.5.1-7c3aed?style=flat-square)
![Browsers](https://img.shields.io/badge/Chrome%20%26%20Edge-supported-2563eb?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)
![Status](https://img.shields.io/badge/status-experimental-f59e0b?style=flat-square)

[![View Installation Guide](https://img.shields.io/badge/Installation-Get%20Started-7c3aed?style=for-the-badge)](#-installation)
[![Explore ToolNovaHub](https://img.shields.io/badge/ToolNovaHub-Explore%20Our%20Tools-2563eb?style=for-the-badge)](https://toolnovahub.github.io/)

[Features](#-features) · [Screenshots](#-screenshots) · [Installation](#-installation) · [Limitations](#-important-limitations) · [Privacy](#-privacy--permissions) · [Other Projects](#-our-other-projects)

</div>

---

## ✨ Overview

**xCloud Region Switcher** helps you request a preferred region when using Xbox Cloud Gaming in Microsoft Edge or Google Chrome. It offers manual selection and experimental automatic modes, with settings stored locally in the browser.

> [!IMPORTANT]
> This is an **unofficial, experimental** project. Selecting a region does **not** guarantee which streaming server Xbox will actually use. The extension does **not** change your public IP address or provide a VPN.

## 🚀 Features

| Feature | What it does |
| --- | --- |
| 🌍 **Manual region selection** | Choose from regions returned by Xbox Cloud Gaming |
| 🧭 **Automatic selection** | Estimate the nearest known region using a fixed Central European reference point |
| ⚡ **Experimental response-time comparison** | Compare HTTP response times where browser and endpoint access allow, with geographic fallback |
| 🔓 **Experimental region bypass** | Attempt regional access handling without a built-in VPN or proxy; success is not guaranteed |
| 📍 **Region status** | Show the requested region and the actual region **when Xbox explicitly reports it** |
| 💾 **Local preferences** | Save your settings using browser extension storage |

## 📸 Screenshots

<div align="center">

### Extension interface

<img src="screenshot-optimized.png" alt="xCloud Region Switcher extension popup showing region settings and status" width="640">

*Region options, automatic modes, and requested/actual region status.*

### Available server regions

<img src="screenshot-optimized2.png" alt="xCloud Region Switcher list of available regions" width="640">

*Detected regions, automatic selection modes, and the Xbox default option.*

</div>

## 📦 Installation

This project is installed as an **unpacked browser extension**.

1. Download the repository as a ZIP using **Code → Download ZIP**, then extract it.
2. Open **`edge://extensions`** or **`chrome://extensions`**.
3. Turn on **Developer mode**.
4. Select **Load unpacked** and choose the extracted extension folder containing the extension's `manifest.json`.
5. Open [Xbox Cloud Gaming](https://www.xbox.com/play) or [play.xbox.com](https://play.xbox.com).
6. Open the extension popup, choose your preferences, then select **Save settings and reload xCloud**.

> [!TIP]
> If the browser reports that no manifest was found, select the inner folder containing `manifest.json`, not its parent ZIP extraction folder.

## ⚠️ Important limitations

- **No VPN or IP change.** The experimental bypass does not change your public IP address.
- **Requested ≠ actual region.** Xbox may assign a different streaming server.
- **Not a streaming ping test.** The experimental latency comparison measures HTTP response time to eligible Xbox-provided endpoints, not streaming-server latency.
- **Approximate automatic selection.** The geographic mode uses a fixed Central European reference point, not your precise location.
- **Compatibility can change.** Browser behavior, account access, Xbox endpoints, and regional restrictions may affect results.
- **No performance guarantees.** Lower latency, better streaming quality, and future compatibility are not guaranteed.
- Use may be subject to Xbox terms and regional restrictions.

## 🔒 Privacy & permissions

The extension uses browser **storage** and access to supported Xbox pages to apply settings and inspect relevant responses. It has **no built-in VPN, proxy, or remote telemetry server**.

The experimental bypass attempts to add an `X-Forwarded-For` header to a login request. Browsers or servers may ignore or block it. Review the source code and requested permissions before installing.

## 🧩 Our other projects

| Project | Description |
| --- | --- |
| [**ToolNovaHub**](https://toolnovahub.github.io/) | 30 free browser-based tools for images, PDFs, text, and developers |
| [**xCloud Toolkit**](https://github.com/BlaNkS01/xcloud-toolkit) | Customization and controls for Xbox Cloud Gaming |
| [**All our projects**](https://toolnovahub.github.io/projects/) | Explore the full project collection |

## 🤝 Feedback & contributing

Found an issue? [Open a GitHub issue](https://github.com/BlaNkS01/xcloud-region-switcher/issues) and include your browser version, xCloud URL, selected region, and steps to reproduce. **Do not share account tokens or private session data.**

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE).

## 🏷️ Release

**v1.5.1** — English UI. Tested by the project owner; behavior may vary by account, browser, and region.

---

<div align="center">

**Made for the Xbox Cloud Gaming community 🎮**

[⬆ Back to top](#-xcloud-region-switcher) · [🌐 ToolNovaHub](https://toolnovahub.github.io/) · [🧩 Our Projects](https://toolnovahub.github.io/projects/)

*Independent community project. Not affiliated with, endorsed by, or supported by Microsoft or Xbox.*

</div>
