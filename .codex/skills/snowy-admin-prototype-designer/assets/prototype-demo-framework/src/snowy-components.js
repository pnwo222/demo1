(function(global){
  function createSnowyComponents(Vue, antd){
    const {computed, reactive, ref, watch} = Vue;
    const componentAliases=new Map((global.SNOWY_PROTOTYPE_SCHEMA.extensions||[]).map(item=>[item.name,item.baseComponent]));
    const resolveComponent=name=>componentAliases.get(name)||name;
    const FieldDisplay={
      name:'SnowyFieldDisplay',props:{field:Object,value:null},
      setup(props){
        const displayValue=computed(()=>props.value??props.field.emptyText??'-');
        const color=computed(()=>props.field.options?.find(item=>(item.value??item)===props.value)?.color||props.field.color||'blue');
        const component=computed(()=>resolveComponent(props.field.component));
        return{displayValue,color,component};
      },
      template:`<span>
        <span v-if="component==='Text'">{{displayValue}}</span>
        <span v-else-if="component==='MaskedText'">{{displayValue}}</span>
        <span v-else-if="component==='Amount'" class="snowy-amount">{{displayValue}}</span>
        <a-tag v-else-if="component==='StatusTag'" :color="color">{{displayValue}}</a-tag>
        <a-switch v-else-if="component==='Switch'" :checked="Boolean(value)" disabled />
        <img v-else-if="component==='Image'&&value" class="snowy-cover" :src="value" alt="图片" />
        <span v-else-if="component==='Image'" class="snowy-empty-image">无图</span>
        <a-avatar v-else-if="component==='Avatar'" :src="value">{{field.avatarText||'人'}}</a-avatar>
        <span v-else-if="component==='Attachment'" class="snowy-attachment">▣ {{displayValue}}</span>
        <a-progress v-else-if="component==='Progress'" :percent="Number(value)||0" size="small" />
        <a-badge v-else-if="component==='Badge'" :status="field.status||'processing'" :text="displayValue" />
        <a-tooltip v-else-if="component==='LongText'" :title="displayValue"><span class="snowy-long-text">{{displayValue}}</span></a-tooltip>
        <span v-else>{{displayValue}}</span>
      </span>`
    };
    const FieldEditor={
      name:'SnowyFieldEditor',props:{field:Object,modelValue:null,disabled:Boolean},emits:['update:modelValue'],
      setup(props,{emit}){
        const component=computed(()=>resolveComponent(props.field.component));
        const fileList=ref(props.modelValue?[{uid:'saved',name:props.field.fileName||'已上传文件',status:'done',url:props.modelValue}]:[]);
        watch(()=>props.modelValue,value=>{if(!value)fileList.value=[]});
        const update=value=>emit('update:modelValue',value);
        const beforeUpload=file=>{const reader=new FileReader();reader.onload=e=>{fileList.value=[{uid:file.uid||String(Date.now()),name:file.name,status:'done',url:e.target.result}];update(e.target.result)};reader.readAsDataURL(file);return false};
        const remove=()=>{fileList.value=[];update('');return true};
        return{update,fileList,beforeUpload,remove,component};
      },
      template:`<span>
        <a-input v-if="component==='Input'" :value="modelValue" :disabled="disabled" :placeholder="field.placeholder||('请输入'+field.label)" @update:value="update" />
        <a-textarea v-else-if="component==='Textarea'" :value="modelValue" :disabled="disabled" :auto-size="{minRows:3,maxRows:8}" @update:value="update" />
        <a-select v-else-if="component==='Select'" :value="modelValue" :disabled="disabled" allow-clear style="width:100%" :options="field.options||[]" @update:value="update" />
        <a-tree-select v-else-if="component==='TreeSelect'" :value="modelValue" :disabled="disabled" tree-default-expand-all style="width:100%" :tree-data="field.options||[]" @update:value="update" />
        <a-range-picker v-else-if="component==='DateRange'" :value="modelValue" :disabled="disabled" style="width:100%" @update:value="update" />
        <a-date-picker v-else-if="component==='DateTime'" :value="modelValue" :disabled="disabled" show-time style="width:100%" @update:value="update" />
        <a-input-number v-else-if="component==='NumberInput'||component==='Amount'" :value="modelValue" :disabled="disabled" style="width:100%" @update:value="update" />
        <a-switch v-else-if="component==='Switch'" :checked="Boolean(modelValue)" :disabled="disabled" @update:checked="update" />
        <a-upload v-else-if="component==='ImageUpload'" list-type="picture-card" :file-list="fileList" :before-upload="beforeUpload" :disabled="disabled" @remove="remove"><div v-if="!fileList.length&&!disabled"><div style="font-size:20px">＋</div><div>选择图片</div></div></a-upload>
        <a-upload v-else-if="component==='FileUpload'" :file-list="fileList" :before-upload="beforeUpload" :disabled="disabled" @remove="remove"><a-button v-if="!disabled">选择文件</a-button></a-upload>
        <a-input v-else :value="modelValue" :disabled="disabled" @update:value="update" />
      </span>`
    };
    const QueryForm={
      name:'SnowyQueryForm',props:{fields:Array,modelValue:Object,pageId:String},emits:['update:modelValue','search','reset'],
      setup(props,{emit}){const set=(key,value)=>emit('update:modelValue',{...props.modelValue,[key]:value});return{set}},
      template:`<div class="snowy-query-card"><a-form layout="vertical"><a-row :gutter="12"><a-col v-for="field in fields" :key="field.key" :xs="24" :md="12" :lg="6"><a-form-item :label="field.label" :data-node-key="pageId+':query:'+field.key"><snowy-field-editor :field="field" :model-value="modelValue[field.key]" @update:model-value="value=>set(field.key,value)" /></a-form-item></a-col><a-col :xs="24" :md="12" :lg="6"><a-form-item label=" "><a-space><a-button :data-node-key="pageId+':query-submit'" type="primary" @click="$emit('search')">查询</a-button><a-button :data-node-key="pageId+':query-reset'" @click="$emit('reset')">重置</a-button></a-space></a-form-item></a-col></a-row></a-form></div>`
    };
    const PageToolbar={
      name:'SnowyPageToolbar',props:{actions:Array,pageId:String,selectedCount:Number},emits:['action'],
      template:`<div class="snowy-toolbar"><div class="snowy-toolbar-left"><a-button v-for="action in actions" :key="action.key" :type="action.primary?'primary':'default'" :danger="action.component==='DangerAction'" :disabled="action.requiresSelection&&!selectedCount" :data-node-key="pageId+':toolbar:'+action.key" @click="$emit('action',action)">{{action.label}}</a-button></div><div class="snowy-toolbar-right"><slot name="tools" /></div></div>`
    };
    const DataTable={
      name:'SnowyDataTable',props:{page:Object,rows:Array,selectedKeys:Array},emits:['action','status','update:selectedKeys'],
      setup(props,{emit}){
        const columns=computed(()=>props.page.columns.map(field=>({title:field.title,dataIndex:field.key,key:field.key,width:field.width||140,fixed:field.fixed})).concat(props.page.rowActions.length?[{title:'操作',key:'actions',fixed:'right',width:props.page.actionWidth||180}]:[]));
        const rowSelection=computed(()=>({selectedRowKeys:props.selectedKeys,onChange:keys=>emit('update:selectedKeys',keys)}));
        const isSwitch=key=>resolveComponent(props.page.columns.find(item=>item.key===key)?.component)==='Switch';
        return{columns,rowSelection,isSwitch};
      },
      template:`<a-table :columns="columns" :data-source="rows" row-key="id" :row-selection="rowSelection" :scroll="{x:'max-content'}" :pagination="{pageSize:10,showSizeChanger:true}"><template #bodyCell="{column,record}"><template v-if="column.key==='actions'"><a-space><a v-for="action in page.rowActions" :key="action.key" :class="{'snowy-danger-link':action.component==='DangerAction'}" :data-node-key="page.id+':row:'+record.id+':action:'+action.key" @click="$emit('action',action,record)">{{action.label}}</a></a-space></template><template v-else><span :data-node-key="page.id+':row:'+record.id+':field:'+column.key"><a-switch v-if="isSwitch(column.key)" :checked="Boolean(record[column.key])" @change="value=>$emit('status',column.key,value,record)"/><snowy-field-display v-else :field="page.columns.find(item=>item.key===column.key)" :value="record[column.key]" /></span></template></template></a-table>`
    };
    const DetailDrawer={
      name:'SnowyDetailDrawer',props:{open:Boolean,page:Object,record:Object},emits:['update:open'],
      template:`<a-drawer :open="open" width="620" :title="page.title+'详情'" @update:open="$emit('update:open',$event)"><div class="snowy-detail-grid"><div v-for="field in page.detailFields" :key="field.key" class="snowy-detail-item" :data-node-key="page.id+':detail:'+field.key"><span class="snowy-detail-label">{{field.label}}</span><snowy-field-display :field="field" :value="record&&record[field.key]" /></div></div></a-drawer>`
    };
    const FormDrawer={
      name:'SnowyFormDrawer',props:{open:Boolean,page:Object,mode:String,modelValue:Object},emits:['update:open','update:modelValue','save'],
      setup(props,{emit}){const fields=computed(()=>props.mode==='add'?props.page.createFields:props.page.editFields);const set=(key,value)=>emit('update:modelValue',{...props.modelValue,[key]:value});return{fields,set}},
      template:`<a-drawer :open="open" width="560" :title="(mode==='add'?'新增':'编辑')+page.title" @update:open="$emit('update:open',$event)"><a-form layout="vertical"><a-row :gutter="12"><a-col v-for="field in fields" :key="field.key" :span="field.span||24"><a-form-item :label="field.label" :required="field.required" :data-node-key="page.id+':form:'+field.key"><snowy-field-editor :field="field" :model-value="modelValue[field.key]" @update:model-value="value=>set(field.key,value)" /></a-form-item></a-col></a-row></a-form><template #footer><a-space><a-button @click="$emit('update:open',false)">取消</a-button><a-button type="primary" @click="$emit('save')">保存</a-button></a-space></template></a-drawer>`
    };
    const ImportModal={
      name:'SnowyImportModal',props:{open:Boolean},emits:['update:open','confirm'],
      template:`<a-modal :open="open" title="导入数据" ok-text="开始导入" @update:open="$emit('update:open',$event)" @ok="$emit('confirm')"><a-upload-dragger :before-upload="()=>false" accept=".xlsx,.xls,.csv"><p style="font-size:28px;margin:0">⇧</p><p>点击或拖拽文件到此区域</p></a-upload-dragger></a-modal>`
    };
    const SnowyShell={name:'SnowyShell',template:`<div class="snowy-app-shell"><slot /></div>`};
    return{SnowyShell,QueryForm,PageToolbar,DataTable,FormDrawer,DetailDrawer,ImportModal,FieldDisplay,FieldEditor};
  }
  global.SnowyPrototypeKit=Object.assign(global.SnowyPrototypeKit||{},{createSnowyComponents});
})(window);
