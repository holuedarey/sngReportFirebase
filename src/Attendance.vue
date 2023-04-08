<template>

  <!-- eslint-disable -->
  <el-main class="container">
    <div class="col-md-12">
      <h1>Attendance</h1>
      <div class="row">
        <div class="col-10">
          <el-date-picker class="col-12" v-model="value1" type="daterange" range-separator="To"
            start-placeholder="Start date" end-placeholder="End date" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="col-2">
          <el-button round type="primary" @click="downloadData()">Download</el-button>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-6 col-sm-12 col-xs-12">
          <el-form ref="form" :model="form" label-width="">
            <el-input class="form-control" v-model="search" placeholder="search with name, email or phone number">
            </el-input>
          </el-form>
        </div>
      </div>
    </div>

    <div class="row">
      <el-skeleton v-if="!attendance.length" />
      <el-table :data="attendance" class="table table-striped">
        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column label="Name" prop="name"> </el-table-column>
        <el-table-column label="Site Name" prop="site_name"> </el-table-column>
        <el-table-column label="Clocking Purpose" prop="clocking_purpose"> </el-table-column>
        <el-table-column label="Clocking Date Time" prop="clocking_date_time"> </el-table-column>
      </el-table>
    </div>
    <div class="row">
      <nav aria-label="Page navigation example"  v-if="attendance.length">
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
            <span v-if="page != totalPage">
              <router-link :to="{ query: { page: totalPage }}" class="page-link">Last</router-link>
            </span>
          </li>
        </ul>
      </nav>
    </div>
  </el-main>
</template>
<style>
  ::-webkit-input-placeholder {
    text-transform: capitalize;
  }

  :-moz-placeholder {
    text-transform: capitalize;
  }

  ::-moz-placeholder {
    text-transform: capitalize;
  }

  :-ms-input-placeholder {
    text-transform: capitalize;
  }

  input {
    text-transform: capitalize;
  }
</style>

<script>
  // import InfiniteLoading from 'vue-infinite-loading'
  import moment from 'moment';
  import axios from 'axios';
  import { ExportToCsv } from 'export-to-csv';
  // import * as ExcelJS from "exceljs";
  const pageSize = 50;
  // const baseUrl = 'https://sngapp.herokuapp.com/api/v1/';
  const config = {
    headers: {
      authorization: 'Bearer j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d',
    }
  };


  export default {
    name: "app",
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
            await this.fetchAttendances(this.startDate, this.endDate, this.search, page, pageSize)
          }
        }
      },
      search: async function (val) {
        const search = val || "";
        this.search = val;
        await this.fetchAttendances(this.startDate, this.endDate, search, 1, pageSize)
      },

    },
    data() {
      return {
        pager: null,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: 'Last week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        name: "",
        attendance: [],
        search: null,
        form: {},
        latDocSnapshot: null,
        value1: '',
        startDate: "",
        endDate: "",
        page: 1,
        totalPage: null
      };
    },
    mounted() {
      this.page = 1;
      this.fetchAttendances(this.startDate, this.endDate, this.search, this.page, pageSize);
    },
    // components: {
    //   InfiniteLoading
    // },
    methods: {

      async fetchAttendances(start = null, end = null, search = null, page = 1, pageSize) {
        let queryDateStart = moment().startOf('day').format('YYYY-MM-DD');
        let queryDateEnd = moment().endOf('day').format('YYYY-MM-DD');

        if (start) {
          queryDateStart = moment(new Date(start))
            .startOf('day').format('YYYY-MM-DD');
          queryDateEnd = moment(new Date(end || start)).endOf('day').format('YYYY-MM-DD');
        }

        try {
          const attendance = await axios.get(`clocking?startdate=${queryDateStart}&enddate=${queryDateEnd}&page=${page}&limit=${pageSize}&search=${search == null ? "" : this.search}`, config);
          this.attendance = attendance.data.data;
          this.pager = this.attendance['total'];
          this.totalPage = Math.ceil(this.pager / pageSize);
          this.attendance = this.attendance['row'].map(el => {
            el['name'] = `${el.user.firstname} ${el.user.lastname}`;
            return el;
          });
          console.log("data to display : ", this.pager)
        } catch (error) {
          this.attendance = []
          console.log(error.message)
        }
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
        let queryDateStart = moment().startOf('day').format('YYYY-MM-DD');
        let queryDateEnd = moment().endOf('day').format('YYYY-MM-DD');

        if (this.startDate) {
          queryDateStart = moment(new Date(this.startDate))
            .startOf('day').format('YYYY-MM-DD');
          queryDateEnd = moment(new Date(this.endDate || this.startDate)).endOf('day').format('YYYY-MM-DD');
        }
        try {
          const response = await axios.get(`clocking/download?startdate=${queryDateStart}&enddate=${queryDateEnd}&search=${this.search == null ? "" : this.search}`, config);
          let csvData = response.data.data;
          csvData = csvData.map(el => {
            return {
              "FirstName": el.user.firstname,
              "LastName": el.user.lastname,
              "SiteName": el.site_name,
              "ClockingPurpose": el.clocking_purpose,
              "ClockingDateTime": el.clocking_date_time
            }
          });
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

          const csvExporter = new ExportToCsv(options);
          csvExporter.generateCsv(csvData);
        } catch (error) {
          this.attendance = []
          console.log(error.message)
        }


      },


    },
  };
</script>