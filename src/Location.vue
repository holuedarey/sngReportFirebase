<template>
  <!-- eslint-disable -->
  <el-main class="container">
    <div class="row">
      <div class="col-7">
        <h1>Locations</h1>
      </div>
      <div class="col-3">
        <el-button type="danger" icon="el-icon-plus" circle @click="dialogFormVisible = true"></el-button>
      </div>
    </div>

    <div class="row">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Site Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in locationData">
            <th scope="row">{{index + 1}}</th>
            <td>{{item.name}}</td>

            <td>
              <el-button type="info" circle icon="el-icon-edit" @click="editLocation(item)"></el-button>
              <el-button type="danger" circle icon="el-icon-delete" @click="deleteLocation(item)"></el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <InfiniteLoading @infinite="infiniteHandler"></InfiniteLoading>

      <el-dialog title="Add Location" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="Site name">
            <el-input class="form-control" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          </el-form-item>
        </el-form>
        <div class="row">
          <el-button class="col" @click="dialogFormVisible = false">Cancel</el-button>
          <el-button class="col" type="primary" @click="addLocation()">Create</el-button>
        </div>
      </el-dialog>

      <el-dialog title="Edit Location" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
          <el-form-item label="Site name">
            <el-input class="form-control" v-model="form.nameEdit" autocomplete="off"></el-input>
          </el-form-item>
          </el-form-item>
        </el-form>
        <div class="row">
          <el-button class="col" @click="dialogFormVisibleEdit = false; this.EditItem =null;">Cancel</el-button>
          <el-button class="col" type="primary" @click="updateLocation()">Update</el-button>
        </div>
      </el-dialog>

      <el-dialog title="Delete Location" :visible.sync="dialogFormVisibleDel">
        <p class="justify-content-center text-center">Are you sure you want to delete?</p>
        <br>
        <div class="row">
          <el-button class="col" @click="dialogFormVisibleDel = false">Cancel</el-button>
          <el-button class="col" type="danger" @click="deleteStatus = true">Delete</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="row">
      <nav aria-label="Page navigation example" v-if="locationData.length">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <span v-if="page != totalPage">
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
            <span v-if="page != totalPage && totalPage != 0">
              <router-link :to="{ query: { page: totalPage }}" class="page-link">Last</router-link>
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </el-main>

</template>
<script>
  const baseUrl = 'https://sngapp.herokuapp.com/api/v1/';
  import InfiniteLoading from 'vue-infinite-loading'
  import axios from 'axios';

  const pageSize = 30;
  let config = {
    headers: {
      authorization: 'Bearer j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d',
    }
  };
  export default {
    name: "app",
    watch: {
      '$route.query.page': {
        immediate: true,
        async handler(page) {
          page = parseInt(page) || 1;
          this.page = page;
          const totalPage = Math.ceil(this.pager / pageSize);
          this.totalPage = totalPage;
          console.log("page", page, 'totalPage', totalPage, this.pager);
          if (totalPage >= page) {
            await this.location()
          }
        }
      },
    },
    data() {
      return {
        locationData: [],
        dialogVisible: false,
        dialogFormVisible: false,
        dialogFormVisibleEdit: false,
        dialogFormVisibleDel: false,
        editName: '',
        formLabelWidth: '120px',
        page: 1,
        totalPage: null,
        pager: null,
        form: {
          name: "",
          nameEdit: ""
        },
        EditItem:null,
      };
    },
    components: {
      InfiniteLoading
    },
    methods: {

      handleClose(done) {
        this.$confirm('Are you sure to close this dialog?')
          .then(() => {
            console.log("hello")
            done();
          })
          .catch(() => { });
      },
      async location() {
        try {
          const location = await axios.get(`${baseUrl}location?page=${this.page}&limit=${pageSize}`, config);
          this.locationData = location.data.data;
          this.pager = this.locationData['total'];
          this.totalPage = Math.ceil(this.pager / pageSize);
          this.locationData = location.data.data['row'];
        } catch (error) {
          this.locationData = []
          console.log(error.message)
        }
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

      async infiniteHandler($state) {
        const locationCount = await this.location();
        if (locationCount > 0) {
          return $state.loaded();
        }
        return $state.complete();
      },
      async editLocation(index) {
        console.log("incoming data", index)
        // this.form.name = name;
        this.dialogFormVisibleEdit = true;
        this.form.nameEdit = index.name;
        this.EditItem = index;
      },
      async addLocation() {
        this.dialogFormVisible = false;
        const payload = {
          name: this.form.name,
        }
        try {
          console.log("modal click", this.form.name)

          // config.body = payload;
          const location = await axios.post(`${baseUrl}location/create`, payload, config);
          console.log("savedobject ::", location);
          this.form.name = ""
          await this.location();
        } catch (error) {
          this.form.name = ""
          console.log(error.message)
        }
      },
      async updateLocation() {
        this.dialogFormVisibleEdit = false;
        const payload = {
          name: this.form.name,
        }
        try {
          console.log("modal click", this.form.name)

          // config.body = payload;
          const location = await axios.patch(`${baseUrl}location/update/${this.EditItem._id}`, payload, config);
          console.log("savedobject ::", location);
          this.form.name = ""
          await this.location();
        } catch (error) {
          this.form.name = ""
          console.log(error.message)
        }
      },
      async deleteLocation(item) {
        this.dialogFormVisibleDel = true;
       
        try {
           // config.body = payload;
          const location = await axios.delete(`${baseUrl}location/delete/${item._id}`, config);
          console.log("savedobject ::", location);
          this.form.name = "";
        this.dialogFormVisibleDel = false;

          await this.location();
        } catch (error) {
          this.form.name = ""
          console.log(error.message)
        }
      },
    },
  }
</script>