chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message === "get-tab-data") {
        let tabs = await chrome.tabs.query({active: true, currentWindow: true});
        let tab = tabs.pop();
        sendResponse(tab);
    }
});