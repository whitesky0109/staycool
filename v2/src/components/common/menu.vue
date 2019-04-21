<template>
<div id="alrMenu" class="alr-menu">
   <ul class="alr-menubar">
      <li v-for="(item, index) in list" :key="index" class='alr-menubar li-category'>
         <router-link :to="item.href">{{item.title}}</router-link>
      </li>
      <li class='alr-menubar li-search'>
         <input id="airSearchInput" type="text" placeholder='Search..' />
         <button id="airSearchBtn" @click="changeRouter($event)">
            <img src="/static/airgg/img/search.png" alt="">
         </button>
      </li>
   </ul>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { settings } from '../../utils/index';

@Component
export default class MenuComponent extends Vue {
   list: any[] = settings.menuList;
}
</script>
