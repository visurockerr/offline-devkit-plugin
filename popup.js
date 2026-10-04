// Single-page popup: render each tool inside an iframe without leaving the popup.
const listView = document.getElementById("listView");
const frameView = document.getElementById("frameView");
const frame = document.getElementById("frame");
const backBtn = document.getElementById("backBtn");
const title = document.getElementById("title");

function openTool(page, toolTitle) {
  frame.src = chrome.runtime.getURL(page);
  listView.classList.add("hidden");
  frameView.classList.add("active");
  backBtn.style.display = "inline-flex";
  if (toolTitle) title.textContent = toolTitle;
}

function showList() {
  frameView.classList.remove("active");
  listView.classList.remove("hidden");
  backBtn.style.display = "none";
  title.textContent = "DevKit";
  // Clear the frame so each visit starts fresh.
  frame.src = "about:blank";
}

document.querySelectorAll(".tool[data-page]").forEach((btn) => {
  btn.addEventListener("click", () => {
    openTool(
      btn.getAttribute("data-page"),
      btn.getAttribute("data-title")
    );
  });
});

backBtn.addEventListener("click", showList);
