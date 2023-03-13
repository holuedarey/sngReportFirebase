<template>
  <!-- eslint-disable -->
  <el-main>
    <el-row>
      <el-col :span="12" :offset="6">
        <div class="grid-content bg-purple">
          <div>
            <h1>Users</h1>
            <hr>
            <el-table :data="
                  userData.filter(
                    (data) =>
                      !search || data.firstname.toLowerCase().includes(search.toLowerCase())
                  )
                " style="width: 100%;">
              <el-table-column label="#" type="index" width="50"> </el-table-column>
              <el-table-column label="First Name" prop="firstname"> </el-table-column>
              <el-table-column label="Last Name" prop="lastname"> </el-table-column>

              <el-table-column label="Email" prop="email"> </el-table-column>
              <el-table-column align="right">
                <template slot="header">
                  <el-input v-model="search" size="mini" placeholder="Type to search" />
                </template>
              </el-table-column>
            </el-table>
            <InfiniteLoading @infinite="infiniteHandler"></InfiniteLoading>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-main>

</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading'
  import moment from 'moment';
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

      async fetchUsers(start = null, end = null) {
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