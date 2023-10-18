<template>
  <div class="p-4">
    <div class="flex items-center gap-1.5 mb-5">
      <input id="checkSite" v-model="checkSite" type="checkbox">
      <label class="whitespace-nowrap" for="checkSite">Использовать для этого сайта</label>
    </div>
    <div class="flex items-center gap-2">
      <InputText label="Начальное ссылка" placeholder="Введите ссылку" v-model="targetLink"/>
      <InputText label="Измененная ссылка" placeholder="Введите ссылку" v-model="replaceLink"/>
    </div>
    <div class="flex items-center gap-2">
      <Button @click="addLink" name="Добавить ссылку"/>
    </div>
    <ListItems/>
  </div>
</template>

<script setup lang="ts">
import type {App, Ref} from "vue"
import {ref, watch} from "vue";
import "~/style.css"
import InputText from "~components/InputText.vue";
import Button from "~components/Button.vue";
import ListItems from "~components/ListItems.vue";

interface ISiteObject {
  enable?: Boolean,
  items?: Array<IItemStorage>,
}
interface IItemStorage {
  target: String,
  replace: String,
}

const checkSite = ref(true);
const targetLink = ref('');
const replaceLink = ref('');
const activeTab: Ref<chrome.tabs.Tab|null> = ref(null);
const activeSiteObject = ref({});

chrome.

chrome.tabs.query({ active: true, currentWindow: true}).then(tabs => {
  activeTab.value = tabs.pop();
  console.log(activeTab.value);
  getSiteObject().then(siteObject => {
    activeSiteObject.value = siteObject;
    checkSite.value = siteObject.enable;
  });
});

watch(checkSite, async (newCheck) => {
  activeSiteObject.value.enable = newCheck;
  let setObject = {};
  setObject[`site_${activeTab.value.id}`] = JSON.stringify(activeSiteObject.value);
  await chrome.storage.local.set(setObject);
});

async function getSiteObject() {
  let sitesObject = await chrome.storage.local.get(`site_${activeTab.value.id}`);
  return sitesObject[`site_${activeTab.value.id}`] ? JSON.parse(sitesObject[`site_${activeTab.value.id}`]) : {enable: true, items: []};
}

function validate() {
  let valid: Boolean = true;
  if(!targetLink.value.length) {
    valid = false;
  }
  else if(!replaceLink.value.length) {
    valid = false;
  }

  return valid;
}

async function addLink() {
  let siteObject = await getSiteObject();

  let siteItems: Array<IItemStorage> = siteObject?.items ? siteObject.items : [];

  if(!validate()) return;

  let itemStorage: IItemStorage = {
    target: targetLink.value,
    replace: replaceLink.value,
  }

  let exits = siteItems.filter((item: IItemStorage) => {
    return itemStorage.target === item.target;
  });

  if(exits.length) return;

  siteItems.push(itemStorage);

  siteObject.items = siteItems;

  let setObject = {};
  setObject[`site_${activeTab.value.id}`] = JSON.stringify(siteObject);

  await chrome.storage.local.set(setObject);
}

chrome.storage.onChanged.addListener((changes) => {
  getSiteObject().then(siteObject => {
    activeSiteObject.value = siteObject;
  });
})

defineOptions({
  prepare(app: App) {
    // Use any plugins here:
    // app.use
  }
})
</script>
