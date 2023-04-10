<template>
  <!-- eslint-disable -->
  <el-main class="container">
    <div class="col-md-12">
      <h1>Users</h1>
    </div>

    <div class="row">
      <el-skeleton v-if="!userData.length" />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col">Terms and condtion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in userData">
            <th scope="row">{{index + 1}}</th>
            <td style="text-transform: capitalize;">{{ item.firstname}}</td>
            <td>{{item.lastname}}</td>
            <td>{{item.email}}</td>
            <td>{{item.acceptTerms}}</td>
          </tr>
        </tbody>
      </table>
    </div>
      <div class="row">
      <nav aria-label="Page navigation example"  v-if="userData.length">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <span v-if="page != totalPage && totalPage != 0">
              <router-link :to="{ query: { page: 1 }}" class="page-link">First</router-link>
            </span>
          </li>
          <li class="page-item">
            <span v-if="page !== 1">
              <router-link :to="{ query: { page: page - 1 }}" class="page-link">Previous</router-link>
            </span>
          </li>
          <li class="page-item">
            <span v-if="totalPage > page">
              <router-link :to="{ query: { page: page + 1 }}" class="page-link">Next</router-link>
            </span>
          </li>
          <li class="page-item">
            <span v-if="page != totalPage">
              <router-link :to="{ query: { page: totalPage }}" class="page-link">Last</router-link>
            </span>
          </li>
        </ul>
      </nav>
    </div>
    <InfiniteLoading @infinite="infiniteHandler"></InfiniteLoading>
  </el-main>

</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading'
  // import moment from 'moment';
  import axios from 'axios';
  const pageSize = 50;
  export default {
    name: "app",
    data() {
      return {
        name: "",
        userData: [],
        latDocSnapshot: null,
        search: null,
        totalPage: null,
        pager: null,
        page: 1,
        startDate: null, 
        endDate: null
      };
    },

    components: {
      InfiniteLoading
    },
    watch: {
      value1: async function (val) {
        this.startDate = val[0];
        this.endDate = val[1];

        await this.fetchAttendances(val[0], val[1], this.search, this.page, pageSize);
      },
      '$route.query.page': {
        immediate: true,
        async handler(page) {
          page = parseInt(page) || 1;
          this.page = page;
          const totalPage = Math.ceil(this.pager / pageSize);
          this.totalPage = totalPage;
          console.log("page", page, 'totalPage', totalPage, this.pager);
          if (totalPage >= page) {
            await this.fetchUsers(this.startDate, this.endDate, this.search, page, pageSize)
          }
        }
      },
      search: async function (val) {
        const search = val || "";
        this.search = val;
        await this.fetchAttendances(this.startDate, this.endDate, search, 1, pageSize)
      },

    },
    mounted() {
      this.fetchUsers();
    },
    methods: {

      async fetchUsers() {
        // let queryDateStart = moment().startOf('day').format('YYYY-MM-DD');
        // let queryDateEnd = moment().endOf('day').format('YYYY-MM-DD');

        // if (start) {
        //   queryDateStart = moment(new Date(start))
        //     .startOf('day').format('YYYY-MM-DD');
        //   queryDateEnd = moment(new Date(end || start)).endOf('day').format('YYYY-MM-DD');
        // }
        try {
          const config = {
            headers: {
              authorization: 'Bearer j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d',
            }
          };
          const users = await axios.get(`users?page=${this.page}&limit=${pageSize}&search=${this.search}`, config);
          this.userData = users.data.data;
          this.userData = this.userData.map(el => {
            console.log("terms and condition  ", el.acceptTerms )
            el.acceptTerms =  el.acceptTerms != undefined || el.acceptTerms == true ? "Acdepted": "Pending"
            return el;
          })
          // this.pager = this.attendance['total'];
          // this.totalPage = Math.ceil(this.pager / pageSize);
        } catch (error) {
          this.userData = []
          console.log(error.message)
        }
      },
      async infiniteHandler($state) {
        const newUserCount = await this.fetchUsers();
        if (newUserCount > 0) {
          return $state.loaded();
        }
        return $state.complete();
      }
    },
    // async search(){

    // }

  }
</script>