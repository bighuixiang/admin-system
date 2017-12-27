<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
				<el-breadcrumb-item>中奖用户查询</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="handle-box">
			<el-select v-model="draw" placeholder="请选择中奖类型">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-input v-model="phone" placeholder="手机号" class="handle-input mr10"></el-input>
			<el-date-picker v-model="start" type="datetime" placeholder="选择开始日期时间" align="right" :picker-options="pickerOptions1">
			</el-date-picker>
			<el-date-picker v-model="end" type="datetime" placeholder="选择结束日期时间" align="right" :picker-options="pickerOptions1">
			</el-date-picker>

			<el-button type="primary" icon="search" @click="search">搜索</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%" ref="multipleTable">
			<!--<el-table-column prop="id" label="id" sortable width="150">
			</el-table-column>-->
			<el-table-column prop="name" label="姓名" width="120">
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="120">
			</el-table-column>
			<el-table-column prop="draw" label="奖品">
			</el-table-column>
			<el-table-column label="中奖时间">
				<template scope="scope">
					<span>
						 {{scope.row.draw_time | dateFormat('yyyy-MM-dd hh:mm:ss')}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="用户上传头像" width="120">
				<template scope="scope">
					<img :src="scope.row.imgurl" style="width: 80px;height: 80px;" />
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="微信昵称">
			</el-table-column>
			<el-table-column label="微信头像" width="120">
				<template scope="scope">
					<img :src="scope.row.headimgurl" style="width: 80px;height: 80px;" />
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="total" :page-size="pageSize" :current-page="cur_page" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				start: '',
				end: '',
				draw: '',
				tableData: [],
				total: 0,
				cur_page: 1,
				pageSize: 10,
				pickerOptions1: {
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				options: [{
					value: '',
					label: '所有中奖用户'
				}, {
					value: 0,
					label: '所有未中奖用户'
				}, {
					value: 1,
					label: '勇于探索奖'
				}, {
					value: 2,
					label: '勇于实践奖'
				}, {
					value: 3,
					label: '获得开拓创新奖'
				}, {
					value: 4,
					label: '获得眼光独到奖'
				}],
			}
		},
		created() {
			this.getData();
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.getData();
			},
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			getData() {
				let self = this;
				let sTime = '';
			    let eTime = '';
			    
			    if(self.start){
			    	sTime = new Date(self.start).getTime()/1000;
			    }
			     if(self.end){
			    	eTime = new Date(self.end).getTime()/1000;
			    }
			     
				let postUrl = "v3/em?action=query_draw&page=" + (self.cur_page - 1) + "&num=" + self.pageSize + "&start=" + sTime + "&end=" + eTime + "&phone=" + self.phone + "&draw=" + self.draw;
				self.$axios
					.post(postUrl, {})
					.then(function(response) {
						console.log(response.data);
						if(response.data.code == 200) {
							self.total = parseInt(response.data.cnt);
							self.tableData = response.data.data;
							if(self.tableData && self.tableData.length > 0) {
								self.tableData.forEach(item => {
									item.name = decodeURI(item.name);
									item.nickname = decodeURI(item.nickname);
									item.draw = self.getType(parseInt(item.draw));
								})
							}
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			getType(numType) {
				let str = '';
				switch(numType) {
					case 0:
						str = "未中奖";
						break;
					case 1:
						str = "获得勇于探索奖";
						break;
					case 2:
						str = "获得勇于实践奖";
						break;
					case 3:
						str = "获得开拓创新奖";
						break;
					case 4:
						str = "获得眼光独到奖";
						break;
					default:
						break;
				}
				return str;
			},
			search() {
				this.getData();
			}
		}
	}
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-select {
		width: 120px;
	}
	
	.handle-input {
		width: 300px;
		display: inline-block;
	}
</style>