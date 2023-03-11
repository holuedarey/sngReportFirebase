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
  // import firebase from "./firebaseInit";
  import InfiniteLoading from 'vue-infinite-loading'
  // const db = firebase.firestore();
  // const pageSize = 50;
  // const field = 'firstname';
  // console.log("data log", lastVisible)
  export default {
    name: "app",
    data() {
      return {
        name: "",
        userData: [],
        latDocSnapshot: null,
        search: null,
      };
    },

    components: {
      InfiniteLoading
    },
    firestore: {
      // userData: db.collection("users").orderBy('firstname').limit(pageSize),
      // userData: this.fetchUsers()
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {

      async fetchUsers() {

   
        // let userRef = db.collection("users").limit(pageSize);
        // if (this.latDocSnapshot) {
        //   userRef =  userRef.startAfter(this.latDocSnapshot);
        // }
        // const userSnap = await userRef.get();
        // this.latDocSnapshot = userSnap.docs[userSnap.docs.length - 1]
        // const result = userSnap.docs.map(u => u.data());
        // this.userData.push(...result);
        // console.log(this.userData)
        // return result.length;
      },
      async infiniteHandler($state){
        const newUserCount = await this.fetchUsers();
        if(newUserCount > 0){
          return $state.loaded();
        }
        return $state.complete();
      }
    },
    // async search(){

    // }

  }
</script>