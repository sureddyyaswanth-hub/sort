// main.js - combined sorting logic
document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("inputArray");
  const generateBtn = document.getElementById("generateBtn");
  const combinedBtn = document.getElementById("combinedBtn");
  const resetBtn = document.getElementById("resetBtn");
  const comparisonCount = document.getElementById("comparisonCount");
  const swapCount = document.getElementById("swapCount");
  const executionTime = document.getElementById("executionTime");
  const arraySize = document.getElementById("arraySize");
  const bubbleResult = document.getElementById("bubbleResult");
  const mergeResult = document.getElementById("mergeResult");
  const rangeSelect = document.getElementById("rangeSelect");
  const bubbleTimeEl = document.getElementById("bubbleTime");
  const mergeTimeEl = document.getElementById("mergeTime");
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    const root = document.documentElement;
    const isLight = theme === "light";
    // apply class and attribute for broad compatibility
    root.classList.toggle("light-mode", isLight);
    try {
      root.setAttribute("data-theme", theme);
    } catch (e) {}
    if (themeToggle) {
      themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
    }
    try {
      localStorage.setItem("site-theme", theme);
    } catch (e) {}
  }

  const savedTheme =
    (function () {
      try {
        return localStorage.getItem("site-theme");
      } catch (e) {
        return null;
      }
    })() || "dark";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.classList.contains("light-mode")
        ? "light"
        : "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
    });
  }

  function parseInput() {
    const v = inputEl.value.trim();
    if (!v) return [];
    return v
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));
  }

  function genRandomArray(n = 10, max = 10000) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * max) + 1);
  }

  generateBtn.addEventListener("click", () => {
    const size = Math.min(
      10000,
      parseInt(prompt("Array size (max 10000)", "10") || "10", 10) || 10,
    );
    let maxVal = 10000;
    if (rangeSelect) {
      if (rangeSelect.value === "custom") {
        maxVal = Math.min(
          10000,
          Math.max(
            1,
            parseInt(prompt("Max value (1-10000)", "100") || "100", 10),
          ),
        );
      } else {
        maxVal = parseInt(rangeSelect.value, 10) || 10000;
      }
    }
    const arr = genRandomArray(size, maxVal);
    inputEl.value = arr.join(",");
    arraySize.textContent = size;
  });

  resetBtn.addEventListener("click", () => {
    inputEl.value = "";
    comparisonCount.textContent = "0";
    swapCount.textContent = "0";
    executionTime.textContent = "0 ms";
    arraySize.textContent = "0";
    bubbleResult.textContent = "Waiting for results...";
    mergeResult.textContent = "Waiting for results...";
  });

  function bubbleSort(a) {
    const arr = a.slice();
    let comps = 0,
      swaps = 0;
    const start = performance.now();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        comps++;
        if (arr[j] > arr[j + 1]) {
          swaps++;
          const t = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = t;
        }
      }
    }
    const time = performance.now() - start;
    return { sorted: arr, comparisons: comps, swaps, time };
  }

  function mergeSort(a) {
    let comps = 0,
      moves = 0;
    const start = performance.now();
    function merge(left, right) {
      const res = [];
      let i = 0,
        j = 0;
      while (i < left.length && j < right.length) {
        comps++;
        if (left[i] <= right[j]) {
          res.push(left[i++]);
          moves++;
        } else {
          res.push(right[j++]);
          moves++;
        }
      }
      while (i < left.length) {
        res.push(left[i++]);
        moves++;
      }
      while (j < right.length) {
        res.push(right[j++]);
        moves++;
      }
      return res;
    }
    function ms(arr) {
      if (arr.length <= 1) return arr.slice();
      const m = Math.floor(arr.length / 2);
      const L = ms(arr.slice(0, m));
      const R = ms(arr.slice(m));
      return merge(L, R);
    }
    const sorted = ms(a);
    const time = performance.now() - start;
    return { sorted, comparisons: comps, swaps: moves, time };
  }

  combinedBtn.addEventListener("click", () => {
    const arr = parseInput();
    if (arr.length === 0) {
      alert("Please provide or generate an array first.");
      return;
    }
    arraySize.textContent = arr.length;
    const m = mergeSort(arr);
    let b;
    if (arr.length > 3000) {
      const runFull = confirm(
        `Array size ${arr.length} — full Bubble Sort is O(n²) and may be very slow. Run full Bubble Sort? Cancel to run a sampled Bubble Sort on first 2000 elements.`,
      );
      if (runFull) {
        b = bubbleSort(arr);
      } else {
        const sample = arr.slice(0, 2000);
        b = bubbleSort(sample);
        b.sampled = true;
        b.sampleSize = sample.length;
      }
    } else {
      b = bubbleSort(arr);
    }
    comparisonCount.textContent = `${b.comparisons} / ${m.comparisons}`;
    swapCount.textContent = `${b.swaps} / ${m.swaps}`;
    executionTime.textContent = `Bubble: ${b.time.toFixed(3)} ms · Merge: ${m.time.toFixed(3)} ms`;
    const bNote = b.sampled ? `(sampled ${b.sampleSize}) ` : "";
    bubbleResult.textContent = `${bNote}Sorted: ${b.sorted.join(", ")} — comparisons: ${b.comparisons}, swaps: ${b.swaps}, time: ${b.time.toFixed(3)} ms`;
    mergeResult.textContent = `Sorted: ${m.sorted.join(", ")} — comparisons: ${m.comparisons}, moves: ${m.swaps}, time: ${m.time.toFixed(3)} ms`;
    if (bubbleTimeEl) bubbleTimeEl.textContent = `${b.time.toFixed(3)} ms`;
    if (mergeTimeEl) mergeTimeEl.textContent = `${m.time.toFixed(3)} ms`;

    // Determine best sort (primary: execution time, tiebreaker: comparisons, then swaps/moves)
    const bestEl = document.getElementById("bestSort");
    if (bestEl) {
      let bestText = "";
      if (b.sampled) {
        bestText = `Merge Sort is recommended (Bubble Sort was sampled for performance).`;
      } else {
        if (b.time < m.time) {
          bestText = `Bubble Sort is faster: ${b.time} ms vs ${m.time} ms`;
        } else if (m.time < b.time) {
          bestText = `Merge Sort is faster: ${m.time} ms vs ${b.time} ms`;
        } else {
          if (b.comparisons < m.comparisons)
            bestText = `Bubble Sort wins on comparisons (${b.comparisons} vs ${m.comparisons})`;
          else if (m.comparisons < b.comparisons)
            bestText = `Merge Sort wins on comparisons (${m.comparisons} vs ${b.comparisons})`;
          else {
            if (b.swaps < m.swaps)
              bestText = `Bubble Sort wins on swaps/moves (${b.swaps} vs ${m.swaps})`;
            else if (m.swaps < b.swaps)
              bestText = `Merge Sort wins on swaps/moves (${m.swaps} vs ${b.swaps})`;
            else bestText = `Both algorithms show similar performance.`;
          }
        }
      }
      bestEl.textContent = bestText;
    }
  });

  bubbleResult.textContent = "Waiting for results...";
  mergeResult.textContent = "Waiting for results...";
});
