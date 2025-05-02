
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  if (tabId === 'progress') updateProgressTracker();
}

function calcRobux() {
  const r = parseFloat(document.getElementById('robuxInput').value) || 0;
  document.getElementById('roproValue').innerText = `RoPro: $${(r * 0.0125).toFixed(2)}`;
  document.getElementById('devexValue').innerText = `DevEx: $${(r * 0.0035).toFixed(2)}`;
  document.getElementById('buyingValue').innerText = `Buying: $${(r * 0.01).toFixed(2)}`;
}

function calculateGoal() {
  const g = parseFloat(document.getElementById('goalAmount').value);
  const d = parseFloat(document.getElementById('dailyAmount').value);
  if (g && d && d > 0) {
    localStorage.setItem("goalAmount", g);
    localStorage.setItem("earnedSoFar", d);
    const days = Math.ceil(g / d);
    const end = new Date(); end.setDate(end.getDate() + days);
    document.getElementById('goalResult').innerText = `Goal in ${days} days (~${end.toDateString()})`;
    updateProgressTracker();
  }
}

function updateProgressTracker() {
  const goal = parseFloat(localStorage.getItem("goalAmount")) || 0;
  const earned = parseFloat(localStorage.getItem("earnedSoFar")) || 0;
  const progress = goal ? Math.min(earned / goal * 100, 100) : 0;
  document.getElementById("goalProgress").style.width = progress + "%";
  document.getElementById("goalText").innerText = `Progress: ${earned} / ${goal} Robux (${Math.floor(progress)}%)`;
  document.getElementById("badgeProgressText").innerText = `0 / 2 badges unlocked (0%)`;
}

function updateProgressTimestamp() {
  const now = new Date();
  document.getElementById("progressTimestamp").innerText = now.toLocaleString();
}

function shareProgress() {
  const target = document.querySelector("#progressWrapper");
  
  const wrapper = document.getElementById("progressWrapper");
  const header = document.getElementById("progressScreenshotHeader");
  updateProgressTimestamp();
  header.style.display = "flex";
  wrapper.style.border = "4px solid #4caf50";

  html2canvas(target, { backgroundColor: "#121212" }).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "robux_progress.png";
      link.href = url;
      link.click();
      
      document.getElementById("shareStatus").innerText = "✅ Progress image downloaded!";
      header.style.display = "none";
      wrapper.style.border = "none";

    });
  }).catch(err => {
    console.error(err);
    document.getElementById("shareStatus").innerText = "❌ Failed to capture progress.";
  });
}

function copyToClipboard() {
  const target = document.querySelector("#progressWrapper");
  
  const wrapper = document.getElementById("progressWrapper");
  const header = document.getElementById("progressScreenshotHeader");
  updateProgressTimestamp();
  header.style.display = "flex";
  wrapper.style.border = "4px solid #4caf50";

  html2canvas(target, { backgroundColor: "#121212" }).then(canvas => {
    canvas.toBlob(blob => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        
        document.getElementById("shareStatus").innerText = "📋 Progress image copied to clipboard!";
        header.style.display = "none";
        wrapper.style.border = "none";

      }, err => {
        console.error(err);
        document.getElementById("shareStatus").innerText = "❌ Failed to copy image.";
      });
    });
  }).catch(err => {
    console.error(err);
    document.getElementById("shareStatus").innerText = "❌ Failed to capture image.";
  });
}
