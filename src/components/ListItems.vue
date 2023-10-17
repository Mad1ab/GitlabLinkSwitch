<template>
  <div class="mt-3 mb-3">
    <div class="mb-2 text-sm font-normal">Список измененных ссылок</div>
    <ul>
      <li class="flex items-center justify-between mb-2">
        <span>link 1</span>
        <span>link 2</span>
        <div class="flex gap-2 items-center">
          <Button name="изменить"/>
          <Button name="удалить"/>
        </div>
      </li>
      <li class="flex items-center justify-between mb-2">
        <span>link 1</span>
        <span>link 2</span>
        <div class="flex gap-2 items-center">
          <Button name="изменить"/>
          <Button name="удалить"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import Button from "~components/Button.vue";
</script>