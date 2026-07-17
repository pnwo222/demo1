(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardSchoolDashboardCharts = {
    name: 'SnowyUnicardSchoolDashboardCharts',
    setup() {
      const trendRef = Vue.ref(null);
      const applicationRef = Vue.ref(null);
      const chartLoading = Vue.ref(true);
      const chartEmpty = Vue.ref(false);
      let trendChart;
      let applicationChart;
      const resize = () => { trendChart?.resize(); applicationChart?.resize(); };
      const renderCharts = () => {
        if (!global.echarts || !trendRef.value || !applicationRef.value) { chartEmpty.value = true; chartLoading.value = false; return; }
        trendChart = global.echarts.init(trendRef.value);
        trendChart.setOption({
          color: ['#1677ff', '#36cfc9'], tooltip: { trigger: 'axis' }, legend: { data: ['专区用户', '校园用户'], right: 8 },
          grid: { left: 48, right: 24, top: 48, bottom: 36 },
          xAxis: { type: 'category', boundaryGap: false, data: ['07-11','07-12','07-13','07-14','07-15','07-16','07-17'] },
          yAxis: { type: 'value', name: '用户数' },
          series: [
            { name: '专区用户', type: 'line', smooth: true, areaStyle: { opacity: 0.12 }, data: [10820,11040,11260,11510,11780,12020,12360] },
            { name: '校园用户', type: 'line', smooth: true, data: [7680,7810,7950,8120,8260,8410,8590] }
          ]
        });
        applicationChart = global.echarts.init(applicationRef.value);
        applicationChart.setOption({
          color: ['#722ed1', '#fa8c16'], tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { data: ['活跃用户', '社保卡码应用量'], right: 8 },
          grid: { left: 48, right: 24, top: 48, bottom: 36 },
          xAxis: { type: 'category', data: ['07-11','07-12','07-13','07-14','07-15','07-16','07-17'] },
          yAxis: { type: 'value', name: '人次' },
          series: [
            { name: '活跃用户', type: 'bar', barMaxWidth: 24, data: [3180,3260,3410,3520,3650,3780,3920] },
            { name: '社保卡码应用量', type: 'bar', barMaxWidth: 24, data: [1260,1320,1390,1450,1530,1610,1690] }
          ]
        });
        chartLoading.value = false;
      };
      Vue.onMounted(() => { Vue.nextTick(renderCharts); window.addEventListener('resize', resize); });
      Vue.onBeforeUnmount(() => { window.removeEventListener('resize', resize); trendChart?.dispose(); applicationChart?.dispose(); });
      return { trendRef, applicationRef, chartLoading, chartEmpty };
    },
    template: `
      <section class="unicard-dashboard" aria-label="学校业务首页数据图表">
        <div class="unicard-dashboard-metrics">
          <a-card :bordered="false"><a-statistic title="专区用户" :value="12360" suffix="人" /></a-card>
          <a-card :bordered="false"><a-statistic title="校园用户" :value="8590" suffix="人" /></a-card>
          <a-card :bordered="false"><a-statistic title="今日活跃用户" :value="3920" suffix="人" /></a-card>
          <a-card :bordered="false"><a-statistic title="今日社保卡码应用量" :value="1690" suffix="人次" /></a-card>
        </div>
        <a-spin :spinning="chartLoading">
          <a-empty v-if="chartEmpty" description="暂无图表数据" />
          <div v-else class="unicard-dashboard-charts">
            <a-card title="专区与校园用户趋势" :bordered="false"><div ref="trendRef" class="unicard-echart"></div></a-card>
            <a-card title="活跃与社保卡码应用趋势" :bordered="false"><div ref="applicationRef" class="unicard-echart"></div></a-card>
          </div>
        </a-spin>
      </section>`
  };
})(window);
