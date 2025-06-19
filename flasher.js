import { flash } from 'https://unpkg.com/esp-web-flasher@6.0.2/dist/esp-web-flasher.min.js';

let port;

window.connectDevice = async function () {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    document.getElementById("status").textContent = "✅ Device connected!";
  } catch (error) {
    console.error("Connection error:", error);
    document.getElementById("status").textContent = "❌ Connection failed.";
  }
};

window.flashFirmware = async function () {
  const fileInput = document.getElementById("firmware");
  if (!fileInput.files.length) {
    alert("Please select a .bin file.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const firmware = new Uint8Array(reader.result);
    try {
      await flash(port, firmware, 0x10000); // 0x10000 is the flash offset
      document.getElementById("status").textContent = "✅ Flash successful!";
    } catch (err) {
      console.error("Flash error:", err);
      document.getElementById("status").textContent = "❌ Flash failed!";
    }
  };

  reader.readAsArrayBuffer(file);
};
