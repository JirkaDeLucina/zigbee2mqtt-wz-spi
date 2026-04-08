# 🚀 Zigbee2MQTT External Converter for Skydance WZ-SPI (Tuya)

Finally, a fully functional integration for the **Skydance WZ-SPI** (Tuya) digital LED controller. 

> **☕ Support my work:** This project was a labor of love (and a bit of madness). It took a significant amount of my time and nerves to get every pixel and every color right. If this script saved your project or your sanity, **[consider buying me a coffee here](https://www.buymeacoffee.com/JirkaDeLucina)**. Your support keeps me motivated to fix more broken things!

---

## ✨ Key Features
* **Full Lighting Control:** Smooth brightness, color selection, and saturation.
* **Chip Support:** Optimized for **SK6812 (RGBW)**, **WS2814 (RGBW)**, and **WS2811 (RGB)**. *(Tested & verified with SK6812 and WS2814)*
* **Dynamic Effects:** Access to all built-in effects + **Effect Speed** control.
* **Custom Effects:** Create your own magic with a **4-color custom effect selector**.
* **Technical Precision:** Direct control over **Pixel Count** (up to 1000), chip settings and music mode support.

<img width="1043" height="704" alt="image" src="https://github.com/user-attachments/assets/5fccf041-f9c4-4dd9-8a9b-df2f52023fb0" />

<img width="1053" height="615" alt="image" src="https://github.com/user-attachments/assets/e820bb0f-9290-4cf0-82b6-fe8f9350570b" />

<img width="1055" height="690" alt="image" src="https://github.com/user-attachments/assets/06b86d43-a93c-4ce0-953e-9f6caabf4f94" />

<img width="1984" height="1120" alt="image" src="https://github.com/user-attachments/assets/dcf7bfa4-b986-49c4-9a5f-1f30a3e6ed19" />

<img width="1984" height="1120" alt="image" src="https://github.com/user-attachments/assets/3f27bed3-65fe-4760-84e5-7c55e4b34b93" />

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

### ⚠️ Important: Register the Converter
If you used **Option 2** or **Option 3** (manual file upload), Zigbee2MQTT won't know about the new file until you register it. You can do this in two ways:

#### A) Via Zigbee2MQTT Web UI:
1. Go to **Settings** -> **External converters**.
2. Type `wz-spi.js` into the text box and click **Submit**.
3. Restart Zigbee2MQTT.

#### B) Manually via configuration.yaml:
If you prefer editing code, open your `configuration.yaml` file (usually located in `/config/zigbee2mqtt/`) and add the following lines:

```yaml
external_converters:
  - wz-spi.js
```

Note: If you already have other external converters, just add - wz-spi.js as a new line under the existing ones.

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

## ⚖️ License & Commercial Use

This project is licensed under the **CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial)**. 

- **Personal Use:** Free and encouraged! Feel free to use it in your home automation.
- **Commercial Use:** Use of this code in commercial products, services, or for-profit installations is **strictly prohibited** without a separate commercial license.

**Are you a company or professional installer?**
If you wish to use this converter for commercial purposes, please contact me directly to negotiate a commercial license. I am open to cooperation!

📧 **Contact:**
If you wish to use this converter for commercial purposes, please **[open a new Issue](https://github.com/JirkaDeLucina/zigbee2mqtt-wz-spi/issues)** in this repository with the subject "Commercial Inquiry" or send me a message via my **[Buy Me a Coffee profile](https://www.buymeacoffee.com/JirkaDeLucina)**. 

I will get back to you as soon as possible to discuss the details.

*Created with ❤️ by JirkaDeLucina*
