async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onMessage.addListener(
  //tab = await getCurrentTab()
  function (request, sender, sendResponse) {
    if (request.cmd === "getUrl") {
      //console.log("bc", sender.tab.url);
      sendResponse({ link: sender.tab.url });
    }
  }
);
