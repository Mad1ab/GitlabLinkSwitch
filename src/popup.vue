<template>
  <div class="p-4">
    <div class="flex items-center gap-1.5 mb-5">
      <input id="checkSite" type="checkbox">
      <label class="whitespace-nowrap" for="checkSite">Использовать для этого сайта</label>
    </div>
    <div class="flex items-center gap-2">
      <InputText label="Начальное ссылка" placeholder="Введите ссылку"/>
      <InputText label="Измененная ссылка" placeholder="Введите ссылку"/>
    </div>
    <div class="flex items-center gap-2">
      <Button name="Добавить ссылку"/>
    </div>
    <ListItems/>
  </div>
</template>

<script setup lang="ts">
import type { App } from "vue"
import "~/style.css"
import InputText from "~components/InputText.vue";
import Button from "~components/Button.vue";
import ListItems from "~components/ListItems.vue";

defineOptions({
  prepare(app: App) {
    // Use any plugins here:
    // app.use
  }
})
</script>
