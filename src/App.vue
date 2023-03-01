<style>
  body {
    padding: 0 !important;
    margin: 0 !important;
  }
</style>
<template>
  <!-- eslint-disable -->
  <div>
    <el-header style="background-color:#545c64">
      <el-col :offset="6">
        <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item>
            <router-link to="/">Attendance</router-link>
          </el-menu-item>
          <el-menu-item>
            <router-link to="/users">Users</router-link>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-header>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>