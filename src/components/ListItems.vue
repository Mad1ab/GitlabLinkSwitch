<template>
  <div class="mt-3 mb-3">
    <div class="mb-2 text-sm font-normal">Список измененных ссылок</div>
    <ul class="max-h-72 overflow-y-auto px-2">
      <li v-for="item in activeSiteObject.items" class="flex items-center justify-between mb-2">
        <span>{{ item.target }}</span>
        <span>{{ item.replace }}</span>
        <div class="flex gap-2 items-center">
<!--          <Button>-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">-->
<!--              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />-->
<!--            </svg>-->
<!--          </Button>-->
          <Button @click="deleteItem(item)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </Button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Button from "~components/Button.vue";
import type {Ref} from "vue";
import {ref} from "vue";

interface ISiteObject {
  enable?: Boolean,
  items?: Array<IItemStorage>,
}
interface IItemStorage {
  target: String,
  replace: String,
}

const activeTab: Ref<chrome.tabs.Tab|null> = ref(null);
const activeSiteObject: Ref<ISiteObject> = ref({});

chrome.tabs.query({ active: true, currentWindow: true}).then(tabs => {
  activeTab.value = tabs.pop();
  let url = new URL(activeTab.value.url);
  activeTab.value.hostname = url.hostname;
  getSiteObject().then(siteObject => {
    activeSiteObject.value = siteObject;
  });
});

async function getSiteObject() {
  let sitesObject = await chrome.storage.local.get(`site_${activeTab.value.hostname}`);
  return sitesObject[`site_${activeTab.value.hostname}`] ? JSON.parse(sitesObject[`site_${activeTab.value.hostname}`]) : {enable: true, items: []};
}

async function deleteItem(item: IItemStorage) {
  activeSiteObject.value.items = activeSiteObject.value.items.filter((itemElement: IItemStorage) => {
    return item.target !== itemElement.target && item.replace !== itemElement.replace;
  });

  let setObject = {};
  setObject[`site_${activeTab.value.hostname}`] = JSON.stringify(activeSiteObject.value);
  await chrome.storage.local.set(setObject);
}

chrome.storage.onChanged.addListener((changes) => {
  getSiteObject().then(siteObject => {
    activeSiteObject.value = siteObject;
  });
})

</script>