(function (global) {
    const prototypeMeta = {
      templateVersion: 'snowy-admin-prototype-v2',
      systemName: '示例管理系统',
      logoText: '示',
      logoImage: ''
    };

    const demoImages = [
      'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="184" height="92"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#1677ff"/><stop offset="1" stop-color="#69b1ff"/></linearGradient></defs><rect width="184" height="92" rx="8" fill="url(#g)"/><circle cx="142" cy="34" r="20" fill="rgba(255,255,255,.35)"/><path d="M20 64l30-28 24 22 18-15 36 31H20z" fill="rgba(255,255,255,.8)"/></svg>'),
      'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="184" height="92"><rect width="184" height="92" rx="8" fill="#12b76a"/><rect x="18" y="18" width="86" height="12" rx="6" fill="rgba(255,255,255,.75)"/><rect x="18" y="42" width="132" height="8" rx="4" fill="rgba(255,255,255,.45)"/><rect x="18" y="58" width="104" height="8" rx="4" fill="rgba(255,255,255,.45)"/></svg>'),
      ''
    ];

    const seedRows = [
      { id: 1, title: '校园资讯首页 Banner', cover: demoImages[0], category: '首页 Banner', position: '后台首页', sort: 10, status: true, audit: '已发布', createdAt: '2026-07-08 09:30', summary: '展示校园资讯和重点通知。', attachmentType: 'pdf', attachmentName: '首页Banner投放说明.pdf', attachmentSize: '1.2 MB' },
      { id: 2, title: '暑期校园开放通知', cover: '', category: '通知公告', position: '学校专区', sort: 20, status: false, audit: '已下架', createdAt: '2026-07-07 16:12', summary: '假期开放安排和入校说明。', attachmentType: 'doc', attachmentName: '暑期开放通知正文.docx', attachmentSize: '860 KB' },
      { id: 3, title: '专业介绍更新', cover: demoImages[1], category: '专业介绍', position: '后台首页', sort: 30, status: true, audit: '待审核', createdAt: '2026-07-06 11:05', summary: '专业介绍内容更新入口。', attachmentType: 'xls', attachmentName: '专业介绍字段清单.xlsx', attachmentSize: '420 KB' },
      { id: 4, title: '招生咨询入口', cover: demoImages[0], category: '招生服务', position: '学校专区', sort: 40, status: true, audit: '已发布', createdAt: '2026-07-05 14:20', summary: '招生咨询和访客预约入口。', attachmentType: '', attachmentName: '', attachmentSize: '' }
    ];
    const userAvatar = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="#1677ff"/><circle cx="40" cy="31" r="14" fill="white" opacity=".9"/><path d="M18 68c4-15 39-15 44 0" fill="white" opacity=".9"/></svg>');
    const componentRows = [
      { id: 'u1', avatar: userAvatar, account: 'admin', name: '系统管理员', gender: '男', phone: '13800000001', org: '信息中心', role: '管理员', status: true, progress: 92, engine: '本地存储', fileType: 'pdf', fileName: '校园专区方案.pdf', size: '2.4 MB', remark: '拥有完整管理权限，可维护菜单、角色与内容。' },
      { id: 'u2', avatar: '', account: 'operator', name: '运营人员', gender: '女', phone: '13800000002', org: '招生办公室', role: '运营人员', status: true, progress: 68, engine: '对象存储', fileType: 'xls', fileName: '访客预约导入模板.xlsx', size: '520 KB', remark: '负责内容发布、招生咨询和访客预约审核。' },
      { id: 'u3', avatar: userAvatar, account: 'auditor', name: '审核人员', gender: '男', phone: '13800000003', org: '教务处', role: '审核人员', status: false, progress: 35, engine: '本地存储', fileType: 'doc', fileName: '通知公告审核记录.docx', size: '890 KB', remark: '负责公告审核、数据复核和发布状态确认。' }
    ];

  global.SnowyPrototypeData = { prototypeMeta, demoImages, seedRows, userAvatar, componentRows };
})(window);
