interface ISiteItem {
    target: String,
    replace: String,
}
window.addEventListener("load", async () => {
    let observer = new MutationObserver(async () => {
        let activeTab = await chrome.runtime.sendMessage("get-tab-data");
        if(!activeTab) return;

        let sitesObject = await chrome.storage.local.get(`site_${activeTab.id}`);
        let siteObject = sitesObject[`site_${activeTab.id}`] ? JSON.parse(sitesObject[`site_${activeTab.id}`]) : {enable: false};
        if(!siteObject.enable) return;

        let siteItems = siteObject?.items ? siteObject.items : [];
        siteItems.forEach((siteItem: ISiteItem) => {
            window.document.querySelectorAll(`[href*="${siteItem.target}"`).forEach((itemEl: HTMLLinkElement) => {
                if(itemEl?.href && typeof itemEl?.href === 'string') {
                    itemEl.href = itemEl.href.replace(new RegExp(siteItem.target, 'gm'), siteItem.replace);
                }
            });
        });
    });

    observer.observe(
        document.getRootNode(),
        {
            childList: true,
            attributes: true,
            subtree: true,
            characterData: true,
            attributeOldValue: true,
            characterDataOldValue: true,
        }
    );
});

