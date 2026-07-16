(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyComponentPresetPage = {
    name: 'SnowyComponentPresetPage',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `              <section>
                <div class="preset-grid">
                  <div class="preset-card annotation-host">
                    <button v-if="hasAnnotation('component-upload')" class="annotation-pin" type="button" @click.stop="showAnnotation('component-upload')">1</button>
                    <h3>上传组件</h3>
                    <div class="preset-row">
                      <img v-if="formState.cover" class="upload-preview" :src="formState.cover" alt="上传预览" />
                      <div v-else class="cover-empty" style="width:102px;height:102px">无图</div>
                      <a-upload :show-upload-list="false" :before-upload="beforeCoverUpload" accept="image/*">
                        <a-button size="small">选择图片</a-button>
                      </a-upload>
                      <a-button size="small" @click="previewCurrentCover">预览</a-button>
                      <a-button size="small" @click="removeCover">移除</a-button>
                    </div>
                  </div>
                  <div class="preset-card annotation-host">
                    <button v-if="hasAnnotation('component-status')" class="annotation-pin" type="button" @click.stop="showAnnotation('component-status')">2</button>
                    <h3>状态与标签</h3>
                    <div class="preset-row">
                      <a-tag color="success">启用</a-tag>
                      <a-tag color="orange">待审核</a-tag>
                      <a-tag color="default">已停用</a-tag>
                      <a-badge status="processing" text="运行中" />
                    </div>
                  </div>
                  <div class="preset-card">
                    <h3>用户与进度</h3>
                    <div class="preset-row">
                      <a-avatar :src="componentRows[0].avatar">管</a-avatar>
                      <span>系统管理员</span>
                      <a-progress :percent="92" size="small" style="width:120px" />
                    </div>
                  </div>
                  <div class="preset-card">
                    <h3>树形选择</h3>
                    <a-tree-select style="width:100%" value="首页 Banner" :tree-data="[{ title: '内容管理', value: '内容管理', children: [{ title: '首页 Banner', value: '首页 Banner' }, { title: '通知公告', value: '通知公告' }] }]" />
                  </div>
                  <div class="preset-card">
                    <h3>确认操作</h3>
                    <a-space>
                      <a-button danger @click="confirmAction('删除数据')">删除</a-button>
                      <a-button @click="confirmAction('重置密码')">重置密码</a-button>
                    </a-space>
                  </div>
                  <div class="preset-card">
                    <h3>文件类型</h3>
                    <div class="preset-row">
                      <span class="file-thumb pdf">PDF</span>
                      <span class="file-thumb xls">XLS</span>
                      <span class="file-thumb doc">DOC</span>
                      <a-button size="small" @click="topAction('文件预览')">预览</a-button>
                    </div>
                  </div>
                </div>
                <div class="table-card annotation-host">
                  <button v-if="hasAnnotation('component-table')" class="annotation-pin" type="button" @click.stop="showAnnotation('component-table')">3</button>
                  <div class="toolbar">
                    <div class="toolbar-left">
                      <a-button type="primary" @click="topAction('新增用户')"><span class="mini-icon">＋</span>新增用户</a-button>
                      <a-button @click="topAction('导入用户')"><span class="mini-icon">⇧</span>导入</a-button>
                      <a-button @click="topAction('导出用户')"><span class="mini-icon">⇩</span>导出</a-button>
                    </div>
                    <div class="toolbar-right">
                      <a-tooltip title="刷新"><a-button shape="circle" @click="refresh"><span class="mini-icon">↻</span></a-button></a-tooltip>
                    </div>
                  </div>
                  <a-table
                    row-key="id"
                    :columns="componentColumns"
                    :data-source="componentRows"
                    :pagination="false"
                    :scroll="{ x: 1500 }"
                    bordered
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'avatar'">
                        <a-avatar v-if="record.avatar" :src="record.avatar" />
                        <a-avatar v-else>{{ record.name.slice(0, 1) }}</a-avatar>
                      </template>
                      <template v-else-if="column.key === 'gender'">
                        <a-tag :color="record.gender === '男' ? 'blue' : 'magenta'">{{ record.gender }}</a-tag>
                      </template>
                      <template v-else-if="column.key === 'role'">
                        <a-tag color="processing">{{ record.role }}</a-tag>
                      </template>
                      <template v-else-if="column.key === 'status'">
                        <a-switch :checked="record.status" @change="value => { record.status = value; topAction(value ? '启用用户' : '停用用户') }" />
                      </template>
                      <template v-else-if="column.key === 'progress'">
                        <a-progress :percent="record.progress" size="small" />
                      </template>
                      <template v-else-if="column.key === 'fileName'">
                        <a-space>
                          <span :class="'file-thumb ' + record.fileType">{{ record.fileType.toUpperCase() }}</span>
                          <span>
                            <a-tooltip :title="record.fileName"><span class="text-ellipsis">{{ record.fileName }}</span></a-tooltip>
                            <div class="muted">{{ record.size }} · {{ record.engine }}</div>
                          </span>
                        </a-space>
                      </template>
                      <template v-else-if="column.key === 'remark'">
                        <a-tooltip :title="record.remark"><span class="text-ellipsis">{{ record.remark }}</span></a-tooltip>
                      </template>
                      <template v-else-if="column.key === 'action'">
                        <a-space>
                          <a @click="topAction('查看详情')">详情</a>
                          <a @click="topAction('编辑资料')">编辑</a>
                          <a-dropdown>
                            <a @click.prevent>更多</a>
                            <template #overlay>
                              <a-menu>
                                <a-menu-item @click="confirmAction('重置密码')">重置密码</a-menu-item>
                                <a-menu-item @click="topAction('角色授权')">角色授权</a-menu-item>
                                <a-menu-item @click="topAction('导出信息')">导出信息</a-menu-item>
                              </a-menu>
                            </template>
                          </a-dropdown>
                        </a-space>
                      </template>
                    </template>
                  </a-table>
                </div>
              </section>`
  };
})(window);
