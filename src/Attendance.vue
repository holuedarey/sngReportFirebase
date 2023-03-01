<template>

  <!-- eslint-disable -->
  <el-main style="height: 90vh">
    <el-row>
      <el-col :span="12" :offset="6">
        <div>
          <h1>Attendance</h1>
          <el-row>
            <el-col :span="12">
              <el-date-picker v-model="value2" type="date" placeholder="Pick a date" default-value="">
              </el-date-picker>
            </el-col>
            <el-col :span="5" :offset="7">
              <el-button round type="primary" @click="downloadData()" >Download</el-button>
            </el-col>
          </el-row>
          <hr>
          <el-table :data="attendance" style="width: 100%;">
            <!-- {{ scope.row.id }} -->
            <el-table-column label="#" type="index" width="50"> </el-table-column>
            <el-table-column label="Name" prop="name"> </el-table-column>
            <el-table-column label="Site Name" prop="site_name"> </el-table-column>
            <el-table-column label="Clocking Purpose" prop="clocking_purpose"> </el-table-column>
            <el-table-column label="Clocking Date Time" prop="clocking_date_time"> </el-table-column>
            <!-- <el-table-column align="right">
              <template slot="header">
                <el-input v-model="search" size="mini" placeholder="Type to search" />
              </template>
            </el-table-column> -->
          </el-table>
          <InfiniteLoading @infinite="infiniteHandler"></InfiniteLoading>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
  import firebase from "./firebaseInit";
  const db = firebase.firestore();
  import InfiniteLoading from 'vue-infinite-loading'
  import moment from 'moment';
  import { ExportToCsv } from 'export-to-csv';
  const pageSize = 50;

  export default {
    name: "app",
    watch: {
      value2: async function (val) {
        await this.fetchAttendances(val)
        this.startDate = val;
      }
    },
    data() {
      return {
        name: "",
        attendance: [],
        search: null,
        latDocSnapshot: null,
        value2: '',
        startDate:  "",
      };
    },
    firestore: {

    },
    components: {
      InfiniteLoading
    },
    methods: {

      async fetchAttendances(date = null) {
        let queryDateStart = moment().startOf('day').toDate();
        let queryDateEnd = moment().endOf('day').toDate()

        if (date) {
          queryDateStart = moment(new Date(date)).startOf('day').toDate();
          queryDateEnd = moment(new Date(date)).endOf('day').toDate();
        }

        let attendanceRef = db.collection("attendance")
          .where('clocking_date_time', '>=', queryDateStart)
          .where('clocking_date_time', '<=', queryDateEnd)
          .orderBy("clocking_date_time", "desc")
          .limit(pageSize);
        if (this.latDocSnapshot) {
          attendanceRef = attendanceRef.startAfter(this.latDocSnapshot);
        }
        const attendanceSnap = await attendanceRef.get();
        this.latDocSnapshot = attendanceSnap.docs[attendanceSnap.docs.length - 1]
        let  result = attendanceSnap.docs.map(async (u) => {
          const data = u.data();
          // console.log("issues:", data.user_id)
          const user = await db.collection("users").where('uid', '==', data.user_id).get();
          const userResp =  user.docs.map(d =>d.data())[0];

          data['clocking_date_time'] = this.formatDate(data.clocking_date_time.seconds);
          data['name'] = `${userResp.firstname} ${userResp.lastname}`;
          data['clockingPurpose'] = data.clocking_purpose;
          delete data['user_id'];
          return data;
        });
        result = await Promise.all(result);
        if (date) {
          console.log("git here", result.length)
          this.attendance = result;
        }else{
          this.attendance.push(...result);
        }
        return result.length;
      },
      async infiniteHandler($state) {
        const newattendanceCount = await this.fetchAttendances();
        if (newattendanceCount > 0) {
          return $state.loaded();
        }
        return $state.complete();
      },
      formatDate(date) {
        return `${new Date(date * 1000).toLocaleDateString()} :  ${new Date(date * 1000).toISOString().split("T")[1].split('.000Z')[0]}`
      },
      formatTime(date) {
        return ` ${new Date(date * 1000).toISOString().split("T")[1]}`
      },
      async downloadData() {
        let queryDateStart = moment().startOf('day').toDate();
        let queryDateEnd = moment().endOf('day').toDate()
        console.log("Date Component", this.startDate)
        if (this.startDate) {
          queryDateStart = moment(new Date(this.startDate)).startOf('day').toDate();
          queryDateEnd = moment(new Date(this.startDate)).endOf('day').toDate();
        }

        let attendanceRef = db.collection("attendance")
          .where('clocking_date_time', '>=', queryDateStart)
          .where('clocking_date_time', '<=', queryDateEnd)
          .orderBy("clocking_date_time", "desc");
        const attendanceSnap = await attendanceRef.get();
        const result = attendanceSnap.docs.map(async (u) => {
          const data = u.data();
          // console.log("issues:", data.user_id)
          const user = await db.collection("users").where('uid', '==', data.user_id).get();
          const userResp =  user.docs.map(d =>d.data())[0];

          data['clocking_date_time'] = this.formatDate(data.clocking_date_time.seconds);
          data['firstname'] = userResp.firstname;
          data['lastname'] = userResp.lastname;
          delete data['user_id'];
          return data;
        });

       let csvData =  await Promise.all(result);
       
       csvData = csvData.map(el => {
        return {
          "FirstName": el.firstname, 
          "LastName":el.lastname,
          "SiteName":el.site_name,
          "ClockingPurpose":el.clocking_purpose,
          "ClockingDateTime":el.clocking_date_time
        }
       });
       console.log("result", csvData.length)
        const options = {
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true,
          showTitle: true,
          filename: `Attendance for ${queryDateStart}`,
          title: `Attendance for ${queryDateStart}`,
          useBom: true,
          // useKeysAsHeaders: true,
          headers: ["First Name", "Last Name", "Site Name", "Clocking Purpose", "Clocking Date Time"]
        };

        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(csvData);
      },


    },
  };
</script>