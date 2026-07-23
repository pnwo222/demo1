<script setup lang='ts'>
import { ykt } from 'icard-jssdk'
import router from '@/router'
import { requireImage } from '@/utils/require'
import { useNoticeDetail } from './hooks'

const { getDetail, noticeDetail } = useNoticeDetail()

onMounted(() => {
  getDetail(router.currentRoute.value.query.id as string)
})

// 根据文件名后缀获取对应的图标
function getFileIcon(fileName: string) {
  if (!fileName)
    return 'file'

  const ext = fileName.split('.').pop()?.toLowerCase()

  const iconMap: Record<string, string> = {
    // 文档类
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'txt': 'file',
    // 表格类
    'xls': 'excel',
    'xlsx': 'excel',
    'csv': 'file',
    // 演示文稿
    'ppt': 'file',
    'pptx': 'file',
    // 图片类
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'bmp': 'image',
    'svg': 'image',
    'webp': 'image',
    // 压缩包
    'zip': 'zip',
    'rar': 'zip',
    '7z': 'zip',
    'tar': 'zip',
    'gz': 'zip',
    // 视频
    'mp4': 'video',
    'avi': 'video',
    'mov': 'video',
    'wmv': 'video',
    // 音频
    'mp3': 'music',
    'wav': 'music',
    'flac': 'music',
  }

  return iconMap[ext || ''] || 'file'
}

function handleDownload(item: any) {
  ykt.downloadFile({
    fileUrl: item.url,
    fileName: item.name,
  })
}
</script>

<template>
  <div class="detail-page">
    <div class="detail">
      <div class="title">
        {{ noticeDetail?.title }}
      </div>
      <div class="desc flex justify-between mt-8">
        <span>{{ noticeDetail?.createTime }}</span>
      </div>

      <div class="content mt-20" v-html="noticeDetail?.content" />
    </div>

    <div v-if="noticeDetail?.fileList?.length" class="file-list mt-40">
      <h2>相关附件：</h2>
      <div v-for="item in noticeDetail?.fileList" :key="item.id" class="file-item" @click="handleDownload(item)">
        <img class="w-24 h-24" :src="requireImage(`image/${getFileIcon(item.name)}.png`)" alt="">
        <span class="file-name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .detail-page {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background: #F7F8FA;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .detail {
    width: 100%;
    // min-height: 300px;
    padding: 10px 16px;
    background: #fff;
    flex: 1;

    .title {
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      color: #333;
    }

    .desc {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999;
    }

    .content {
      // min-height: 80vh;
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      color: #333;

      p, h1, h2, h3, h4, h5, h6 {
        margin-block: 1em;
        margin-inline: 0;
        unicode-bidi: isolate;
      }

      img {
        max-width: 100%;
      }
    }
  }

  .file-list {
    width: 100%;
    padding: 10px 16px;
    padding-top: 6px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
    margin-top: 14px;
    background: #fff;

    h2 {
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      color: rgb(20 20 20 / 85%);
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      font-size: 13px;
      line-height: normal;
      // border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .file-name {
        color: var(--van-blue);
        text-decoration: underline;
        word-break: break-all;
        flex: 1;
      }
    }
  }
</style>
