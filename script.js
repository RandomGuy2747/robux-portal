
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
  updateCalcPie();
}

function updateCalcPie() {
  const robux = parseFloat(document.getElementById("robuxInput")?.value || 0);
  const roproVal = robux * 0.0125;
  const devexVal = robux * 0.0035;
  const keepPercent = Math.round((devexVal / roproVal) * 100) || 0;
  const losePercent = 100 - keepPercent;

  document.getElementById("calcRoProEstimateText").innerText = `RoPro Estimate: $${roproVal.toFixed(2)}`;
  document.getElementById("calcKeepPercent").innerText = `You keep: ${keepPercent}%`;
  document.getElementById("calcLosePercent").innerText = `You lose: ${losePercent}%`;

  const ctx = document.getElementById("calcPie").getContext("2d");
  if (window.calcPieChart) window.calcPieChart.destroy();
  window.calcPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Kept (DevEx)', 'Lost (to Roblox)'],
      datasets: [{
        data: [keepPercent, losePercent],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: { responsive: false }
  });
}

function updateProgressTracker() {
  const goal = parseFloat(localStorage.getItem("goalAmount")) || 0;
  const earned = parseFloat(localStorage.getItem("earnedSoFar")) || 0;
  const progress = goal ? Math.min(earned / goal * 100, 100) : 0;
  document.getElementById("goalProgress").style.width = progress + "%";
  document.getElementById("goalText").innerText = `Progress: ${earned} / ${goal} Robux (${Math.floor(progress)}%)`;
  document.getElementById("badgeProgressText").innerText = `0 / 2 badges unlocked (0%)`;
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

function shareProgress() {
  const target = document.querySelector("#progress");
  html2canvas(target).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "robux_progress.png";
      link.href = url;
      link.click();
      document.getElementById("shareStatus").innerText = "✅ Progress image downloaded!";
    });
  }).catch(err => {
    console.error(err);
    document.getElementById("shareStatus").innerText = "❌ Failed to capture progress.";
  });
}


function copyToClipboard() {
  const target = document.querySelector("#progress");
  html2canvas(target).then(canvas => {
    canvas.toBlob(blob => {
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]).then(() => {
        document.getElementById("shareStatus").innerText = "📋 Progress image copied to clipboard!";
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
