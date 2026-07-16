import html
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BLUEPRINT = ROOT / "docs/design/FY-20260714-UNICARD-admin-page-blueprint.md"
TEMPLATE = ROOT / ".codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/index.html"
TARGET = ROOT / "docs/design/FY-20260714-UNICARD-admin-low-fidelity.html"


def cells(line: str):
    return [item.strip() for item in line.strip().strip("|").split("|")]


def table_after(section: str, heading: str):
    pos = section.find(heading)
    if pos < 0:
        return []
    rows = []
    for line in section[pos:].splitlines()[1:]:
        if re.match(r"^#{2,4}\s", line):
            break
        if not line.startswith("|"):
            continue
        row = cells(line)
        if not row or all(re.fullmatch(r"[-: ]+", value or "-") for value in row):
            continue
        rows.append(row)
    return rows[1:] if rows else []


def unique(values):
    result = []
    for value in values:
        value = re.sub(r"\s+", " ", value).strip()
        if value and value != "不适用" and value not in result:
            result.append(value)
    return result


def options_for(field: str, status_items):
    semantic = {
        "可见身份": ["学生", "教职工", "访客"],
        "展示模式": ["图文", "列表", "大图"],
        "身份标签": ["学生", "教职工", "访客"],
        "民族": ["汉族", "壮族", "回族", "满族", "其他"],
        "性别": ["男", "女", "未说明"],
        "认证场景": ["食堂支付", "门禁通行", "图书借阅"],
        "审核状态": ["草稿", "待审核", "审核通过", "审核驳回"],
        "认证结果": ["通过", "未通过"],
        "执行状态": ["成功", "格式拦截", "重复拦截", "接口失败"],
        "在线状态": ["在线", "离线", "故障"],
        "设备状态": ["在线", "离线", "故障"],
        "登记状态": ["未登记", "登记中", "已登记", "更新失败"],
        "任务状态": ["待处理", "处理中", "成功", "部分成功", "失败"],
        "通行方向": ["进入", "离开"],
        "验证方式": ["掌静脉", "实体社保卡", "电子社保码"],
        "付款方式": ["电子社保码", "实体社保卡", "校园账户"],
        "支付类型": ["消费", "退款"],
        "认证模式": ["掌静脉优先", "卡片优先", "社保码优先"],
        "卡规范版本": ["3.0", "2.0"],
        "用户身份": ["学生", "教职工", "访客"],
        "人员类型": ["学生", "教职工"],
        "功能类型": ["门禁", "消费", "认证"],
        "请求方式": ["POST", "GET"],
        "登录登出类型": ["登录", "登出"],
        "专区注册状态": ["已注册", "未注册"],
        "社保绑卡状态": ["已绑定", "未绑定"],
        "省内持卡状态": ["持卡", "未持卡"],
        "社保卡金融账户激活状态": ["已激活", "未激活"],
        "当前状态": ["在职", "离职"],
        "展示状态": ["展示", "隐藏"],
        "显示状态": ["显示", "隐藏"],
        "推荐状态": ["已推荐", "未推荐"],
        "可用状态": ["启用", "停用"],
        "账号状态": ["启用", "禁用"],
        "角色状态": ["启用", "禁用"],
        "发布范围": ["全校", "指定学院", "指定身份"],
        "可见范围": ["全校", "指定学院", "指定身份"],
        "审核业务类型": ["公告", "文章", "活动"],
        "日志分类": ["接口调用", "数据同步", "认证交易"],
        "交互状态": ["成功", "失败", "超时"],
    }
    if field in semantic:
        return semantic[field]
    if "状态" in field or "结果" in field:
        candidates = []
        for item in status_items:
            candidates.extend(re.split(r"[、，,/；]", item))
        candidates = unique(value for value in candidates if len(value) <= 12)
        return candidates[:8] or ["正常", "异常"]
    if "类型" in field:
        return ["类型一", "类型二"]
    if "方式" in field:
        return ["方式一", "方式二"]
    if "方向" in field:
        return ["进入", "离开"]
    if "版本" in field:
        return ["v3", "v2"]
    return []


def is_read_action(action: str):
    return any(keyword in action for keyword in ["查看", "详情", "查询", "进入"])


def action_policy(page_id: str, roles, actions, action_permissions):
    policy = {}
    for role in roles:
        allowed = []
        for action in actions:
            permission = action_permissions.get(action, "")
            mentioned_roles = [candidate for candidate in roles if candidate in permission]
            if mentioned_roles:
                permitted = role in mentioned_roles
            elif permission and not any(token in permission for token in ["不适用", "无权限"]):
                permitted = True
            else:
                permitted = False
            if permitted and role in mentioned_roles and re.search(re.escape(role) + r"[^；，。]*只读", permission) and not is_read_action(action):
                permitted = False
            if permitted:
                allowed.append(action)
        policy[role] = unique(allowed)
    return policy


def parse_pages(text: str):
    matches = list(re.finditer(r"(?m)^### ((?:ADM-[SP]|API|PAM)-\d{3}) (.+)$", text))
    pages = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else text.find("\n## 原型需求覆盖矩阵", match.end())
        if end < 0:
            end = len(text)
        section = text[match.start():end]
        meta = {}
        for row in table_after(section, "| 项 | 内容 |"):
            if len(row) >= 2:
                meta[row[0]] = row[1]
        atom_rows = table_after(section, "#### 原子需求清单")
        atoms = []
        for row in atom_rows:
            if len(row) >= 6:
                atoms.append({"type": row[0], "item": row[1], "source": row[2], "location": row[3], "shape": row[4], "covered": row[5]})
        structure_rows = table_after(section, "#### 页面结构")
        structures = {row[0]: row for row in structure_rows if len(row) >= 2}
        interaction_rows = table_after(section, "#### 操作和点击交互")
        action_permissions = {row[0]: row[5] for row in interaction_rows if len(row) >= 7}
        excerpt_match = re.search(r"#### 原始需求摘录\s+\n+>\s*(.+)", section)
        conclusion = meta.get("页面结论", "按蓝图字段与权限提供页面能力。")

        def atom_items(kind):
            return unique(a["item"] for a in atoms if a["type"] == kind and a["item"] != "不适用")

        display = unique(atom_items("同步字段") + atom_items("展示字段"))
        query = atom_items("筛选字段")
        details = atom_items("详情字段") or display
        status = atom_items("状态字段")
        sensitive = atom_items("敏感字段")
        actions = atom_items("操作")
        exceptions = atom_items("异常")
        permissions = atom_items("权限")

        def fields_from_structure(name):
            row = structures.get(name)
            if not row or len(row) < 2 or row[1].startswith("不适用"):
                return []
            return unique(re.split(r"[、，]", row[1]))

        create_fields = fields_from_structure("新增抽屉")
        edit_fields = fields_from_structure("编辑抽屉")
        if "新增" in actions and not create_fields:
            create_fields = display[:8]
        if "编辑" in actions and not edit_fields:
            edit_fields = create_fields or display[:8]

        page = {
            "id": match.group(1),
            "title": meta.get("页面名称", match.group(2)),
            "group": "学校端" if match.group(1).startswith("ADM-S") else "平台端" if match.group(1).startswith("ADM-P") else "接口中心" if match.group(1).startswith("API") else "PAM 管理",
            "menuPath": meta.get("菜单路径", ""),
            "route": meta.get("路由路径", ""),
            "permission": meta.get("权限标识", ""),
            "roles": meta.get("可见角色", ""),
            "pageType": meta.get("页面类型", ""),
            "reference": meta.get("参考 Snowy 页面", ""),
            "conclusion": conclusion,
            "excerpt": excerpt_match.group(1).strip() if excerpt_match else conclusion,
            "query": query,
            "display": display,
            "details": details,
            "create": create_fields,
            "edit": edit_fields,
            "status": status,
            "sensitive": sensitive,
            "actions": actions,
            "exceptions": exceptions,
            "permissions": permissions,
            "atoms": atoms,
            "actionPermissions": action_permissions,
        }
        page["options"] = {field: options_for(field, status) for field in query if options_for(field, status)}
        if page["id"] == "PAM-002":
            page["pageType"] = "敏感配置管理"
        page_roles = [value.strip() for value in page["roles"].split("、") if value.strip()]
        page["actionPolicy"] = action_policy(page["id"], page_roles, actions, action_permissions)
        page["enumQueryFields"] = unique(
            atom["item"] for atom in atoms
            if atom["type"] == "筛选字段" and re.search(r"枚举|状态标签|字典标签", atom["shape"])
        )
        pages.append(page)
    return pages


def js(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


text = BLUEPRINT.read_text(encoding="utf-8")
pages = parse_pages(text)
if len(pages) != 49:
    raise SystemExit(f"expected 49 pages, got {len(pages)}")

ids = [page["id"] for page in pages]
if len(ids) != len(set(ids)):
    raise SystemExit("duplicate page ids")

api5 = next(page for page in pages if page["id"] == "API-005")
pam2 = next(page for page in pages if page["id"] == "PAM-002")
if not any("不落日志" in atom["shape"] or "不采集" in atom["shape"] for atom in api5["atoms"]):
    raise SystemExit("API-005 no-log rule missing")
if not any("永不展示" in atom["shape"] for atom in pam2["atoms"]):
    raise SystemExit("PAM-002 no-display rule missing")

source = TEMPLATE.read_text(encoding="utf-8")
head = source[:source.index("<body>")]
head = re.sub(r"<title>.*?</title>", "<title>宁波市高校一卡通专区后管低保真原型</title>", head, flags=re.S)
extra_css = r'''
  <style>
    .prototype-workspace{min-width:0}.prototype-page{padding:16px}.page-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
    .query-card,.content-card{background:#fff;border-radius:8px;border:1px solid #eef0f3;padding:16px;margin-bottom:12px}
    .query-grid{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:12px}.query-actions{display:flex;gap:8px;align-items:end}
    .toolbar{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px}.toolbar-left,.toolbar-right{display:flex;gap:8px;flex-wrap:wrap}
    .field-mask{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.amount-cell{text-align:right;font-variant-numeric:tabular-nums}
    .thumb{width:68px;height:42px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb}.permission-tree{padding:10px;background:#f8fafc;border-radius:6px;line-height:2}
    .state-strip{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0}.state-strip .label{color:#64748b}
    .page-summary{color:#475569;line-height:1.75;margin-bottom:12px}.route-code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:#475569}
    .drawer-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.detail-item{border-bottom:1px solid #f0f0f0;padding:8px 0}.detail-label{display:block;color:#64748b;font-size:12px;margin-bottom:4px}
    .upload-preview{display:flex;align-items:center;gap:12px;margin-top:8px}.upload-preview img{width:120px;height:72px;object-fit:cover;border-radius:6px}
    .matrix-wrap{overflow:auto;max-height:68vh}.coverage-table{width:100%;border-collapse:collapse;font-size:12px}.coverage-table th,.coverage-table td{border:1px solid #e5e7eb;padding:8px;text-align:left;vertical-align:top}.coverage-table th{background:#f8fafc;position:sticky;top:0;z-index:1}
    .node-comment-hover{outline:2px solid #69b1ff!important;outline-offset:2px}.node-comment-selected{outline:2px solid #1677ff!important;outline-offset:2px}
    .node-comment-popover{position:fixed;z-index:2400;width:320px;background:#fff;border:1px solid #91caff;border-radius:8px;box-shadow:0 12px 30px rgba(15,23,42,.18);padding:12px}
    .node-comment-popover textarea{width:100%;min-height:72px;max-height:168px;resize:vertical;border:1px solid #d9d9d9;border-radius:6px;padding:8px}
    .node-comment-pin,.annotation-pin{position:fixed;z-index:2300;width:24px;height:24px;border:2px solid #fff;border-radius:50%;background:#1677ff;color:#fff;font-size:12px;box-shadow:0 2px 8px rgba(15,23,42,.28);cursor:pointer}.annotation-pin{background:#722ed1}
    .annotation-list{display:grid;gap:10px}.annotation-row{border:1px solid #e5e7eb;border-radius:8px;padding:10px}.annotation-row-title{display:flex;justify-content:space-between;gap:12px}.annotation-row p{white-space:pre-wrap;margin:6px 0 0;color:#475569}
    .requirement-preview{white-space:pre-wrap;line-height:1.8;padding:12px;border:1px solid #e5e7eb;border-radius:8px;min-height:160px;position:relative}.requirement-edit{position:absolute;right:8px;top:8px;opacity:0}.requirement-preview:hover .requirement-edit{opacity:1}
    .empty-panel{text-align:center;padding:46px 12px;color:#64748b}.risk-note{border-left:3px solid #faad14;background:#fffbe6;padding:10px 12px;margin:10px 0;white-space:pre-wrap}.requirement-drawer .ant-drawer-header{padding-top:18px}.requirement-drawer .ant-drawer-close{position:relative;z-index:2}
    @media(max-width:1100px){.query-grid{grid-template-columns:repeat(2,minmax(160px,1fr))}.drawer-grid{grid-template-columns:1fr}}
  </style>
'''
head = head.replace("</head>", extra_css + "</head>")

body = r'''<body>
  <div id="app"></div>
  <script id="snowy-annotation-state" type="application/json">{}</script>
  <script src="https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/advancedFormat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/customParseFormat.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/localeData.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/quarterOfYear.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/weekday.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/weekOfYear.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.19/plugin/weekYear.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/ant-design-vue@4.2.6/dist/antd.min.js"></script>
  <script>
    const {createApp,ref,reactive,computed,nextTick,onMounted,onBeforeUnmount}=Vue;
    const prototypeMeta={templateVersion:'snowy-admin-prototype-v2',systemName:'宁波市高校一卡通后管',logoText:'甬',logoImage:''};
    // 49 个页面均由已校验蓝图生成独立字段、操作、状态、异常和权限模型；不使用通用字段集补位。
    const pageSpecs=__PAGES__;
    const demoImage='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="184" height="92"><rect width="184" height="92" rx="8" fill="#1677ff"/><circle cx="142" cy="30" r="20" fill="rgba(255,255,255,.3)"/><path d="M18 70l32-30 25 22 22-18 48 35H18z" fill="rgba(255,255,255,.82)"/></svg>');
    const app=createApp({
      setup(){
        const grouped=pageSpecs.reduce((all,page)=>{(all[page.group]||(all[page.group]=[])).push(page);return all;},{});
        const groupKeys=Object.keys(grouped);
        const storageKey='fyy-unicard-admin-prototype-v2';
        const embedded=(()=>{try{return JSON.parse(document.getElementById('snowy-annotation-state').textContent||'{}')}catch(e){return {}}})();
        const local=(()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch(e){return {}}})();
        const stateTime=state=>{const value=Date.parse(state?.savedAt||'');return Number.isFinite(value)?value:0};
        const persisted=stateTime(local)>=stateTime(embedded)&&stateTime(local)>0?local:embedded;
        const initialPage=pageSpecs.find(page=>page.id===persisted.activePage)||pageSpecs[0];
        const activeId=ref(initialPage.id), selectedKeys=ref([initialPage.id]), openKeys=ref(groupKeys.slice());
        const visitedTabs=ref([initialPage.id]);
        const active=computed(()=>pageSpecs.find(page=>page.id===activeId.value)||pageSpecs[0]);
        const rolesFor=page=>page.roles.split('、').map(value=>value.trim()).filter(Boolean);
        const allRoles=Array.from(new Set(pageSpecs.flatMap(rolesFor)));
        const currentRole=ref(allRoles.includes(persisted.currentRole)?persisted.currentRole:rolesFor(initialPage)[0]);
        const query=reactive({}), rowsByPage=reactive({}), viewState=ref('normal'), selectedRowKeys=ref([]), pageNo=ref(1), pageSize=ref(10);
        const detailOpen=ref(false), detailRow=ref(null), formOpen=ref(false), formMode=ref('add'), formState=reactive({});
        const importOpen=ref(false), importFile=ref(''), importResult=ref(null), exportOpen=ref(false), actionOpen=ref(false), actionTitle=ref(''), actionText=ref('');
        const authorizationOpen=ref(false), authorizationCurrent=ref(''), authorizationNext=ref(undefined), authorizationError=ref('');
        const submissionOpen=ref(false), submissionScope=ref('原发布范围'), submissionNote=ref('');
        const auditOpen=ref(false), auditDecision=ref('通过'), auditOpinion=ref(''), statusOpen=ref(false), statusContext=reactive({row:null,field:'',current:'',next:'',action:''});
        const matrixOpen=ref(false), columnOpen=ref(false), hiddenColumns=reactive({}), uploadPreview=ref('');
        const requirementDrawerOpen=ref(false), requirementEditing=ref(false), requirementDraft=ref(''), requirementSnapshot=ref('');
        const annotationEnabled = ref(false), annotationToolbarCollapsed=ref(false), annotationDrawerOpen=ref(false);
        const annotationText=ref(''), nodeCommentOpen=ref(false), nodeTarget=ref(null), nodeCommentStyle=reactive({left:'20px',top:'80px'});
        const baselineRequirements=Object.fromEntries(pageSpecs.map(page=>[page.id,`${page.title}：${page.excerpt}\n菜单：${page.menuPath}\n路由：${page.route}\n权限：${page.permission}\n角色：${page.roles}\n页面结论：${page.conclusion}`]));
        const pageRequirements=reactive({...baselineRequirements,...(persisted.pageRequirements||{})});
        const baselineAnnotations=Object.fromEntries(pageSpecs.map(page=>[page.id,[{id:`${page.id}-rule`,index:1,baseline:true,title:page.sensitive.length?'敏感数据与权限规则':'状态与异常规则',summary:page.sensitive.length?`敏感字段：${page.sensitive.join('、')}。按蓝图脱敏、限制访问并审计。`:`异常：${(page.exceptions.length?page.exceptions:['加载失败、空数据、无权限']).join('；')}`,detail:`允许操作：${page.actions.join('、')||'只读查看'}；可见角色：${page.roles}` }]]));
        const annotationGroups=reactive(JSON.parse(JSON.stringify(baselineAnnotations)));
        Object.entries(persisted.annotationGroups||{}).forEach(([key,value])=>{if(Array.isArray(value))annotationGroups[key]=value});
        const nodeComments=reactive(Array.isArray(persisted.nodeComments)?persisted.nodeComments:[]);
        const hiddenBaselineIds=reactive(Array.isArray(persisted.hiddenBaselineIds)?persisted.hiddenBaselineIds:[]);

        function sampleValue(field,index=0,page=active.value){
          if(/身份证/.test(field))return '3302********1234'; if(/手机号|手机/.test(field))return '138****5608'; if(/证件号/.test(field))return '33**************21';
          if(/社保卡号/.test(field))return 'A62***********908'; if(/人员标识/.test(field))return 'U***1024';
          if(page.options[field]?.length)return page.options[field][index%page.options[field].length];
          if(/金额/.test(field))return (26.8+index*3.7).toFixed(2); if(/时间|日期/.test(field))return `2026-07-${String(index%28+1).padStart(2,'0')} ${String(8+index%10).padStart(2,'0')}:20:00`;
          if(/状态|结果/.test(field))return index%3===2?'异常':'正常'; if(/图片|图标|封面/.test(field))return demoImage;
          if(/姓名|人员|用户/.test(field))return index%2?'李老师':'王同学'; if(/学校/.test(field))return '宁波纺织学院'; if(/部门|学院/.test(field))return index%2?'信息中心':'智能制造学院';
          if(/流水号|请求标识|标识|编号|单号|编码|工号|学号/.test(field))return `${page.id}-${String(index+1).padStart(4,'0')}`;
          if(/位置|区域/.test(field))return index%2?'图书馆东门':'第一食堂'; if(/设备/.test(field))return `终端-${String(index+1).padStart(2,'0')}`;
          if(/权限|范围/.test(field))return index%2?'本部门':'本校'; if(/数量|容量|连接数|排序|耗时|失败率/.test(field))return String(86+index);
          if(/链接|路径/.test(field))return '/unicard/home'; if(/标题|名称|题名/.test(field))return `${page.title}示例${index+1}`;
          return `示例数据${index+1}`;
        }
        function ensureRows(page){
          if(rowsByPage[page.id])return;
          const fields=Array.from(new Set([...(page.display.length?page.display:page.details),...page.details,...page.query]));
          rowsByPage[page.id]=Array.from({length:28},(_,index)=>{const row={_key:`${page.id}-ROW-${String(index+1).padStart(3,'0')}`};fields.forEach(field=>row[field]=sampleValue(field,index,page));return row});
        }
        ensureRows(active.value);
        const visibleFields=computed(()=>active.value.display.filter(field=>!(hiddenColumns[active.value.id]||[]).includes(field)));
        const columns=computed(()=>visibleFields.value.map(field=>({title:field,dataIndex:field,key:field,width:/内容|摘要|权限|范围/.test(field)?220:150,align:/金额|数量|容量|耗时|排序|连接数|失败率/.test(field)?'right':'left'})).concat([{title:'操作',key:'actions',fixed:'right',width:Math.max(150,Math.min(360,allowedActions.value.length*68))}]));
        const rows=computed(()=>rowsByPage[activeId.value]||[]);
        const filteredRows=computed(()=>{if(viewState.value!=='normal')return [];return rows.value.filter(row=>active.value.query.every(field=>{const value=query[field];if(!value||(Array.isArray(value)&&!value.length))return true;if(Array.isArray(value)&&value.length===2){const actual=dayjs(row[field]);return !actual.isBefore(dayjs(value[0]).startOf('day'))&&!actual.isAfter(dayjs(value[1]).endOf('day'))}return String(row[field]||'').includes(String(value).trim())}))});
        const pagedRows=computed(()=>filteredRows.value.slice((pageNo.value-1)*pageSize.value,pageNo.value*pageSize.value));
        const currentAnnotations=computed(()=>annotationGroups[activeId.value]||[]);
        const formFields=computed(()=>formMode.value==='add'?active.value.create:active.value.edit);
        const requirementDirty=computed(()=>requirementDraft.value!==requirementSnapshot.value);
        const currentRoleAllowed=computed(()=>rolesFor(active.value).includes(currentRole.value));
        function actionAllowed(page,action,role=currentRole.value){
          return Array.isArray(page.actionPolicy?.[role])&&page.actionPolicy[role].includes(action);
        }
        const allowedActions=computed(()=>active.value.actions.filter(action=>actionAllowed(active.value,action)));
        function isToolbarAction(action){return ['新增','导入','导出','报表','清单'].some(key=>action.includes(key))}
        function persist(){const state={savedAt:new Date().toISOString(),activePage:activeId.value,currentRole:currentRole.value,pageRequirements:JSON.parse(JSON.stringify(pageRequirements)),annotationGroups:JSON.parse(JSON.stringify(annotationGroups)),nodeComments:JSON.parse(JSON.stringify(nodeComments)),hiddenBaselineIds:JSON.parse(JSON.stringify(hiddenBaselineIds))};try{localStorage.setItem(storageKey,JSON.stringify(state))}catch(e){}return state}
        function switchPage(id){activeId.value=id;selectedKeys.value=[id];if(!visitedTabs.value.includes(id))visitedTabs.value.push(id);const page=pageSpecs.find(p=>p.id===id);ensureRows(page);if(!rolesFor(page).includes(currentRole.value))currentRole.value=rolesFor(page)[0];Object.keys(query).forEach(k=>delete query[k]);viewState.value='normal';pageNo.value=1;selectedRowKeys.value=[];persist();nextTick(renderPins)}
        function switchRole(role){currentRole.value=role;viewState.value=rolesFor(active.value).includes(role)?'normal':'forbidden';persist();antd.message.info(`当前以“${role}”预览权限`)}
        function closeTab(id){if(visitedTabs.value.length===1)return;const pos=visitedTabs.value.indexOf(id);visitedTabs.value=visitedTabs.value.filter(item=>item!==id);if(activeId.value===id)switchPage(visitedTabs.value[Math.max(0,pos-1)])}
        function search(){viewState.value='normal';pageNo.value=1;antd.message.success(`已按 ${active.value.title} 专属字段查询`)}
        function reset(){active.value.query.forEach(field=>query[field]='');viewState.value='normal';pageNo.value=1;antd.message.success('查询条件已重置')}
        function refresh(){viewState.value='normal';antd.message.success('数据已刷新')}
        function openDetail(row){detailRow.value=row;detailOpen.value=true}
        function openForm(mode,row){formMode.value=mode;Object.keys(formState).forEach(k=>delete formState[k]);(mode==='add'?active.value.create:active.value.edit).forEach(field=>formState[field]=row?row[field]||'':sampleValue(field));uploadPreview.value='';formOpen.value=true}
        function saveForm(){if(!formFields.value.length)return;const payload={_key:`${active.value.id}-${Date.now()}`};active.value.display.forEach(field=>payload[field]=formState[field]||sampleValue(field));if(formMode.value==='add')rowsByPage[activeId.value].unshift(payload);else Object.assign(detailRow.value||rowsByPage[activeId.value][0],payload);formOpen.value=false;antd.message.success(formMode.value==='add'?'新增成功':'编辑成功')}
        function removeRow(row){antd.Modal.confirm({title:'删除确认',content:`将删除 ${active.value.title} 当前记录并记录审计日志，是否继续？`,okButtonProps:{danger:true},onOk:()=>{rowsByPage[activeId.value]=rows.value.filter(item=>item._key!==row._key);antd.message.success('删除成功')}})}
        function openAction(action,row){
          if(/查看|详情/.test(action)){openDetail(row);return} if(action==='新增'){openForm('add');return} if(action==='编辑'){detailRow.value=row;openForm('edit',row);return} if(action==='删除'){removeRow(row);return}
          if(/导入/.test(action)){importFile.value='';importResult.value=null;actionTitle.value=action;importOpen.value=true;return} if(/导出|报表/.test(action)){actionTitle.value=action;exportOpen.value=true;return}
          if(/授权|分配角色|配置分级权限/.test(action)){detailRow.value=row||rows.value[0];authorizationCurrent.value=active.value.display.find(field=>/权限|范围|角色/.test(field))?detailRow.value[active.value.display.find(field=>/权限|范围|角色/.test(field))]||'本部门':'本部门';authorizationNext.value=undefined;authorizationError.value='';actionTitle.value=action;authorizationOpen.value=true;return}
          if(action==='提交审核'){detailRow.value=row||rows.value[0];submissionScope.value=detailRow.value?.['发布范围']||detailRow.value?.['可见范围']||'原发布范围';submissionNote.value='';actionTitle.value=action;submissionOpen.value=true;return}
          if(['审核','通过','驳回'].includes(action)){detailRow.value=row||rows.value[0];auditDecision.value=action==='驳回'?'驳回':'通过';auditOpinion.value='';actionTitle.value=action;auditOpen.value=true;return}
          if(/启用|禁用|停用|状态切换|更新.*状态/.test(action)){openStatusChange(action,row||rows.value[0]);return}
          actionTitle.value=action;actionText.value=`对象：${active.value.title}\n权限：${active.value.permission}\n执行前校验角色、数据范围和状态；执行结果写入审计记录。`;actionOpen.value=true;detailRow.value=row||null;
        }
        function confirmAction(){if(actionTitle.value.includes('远程设备配置'))actionText.value+='\n配置结果：2 台成功，1 台离线未下发（部分成功）。';actionOpen.value=false;antd.message.success(`${actionTitle.value}已提交`)}
        function importChange(event){const file=event.target.files&&event.target.files[0];importFile.value=file?`${file.name}（${Math.ceil(file.size/1024)} KB）`:''}
        function confirmImport(){if(!importFile.value){antd.message.warning('请先选择文件');return}importResult.value={success:18,failed:2,errors:['第 6 行：人员编号重复','第 14 行：所属部门不在当前授权范围']};antd.message.warning('预校验完成：成功 18 条，失败 2 条，请处理错误项')}
        function confirmExport(){exportOpen.value=false;antd.message.success('已按当前条件和数据范围生成导出任务')}
        function confirmAuthorization(){if(!authorizationNext.value){authorizationError.value='请选择变更范围';return}if(authorizationNext.value==='全平台'&&currentRole.value!=='平台管理员'){authorizationError.value='变更范围超出当前账号管理边界，已阻止越权授权';return}const field=active.value.display.find(value=>/权限|范围|角色/.test(value));if(field&&detailRow.value)detailRow.value[field]=authorizationNext.value;authorizationOpen.value=false;antd.message.success('授权范围已更新，变更前后值已写入审计日志')}
        function confirmSubmission(){if(!submissionNote.value.trim()){antd.message.warning('请输入提交说明');return}const field=active.value.display.find(value=>/审核状态/.test(value))||active.value.details.find(value=>/审核状态/.test(value));if(field&&detailRow.value)detailRow.value[field]='待审核';const scopeField=active.value.display.find(value=>/发布范围|可见范围/.test(value));if(scopeField&&detailRow.value&&submissionScope.value!=='原发布范围')detailRow.value[scopeField]=submissionScope.value;submissionOpen.value=false;antd.message.success('已提交审核，状态更新为待审核并记录提交人和说明')}
        function confirmAudit(){if(!auditOpinion.value.trim()){antd.message.warning('请输入审核意见');return}const field=active.value.display.find(value=>/审核状态|审核结果|状态/.test(value));if(field&&detailRow.value)detailRow.value[field]=auditDecision.value==='通过'?'审核通过':'审核驳回';auditOpen.value=false;antd.message.success(`审核${auditDecision.value}，状态已更新并留痕`)}
        function switchOffValue(page,field){const values=page.options?.[field]||[];return values.includes('禁用')||/账号|角色/.test(field)?'禁用':'停用'}
        function transitionValue(action,page,field){if(action.includes('禁用'))return '禁用';if(action.includes('停用'))return '停用';if(action.includes('启用'))return '启用';return switchOffValue(page,field)}
        function openStatusChange(action,row,field='',next=''){const targetField=field||active.value.display.find(value=>/状态|启用|显示|可用/.test(value))||active.value.details.find(value=>/状态/.test(value));statusContext.row=row;statusContext.field=targetField;statusContext.current=row?.[targetField]||'未设置';statusContext.next=next||transitionValue(action,active.value,targetField);statusContext.action=action;statusOpen.value=true}
        function confirmStatus(){if(statusContext.row&&statusContext.field)statusContext.row[statusContext.field]=statusContext.next;statusOpen.value=false;antd.message.success(`${statusContext.field}已更新为${statusContext.next}，操作已审计`)}
        function onPageChange(page,size){pageNo.value=page;pageSize.value=size;selectedRowKeys.value=[];antd.message.success(`已切换至第 ${page} 页`)}
        function toggleColumn(field,checked){const list=hiddenColumns[activeId.value]||(hiddenColumns[activeId.value]=[]);const index=list.indexOf(field);if(checked&&index>=0)list.splice(index,1);if(!checked&&index<0)list.push(field)}
        function isStatus(field){return /状态|结果|类型|方式|方向|版本/.test(field)} function isSwitch(field){return /启用|停用|可用|显示|展示状态/.test(field)}
        function isImage(field){return /图片|图标|封面/.test(field)} function isSensitive(field){return /身份证|手机号|手机|证件号|卡号|人员标识/.test(field)} function isAmount(field){return /金额|数量|容量|耗时|排序|连接数|失败率/.test(field)}
        function tagColor(value){return /异常|失败|离线|停用|拒绝|未通过/.test(String(value))?'red':/待|中|部分|拦截/.test(String(value))?'orange':'green'}
        function uploadChange(event){const file=event.target.files&&event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{uploadPreview.value=reader.result;const field=formFields.value.find(isImage);if(field)formState[field]=reader.result};reader.readAsDataURL(file)}
        function openRequirementDrawer(){requirementDraft.value=pageRequirements[activeId.value]||'';requirementSnapshot.value=requirementDraft.value;requirementEditing.value=false;requirementDrawerOpen.value=true}
        function saveRequirement(){if(!requirementDraft.value.trim()){antd.message.warning('页面需求不能为空');return}pageRequirements[activeId.value]=requirementDraft.value.trim();requirementSnapshot.value=pageRequirements[activeId.value];requirementEditing.value=false;persist();antd.message.success('页面需求已保存')}
        function cancelRequirement(){requirementDraft.value=requirementSnapshot.value;requirementEditing.value=false}
        function toggleAnnotationMode(){annotationEnabled.value=!annotationEnabled.value;if(!annotationEnabled.value)clearNodeSelection();antd.message.info(annotationEnabled.value?'标注模式已开启：选择具体控件添加注释':'标注模式已关闭')}
        function findTarget(event){return event.target.closest('[data-node-key]')}
        function hoverNode(event){if(!annotationEnabled.value||nodeCommentOpen.value)return;const target=findTarget(event);document.querySelectorAll('.node-comment-hover').forEach(el=>el.classList.remove('node-comment-hover'));if(target)target.classList.add('node-comment-hover')}
        function selectNode(event){if(!annotationEnabled.value||nodeCommentOpen.value)return;const target=findTarget(event);if(!target)return;event.preventDefault();event.stopPropagation();clearNodeSelection();nodeTarget.value=target;target.classList.add('node-comment-selected');nodeCommentStyle.left=Math.min(window.innerWidth-340,event.clientX+12)+'px';nodeCommentStyle.top=Math.min(window.innerHeight-190,event.clientY+12)+'px';annotationText.value='';nodeCommentOpen.value=true;nextTick(()=>document.getElementById('node-comment-text')?.focus())}
        function clearNodeSelection(){document.querySelectorAll('.node-comment-hover,.node-comment-selected').forEach(el=>el.classList.remove('node-comment-hover','node-comment-selected'));nodeCommentOpen.value=false;nodeTarget.value=null}
        function stableNodeKey(el){return el?.dataset?.nodeKey||''}
        function saveNodeComment(){const value=annotationText.value.trim(),nodeKey=stableNodeKey(nodeTarget.value);if(!value){antd.message.warning('请输入注释内容');return}if(!nodeKey){antd.message.warning('当前节点缺少稳定定位符');return}const group=annotationGroups[activeId.value]||(annotationGroups[activeId.value]=[]);const note={id:`${activeId.value}-user-${Date.now()}`,index:group.reduce((m,n)=>Math.max(m,Number(n.index)||0),0)+1,baseline:false,title:'节点注释',summary:value,detail:value};group.push(note);nodeComments.push({pageId:activeId.value,noteId:note.id,nodeKey});persist();clearNodeSelection();nextTick(renderPins);antd.message.success('节点注释已保存')}
        function editAnnotation(note){annotationText.value=note.summary;antd.Modal.confirm({title:'编辑标注',content:Vue.h(antd.Input.TextArea,{defaultValue:note.summary,autosize:{minRows:3,maxRows:8},onChange:e=>annotationText.value=e.target.value}),onOk:()=>{if(annotationText.value.trim())note.summary=annotationText.value.trim();persist();annotationText.value='';antd.message.success('标注已更新')}})}
        function comparable(note){return JSON.stringify({title:note.title,summary:note.summary,detail:note.detail})}
        function deleteAnnotation(note){const group=annotationGroups[activeId.value];const base=(baselineAnnotations[activeId.value]||[]).find(item=>item.id===note.id);const index=group.findIndex(item=>item.id===note.id);if(base&&comparable(note)===comparable(base)){if(index>=0)group.splice(index,1);if(!hiddenBaselineIds.includes(note.id))hiddenBaselineIds.push(note.id);antd.message.success('自动标注已在本地隐藏，基线仍保留')}else if(base){group.splice(index,1,JSON.parse(JSON.stringify(base)));const hiddenIndex=hiddenBaselineIds.indexOf(note.id);if(hiddenIndex>=0)hiddenBaselineIds.splice(hiddenIndex,1);antd.message.success('用户修改已删除并恢复自动标注基线')}else{if(index>=0)group.splice(index,1);for(let i=nodeComments.length-1;i>=0;i--)if(nodeComments[i].noteId===note.id)nodeComments.splice(i,1);antd.message.success('用户标注已删除')}persist();nextTick(renderPins)}
        function restoreHiddenAnnotations(){const group=annotationGroups[activeId.value];(baselineAnnotations[activeId.value]||[]).forEach(base=>{const hiddenIndex=hiddenBaselineIds.indexOf(base.id);if(hiddenIndex>=0&&!group.some(note=>note.id===base.id)){group.push(JSON.parse(JSON.stringify(base)));hiddenBaselineIds.splice(hiddenIndex,1)}});group.sort((a,b)=>a.index-b.index);persist();nextTick(renderPins);antd.message.success('已恢复隐藏的自动标注')}
        function renderPins(){document.querySelectorAll('.node-comment-pin,.annotation-pin').forEach(el=>el.remove());const findTarget=key=>Array.from(document.querySelectorAll('[data-node-key]')).find(el=>el.dataset.nodeKey===key);(annotationGroups[activeId.value]||[]).filter(note=>note.baseline).forEach(note=>{const key=`${activeId.value}:query-card`,target=findTarget(key);if(!target)return;const rect=target.getBoundingClientRect();const pin=document.createElement('button');pin.className='annotation-pin';pin.dataset.commentId=note.id;pin.dataset.nodeKey=key;pin.title=note.title;pin.textContent=note.index;pin.style.left=Math.min(window.innerWidth-28,Math.max(4,rect.right-34))+'px';pin.style.top=Math.min(window.innerHeight-28,Math.max(4,rect.top+8))+'px';pin.onclick=()=>{annotationDrawerOpen.value=true};document.body.appendChild(pin)});nodeComments.filter(item=>item.pageId===activeId.value).forEach(item=>{const key=item.nodeKey;if(!key)return;const target=findTarget(key);const note=(annotationGroups[activeId.value]||[]).find(n=>n.id===item.noteId);if(!target||!note)return;const rect=target.getBoundingClientRect();const pin=document.createElement('button');pin.className='node-comment-pin';pin.dataset.commentId=item.noteId;pin.dataset.nodeKey=key;pin.textContent=note.index;pin.style.left=Math.min(window.innerWidth-28,Math.max(4,rect.right-8))+'px';pin.style.top=Math.min(window.innerHeight-28,Math.max(4,rect.top-10))+'px';pin.onclick=()=>{annotationDrawerOpen.value=true};document.body.appendChild(pin)})}
        function saveAsAnnotatedHtml(){clearNodeSelection();const state=persist();const doc=new DOMParser().parseFromString('<!DOCTYPE html>\n'+document.documentElement.outerHTML,'text/html');doc.querySelectorAll('.node-comment-pin,.annotation-pin').forEach(node=>node.remove());const appNode=doc.getElementById('app');if(appNode)appNode.innerHTML='';const stateNode=doc.getElementById('snowy-annotation-state');stateNode.textContent=JSON.stringify(state).replace(/</g,'\\u003c');const blob=new Blob(['<!DOCTYPE html>\n'+doc.documentElement.outerHTML],{type:'text/html;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`FY-20260714-UNICARD-admin-annotated-${dayjs().format('YYYYMMDD-HHmmss')}.html`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);antd.message.success('已另存为包含最新标注与页面需求的 HTML')}
        function rowSelection(){return {selectedRowKeys:selectedRowKeys.value,onChange:keys=>selectedRowKeys.value=keys}}
        const pinRestoreTimers=[];
        function schedulePinRestore(){nextTick(renderPins);[120,480,1200].forEach(delay=>pinRestoreTimers.push(setTimeout(renderPins,delay)))}
        onMounted(()=>{window.addEventListener('scroll',renderPins,true);window.addEventListener('resize',renderPins);schedulePinRestore()});onBeforeUnmount(()=>{window.removeEventListener('scroll',renderPins,true);window.removeEventListener('resize',renderPins);pinRestoreTimers.forEach(clearTimeout)});
        return {prototypeMeta,demoImage,grouped,groupKeys,activeId,selectedKeys,openKeys,visitedTabs,active,allRoles,currentRole,currentRoleAllowed,allowedActions,query,visibleFields,columns,filteredRows,pagedRows,rows,viewState,pageNo,pageSize,selectedRowKeys,detailOpen,detailRow,formOpen,formMode,formState,formFields,importOpen,importFile,importResult,exportOpen,actionOpen,actionTitle,actionText,authorizationOpen,authorizationCurrent,authorizationNext,authorizationError,submissionOpen,submissionScope,submissionNote,auditOpen,auditDecision,auditOpinion,statusOpen,statusContext,matrixOpen,columnOpen,hiddenColumns,uploadPreview,requirementDrawerOpen,requirementEditing,requirementDraft,requirementDirty,annotationEnabled,annotationToolbarCollapsed,annotationDrawerOpen,currentAnnotations,hiddenBaselineIds,nodeCommentOpen,nodeCommentStyle,annotationText,pageSpecs,sampleValue,switchPage,switchRole,closeTab,search,reset,refresh,openDetail,openForm,saveForm,openAction,confirmAction,importChange,confirmImport,confirmExport,confirmAuthorization,confirmSubmission,confirmAudit,openStatusChange,confirmStatus,switchOffValue,onPageChange,isToolbarAction,actionAllowed,toggleColumn,isStatus,isSwitch,isImage,isSensitive,isAmount,tagColor,uploadChange,openRequirementDrawer,saveRequirement,cancelRequirement,toggleAnnotationMode,hoverNode,selectNode,clearNodeSelection,saveNodeComment,editAnnotation,deleteAnnotation,restoreHiddenAnnotations,saveAsAnnotatedHtml,rowSelection};
      },
      template:`
      <a-layout class="app-shell" :class="{'annotation-cursor':annotationEnabled}" @mousemove="hoverNode" @click.capture="selectNode">
        <div class="annotation-toolbar" :class="{collapsed:annotationToolbarCollapsed}">
          <button class="annotation-tool-button icon-only" type="button" @click.stop="annotationToolbarCollapsed=!annotationToolbarCollapsed">{{annotationToolbarCollapsed?'☰':'⌃'}}</button>
          <template v-if="!annotationToolbarCollapsed">
            <span class="annotation-tool-meta"><span class="annotation-tool-dot" :class="{active:annotationEnabled}"></span>标注模式</span>
            <button class="annotation-tool-button" :class="{primary:annotationEnabled}" type="button" @click.stop="toggleAnnotationMode">{{annotationEnabled?'关闭':'开启'}}</button>
            <button class="annotation-tool-button" type="button" @click.stop="openRequirementDrawer">页面需求</button>
            <button class="annotation-tool-button" type="button" @click.stop="annotationDrawerOpen=true">标注清单</button>
            <button class="annotation-tool-button" type="button" @click.stop="saveAsAnnotatedHtml">另存为</button>
          </template>
        </div>
        <a-layout-sider class="snowy-sider" :width="240"><div class="snowy-logo"><div class="snowy-logo-mark">{{prototypeMeta.logoText}}</div><span>{{prototypeMeta.systemName}}</span></div>
          <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
            <a-sub-menu v-for="group in groupKeys" :key="group"><template #title>{{group}}</template><a-menu-item v-for="page in grouped[group]" :key="page.id" :data-node-key="page.id+':menu'" @click="switchPage(page.id)">{{page.title}}</a-menu-item></a-sub-menu>
          </a-menu></a-layout-sider>
        <a-layout class="prototype-workspace"><a-layout-header class="snowy-header"><div><strong>{{active.title}}</strong><div class="route-code">{{active.route}}</div></div><div style="display:flex;gap:10px;align-items:center"><span>角色预览</span><a-select data-node-key="global:role-preview" :value="currentRole" style="width:170px" :options="allRoles.map(role=>({value:role,label:role}))" @change="switchRole"/><a-button data-node-key="global:coverage-matrix" @click.stop="matrixOpen=true">原型需求覆盖矩阵</a-button></div></a-layout-header>
          <div class="tabs-row"><button v-for="id in visitedTabs" :key="id" type="button" :class="{active:id===activeId}" @click.stop="switchPage(id)">{{pageSpecs.find(p=>p.id===id).title}}<span v-if="visitedTabs.length>1" @click.stop="closeTab(id)"> ×</span></button></div>
          <a-layout-content class="prototype-page" :data-page-id="active.id">
            <div class="page-meta"><a-tag color="blue">{{active.id}}</a-tag><a-tag>{{active.pageType}}</a-tag><a-tag color="purple">{{active.roles}}</a-tag><a-tag class="route-code">{{active.permission}}</a-tag></div>
            <div class="page-summary">{{active.conclusion}}</div>
            <div v-if="active.id==='API-005'" class="risk-note"><strong>电子社保码安全规则：</strong>瞬时认证原码不采集、不落日志、不进入查询、表格、详情或导出；仅保留关联请求标识、认证场景和认证结果。</div>
            <div v-if="active.id==='PAM-002'" class="risk-note"><strong>掌静脉安全规则：</strong>真实模板永不展示、永不记录、禁止导入导出，不存在明文查看权限；页面只呈现不可逆 ID 与容量、版本、登记状态等元数据。</div>
            <section class="query-card" :data-node-key="active.id+':query-card'"><div class="query-grid"><label v-for="field in active.query" :key="field" :data-node-key="active.id+':query:'+field"><span class="detail-label ant-form-item-label">{{field}}</span><a-select v-if="active.options[field]" v-model:value="query[field]" allow-clear style="width:100%" :options="active.options[field].map(value=>({value,label:value}))"/><a-range-picker v-else-if="/时间|日期/.test(field)" v-model:value="query[field]" style="width:100%"/><a-input v-else v-model:value="query[field]" :placeholder="'请输入'+field"/></label><div class="query-actions"><a-button :data-node-key="active.id+':query-submit'" type="primary" @click.stop="search">查询</a-button><a-button :data-node-key="active.id+':query-reset'" @click.stop="reset">重置</a-button></div></div></section>
            <section class="content-card" :data-node-key="active.id+':content-card'"><div class="toolbar"><div class="toolbar-left"><a-button v-for="action in allowedActions.filter(isToolbarAction)" :key="action" :data-node-key="active.id+':toolbar:'+action" :type="action==='新增'?'primary':'default'" @click.stop="openAction(action)">{{action}}</a-button></div><div class="toolbar-right"><a-button :data-node-key="active.id+':refresh'" @click.stop="refresh">刷新</a-button><a-popover v-model:open="columnOpen" trigger="click"><template #content><a-checkbox v-for="field in active.display" :key="field" :checked="!(hiddenColumns[active.id]||[]).includes(field)" @change="e=>toggleColumn(field,e.target.checked)">{{field}}</a-checkbox></template><a-button :data-node-key="active.id+':column-settings'" @click.stop>列设置</a-button></a-popover><a-dropdown><a-button :data-node-key="active.id+':page-state'" @click.stop>页面状态</a-button><template #overlay><a-menu><a-menu-item @click="viewState='normal'">正常数据</a-menu-item><a-menu-item @click="viewState='empty'">空数据</a-menu-item><a-menu-item @click="viewState='error'">接口异常</a-menu-item><a-menu-item @click="viewState='forbidden'">无权限</a-menu-item></a-menu></template></a-dropdown></div></div>
              <div class="state-strip"><span class="label">状态/异常：</span><a-tag v-for="state in active.status" :key="state" :color="tagColor(state)">{{state}}</a-tag><a-tag v-for="error in active.exceptions" :key="error" color="red">{{error}}</a-tag></div>
              <div v-if="viewState==='error'" class="empty-panel"><a-result status="error" title="接口加载失败" :sub-title="active.exceptions.join('；')||'请稍后重试'"><template #extra><a-button type="primary" @click.stop="refresh">重试加载</a-button></template></a-result></div>
              <div v-else-if="viewState==='forbidden'" class="empty-panel"><a-result status="403" title="无权限访问" :sub-title="'需要权限：'+active.permission"><template #extra><a-button @click.stop="activeId=activeId">申请权限</a-button></template></a-result></div>
              <div v-else-if="viewState==='empty'||filteredRows.length===0" class="empty-panel"><a-empty description="当前条件下暂无数据"/><a-button @click.stop="reset">清空条件</a-button></div>
              <a-table v-else class="a-table" :columns="columns" :data-source="pagedRows" row-key="_key" :row-selection="rowSelection()" :pagination="false" :scroll="{x:'max-content'}">
                <template #bodyCell="{column,record}"><template v-if="column.key==='actions'"><a-space wrap><a v-for="action in allowedActions.filter(a=>!isToolbarAction(a))" :key="action" :data-node-key="active.id+':row:'+record._key+':action:'+action" :class="{'danger-link':action==='删除'}" @click.stop="openAction(action,record)">{{action}}</a></a-space></template><template v-else-if="isImage(column.dataIndex)"><img class="thumb" :data-node-key="active.id+':row:'+record._key+':field:'+column.dataIndex" :src="record[column.dataIndex]||demoImage" alt="业务图片"/></template><template v-else-if="isSwitch(column.dataIndex)"><a-switch :data-node-key="active.id+':row:'+record._key+':switch:'+column.dataIndex" :checked="/正常|启用|可用|展示|示例/.test(String(record[column.dataIndex]))" @change="checked=>openStatusChange('状态切换',record,column.dataIndex,checked?'启用':switchOffValue(active,column.dataIndex))"/></template><template v-else-if="isStatus(column.dataIndex)"><a-tag :data-node-key="active.id+':row:'+record._key+':field:'+column.dataIndex" :color="tagColor(record[column.dataIndex])">{{record[column.dataIndex]}}</a-tag></template><template v-else><span :data-node-key="active.id+':row:'+record._key+':field:'+column.dataIndex" :class="{'field-mask':isSensitive(column.dataIndex),'amount-cell':isAmount(column.dataIndex)}">{{record[column.dataIndex]}}</span></template></template>
              </a-table><div style="display:flex;justify-content:flex-end;margin-top:12px"><a-pagination :data-node-key="active.id+':pagination'" :current="pageNo" :total="filteredRows.length" :page-size="pageSize" show-size-changer @change="onPageChange" @show-size-change="onPageChange"/></div>
            </section>
            <div class="risk-note"><strong>页面权限：</strong>{{active.roles}}；入口与按钮受 {{active.permission}} 控制，服务端按角色、组织或资源范围拒绝越权。</div>
          </a-layout-content>
        </a-layout>
        <a-drawer class="a-drawer" v-model:open="detailOpen" width="680" :title="active.title+'详情'"><div class="drawer-grid"><div v-for="field in active.details" :key="field" class="detail-item"><span class="detail-label">{{field}}</span><img v-if="isImage(field)" class="thumb" :src="(detailRow&&detailRow[field])||demoImage"/><a-tag v-else-if="isStatus(field)" :color="tagColor(detailRow&&detailRow[field])">{{(detailRow&&detailRow[field])||sampleValue(field)}}</a-tag><span v-else :class="{'field-mask':isSensitive(field),'amount-cell':isAmount(field)}">{{(detailRow&&detailRow[field])||sampleValue(field)}}</span></div></div><div class="risk-note" v-if="active.sensitive.length"><strong>敏感字段：</strong>{{active.sensitive.join('、')}}。详情仍执行脱敏与权限控制，并记录访问审计。</div></a-drawer>
        <a-drawer class="a-drawer" v-model:open="formOpen" width="620" :title="(formMode==='add'?'新增':'编辑')+active.title"><a-form layout="vertical"><a-form-item v-for="field in formFields" :key="field" :label="field"><template v-if="isImage(field)"><input :data-node-key="active.id+':form-upload:'+field" type="file" accept="image/*" @change="uploadChange"/><div v-if="uploadPreview||formState[field]" class="upload-preview"><img :src="uploadPreview||formState[field]"/><a-button :data-node-key="active.id+':form-upload-remove:'+field" danger @click="uploadPreview='';formState[field]=''">移除</a-button></div></template><a-tree-select v-else-if="/权限|范围|部门|组织/.test(field)" v-model:value="formState[field]" tree-default-expand-all :tree-data="[{title:'本校',value:'本校',children:[{title:'本部门',value:'本部门'}]}]"/><a-switch v-else-if="isSwitch(field)" :checked="formState[field]==='启用'" @change="v=>formState[field]=v?'启用':'停用'"/><a-input-number v-else-if="isAmount(field)" v-model:value="formState[field]" style="width:100%"/><a-input v-else v-model:value="formState[field]"/></a-form-item></a-form><template #footer><a-space><a-button type="primary" @click="saveForm">保存</a-button><a-button @click="formOpen=false">取消</a-button></a-space></template></a-drawer>
        <a-modal class="a-modal" v-model:open="importOpen" :title="actionTitle+' · 文件选择与预校验'"><input data-node-key="import:file" type="file" accept=".xlsx,.xls,.csv" @change="importChange"/><div class="upload-preview" v-if="importFile"><a-tag color="blue">{{importFile}}</a-tag><a-button data-node-key="import:remove" danger @click="importFile='';importResult=null">移除</a-button></div><p>提交后先执行格式、重复项、权限范围与异常数据校验，再展示成功/失败数量和逐项原因。</p><a-alert v-if="importResult" type="warning" show-icon :message="'预校验：成功 '+importResult.success+' 条，失败 '+importResult.failed+' 条'"><template #description><ul><li v-for="error in importResult.errors" :key="error">{{error}}</li></ul></template></a-alert><template #footer><a-space><a-button @click="importOpen=false">{{importResult?'完成':'取消'}}</a-button><a-button v-if="!importResult" data-node-key="import:validate" type="primary" @click="confirmImport">开始预校验</a-button></a-space></template></a-modal>
        <a-modal class="a-modal" v-model:open="exportOpen" title="受控导出确认" @ok="confirmExport"><a-form layout="vertical"><a-form-item label="导出用途"><a-input value="业务核验"/></a-form-item><a-form-item label="导出范围"><a-select value="当前查询结果" :options="[{value:'当前查询结果',label:'当前查询结果'}]"/></a-form-item></a-form><p>敏感字段默认脱敏；系统记录导出人、时间、条件、用途和结果。</p></a-modal>
        <a-modal class="a-modal" v-model:open="authorizationOpen" :title="actionTitle+' · 权限范围变更'" @ok="confirmAuthorization"><a-descriptions bordered :column="1"><a-descriptions-item label="当前角色">{{currentRole}}</a-descriptions-item><a-descriptions-item label="当前范围">{{authorizationCurrent}}</a-descriptions-item></a-descriptions><a-form layout="vertical" style="margin-top:16px"><a-form-item label="变更范围（组织/资源树）"><a-tree-select data-node-key="authorization:tree" v-model:value="authorizationNext" tree-default-expand-all style="width:100%" :tree-data="[{title:'宁波纺织学院',value:'本校',children:[{title:'当前部门',value:'本部门',children:[{title:'本人负责资源',value:'本人'}]}]},{title:'全平台（仅平台管理员）',value:'全平台'}]"/></a-form-item></a-form><a-alert v-if="authorizationError" type="error" show-icon :message="authorizationError"/><p>保存前校验当前账号管理边界；变更前后范围和操作者写入审计日志。</p></a-modal>
        <a-modal class="a-modal" v-model:open="submissionOpen" title="提交审核 · 发布范围确认" @ok="confirmSubmission"><a-form layout="vertical"><a-form-item label="发布范围"><a-select data-node-key="submission:scope" v-model:value="submissionScope" :options="['原发布范围','全校','指定学院','指定身份'].map(value=>({value,label:value}))"/></a-form-item><a-form-item label="提交说明"><a-textarea data-node-key="submission:note" v-model:value="submissionNote" :auto-size="{minRows:3,maxRows:8}"/></a-form-item></a-form><p>此操作仅由内容维护人员发起，将草稿状态变更为待审核；不会代替审核人员作出通过或驳回结论。</p></a-modal>
        <a-modal class="a-modal" v-model:open="auditOpen" :title="actionTitle+' · 审核处理'" @ok="confirmAudit"><a-form layout="vertical"><a-form-item label="审核结论"><a-radio-group data-node-key="audit:decision" v-model:value="auditDecision"><a-radio value="通过">通过</a-radio><a-radio value="驳回">驳回</a-radio></a-radio-group></a-form-item><a-form-item label="审核意见"><a-textarea data-node-key="audit:opinion" v-model:value="auditOpinion" :auto-size="{minRows:3,maxRows:8}"/></a-form-item></a-form><p>确认后更新审核状态，并记录审核人、时间、意见和前后值。</p></a-modal>
        <a-modal class="a-modal" v-model:open="statusOpen" :title="statusContext.action+'确认'" @ok="confirmStatus"><a-descriptions bordered :column="1"><a-descriptions-item label="字段">{{statusContext.field}}</a-descriptions-item><a-descriptions-item label="当前值">{{statusContext.current}}</a-descriptions-item><a-descriptions-item label="变更为">{{statusContext.next}}</a-descriptions-item></a-descriptions><p>状态切换需二次确认；确认后更新当前行并留存审计记录。</p></a-modal>
        <a-modal class="a-modal" v-model:open="actionOpen" :title="actionTitle+'确认'" @ok="confirmAction"><pre style="white-space:pre-wrap">{{actionText}}</pre><div v-if="actionTitle.includes('远程设备配置')"><a-form layout="vertical"><a-form-item label="认证模式"><a-select value="掌静脉优先" :options="[{value:'掌静脉优先',label:'掌静脉优先'},{value:'卡片优先',label:'卡片优先'}]"/></a-form-item><a-form-item label="识别参数"><a-input value="阈值 0.82"/></a-form-item></a-form></div></a-modal>
        <a-drawer class="requirement-drawer" :z-index="2600" v-model:open="requirementDrawerOpen" width="620" :title="active.title+' · 整体需求说明'"><div v-if="!requirementEditing" class="requirement-preview">{{requirementDraft}}<a-button class="requirement-edit" size="small" title="编辑整体需求描述" @click="requirementEditing=true">编辑</a-button></div><a-textarea v-else v-model:value="requirementDraft" :auto-size="{minRows:8,maxRows:18}"/><template #footer><a-space v-if="requirementEditing"><button v-if="requirementDirty" type="button" class="ant-btn ant-btn-primary" aria-label="保存" title="保存" @click="saveRequirement"><span>保存</span></button><button type="button" class="ant-btn" aria-label="取消" @click="cancelRequirement"><span>取消</span></button></a-space><button v-else type="button" class="ant-btn" aria-label="关闭" title="关闭" @click="requirementDrawerOpen=false"><span>关闭</span></button></template></a-drawer>
        <a-drawer v-model:open="annotationDrawerOpen" width="560" :title="active.title+' · 标注清单'"><a-button v-if="hiddenBaselineIds.some(id=>id.startsWith(active.id+'-'))" style="margin-bottom:12px" @click="restoreHiddenAnnotations">恢复隐藏的自动标注</a-button><div class="annotation-list"><div v-for="note in currentAnnotations" :key="note.id" class="annotation-row"><div class="annotation-row-title"><strong>{{note.index}}. {{note.title}}</strong><a-space><a @click="editAnnotation(note)">编辑</a><a class="danger-link" @click="deleteAnnotation(note)">{{note.baseline?'删除自动标注':'删除'}}</a></a-space></div><p>{{note.summary}}</p></div></div></a-drawer>
        <a-modal v-model:open="matrixOpen" width="96vw" title="原型需求覆盖矩阵" :footer="null"><div class="matrix-wrap"><table class="coverage-table"><thead><tr><th>需求编号</th><th>功能点</th><th>页面/弹窗/抽屉</th><th>蓝图条目</th><th>字段</th><th>操作</th><th>状态/异常</th><th>权限</th><th>覆盖状态</th><th>说明</th></tr></thead><tbody><tr v-for="page in pageSpecs" :key="page.id"><td>{{page.id}}</td><td>{{page.title}}</td><td>{{page.menuPath}}；详情抽屉<span v-if="page.create.length">；新增抽屉</span><span v-if="page.edit.length">；编辑抽屉</span></td><td>原始需求摘录、原子需求清单、页面结构、字段明细、操作交互</td><td>{{[...page.query,...page.display,...page.details].filter((v,i,a)=>a.indexOf(v)===i).join('、')}}</td><td>查询、重置<span v-if="page.actions.length">、{{page.actions.join('、')}}</span></td><td>{{[...page.status,...page.exceptions].join('；')||'加载、空数据、接口异常、无权限'}}</td><td>{{page.roles}}；{{page.permission}}</td><td><a-tag color="green">已覆盖</a-tag></td><td>逐页专属字段与交互；可由页面菜单直接验证</td></tr></tbody></table></div></a-modal>
        <div v-if="nodeCommentOpen" class="node-comment-popover" :style="nodeCommentStyle" @click.stop><strong>添加节点注释</strong><textarea id="node-comment-text" v-model="annotationText" rows="3" placeholder="Enter 换行；点击发送提交"></textarea><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px"><a-button @click="clearNodeSelection">取消</a-button><a-button class="node-comment-submit" type="primary" :disabled="!annotationText.trim()" @click="saveNodeComment">发送</a-button></div></div>
      </a-layout>`
    });
    app.use(antd).mount('#app');
  </script>
</body></html>
'''

body = body.replace("__PAGES__", js(pages))
output = head + body
required_markers = [
    "snowy-admin-prototype-v2", "prototypeMeta", ".snowy-sider", ".snowy-header", ".tabs-row",
    "query-card", "toolbar", "a-table", "a-drawer", "a-modal", "annotation-toolbar",
    "node-comment-pin", "pageRequirements", "saveAsAnnotatedHtml", "原型需求覆盖矩阵",
]
missing_markers = [marker for marker in required_markers if marker not in output]
if missing_markers:
    raise SystemExit(f"missing output markers: {missing_markers}")
for page in pages:
    for value in [page["id"], page["title"], page["route"], page["permission"], *page["query"], *page["display"], *page["details"], *page["actions"], *page["status"], *page["exceptions"]]:
        if value and value not in output:
            raise SystemExit(f"output missing {page['id']} value: {value}")
    page_roles = [value.strip() for value in page["roles"].split("、") if value.strip()]
    if set(page["actionPolicy"]) != set(page_roles):
        raise SystemExit(f"action policy role mismatch: {page['id']}")
    for role, allowed in page["actionPolicy"].items():
        if any(action not in page["actions"] for action in allowed):
            raise SystemExit(f"action policy contains unknown action: {page['id']} {role}")
    missing_enum_options = [field for field in page["enumQueryFields"] if not page["options"].get(field)]
    if missing_enum_options:
        raise SystemExit(f"enum query fields without options: {page['id']} {missing_enum_options}")
    valid_permission_keys = set(page["actions"]) | {"查询", "重置"}
    extra_permission_keys = set(page["actionPermissions"]) - valid_permission_keys
    if extra_permission_keys:
        raise SystemExit(f"action permission keys outside page actions: {page['id']} {sorted(extra_permission_keys)}")
    missing_permission_keys = set(page["actions"]) - set(page["actionPermissions"])
    if missing_permission_keys:
        raise SystemExit(f"page actions without permission rows: {page['id']} {sorted(missing_permission_keys)}")
notice = next(page for page in pages if page["id"] == "ADM-S-009")
notice_operator_required = {"新增", "编辑", "删除", "提交审核", "查看详情"}
if not notice_operator_required.issubset(set(notice["actionPolicy"].get("内容运营人员", []))):
    raise SystemExit("ADM-S-009 content operator action policy incomplete")
if set(notice["actionPolicy"].get("审核人员", [])) != {"审核", "查看详情"}:
    raise SystemExit("ADM-S-009 reviewer action policy must be audit/detail only")
for forbidden in ["currentConfig", "同新增", "与上一页一致", "多条件筛选", "等状态", "组件预设"]:
    if forbidden in output:
        raise SystemExit(f"forbidden generic phrase in output: {forbidden}")
TARGET.write_text(output, encoding="utf-8", newline="\n")
print(f"generated {TARGET} with {len(pages)} page-specific models; markers/fields/actions audit PASS")
