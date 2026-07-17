(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyBannerQueryForm = {
    name: 'SnowyBannerQueryForm',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `                <div class="query-card">
                  <h1 class="page-title">{{ pageTitle }}</h1>
                  <a-form layout="vertical">
                    <a-row :gutter="12">
                      <a-col :xs="24" :md="6">
                        <a-form-item label="标题">
                          <a-input v-model:value="query.keyword" placeholder="请输入标题关键词" allow-clear @pressEnter="search" />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="6">
                        <a-form-item label="栏目">
                          <a-select v-model:value="query.category" placeholder="全部栏目" allow-clear>
                            <a-select-option value="首页 Banner">首页 Banner</a-select-option>
                            <a-select-option value="通知公告">通知公告</a-select-option>
                            <a-select-option value="专业介绍">专业介绍</a-select-option>
                            <a-select-option value="招生服务">招生服务</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="6">
                        <a-form-item label="是否显示">
                          <a-select v-model:value="query.status" placeholder="全部" allow-clear>
                            <a-select-option :value="true">显示</a-select-option>
                            <a-select-option :value="false">隐藏</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="6" class="annotation-host" data-annotation-id="banner-date-range">
                        <button v-if="hasAnnotation('banner-date-range')" class="annotation-pin" type="button" @click.stop="showAnnotation('banner-date-range')">1</button>
                        <a-form-item label="创建时间">
                          <a-range-picker v-model:value="query.dateRange" style="width:100%" />
                        </a-form-item>
                      </a-col>
                      <a-col v-if="advanced" :xs="24" :md="6">
                        <a-form-item label="发布位置">
                          <a-select placeholder="全部位置" allow-clear>
                            <a-select-option value="后台首页">后台首页</a-select-option>
                            <a-select-option value="学校专区">学校专区</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-space>
                      <a-button type="primary" @click="search"><span class="mini-icon">⌕</span>查询</a-button>
                      <a-button @click="reset">重置</a-button>
                      <a-button type="link" @click="advanced = !advanced">{{ advanced ? '收起' : '展开' }}</a-button>
                    </a-space>
                  </a-form>
                </div>`
  };
})(window);
