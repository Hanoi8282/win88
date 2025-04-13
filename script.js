let history = JSON.parse(localStorage.getItem("baccaratHistory")) || [];

function addResult(result) {
  history.push(result);
  localStorage.setItem("baccaratHistory", JSON.stringify(history));
  updateDisplay();
}

function resetHistory() {
  history = [];
  localStorage.removeItem("baccaratHistory");
  updateDisplay();
}

function updateDisplay() {
  const display = document.getElementById("historyDisplay");
  display.innerText = history.join(" - ");

  const pred = predictNext();
  document.getElementById("predictionText").innerText = `Dự đoán: ${pred.label} (${pred.confidence}%)`;
  document.getElementById("suggestionText").innerText = `Gợi ý cược: ${pred.betAmount}% vốn (${pred.direction})`;

  document.getElementById("profit5").innerText = calcProfit(5);
  document.getElementById("profit10").innerText = calcProfit(10);
}

function predictNext() {
  if (history.length < 5) {
    return { label: "Chưa đủ dữ liệu", confidence: 0, direction: "-", betAmount: 0 };
  }

  const last = history.slice(-5);
  const counts = { P: 0, B: 0, T: 0 };
  last.forEach(r => counts[r]++);

  let label = "P";
  let max = counts.P;
  if (counts.B > max) {
    label = "B";
    max = counts.B;
  } else if (counts.T > max) {
    label = "T";
    max = counts.T;
  }

  const confidence = Math.round((max / 5) * 100);
  const betAmount = confidence >= 80 ? 30 : confidence >= 60 ? 20 : 10;

  return {
    label,
    confidence,
    betAmount,
    direction: label === "P" ? "Cược Player" : label === "B" ? "Cược Banker" : "Cược Tie"
  };
}

function calcProfit(n) {
  const slice = history.slice(-n);
  let balance = 0;

  for (let i = 1; i < slice.length; i++) {
    const prev = slice[i - 1];
    const current = slice[i];
    if (prev === current) {
      balance += 1;
    } else {
      balance -= 1;
    }
  }

  return balance;
}

// Khởi tạo khi tải lại trang
updateDisplay();