# 🚀 Zigbee2MQTT External Converter for Skydance WZ-SPI (Tuya)

Finally, a fully functional integration for the **Skydance WZ-SPI** (Tuya) digital LED controller. 

> **☕ Support my work:** This project was a labor of love (and a bit of madness). It took a significant amount of my time and nerves to get every pixel and every color right. If this script saved your project or your sanity, **[consider buying me a coffee here](https://www.buymeacoffee.com/JirkaDeLucina)**. Your support keeps me motivated to fix more broken things!

---

## ✨ Key Features
* **Full Lighting Control:** Smooth brightness, color selection, and saturation.
* **Chip Support:** Optimized for **SK6812 (RGBW)**, **WS2814 (RGBW)**, **WS2811 (RGB)** and others.
* **Dynamic Effects:** Access to all built-in effects + **Effect Speed** control.
* **Custom Effects:** Create your own magic with a **4-color custom effect selector**.
* **Technical Precision:** Direct control over **Pixel Count** (up to 1000), chip settings and music mode support.

---

## 🛠️ Installation Guide

### Option 1: Using the Zigbee2MQTT Web Interface (Recommended)
1. In **Home Assistant**, go to **Settings** -> **Add-ons** and ensure **Zigbee2MQTT** is installed.
2. Open the **Zigbee2MQTT** web UI.
3. Go to **Settings** -> **External converters**.
4. Click on the button to create a new file (or add a new entry), name it `wz-spi.js`.
5. Paste the code from this repository into the editor and click **Save**.

### Option 2: Manual Installation via File Editor (If Option 1 fails)
1. Install the **File Editor** add-on in Home Assistant.
2. In File Editor settings, switch **Enforce Basepath** to **OFF**.
3. Open File Editor and click on **Browse Filesystem** (folder icon).
4. Navigate to the **root directory** (arrow up), find the folder `addons_config`.
5. Open the Zigbee2MQTT folder (it usually looks like `45df7312_zigbee2mqtt` or similar).
6. Create a **New File** icon and name it `wz-spi.js`.
7. Paste the code into this file and **Save**.

### Option 3: Direct Download & Upload (The "Pro" Way)
1. In the file list at the top of this page, click on **`wz-spi.js`**.
2. Click the **Download raw file** icon (the small download arrow in the top right corner of the code box).
3. Save the file to your computer.
4. Open your Home Assistant and use the **File Editor** or **Samba share** to upload the file directly into your `/config/zigbee2mqtt/` folder.
5. Make sure the file is named exactly `wz-spi.js`.
---

## 🏁 Finalizing the Setup
1. Go to **Settings** -> **Add-ons** -> **Zigbee2MQTT** and click **Restart**.
2. Open the **Zigbee2MQTT** menu, go to **Devices**, click **Permit Join**, and pair your WZ-SPI controller.
3. Once added, go to the **Exposes** (Main Overview) tab of the device.
4. Your controller is now fully ready for action! 🎨

---

## 🌿 About the Author

I am an independent developer who believes in **justice, love, and goodness**. I build things that solve real-life frustrations. When I'm not fighting "byte shifts" in JavaScript, you'll find me growing lavender, traveling, or seeking spiritual harmony.

**Is this code useful to you? I'd be incredibly grateful if you bought me a coffee! 🍻**

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/JirkaDeLucina)

---
*Created with ❤️ by JirkaDeLucina*
