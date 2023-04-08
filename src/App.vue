<template>
  <!-- eslint-disable -->
  <div>

    <nav class="navbar navbar-light navbar-expand-lg bg-success sticky-top">
      <div class="container">
        <a class="navbar-brand" href="#">
          <b>South North Group</b>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <el-menu class="navbar-nav me-auto mb-2 mb-lg-0 ml-auto">
            <el-menu-item class="nav-item">
              <router-link class="nav-link" to="/">Attendance</router-link>
            </el-menu-item>
            <el-menu-item>
              <router-link class="nav-link" to="/users">Users</router-link>
            </el-menu-item>
            <el-menu-item>
              <router-link class="nav-link" to="/location">Location</router-link>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </nav>
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