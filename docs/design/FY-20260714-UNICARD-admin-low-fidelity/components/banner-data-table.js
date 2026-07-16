(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyBannerDataTable = {
    name: 'SnowyBannerDataTable',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `                <div class="table-card">
                  <div class="toolbar">
                    <div class="toolbar-left">
                      <a-button type="primary" @click="openAdd"><span class="mini-icon">＋</span>新增内容</a-button>
                      <span class="annotation-host">
                        <button v-if="hasAnnotation('banner-batch-delete')" class="annotation-pin" type="button" @click.stop="showAnnotation('banner-batch-delete')">5</button>
                        <a-button danger @click="batchDelete"><span class="mini-icon">×</span>批量删除</a-button>
                      </span>
                      <a-button @click="importOpen = true"><span class="mini-icon">⇧</span>导入</a-button>
                      <a-button @click="exportData"><span class="mini-icon">⇩</span>导出</a-button>
                    </div>
                    <div class="toolbar-right">
                      <a-tooltip title="刷新"><a-button shape="circle" @click="refresh"><span class="mini-icon">↻</span></a-button></a-tooltip>
                      <a-tooltip title="表格密度"><a-button shape="circle" @click="tableSize = tableSize === 'middle' ? 'small' : 'middle'"><span class="mini-icon">↕</span></a-button></a-tooltip>
                      <a-tooltip title="列设置"><a-button shape="circle" @click="columnOpen = true"><span class="mini-icon">☷</span></a-button></a-tooltip>
                    </div>
                  </div>
                  <a-table
                    row-key="id"
                    :columns="columns"
                    :data-source="filteredRows"
                    :row-selection="rowSelection"
                    :size="tableSize"
                    :pagination="{ current: pagination.current, pageSize: pagination.pageSize, total: filteredRows.length, showSizeChanger: true, showTotal: total => '共 ' + total + ' 条' }"
                    :scroll="{ x: 1200 }"
                    @change="changePage"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'cover'">
                        <span class="annotation-host" style="display:inline-block">
                          <button v-if="rows.length && record.id === rows[0].id && hasAnnotation('banner-cover-image')" class="annotation-pin" type="button" @click.stop="showAnnotation('banner-cover-image')">4</button>
                          <img v-if="record.cover" class="cover" :src="record.cover" alt="封面图" />
                          <div v-else class="cover-empty">无图</div>
                        </span>
                      </template>
                      <template v-else-if="column.key === 'position'">
                        <a-tag :color="record.position === '后台首页' ? 'green' : 'blue'">{{ record.position }}</a-tag>
                      </template>
                      <template v-else-if="column.key === 'audit'">
                        <span class="annotation-host" style="display:inline-block">
                          <button v-if="rows.length && record.id === rows[0].id && hasAnnotation('banner-publish-status')" class="annotation-pin" type="button" @click.stop="showAnnotation('banner-publish-status')">2</button>
                          <a-tag :color="record.audit === '待审核' ? 'orange' : record.audit === '已发布' ? 'success' : 'default'">{{ record.audit }}</a-tag>
                        </span>
                      </template>
                      <template v-else-if="column.key === 'status'">
                        <span class="annotation-host" style="display:inline-block">
                          <button v-if="rows.length && record.id === rows[0].id && hasAnnotation('banner-enable-status')" class="annotation-pin" type="button" @click.stop="showAnnotation('banner-enable-status')">3</button>
                          <a-switch :checked="record.status" @change="value => toggleStatus(record, value)" />
                        </span>
                      </template>
                      <template v-else-if="column.key === 'attachment'">
                        <a-space v-if="record.attachmentName">
                          <span :class="'file-thumb ' + record.attachmentType">{{ String(record.attachmentType || 'file').toUpperCase() }}</span>
                          <span>
                            <a-tooltip :title="record.attachmentName"><span class="text-ellipsis">{{ record.attachmentName }}</span></a-tooltip>
                            <div class="muted">{{ record.attachmentSize }}</div>
                          </span>
                        </a-space>
                        <span v-else class="muted">无附件</span>
                      </template>
                      <template v-else-if="column.key === 'action'">
                        <a-space>
                          <a @click="openDetail(record)">详情</a>
                          <a @click="openEdit(record)">编辑</a>
                          <a v-if="record.audit === '待审核'" @click="auditRow(record)">审核</a>
                          <a-typography-link type="danger" @click="removeRow(record)">删除</a-typography-link>
                        </a-space>
                      </template>
                    </template>
                  </a-table>
                </div>`
  };
})(window);
