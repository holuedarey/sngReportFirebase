<template>
  <!-- eslint-disable -->
  <el-main>
    <el-row>
      <el-col :span="8" :offset="6">
        <div class="grid-content bg-purple">
          <div>
            <h1>Locations</h1>
            <el-row>
              <el-col :span="2" :offset="22">
                <el-button type="danger" icon="el-icon-plus" circle @click="dialogFormVisible = true"></el-button>
              </el-col>
            </el-row>
            <hr>
            <el-table :data="locationData" style="width: 100%;">
              <el-table-column label="#" type="index" width="50"> </el-table-column>
              <el-table-column label="Site Name" prop="name"> </el-table-column>
              <el-table-column align="right" label="Action">
                <template slot-scope="scope">
                  <el-button type="info" circle icon="el-icon-edit" @click="editLocation(scope.$index)"></el-button>
                  <el-button type="danger" circle icon="el-icon-delete" @click="editLocation(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <InfiniteLoading @infinite="infiniteHandler"></InfiniteLoading>
            
            <el-dialog title="Add Location" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="Site name" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addLocation()">Confirm</el-button>
              </span>
            </el-dialog>

            <el-dialog title="Edit Location" :visible.sync="dialogFormVisibleEdit">
              <el-form :model="form">
                <el-form-item label="Site name" :label-width="formLabelWidth">
                  <el-input v-model="form.nameEdit" autocomplete="off"></el-input>
                </el-form-item>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addLocation()">Confirm</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-main>

</template>
<script>
  const baseUrl = 'https://sngapp.herokuapp.com/api/v1/';
  import InfiniteLoading from 'vue-infinite-loading'
  import axios from 'axios';
  let config = {
    headers: {
      authorization: 'Bearer j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d',
    }
  };
  export default {
    name: "app",
    data() {
      return {
        locationData: [],
        dialogVisible: false,
        dialogFormVisible: false,
        dialogFormVisibleEdit:false,
        editName: '',
        formLabelWidth: '120px',
        form: {
          name: "",
          nameEdit : ""
        }
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
          const location = await axios.get(`${baseUrl}location`, config);
          this.locationData = location.data.data;
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
      async editLocation(index){
        // this.form.name = name;
        this.dialogFormVisibleEdit = true;
        this.form.nameEdit = this.locationData[index].name;
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
    },
  }
</script>