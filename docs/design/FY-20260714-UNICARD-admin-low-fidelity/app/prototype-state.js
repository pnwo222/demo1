(function (global) {
  const { ref, reactive, computed, h, nextTick, onMounted, onBeforeUnmount } = Vue;
  const { prototypeMeta, demoImages, seedRows, componentRows } = global.SnowyPrototypeData;

  global.createSnowyPrototypeContext = function createSnowyPrototypeContext() {
        const collapsed = ref(false);
        const businessPages = Object.freeze([...global.UnicardSchoolPages, ...global.UnicardPlatformPages]);
        const currentPage = ref('ADM-S-001');
        const activeTab = ref('业务首页');
        const selectedKeys = ref(['ADM-S-001']);
        const openKeys = ref(['school-root', 'school-people', 'school-content', 'school-query', 'platform-root', 'platform-org', 'platform-auth', 'platform-log']);
        const tableSize = ref('middle');
        const selectedRowKeys = ref([]);
        const rows = ref(seedRows.map(item => ({ ...item })));
        const query = reactive({ keyword: '', category: undefined, status: undefined, dateRange: [] });
        const advanced = ref(false);
        const drawerOpen = ref(false);
        const drawerMode = ref('add');
        const formState = reactive({ id: null, title: '', category: '首页 Banner', position: '后台首页', sort: 10, status: true, audit: '待审核', cover: demoImages[0], summary: '', uploadFiles: [{ uid: 'init', name: '示例封面.png', status: 'done', url: demoImages[0] }] });
        const detailRecord = ref(null);
        const importOpen = ref(false);
        const columnOpen = ref(false);
        const previewOpen = ref(false);
        const previewImage = ref('');
        const previewTitle = ref('');
        const menuDrawerOpen = ref(false);
        const menuForm = reactive({ parent: '内容管理', name: '首页 Banner', path: '/content/banner', permissionName: '首页 Banner 管理', visible: true, sort: 20 });
        const activeResource = ref('首页 Banner');
        const checkedColumns = ref(['title', 'cover', 'category', 'position', 'sort', 'audit', 'status', 'attachment', 'action']);
        const pagination = reactive({ current: 1, pageSize: 10 });
        const currentRole = ref('学校管理员');
        const availableRoleOptions = ['学校管理员', '内容运营人员', '审核人员', '平台管理员', '安全审计人员', '设备运维人员'].map(value => ({ label: value, value }));
        const businessQuery = reactive({});
        const businessPagination = reactive({ current: 1, pageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条` });
        const businessRowsByPage = reactive(Object.fromEntries(businessPages.map(page => {
          const rowsForPage = Array.from({ length: 15 }, (_, index) => {
            const record = { ...page.sampleRows[0], _key: `${page.id}-${index + 1}` };
            page.tableFields.forEach(field => {
              if (field.shape.includes('状态') || field.shape.includes('告警')) record[field.key] = page.states[index % page.states.length]?.name || '正常';
              if (field.shape.includes('图片')) record[field.key] = demoImages[index % 2];
              if (field.shape.includes('数字')) record[field.key] = (index + 1) * 10;
            });
            return record;
          });
          return [page.id, rowsForPage];
        })));
        const businessDrawerOpen = ref(false);
        const businessDrawerMode = ref('add');
        const businessForm = reactive({});
        const businessDetailRecord = reactive({});
        const businessUploadFiles = ref([]);
        const businessPreviewOpen = ref(false);
        const businessPreviewImage = ref(demoImages[0]);
        const roleGrantOpen = ref(false);
        const roleGrantCheckedKeys = ref(['ADM-S-001', 'ADM-S-003']);
        const roleGrantOrgKeys = ref(['school-ningbo-textile']);
        const roleGrantScope = ref('org');
        const roleGrantBefore = ref('业务首页、学生管理；本组织数据');
        const roleGrantAfter = ref('业务首页、学生管理、内容管理；本组织及下级数据');
        const governanceTreeSelection = ref(['school-ningbo-textile']);
        const annotationStorageKey = 'snowy-admin-prototype:annotations:' + (window.location.pathname || document.title);
        const embeddedAnnotationState = (() => {
          try {
            const node = document.getElementById('snowy-annotation-state');
            return node && node.textContent.trim() ? JSON.parse(node.textContent) : {};
          } catch (error) {
            return {};
          }
        })();
        const localAnnotationState = (() => {
          try {
            const value = window.localStorage.getItem(annotationStorageKey);
            return value ? JSON.parse(value) : {};
          } catch (error) {
            return {};
          }
        })();
        const annotationStateTime = state => {
          const value = Date.parse(state && state.savedAt ? state.savedAt : '');
          return Number.isFinite(value) ? value : 0;
        };
        const persistedAnnotationState = annotationStateTime(localAnnotationState) >= annotationStateTime(embeddedAnnotationState)
          && annotationStateTime(localAnnotationState) > 0
          ? localAnnotationState
          : embeddedAnnotationState;
        const annotationEnabled = ref(false);
        const annotationToolbarCollapsed = ref(false);
        const annotationEditorOpen = ref(false);
        const annotationEditorMode = ref('add');
        const annotationEditingField = ref('');
        const annotationForm = reactive({ id: '', index: 1, title: '', summary: '', detail: '' });
        const annotationFormSnapshot = ref('');
        const requirementDrawerOpen = ref(false);
        const requirementDraft = ref('');
        const requirementSnapshot = ref('');
        const requirementEditing = ref(false);
        const nodeCommentOpen = ref(false);
        const nodeCommentText = ref('');
        const nodeCommentTarget = ref('');
        const nodeCommentEditingId = ref('');
        const nodeCommentInputRef = ref(null);
        const nodeCommentStyle = reactive({ left: '0px', top: '0px' });
        const nodeCommentAnchor = reactive({ left: 0, top: 0 });
        let selectedNodeEl = null;
        let draftNodePinEl = null;
        let hoverOutlineEl = null;
        let selectedOutlineEl = null;
        let hoverNodeEl = null;
        let overlayFrame = 0;

        const baseAnnotationGroups = {
          banner: [
            { id: 'banner-date-range', index: 1, title: '示例：创建时间范围限制', summary: '示例规则：日期范围最多只能选择 7 天。', detail: '这是 Demo 中用于展示标注形态的示例规则。真实项目必须从当前需求文档或页面蓝图提取日期范围限制；如果需求没有写 7 天，不得沿用本示例。' },
            { id: 'banner-publish-status', index: 2, title: '示例：发布状态枚举', summary: '示例规则：发布状态包含已发布、待审核、已下架。', detail: '这是 Demo 中用于展示状态枚举标注的示例。真实项目必须以需求文档中的状态为准，例如需求写了注册状态、绑卡状态或审批状态，就应标注那些真实枚举。' },
            { id: 'banner-enable-status', index: 3, title: '示例：是否显示开关含义', summary: '示例规则：是否显示只控制前台展示，不代表审核是否通过。', detail: '这是 Demo 中用于展示“状态容易混淆”时如何标注。真实项目应根据需求说明区分业务状态、流程状态和显示控制，不能默认套用本示例解释。' },
            { id: 'banner-cover-image', index: 4, title: '示例：封面图展示规则', summary: '示例规则：封面图展示真实图片缩略图，无图显示占位。', detail: '这是 Demo 中用于展示图片字段标注的示例。真实项目应根据需求中的图片、附件、头像、证件照、图标等字段分别标注展示规则和上传限制。' },
            { id: 'banner-batch-delete', index: 5, title: '示例：批量删除风险', summary: '示例规则：批量删除必须先选择数据，并二次确认。', detail: '这是 Demo 中用于展示高风险操作标注的示例。真实项目只有在需求包含删除、批量操作、作废、撤销等风险动作时才标注，并按真实业务规则写清影响范围。' },
            { id: 'banner-drawer-cover', index: 6, title: '示例：表单封面图要求', summary: '示例规则：新增和编辑支持选择、预览、移除；详情只读。', detail: '这是 Demo 中用于展示表单字段标注的示例。真实项目应按需求中的新增、编辑、详情字段逐项标注，尤其是必填、只读、脱敏、校验和权限差异。' }
          ],
          menuResource: [
            { id: 'menu-tree', index: 1, title: '菜单层级必须完整', summary: '内容管理下包含首页 Banner、通知公告等二级/三级菜单。', detail: '需求中出现“模块/菜单/管理”层级时，原型必须落成左侧菜单结构，不能只在页面标题里体现。菜单节点需要能追溯到需求章节和具体页面。' },
            { id: 'menu-detail', index: 2, title: '路由和权限必须明确', summary: '菜单资源必须展示路由地址、权限名称、可见角色和操作范围。', detail: '每个后管页面都要明确路由路径和权限标识，例如 /content/banner 与首页 Banner 管理权限。没有权限标识的页面不能进入开发。' },
            { id: 'menu-actions', index: 3, title: '删除菜单属于高风险操作', summary: '删除菜单前必须确认是否影响角色授权和已有按钮权限。', detail: '删除菜单会影响入口可见性、按钮权限和角色授权，应二次确认，并提示可能影响已分配角色。普通内容删除和菜单删除不能使用同一套轻提示。' }
          ],
          components: [
            { id: 'component-upload', index: 1, title: '图片上传校验', summary: '图片上传建议限制 JPG/PNG，单图不超过 2MB。', detail: '图片字段要提供选择、预览、移除能力。上传失败时应保留原图，不应清空表单；重新选择图片后页面内预览必须立即更新。' },
            { id: 'component-status', index: 2, title: '状态组件选择', summary: '业务状态用标签，是否显示用开关，流程中状态用徽标。', detail: '不同状态含义要用不同组件表达：审核状态用标签，显示控制用开关，异步任务或运行状态用徽标，避免所有状态都画成同一种颜色标签。' },
            { id: 'component-table', index: 3, title: '表格字段展示形态', summary: '头像、文件、进度、长文本不能都用普通文本展示。', detail: '头像用 Avatar；文件用类型图标、文件名、大小和来源；进度用进度条；长文本默认省略并提供悬浮完整内容；更多操作放入下拉菜单。' }
          ]
        };
        const generatedAnnotationGroups = Object.fromEntries(businessPages.map(page => [
          page.id,
          global.UnicardPageAnnotations
            .filter(item => item.pageId === page.id)
            .map((item, index) => ({ id: item.id, index: index + 1, title: item.title, summary: item.summary, detail: `节点：${item.nodeKey}；来源：${item.source}` }))
        ]));
        Object.keys(baseAnnotationGroups).forEach(key => delete baseAnnotationGroups[key]);
        Object.assign(baseAnnotationGroups, generatedAnnotationGroups);
        const annotationGroups = reactive(JSON.parse(JSON.stringify(baseAnnotationGroups)));
        if (persistedAnnotationState.annotationGroups) {
          Object.entries(persistedAnnotationState.annotationGroups).forEach(([key, value]) => {
            if (Array.isArray(value)) annotationGroups[key] = value;
          });
        }
        const savedNodeComments = reactive(Array.isArray(persistedAnnotationState.nodeComments) ? persistedAnnotationState.nodeComments : []);
        const basePageRequirements = {
          banner: '本页面用于管理首页 Banner 内容。支持按标题、栏目、发布状态、是否显示和创建时间筛选；列表展示封面图、栏目、发布位置、排序、发布状态、是否显示、附件和创建时间；支持新增、编辑、详情、审核、删除、批量删除、导入、导出、图片上传预览及附件管理。',
          menuResource: '本页面用于维护后管菜单资源。左侧展示业务菜单层级，右侧展示当前菜单的路由地址、权限名称、可见角色和操作范围；支持新增、编辑、角色授权、删除菜单，并对影响已有权限分配的操作进行确认。',
          components: '本页面集中展示 Snowy 后管常用组件及数据语义，包括图片上传、状态标签、开关、徽标、确认操作、文件类型、进度、头像、长文本省略和表格更多操作，用于约束业务原型选择符合字段含义的展示形式。'
        };
        Object.keys(basePageRequirements).forEach(key => delete basePageRequirements[key]);
        Object.assign(basePageRequirements, Object.fromEntries(businessPages.map(page => [page.id, global.UnicardPageRequirements[page.id].summary])));
        const pageRequirements = reactive({
          ...basePageRequirements,
          ...(persistedAnnotationState.pageRequirements || {})
        });

        const leaf = id => ({ key: id, label: businessPages.find(page => page.id === id).title });
        const menuItems = [
          { key: 'school-root', label: '学校端', children: [
            leaf('ADM-S-001'),
            { key: 'school-people', label: '师生管理', children: ['ADM-S-002', 'ADM-S-003', 'ADM-S-004', 'ADM-S-005'].map(leaf) },
            { key: 'school-content', label: '内容管理', children: ['ADM-S-006', 'ADM-S-007', 'ADM-S-008', 'ADM-S-009', 'ADM-S-010', 'ADM-S-011'].map(leaf) },
            leaf('ADM-S-012'), leaf('ADM-S-013'),
            { key: 'school-query', label: '信息查询', children: ['ADM-S-014', 'ADM-S-015', 'ADM-S-016', 'ADM-S-017', 'ADM-S-018'].map(leaf) },
            leaf('ADM-S-019'), leaf('ADM-S-020')
          ] },
          { key: 'platform-root', label: '平台端', children: [
            leaf('ADM-P-001'),
            { key: 'platform-org', label: '组织架构', children: ['ADM-P-002', 'ADM-P-003'].map(leaf) },
            { key: 'platform-auth', label: '权限管理', children: ['ADM-P-004', 'ADM-P-005', 'ADM-P-006'].map(leaf) },
            { key: 'platform-log', label: '日志管理', children: ['ADM-P-007', 'ADM-P-008', 'ADM-P-009'].map(leaf) },
            leaf('ADM-P-010'), leaf('ADM-P-011'), leaf('ADM-P-012'), leaf('ADM-P-013')
          ] }
        ];

        const baseColumns = [
          { title: '标题', dataIndex: 'title', key: 'title', width: 190 },
          { title: '封面图', dataIndex: 'cover', key: 'cover', width: 116 },
          { title: '栏目', dataIndex: 'category', key: 'category', width: 110 },
          { title: '发布位置', dataIndex: 'position', key: 'position', width: 110 },
          { title: '排序', dataIndex: 'sort', key: 'sort', width: 70, sorter: (a, b) => a.sort - b.sort },
          { title: '发布状态', dataIndex: 'audit', key: 'audit', width: 100 },
          { title: '是否显示', dataIndex: 'status', key: 'status', width: 96 },
          { title: '附件', dataIndex: 'attachmentName', key: 'attachment', width: 210 },
          { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 172 },
          { title: '操作', key: 'action', fixed: 'right', width: 170 }
        ];
        const columns = computed(() => baseColumns.filter(col => checkedColumns.value.includes(col.key)));
        const componentColumns = [
          { title: '头像', dataIndex: 'avatar', key: 'avatar', width: 78, align: 'center' },
          { title: '账号', dataIndex: 'account', key: 'account', width: 110 },
          { title: '姓名', dataIndex: 'name', key: 'name', width: 110 },
          { title: '性别', dataIndex: 'gender', key: 'gender', width: 90 },
          { title: '机构', dataIndex: 'org', key: 'org', width: 130 },
          { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
          { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
          { title: '完成度', dataIndex: 'progress', key: 'progress', width: 150 },
          { title: '文件', dataIndex: 'fileName', key: 'fileName', width: 230 },
          { title: '备注', dataIndex: 'remark', key: 'remark', width: 260 },
          { title: '操作', key: 'action', fixed: 'right', width: 170 }
        ];

        const activeBusinessPage = computed(() => businessPages.find(page => page.id === currentPage.value) || businessPages[0]);
        const allowedBusinessActions = computed(() => activeBusinessPage.value.actions.filter(action => action.roles.includes(currentRole.value) || currentRole.value === '平台管理员'));
        const primaryBusinessActions = computed(() => allowedBusinessActions.value.filter(action => !['查询', '重置', '查看详情', '查看学生详情', '查看教职工详情', '查看历史学生详情', '查看申领详情', '查看访客详情', '查看通行详情', '查看消费详情', '查看借阅详情', '查看用户详情', '查看设备详情', '查看访问日志详情', '查看操作日志详情', '查看外部调用日志详情', '查看对接状态详情', '查看审核数据详情', '查看监控详情', '编辑', '删除', '提交审核', '审核', '发布', '发布至 APP', '设置首页推荐', '同步 APP 端', '分配角色', '菜单授权', '数据授权', '调整层级', '排序调整'].includes(action.name)));
        const rowBusinessActions = computed(() => allowedBusinessActions.value.filter(action => !['查询', '重置', '新增', '报表导出', '清单导出', '导出访客记录'].includes(action.name)));
        const businessRows = computed(() => {
          const source = businessRowsByPage[activeBusinessPage.value.id] || [];
          const filters = Object.entries(businessQuery).filter(([, value]) => value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length));
          if (!filters.length) return source;
          return source.filter(record => filters.every(([key, value]) => String(record[key] || '').includes(Array.isArray(value) ? '' : String(value))));
        });
        const businessColumns = computed(() => [
          ...activeBusinessPage.value.tableFields.slice(0, 8).map(field => ({ title: field.label, dataIndex: field.key, key: field.key, width: field.sensitive ? 170 : 150, ellipsis: true })),
          { title: '操作', key: '__actions', fixed: 'right', width: 190 }
        ]);
        const businessField = key => activeBusinessPage.value.tableFields.find(field => field.key === key) || { key, label: key, shape: '文本', sensitive: false };
        const businessImage = computed(() => demoImages[0]);
        const businessDrawerTitle = computed(() => businessDrawerMode.value === 'detail' ? `${activeBusinessPage.value.title.replace('管理', '')}详情` : `${businessDrawerMode.value === 'edit' ? '编辑' : '新增'}${activeBusinessPage.value.title.replace('管理', '')}`);
        const permissionGuideRows = computed(() => {
          const school = activeBusinessPage.value.id.startsWith('ADM-S-');
          return businessPages.filter(page => page.id.startsWith(school ? 'ADM-S-' : 'ADM-P-')).map(page => ({
            _key: page.id,
            菜单名称: page.title,
            路由路径: page.route,
            权限标识: page.permission,
            入口位置: page.menuPath,
            可见角色: page.roles.join('、'),
            数据范围: school ? '本学校及授权组织' : '全局或授权组织',
            按钮权限: page.actions.map(action => action.name).join('、')
          }));
        });
        const governanceTreeData = [
          { key: 'platform', title: '宁波市高校一卡通', children: [
            { key: 'school-ningbo-textile', title: '宁波纺织学院', children: [{ key: 'org-it', title: '信息中心' }, { key: 'org-student', title: '学生工作部' }] },
            { key: 'school-demo', title: '示范高校', children: [{ key: 'org-library', title: '图书馆' }] }
          ] }
        ];
        const roleGrantTreeData = menuItems.map(group => ({ key: `grant-${group.key}`, title: group.label, children: group.children.map(item => ({ key: item.key, title: item.label, children: item.children?.map(child => ({ key: child.key, title: child.label })) })) }));
        const businessSelectOptions = field => activeBusinessPage.value.states.slice(0, 6).map(state => ({ label: state.name, value: state.name }));
        const businessMetricValue = index => [12860, 4382, 96, 17, 8, 3][index] || 0;
        const businessStatusColor = value => /失败|异常|离线|报警|驳回|停用/.test(String(value)) ? 'red' : /待|中/.test(String(value)) ? 'orange' : 'green';

        const filteredRows = computed(() => {
          let result = rows.value.slice();
          if (query.keyword) result = result.filter(row => row.title.includes(query.keyword.trim()));
          if (query.category) result = result.filter(row => row.category === query.category);
          if (query.status !== undefined) result = result.filter(row => row.status === query.status);
          if (query.dateRange && query.dateRange.length === 2) {
            const start = dayjs(query.dateRange[0]).startOf('day');
            const end = dayjs(query.dateRange[1]).endOf('day');
            result = result.filter(row => dayjs(row.createdAt).isAfter(start) && dayjs(row.createdAt).isBefore(end));
          }
          return result;
        });

        const pageTitle = computed(() => activeBusinessPage.value.title);
        const currentAnnotationKey = computed(() => currentPage.value);
        const currentAnnotations = computed(() => annotationGroups[currentAnnotationKey.value] || []);
        const requirementDrawerTitle = computed(() => pageTitle.value + ' - 整体需求说明');
        const requirementDirty = computed(() => requirementDraft.value.trim() !== requirementSnapshot.value);
        const nodeCommentMultiline = computed(() => /\r?\n/.test(nodeCommentText.value) || Array.from(nodeCommentText.value).length > 24);
        const snapshotAnnotationForm = () => JSON.stringify({
          id: annotationForm.id,
          index: Number(annotationForm.index) || 0,
          title: String(annotationForm.title || ''),
          summary: String(annotationForm.summary || ''),
          detail: String(annotationForm.detail || '')
        });
        const annotationDirty = computed(() => snapshotAnnotationForm() !== annotationFormSnapshot.value);
        const normalizeAnnotationTitle = title => {
          const value = String(title || '').trim();
          return /^\d+\s*[：:]\s*注释$/.test(value) ? '注释' : value;
        };
        const annotationComparable = note => JSON.stringify({
          id: note && note.id ? note.id : '',
          index: Number(note && note.index) || 0,
          title: String(note && note.title || ''),
          summary: String(note && note.summary || ''),
          detail: String(note && note.detail || '')
        });
        const findBaseAnnotation = (pageKey, noteId) => {
          const group = baseAnnotationGroups[pageKey] || [];
          return group.find(item => item.id === noteId) || null;
        };
        const hasAnnotation = noteId => currentAnnotations.value.some(item => item.id === noteId);
        const annotationDeleteLabel = computed(() => {
          if (annotationEditorMode.value !== 'edit') return '';
          const base = findBaseAnnotation(currentAnnotationKey.value, annotationForm.id);
          if (base && annotationComparable(base) !== snapshotAnnotationForm()) return '恢复原始标注';
          return '删除标注';
        });
        const rowSelection = computed(() => ({
          selectedRowKeys: selectedRowKeys.value,
          onChange: keys => selectedRowKeys.value = keys
        }));

        const showMessage = (type, text) => antd.message[type](text);
        const resetBusinessQuery = () => {
          Object.keys(businessQuery).forEach(key => delete businessQuery[key]);
          businessPagination.current = 1;
          showMessage('success', '查询条件已重置');
        };
        const searchBusinessRows = () => {
          businessPagination.current = 1;
          showMessage('success', '查询完成');
        };
        const refreshBusinessRows = () => showMessage('success', '数据已刷新');
        const changeBusinessPage = pageInfo => { businessPagination.current = pageInfo.current; businessPagination.pageSize = pageInfo.pageSize; };
        const openBusinessColumnSettings = () => showMessage('success', '列设置已应用');
        const openBusinessDetail = record => {
          businessDrawerMode.value = 'detail';
          Object.keys(businessDetailRecord).forEach(key => delete businessDetailRecord[key]);
          Object.assign(businessDetailRecord, record || businessRows.value[0] || {});
          businessDrawerOpen.value = true;
        };
        const openBusinessForm = (mode, record) => {
          businessDrawerMode.value = mode;
          Object.keys(businessForm).forEach(key => delete businessForm[key]);
          activeBusinessPage.value.formFields.forEach(field => { businessForm[field.key] = record?.[field.key] ?? (field.shape.includes('开关') ? true : ''); });
          businessUploadFiles.value = [];
          businessDrawerOpen.value = true;
        };
        const runBusinessAction = (name, record) => {
          if (name === '查询') return searchBusinessRows();
          if (name === '重置') return resetBusinessQuery();
          if (name === '新增') return openBusinessForm('add');
          if (name === '编辑' || name === '配置显示字段') return openBusinessForm('edit', record || businessRows.value[0]);
          if (/查看.*详情|查看详情|查看关联菜单与权限/.test(name)) return openBusinessDetail(record);
          if (name === '菜单授权' || name === '数据授权' || name === '分配角色') return openRoleGrant(record);
          const action = activeBusinessPage.value.actions.find(item => item.name === name);
          if (action?.kind === 'danger' || action?.kind === 'controlled' || /审核|发布|同步|导出|删除|调整/.test(name)) {
            antd.Modal.confirm({ title: '操作确认', content: `确定执行“${name}”吗？该操作将记录审计日志。`, okText: '确定', cancelText: '取消', onOk: () => showMessage('success', `${name}已完成`) });
            return;
          }
          showMessage('success', `${name}已完成`);
        };
        const saveBusinessForm = () => {
          const required = activeBusinessPage.value.formFields.find(field => ['图片标题', '应用名称', '公告标题', '文章标题', '活动标题', '学校名称', '用户账号', '角色名称', '菜单名称'].includes(field.label));
          if (required && !String(businessForm[required.key] || '').trim()) return showMessage('warning', `请输入${required.label}`);
          if (businessDrawerMode.value === 'add') businessRowsByPage[activeBusinessPage.value.id].unshift({ ...businessForm, _key: `${activeBusinessPage.value.id}-${Date.now()}` });
          else Object.assign(businessRowsByPage[activeBusinessPage.value.id][0], businessForm);
          businessDrawerOpen.value = false;
          showMessage('success', '保存成功，列表已刷新');
        };
        const beforeBusinessUpload = file => {
          if (!file.type?.startsWith('image/')) { showMessage('warning', '请选择图片文件'); return false; }
          const reader = new FileReader();
          reader.onload = event => {
            businessPreviewImage.value = event.target.result;
            businessUploadFiles.value = [{ uid: file.uid || String(Date.now()), name: file.name, status: 'done', url: event.target.result }];
            showMessage('success', '图片已选择');
          };
          reader.readAsDataURL(file);
          return false;
        };
        const removeBusinessUpload = () => { businessUploadFiles.value = []; businessPreviewImage.value = demoImages[0]; showMessage('success', '图片已移除'); return true; };
        const previewBusinessUpload = file => { businessPreviewImage.value = file.url || demoImages[0]; businessPreviewOpen.value = true; };
        const previewBusinessImage = () => { businessPreviewImage.value = businessUploadFiles.value[0]?.url || demoImages[0]; businessPreviewOpen.value = true; };
        const navigateBusinessGroup = index => {
          const targets = activeBusinessPage.value.id === 'ADM-S-002' ? ['ADM-S-003', 'ADM-S-004', 'ADM-S-005'] : ['ADM-S-015', 'ADM-S-016', 'ADM-S-017', 'ADM-S-018'];
          setPage({ key: targets[index] || targets[0] });
        };
        const selectGovernanceTree = keys => { governanceTreeSelection.value = keys; showMessage('success', '组织范围已切换'); };
        const openRoleGrant = () => { roleGrantOpen.value = true; };
        const saveRoleGrant = () => { roleGrantOpen.value = false; showMessage('success', '授权已保存并记录变更审计'); };
        const setPage = ({ key }) => {
          const target = businessPages.find(page => page.id === key);
          if (!target) return;
          selectedKeys.value = [key];
          activeTab.value = target.title;
          currentPage.value = key;
          currentRole.value = target.roles[0];
          resetBusinessQuery();
          nextTick(restoreNodeCommentPinsForCurrentPage);
          showMessage('success', '已切换到' + activeTab.value);
        };
        const onOpenChange = keys => openKeys.value = keys;
        const search = () => {
          if (query.dateRange && query.dateRange.length === 2) {
            const start = dayjs(query.dateRange[0]).startOf('day');
            const end = dayjs(query.dateRange[1]).endOf('day');
            if (end.diff(start, 'day') > 7) {
              showMessage('warning', '查询时间范围不能超过 7 天');
              return;
            }
          }
          pagination.current = 1;
          showMessage('success', '查询完成');
        };
        const reset = () => {
          query.keyword = '';
          query.category = undefined;
          query.status = undefined;
          query.dateRange = [];
          pagination.current = 1;
          showMessage('success', '查询条件已重置');
        };
        const refresh = () => showMessage('success', '列表已刷新');
        const exportData = () => showMessage('success', '导出任务已创建');
        const batchDelete = () => {
          if (!selectedRowKeys.value.length) {
            showMessage('warning', '请先选择需要删除的数据');
            return;
          }
          antd.Modal.confirm({
            title: '删除确认',
            content: '确定要删除选中的数据吗？删除后列表将自动刷新。',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              rows.value = rows.value.filter(row => !selectedRowKeys.value.includes(row.id));
              selectedRowKeys.value = [];
              showMessage('success', '删除成功');
            }
          });
        };
        const removeRow = record => {
          antd.Modal.confirm({
            title: '删除确认',
            content: '确定要删除“' + record.title + '”吗？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              rows.value = rows.value.filter(row => row.id !== record.id);
              selectedRowKeys.value = selectedRowKeys.value.filter(id => id !== record.id);
              showMessage('success', '删除成功');
            }
          });
        };
        const openAdd = () => {
          drawerMode.value = 'add';
          Object.assign(formState, { id: null, title: '', category: '首页 Banner', position: '后台首页', sort: 10, status: true, audit: '待审核', cover: demoImages[0], summary: '', uploadFiles: demoImages[0] ? [{ uid: 'demo-1', name: '示例封面.png', status: 'done', url: demoImages[0] }] : [] });
          drawerOpen.value = true;
        };
        const openEdit = record => {
          drawerMode.value = 'edit';
          Object.assign(formState, { ...record, uploadFiles: record.cover ? [{ uid: String(record.id), name: record.title + '.png', status: 'done', url: record.cover }] : [] });
          drawerOpen.value = true;
        };
        const openDetail = record => {
          detailRecord.value = { ...record };
          drawerMode.value = 'detail';
          Object.assign(formState, { ...record, uploadFiles: record.cover ? [{ uid: String(record.id), name: record.title + '.png', status: 'done', url: record.cover }] : [] });
          drawerOpen.value = true;
        };
        const saveForm = () => {
          if (!formState.title.trim()) {
            showMessage('warning', '请输入标题');
            return;
          }
          if (drawerMode.value === 'edit') {
            rows.value = rows.value.map(row => row.id === formState.id ? { ...row, ...formState } : row);
          } else {
            rows.value.unshift({ ...formState, id: Date.now(), createdAt: dayjs().format('YYYY-MM-DD HH:mm'), audit: '待审核' });
          }
          drawerOpen.value = false;
          showMessage('success', '保存成功，列表已刷新');
        };
        const auditRow = record => {
          record.audit = '已发布';
          record.status = true;
          showMessage('success', '审核通过');
        };
        const toggleStatus = (record, value) => {
          record.status = value;
          record.audit = value ? '已发布' : '已下架';
          showMessage('success', value ? '已启用' : '已停用');
        };
        const useExampleCover = () => {
          formState.cover = formState.cover === demoImages[0] ? demoImages[1] : demoImages[0];
          formState.uploadFiles = formState.cover ? [{ uid: 'example', name: '示例封面.png', status: 'done', url: formState.cover }] : [];
          showMessage('success', '封面图已更新');
        };
        const beforeCoverUpload = file => {
          if (!file.type || !file.type.startsWith('image/')) {
            showMessage('warning', '请选择图片文件');
            return false;
          }
          const reader = new FileReader();
          reader.onload = event => {
            const dataUrl = event.target.result;
            formState.cover = dataUrl;
            formState.uploadFiles = [{ uid: file.uid || String(Date.now()), name: file.name, status: 'done', url: dataUrl }];
            showMessage('success', '图片已选择');
          };
          reader.readAsDataURL(file);
          return false;
        };
        const removeCover = () => {
          formState.cover = '';
          formState.uploadFiles = [];
          showMessage('success', '封面图已移除');
          return true;
        };
        const previewCover = file => {
          previewImage.value = file.url || formState.cover;
          previewTitle.value = file.name || '图片预览';
          previewOpen.value = true;
        };
        const previewCurrentCover = () => {
          if (!formState.cover) {
            showMessage('warning', '暂无图片可预览');
            return;
          }
          previewImage.value = formState.cover;
          previewTitle.value = formState.title || '图片预览';
          previewOpen.value = true;
        };
        const saveImport = () => {
          importOpen.value = false;
          showMessage('success', '导入完成，列表已刷新');
        };
        const saveMenu = () => {
          menuDrawerOpen.value = false;
          showMessage('success', '菜单已保存');
        };
        const setResource = name => {
          activeResource.value = name;
          showMessage('success', '已选择' + name);
        };
        const changePage = page => {
          pagination.current = page.current;
          pagination.pageSize = page.pageSize;
        };
        const topAction = text => showMessage('success', text + '已完成');
        const ensureCommentOutline = selected => {
          const current = selected ? selectedOutlineEl : hoverOutlineEl;
          if (current) return current;
          const outline = document.createElement('div');
          outline.className = 'node-comment-outline' + (selected ? ' selected' : '');
          document.body.appendChild(outline);
          if (selected) selectedOutlineEl = outline;
          else hoverOutlineEl = outline;
          return outline;
        };
        const positionCommentOutline = (outline, target) => {
          if (!outline || !target) return;
          const rect = getVisibleCommentRect(target);
          if (!rect) {
            outline.style.display = 'none';
            return;
          }
          outline.style.display = 'block';
          outline.style.left = (rect.left - 2) + 'px';
          outline.style.top = (rect.top - 2) + 'px';
          outline.style.width = Math.max(4, rect.width + 4) + 'px';
          outline.style.height = Math.max(4, rect.height + 4) + 'px';
        };
        const getVisibleCommentRect = target => {
          if (!target || !target.isConnected) return null;
          const source = target.getBoundingClientRect();
          let left = Math.max(0, source.left);
          let top = Math.max(0, source.top);
          let right = Math.min(window.innerWidth, source.right);
          let bottom = Math.min(window.innerHeight, source.bottom);
          let parent = target.parentElement;
          while (parent && parent !== document.body) {
            const style = window.getComputedStyle(parent);
            const overflow = style.overflow + style.overflowX + style.overflowY;
            if (/(auto|scroll|hidden|clip)/.test(overflow)) {
              const parentRect = parent.getBoundingClientRect();
              left = Math.max(left, parentRect.left);
              top = Math.max(top, parentRect.top);
              right = Math.min(right, parentRect.right);
              bottom = Math.min(bottom, parentRect.bottom);
            }
            parent = parent.parentElement;
          }
          const width = right - left;
          const height = bottom - top;
          if (width <= 1 || height <= 1) return null;
          return { left, top, right, bottom, width, height, source };
        };
        const positionNodeCommentPopover = point => {
          const width = 360;
          const height = 48;
          const sourceLeft = point && Number.isFinite(point.left) ? point.left : 12;
          const sourceTop = point && Number.isFinite(point.top) ? point.top : 12;
          const left = Math.min(sourceLeft + 12, window.innerWidth - width - 12);
          const top = Math.min(sourceTop + 12, window.innerHeight - height - 12);
          nodeCommentStyle.left = Math.max(12, left) + 'px';
          nodeCommentStyle.top = Math.max(12, top) + 'px';
        };
        const positionNodeCommentPin = (pin, target) => {
          if (!pin || !target) return;
          if (!target.isConnected) {
            pin.style.display = 'none';
            return;
          }
          const rect = getVisibleCommentRect(target);
          if (!rect) {
            pin.style.display = 'none';
            return;
          }
          const pinSize = 30;
          const inset = 4;
          const minLeft = rect.left + inset;
          const maxLeft = rect.right - pinSize - inset;
          const minTop = rect.top + inset;
          const maxTop = rect.bottom - pinSize - inset;
          pin.style.display = 'inline-flex';
          pin.style.left = (maxLeft >= minLeft ? maxLeft : rect.left + Math.max(0, (rect.width - pinSize) / 2)) + 'px';
          pin.style.top = (maxTop >= minTop ? minTop : rect.top + Math.max(0, (rect.height - pinSize) / 2)) + 'px';
        };
        const updateCommentOverlays = () => {
          if (hoverNodeEl && !nodeCommentOpen.value) {
            positionCommentOutline(ensureCommentOutline(false), hoverNodeEl);
          }
          if (selectedNodeEl) {
            positionCommentOutline(ensureCommentOutline(true), selectedNodeEl);
            if (nodeCommentOpen.value) positionNodeCommentPopover(nodeCommentAnchor);
          }
          document.querySelectorAll('.node-comment-pin').forEach(pin => {
            positionNodeCommentPin(pin, pin.__commentTarget);
          });
        };
        const scheduleCommentOverlayUpdate = () => {
          if (overlayFrame) return;
          overlayFrame = requestAnimationFrame(() => {
            overlayFrame = 0;
            updateCommentOverlays();
          });
        };
        const clearHoverNode = () => {
          if (hoverOutlineEl) hoverOutlineEl.remove();
          hoverOutlineEl = null;
          hoverNodeEl = null;
        };
        const clearSelectedOutline = () => {
          if (selectedOutlineEl) selectedOutlineEl.remove();
          selectedOutlineEl = null;
        };
        const clearNodeSelection = () => {
          selectedNodeEl = null;
          clearSelectedOutline();
          if (draftNodePinEl) draftNodePinEl.remove();
          draftNodePinEl = null;
          nodeCommentOpen.value = false;
          nodeCommentText.value = '';
          nodeCommentTarget.value = '';
          nodeCommentEditingId.value = '';
        };
        const toggleAnnotationMode = () => {
          annotationEnabled.value = !annotationEnabled.value;
          if (!annotationEnabled.value) {
            clearHoverNode();
            clearNodeSelection();
          }
        };
        const handleAnnotationKeydown = event => {
          if (event.key === 'Escape' && nodeCommentOpen.value) clearNodeSelection();
        };
        const findCommentableNode = event => {
          const ignore = event.target.closest('.annotation-pin,.node-comment-pin,.node-comment-popover,.ant-modal,.ant-message,.ant-dropdown,.ant-picker-dropdown');
          if (ignore) return null;
          return event.target.closest('label,.ant-form-item-label,.ant-input,.ant-select-selector,.ant-picker,th,td,button,a,.ant-tag,.ant-switch,.cover,.file-thumb,.resource-node,h1,.page-title') || event.target;
        };
        const getNodeTitle = node => {
          const raw = (node.innerText || node.getAttribute('placeholder') || node.getAttribute('title') || node.getAttribute('aria-label') || node.tagName || '').trim();
          return raw.replace(/\s+/g, ' ').slice(0, 28) || node.tagName.toLowerCase();
        };
        const findNodeCommentNote = noteId => {
          if (!noteId) return null;
          for (const group of Object.values(annotationGroups)) {
            const note = group.find(item => item.id === noteId);
            if (note) return note;
          }
          return null;
        };
        const cssEscape = value => (window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/["\\#.:,[\]>+~*]/g, '\\$&'));
        const getNodeSelector = node => {
          if (!node || !node.isConnected) return '';
          const parts = [];
          let current = node;
          while (current && current.nodeType === 1 && current.id !== 'app') {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
              selector += '#' + cssEscape(current.id);
              parts.unshift(selector);
              break;
            }
            const siblings = Array.from(current.parentElement ? current.parentElement.children : []).filter(item => item.tagName === current.tagName);
            if (siblings.length > 1) selector += ':nth-of-type(' + (siblings.indexOf(current) + 1) + ')';
            parts.unshift(selector);
            current = current.parentElement;
          }
          return '#app ' + parts.join(' > ');
        };
        const clearNodeCommentPins = () => {
          document.querySelectorAll('.node-comment-pin').forEach(pin => pin.remove());
        };
        const restoreNodeCommentPinsForCurrentPage = () => {
          clearNodeCommentPins();
          savedNodeComments
            .filter(item => item.pageKey === currentAnnotationKey.value)
            .forEach(item => {
              const target = document.querySelector(item.selector);
              const note = findNodeCommentNote(item.noteId);
              if (!target || !note) return;
              target.__commentNoteId = item.noteId;
              const pin = createNodeCommentPin(target, note.index, item.noteId);
              if (pin) pin.__commentNoteId = item.noteId;
            });
        };
        const cloneAnnotationGroups = () => JSON.parse(JSON.stringify(annotationGroups));
        const buildAnnotationState = () => ({
          version: 1,
          savedAt: new Date().toISOString(),
          annotationGroups: cloneAnnotationGroups(),
          nodeComments: JSON.parse(JSON.stringify(savedNodeComments)),
          pageRequirements: JSON.parse(JSON.stringify(pageRequirements))
        });
        const persistAnnotationState = () => {
          try {
            window.localStorage.setItem(annotationStorageKey, JSON.stringify(buildAnnotationState()));
            return true;
          } catch (error) {
            showMessage('warning', '浏览器未允许本地保存，请使用“另存为”保存标注');
            return false;
          }
        };
        const openRequirementDrawer = () => {
          requirementDraft.value = pageRequirements[currentAnnotationKey.value] || '';
          requirementSnapshot.value = requirementDraft.value;
          requirementEditing.value = false;
          requirementDrawerOpen.value = true;
        };
        const cancelRequirementEdit = () => {
          requirementDraft.value = requirementSnapshot.value;
          requirementEditing.value = false;
        };
        const savePageRequirement = () => {
          const value = requirementDraft.value.trim();
          if (!value) {
            showMessage('warning', '请输入当前页面的整体需求描述');
            return;
          }
          pageRequirements[currentAnnotationKey.value] = value;
          persistAnnotationState();
          requirementDraft.value = value;
          requirementSnapshot.value = value;
          requirementEditing.value = false;
          showMessage('success', '页面需求说明已保存');
        };
        const saveAsAnnotatedHtml = () => {
          clearNodeSelection();
          const state = buildAnnotationState();
          const doc = new DOMParser().parseFromString('<!DOCTYPE html>\n' + document.documentElement.outerHTML, 'text/html');
          doc.querySelectorAll('.node-comment-pin,.node-comment-outline,.node-comment-mask,.node-comment-popover').forEach(node => node.remove());
          const appNode = doc.getElementById('app');
          if (appNode) appNode.innerHTML = '';
          let stateNode = doc.getElementById('snowy-annotation-state');
          if (!stateNode) {
            stateNode = doc.createElement('script');
            stateNode.id = 'snowy-annotation-state';
            stateNode.type = 'application/json';
            doc.body.insertBefore(stateNode, doc.body.firstChild);
          }
          stateNode.textContent = JSON.stringify(state).replace(/</g, '\\u003c');
          const html = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'snowy-admin-prototype-annotated-' + dayjs().format('YYYYMMDD-HHmmss') + '.html';
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          showMessage('success', '已生成包含标注的 HTML 文件');
        };
        const hoverNodeForComment = event => {
          if (!annotationEnabled.value) return;
          if (nodeCommentOpen.value) {
            clearHoverNode();
            return;
          }
          const target = findCommentableNode(event);
          if (!target || !target.classList || target === selectedNodeEl) {
            clearHoverNode();
            return;
          }
          hoverNodeEl = target;
          positionCommentOutline(ensureCommentOutline(false), target);
        };
        const selectNodeForComment = event => {
          if (!annotationEnabled.value) return;
          if (nodeCommentOpen.value) return;
          const target = findCommentableNode(event);
          if (!target || !target.classList) return;
          event.preventDefault();
          event.stopPropagation();
          clearHoverNode();
          selectedNodeEl = target;
          positionCommentOutline(ensureCommentOutline(true), selectedNodeEl);
          nodeCommentAnchor.left = event.clientX;
          nodeCommentAnchor.top = event.clientY;
          positionNodeCommentPopover(nodeCommentAnchor);
          nodeCommentTarget.value = getNodeTitle(selectedNodeEl);
          const existingNote = findNodeCommentNote(selectedNodeEl.__commentNoteId);
          nodeCommentEditingId.value = existingNote ? existingNote.id : '';
          nodeCommentText.value = existingNote ? existingNote.summary : '';
          nodeCommentOpen.value = true;
          if (draftNodePinEl) draftNodePinEl.remove();
          draftNodePinEl = null;
          nextTick(() => {
            if (nodeCommentInputRef.value && nodeCommentInputRef.value.focus) nodeCommentInputRef.value.focus();
          });
        };
        const createNodeCommentPin = (target, index, noteId, draft = false) => {
          if (!target) return null;
          const pin = document.createElement('button');
          pin.type = 'button';
          pin.className = 'node-comment-pin' + (draft ? ' draft' : '');
          pin.textContent = String(index);
          pin.__commentTarget = target;
          positionNodeCommentPin(pin, target);
          if (!draft) {
            pin.addEventListener('click', event => {
              event.stopPropagation();
              showAnnotation(noteId);
            });
          }
          document.body.appendChild(pin);
          positionNodeCommentPin(pin, target);
          return pin;
        };
        const saveNodeComment = () => {
          const text = nodeCommentText.value.trim();
          if (!text) {
            showMessage('warning', '请输入注释内容');
            return;
          }
          const editingNote = findNodeCommentNote(nodeCommentEditingId.value);
          if (editingNote) {
            editingNote.summary = text;
            editingNote.detail = editingNote.detail || '';
            persistAnnotationState();
            clearNodeSelection();
            showMessage('success', '注释已更新');
            return;
          }
          const key = currentAnnotationKey.value;
          const group = annotationGroups[key] || annotationGroups.banner;
          const maxIndex = group.reduce((max, item) => Math.max(max, Number(item.index) || 0), 0);
          const noteId = key + '-node-comment-' + Date.now();
          const nextIndex = maxIndex + 1;
          group.push({
            id: noteId,
            index: nextIndex,
            title: '注释',
            summary: text,
            detail: ''
          });
          group.sort((a, b) => Number(a.index) - Number(b.index));
          const targetEl = selectedNodeEl;
          if (draftNodePinEl) {
            draftNodePinEl.remove();
            draftNodePinEl = null;
          }
          if (targetEl) targetEl.__commentNoteId = noteId;
          const selector = getNodeSelector(targetEl);
          if (selector) {
            const existing = savedNodeComments.find(item => item.selector === selector && item.pageKey === key);
            const payload = { noteId, pageKey: key, selector, targetTitle: nodeCommentTarget.value };
            if (existing) Object.assign(existing, payload);
            else savedNodeComments.push(payload);
          }
          const pin = createNodeCommentPin(targetEl, nextIndex, noteId);
          if (pin) pin.__commentNoteId = noteId;
          persistAnnotationState();
          clearNodeSelection();
          showMessage('success', '注释已添加');
        };
        const openAnnotationAdd = () => {
          const maxIndex = currentAnnotations.value.reduce((max, item) => Math.max(max, Number(item.index) || 0), 0);
          Object.assign(annotationForm, { id: '', index: maxIndex + 1, title: '', summary: '', detail: '' });
          annotationFormSnapshot.value = snapshotAnnotationForm();
          annotationEditorMode.value = 'add';
          annotationEditingField.value = '';
          annotationEditorOpen.value = true;
        };
        const openAnnotationEdit = note => {
          Object.assign(annotationForm, {
            id: note.id,
            index: note.index,
            title: normalizeAnnotationTitle(note.title),
            summary: note.summary,
            detail: note.detail
          });
          annotationFormSnapshot.value = snapshotAnnotationForm();
          annotationEditorMode.value = 'edit';
          annotationEditingField.value = '';
          annotationEditorOpen.value = true;
        };
        const saveAnnotation = () => {
          if (!String(annotationForm.title).trim()) {
            showMessage('warning', '请输入标注标题');
            return;
          }
          if (!String(annotationForm.summary).trim()) {
            showMessage('warning', '请输入标注摘要');
            return;
          }
          const key = currentAnnotationKey.value;
          const group = annotationGroups[key] || annotationGroups.banner;
          const payload = {
            id: annotationForm.id || key + '-custom-' + Date.now(),
            index: Number(annotationForm.index) || group.length + 1,
            title: annotationForm.title.trim(),
            summary: annotationForm.summary.trim(),
            detail: String(annotationForm.detail || '').trim()
          };
          if (annotationEditorMode.value === 'edit') {
            const target = group.find(item => item.id === annotationForm.id);
            if (target) Object.assign(target, payload);
          } else {
            group.push(payload);
          }
          group.sort((a, b) => Number(a.index) - Number(b.index));
          persistAnnotationState();
          annotationFormSnapshot.value = snapshotAnnotationForm();
          annotationEditorOpen.value = false;
          showMessage('success', annotationEditorMode.value === 'edit' ? '标注已更新' : '标注已新增');
        };
        const removeNodeCommentState = noteId => {
          for (let index = savedNodeComments.length - 1; index >= 0; index -= 1) {
            const item = savedNodeComments[index];
            if (item.noteId !== noteId) continue;
            const target = document.querySelector(item.selector);
            if (target && target.__commentNoteId === noteId) delete target.__commentNoteId;
            savedNodeComments.splice(index, 1);
          }
          document.querySelectorAll('.node-comment-pin').forEach(pin => {
            if (pin.__commentNoteId === noteId) pin.remove();
          });
        };
        const deleteAnnotation = () => {
          const key = currentAnnotationKey.value;
          const group = annotationGroups[key] || annotationGroups.banner;
          const targetIndex = group.findIndex(item => item.id === annotationForm.id);
          if (targetIndex < 0) return;
          const target = group[targetIndex];
          const base = findBaseAnnotation(key, target.id);
          const restoresBase = !!base && annotationComparable(base) !== annotationComparable(target);
          antd.Modal.confirm({
            title: restoresBase ? '恢复原始标注' : '删除标注',
            content: restoresBase ? '将删除用户修改的内容，并恢复自动生成的原始标注。' : '确定删除这条标注吗？',
            zIndex: 2400,
            okText: restoresBase ? '恢复' : '删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: () => {
              if (restoresBase) {
                Object.assign(target, JSON.parse(JSON.stringify(base)));
              } else {
                group.splice(targetIndex, 1);
                removeNodeCommentState(target.id);
              }
              persistAnnotationState();
              annotationEditorOpen.value = false;
              nextTick(restoreNodeCommentPinsForCurrentPage);
              showMessage('success', restoresBase ? '已恢复原始标注' : '标注已删除');
            }
          });
        };
        const deleteAllAnnotations = () => {
          const key = currentAnnotationKey.value;
          antd.Modal.confirm({
            title: '全部删除',
            content: '将删除当前页面全部用户标注和修改，并恢复自动生成标注的原始内容。',
            zIndex: 2400,
            okText: '全部删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: () => {
              const noteIds = savedNodeComments
                .filter(item => item.pageKey === key)
                .map(item => item.noteId);
              noteIds.forEach(removeNodeCommentState);
              annotationGroups[key] = JSON.parse(JSON.stringify(baseAnnotationGroups[key] || []));
              persistAnnotationState();
              annotationEditorOpen.value = false;
              nextTick(restoreNodeCommentPinsForCurrentPage);
              showMessage('success', '当前页面标注已恢复为初始状态');
            }
          });
        };
        const showAnnotation = id => {
          const note = currentAnnotations.value.find(item => item.id === id);
          if (!note) return;
          openAnnotationEdit(note);
        };
        const confirmAction = text => {
          antd.Modal.confirm({
            title: '操作确认',
            content: '确定执行“' + text + '”吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => showMessage('success', text + '已完成')
          });
        };
        onMounted(() => {
          window.addEventListener('scroll', scheduleCommentOverlayUpdate, true);
          window.addEventListener('resize', scheduleCommentOverlayUpdate);
          window.addEventListener('keydown', handleAnnotationKeydown);
          nextTick(restoreNodeCommentPinsForCurrentPage);
        });
        onBeforeUnmount(() => {
          window.removeEventListener('scroll', scheduleCommentOverlayUpdate, true);
          window.removeEventListener('resize', scheduleCommentOverlayUpdate);
          window.removeEventListener('keydown', handleAnnotationKeydown);
          if (overlayFrame) cancelAnimationFrame(overlayFrame);
        });

        const context = {
          prototypeMeta,
          collapsed, currentPage, activeTab, selectedKeys, openKeys, tableSize, selectedRowKeys,
          rows, query, advanced, drawerOpen, drawerMode, formState, detailRecord, importOpen,
          columnOpen, previewOpen, previewImage, previewTitle, menuDrawerOpen, menuForm, activeResource, checkedColumns, pagination,
          annotationEnabled, annotationToolbarCollapsed, annotationEditorOpen, annotationEditorMode, annotationForm, currentAnnotations,
          annotationEditingField, annotationDirty, annotationDeleteLabel,
          requirementDrawerOpen, requirementDraft, requirementDrawerTitle, requirementEditing, requirementDirty,
          nodeCommentOpen, nodeCommentText, nodeCommentTarget, nodeCommentEditingId, nodeCommentInputRef, nodeCommentStyle, nodeCommentMultiline,
          menuItems, columns, componentColumns, componentRows, filteredRows, pageTitle, rowSelection,
          businessPages, activeBusinessPage, businessQuery, businessRows, businessColumns, businessPagination, businessImage,
          allowedBusinessActions, primaryBusinessActions, rowBusinessActions, permissionGuideRows,
          currentRole, availableRoleOptions, businessDrawerOpen, businessDrawerMode, businessDrawerTitle, businessForm, businessDetailRecord,
          businessUploadFiles, businessPreviewOpen, businessPreviewImage, governanceTreeData, governanceTreeSelection,
          roleGrantOpen, roleGrantCheckedKeys, roleGrantOrgKeys, roleGrantScope, roleGrantBefore, roleGrantAfter, roleGrantTreeData,
          businessField, businessSelectOptions, businessMetricValue, businessStatusColor,
          resetBusinessQuery, searchBusinessRows, refreshBusinessRows, changeBusinessPage, openBusinessColumnSettings, openBusinessDetail, runBusinessAction,
          saveBusinessForm, beforeBusinessUpload, removeBusinessUpload, previewBusinessUpload, previewBusinessImage,
          navigateBusinessGroup, selectGovernanceTree, openRoleGrant, saveRoleGrant,
          setPage, onOpenChange, search, reset, refresh, exportData, batchDelete, removeRow,
          openAdd, openEdit, openDetail, saveForm, auditRow, toggleStatus, useExampleCover,
          beforeCoverUpload, removeCover, previewCover, previewCurrentCover,
          saveImport, saveMenu, setResource, changePage, topAction, hoverNodeForComment, clearHoverNode, selectNodeForComment, clearNodeSelection, saveNodeComment,
          toggleAnnotationMode, saveAsAnnotatedHtml,
          openRequirementDrawer, cancelRequirementEdit, savePageRequirement,
          openAnnotationAdd, openAnnotationEdit, saveAnnotation, deleteAnnotation, deleteAllAnnotations, showAnnotation, hasAnnotation, normalizeAnnotationTitle, confirmAction,
        };
        return context;
  };
})(window);
