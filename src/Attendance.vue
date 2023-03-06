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
              <el-button round type="primary" @click="downloadData()">Download</el-button>
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
  import InfiniteLoading from 'vue-infinite-loading'
  import moment from 'moment';
  import axios from 'axios';
  // import { ExportToCsv } from 'export-to-csv';
  // import * as ExcelJS from "exceljs";
  // const pageSize = 50;
  // const baseUrl = 'https://sngapp.herokuapp.com/api/v1/';
  const config = {
    headers: {
      authorization: 'Bearer j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d',
    }
  };
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
        startDate: "",
      };
    },
    components: {
      InfiniteLoading
    },
    methods: {

      async fetchAttendances(date = null) {
        console.log(date)
        let queryDateStart = moment().startOf('day').format('YYYY-MM-DD');
        let queryDateEnd = moment().endOf('day').format('YYYY-MM-DD');

        if (date) {
          queryDateStart = moment(new Date(date))
          .startOf('day').format('YYYY-MM-DD');
          queryDateEnd = moment(new Date(date)).endOf('day').format('YYYY-MM-DD');
        }
        try {
          const attendance = await axios.get(`clocking?startdate=${queryDateStart}&enddate=${queryDateEnd}`, config);
          this.attendance = attendance.data.data;
          this.attendance = this.attendance.map(el => {
            el['name'] = `${el.user.firstname} ${el.user.lastname}`;
            return el;
          });
          console.log("data to display : ", this.attendance)
        } catch (error) {
          this.attendance = []
          console.log(error.message)
        }

        // let queryDateStart = moment().startOf('day').toDate();
        // let queryDateEnd = moment().endOf('day').toDate()

        // if (date) {
        //   queryDateStart = moment(new Date(date)).startOf('day').toDate();
        //   queryDateEnd = moment(new Date(date)).endOf('day').toDate();
        // }

        // let attendanceRef = db.collection("attendance")
        //   .where('clocking_date_time', '>=', queryDateStart)
        //   .where('clocking_date_time', '<=', queryDateEnd)
        //   .orderBy("clocking_date_time", "desc")
        //   .limit(pageSize);
        // if (this.latDocSnapshot) {
        //   attendanceRef = attendanceRef.startAfter(this.latDocSnapshot);
        // }
        // const attendanceSnap = await attendanceRef.get();
        // this.latDocSnapshot = attendanceSnap.docs[attendanceSnap.docs.length - 1]
        // let result = attendanceSnap.docs.map(async (u) => {
        //   const data = u.data();
        //   // console.log("issues:", data.user_id)
        //   const user = await db.collection("users").where('uid', '==', data.user_id).get();
        //   const userResp = user.docs.map(d => d.data())[0];

        //   data['clocking_date_time'] = this.formatDate(data.clocking_date_time.seconds);
        //   data['name'] = `${userResp.firstname} ${userResp.lastname}`;
        //   data['clockingPurpose'] = data.clocking_purpose;
        //   delete data['user_id'];
        //   return data;
        // });
        // result = await Promise.all(result);
        // if (date) {
        //   console.log("git here", result.length)
        //   this.attendance = result;
        // } else {
        //   this.attendance.push(...result);
        // }
        // return result.length;
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
        // let queryDateStart = moment().startOf('day').toDate();
        // let queryDateEnd = moment().endOf('day').toDate()
        // console.log("Date Component", this.startDate)
        // if (this.startDate) {
        //   queryDateStart = moment(new Date(this.startDate)).startOf('day').toDate();
        //   queryDateEnd = moment(new Date(this.startDate)).endOf('day').toDate();
        // }

        // let attendanceRef = db.collection("attendance")
        //   .where('clocking_date_time', '>=', queryDateStart)
        //   .where('clocking_date_time', '<=', queryDateEnd)
        //   .orderBy("clocking_date_time", "desc");
        // const attendanceSnap = await attendanceRef.get();
        // const result = attendanceSnap.docs.map(async (u) => {
        //   const data = u.data();
        //   // console.log("issues:", data.user_id)
        //   const user = await db.collection("users").where('uid', '==', data.user_id).get();
        //   const userResp = user.docs.map(d => d.data())[0];

        //   data['clocking_date_time'] = this.formatDate(data.clocking_date_time.seconds);
        //   data['firstname'] = userResp.firstname;
        //   data['lastname'] = userResp.lastname;
        //   delete data['user_id'];
        //   return data;
        // });

        // let csvData = await Promise.all(result);

        // csvData = csvData.map(el => {
        //   return {
        //     "FirstName": el.firstname,
        //     "LastName": el.lastname,
        //     "SiteName": el.site_name,
        //     "ClockingPurpose": el.clocking_purpose,
        //     "ClockingDateTime": el.clocking_date_time
        //   }
        // });
        // console.log("result", csvData.length)
        // const options = {
        //   fieldSeparator: ',',
        //   quoteStrings: '"',
        //   decimalSeparator: '.',
        //   showLabels: true,
        //   showTitle: true,
        //   filename: `Attendance for ${queryDateStart}`,
        //   title: `Attendance for ${queryDateStart}`,
        //   useBom: true,
        //   // useKeysAsHeaders: true,
        //   headers: ["First Name", "Last Name", "Site Name", "Clocking Purpose", "Clocking Date Time"]
        // };

        // const workbook = new ExcelJS.Workbook();
        // workbook.creator = 'Sng Reports';
        // workbook.created = new Date();

        // const worksheet = workbook.addWorksheet('Attendance');
        // 
        // worksheet.columns = Object.keys(csvData[0] || {}).map(col => ({ key: col, width: 24, height: 10 }));
        // worksheet.getRow(1).values = ["First Name", "Last Name", "Site Name", "Clocking Purpose", "Clocking Date Time"];
        // worksheet.getRow(1).height = 85;
        // worksheet.getRow(1).alignment = { vertical: 'middle' };
        // worksheet.getRow(1).eachCell((cell) => {
        //   cell.fill = {
        //     type: 'pattern',
        //     pattern: 'darkTrellis',
        //     fgColor: { argb: '000000' },
        //     bgColor: { argb: '000000' },
        //   };
        //   cell.border = {
        //     top: { style: 'thick' },
        //     left: { style: 'thick' },
        //     bottom: { style: 'thick' },
        //     right: { style: 'thick' },
        //   };
        //   cell.font = {
        //     color: { argb: 'ffffff' },
        //     bold: true,
        //     name: 'Calibri',
        //   };
        // });

        // worksheet.addRows(csvData);
        // worksheet.eachRow((row) => { (row.font || {}).name = 'Calibri'; });
        //  workbook.xlsx.writeBuffer(`Attendance_for_`).then(data => console.log("data", data));

        // return `files/Attendance_for_${queryDateStart}`;

        // const csvExporter = new ExportToCsv(options);
        // csvExporter.generateCsv(csvData);
      },


    },
  };
</script>