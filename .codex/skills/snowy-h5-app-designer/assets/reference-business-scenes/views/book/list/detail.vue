<script setup lang="ts">
import type { IClientBookSearch, IItem } from '@/api/book/search-types'
import { groupBy } from 'lodash-es'
import { useStorage } from '@/hooks/system/useStorage'
import { useBookDetail } from '@/views/book/hooks'

const { openDetail } = useBookDetail()

const detail = useStorage.ss.get('bookDetail')

// 生成随机背景色
const colorCache = new Map<string, string>()

function getRandomColor(title: string) {
  if (!title) return '#FF6B6B'

  // 如果已经有缓存的颜色，直接返回
  if (colorCache.has(title)) {
    return colorCache.get(title)!
  }

  // 生成新的随机颜色并缓存
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#F8C471',
    '#82E0AA',
    '#F1948A',
    '#85C1E9',
    '#D7BDE2',
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  colorCache.set(title, randomColor)
  return randomColor
}

// 处理书名显示，考虑长度问题
function getDisplayTitle(title: string) {
  if (!title) return ''

  // 如果书名长度超过8个字符，截取前8个字符并添加省略号
  if (title.length > 8) {
    return `${title.substring(0, 8)}...`
  }
  return title
}

// 根据书名长度调整字体大小
function getFontSize(title: string) {
  if (!title) return '16px'

  if (title.length <= 4) return '18px'
  if (title.length <= 6) return '16px'
  if (title.length <= 8) return '14px'
  return '12px'
}

const data = computed<{
  children: IItem[]
  locationId: string
  locationName: string
}[]>(() => {
  return Object.entries(groupBy(detail.items, 'locationId')).map(([key, value]) => {
    return {
      locationId: key,
      locationName: value[0].locationName as string,
      children: value as IItem[],
    }
  })
})
</script>

<template>
  <div class="book-detail">
    <!-- 图书信息区域 -->
    <div class="book-info">
      <div class="book-cover">
        <div
          class="cover-image"
          :style="{
            backgroundColor: getRandomColor(detail?.title),
            fontSize: getFontSize(detail?.title),
          }"
        >
          <!-- 默认封面装饰 -->
          <div class="book-cover-decoration">
            <div class="cover-lines">
              <div class="line line-1" />
              <div class="line line-2" />
              <div class="line line-3" />
            </div>
            <div class="cover-corner" />
          </div>
          <div class="title-text">
            {{ getDisplayTitle(detail?.title) }}
          </div>
        </div>
      </div>
      <div class="book-meta">
        <h1 class="book-title">
          {{ detail?.title }}
        </h1>
        <p class="book-author">
          {{ detail?.author }}
        </p>
        <p class="book-publisher">
          出版社:{{ detail?.publisher }}
        </p>
        <div class="detail-link" @click="openDetail(detail)">
          <span>详细信息 »</span>
        </div>
      </div>
    </div>

    <!-- 可用性统计 -->
    <div class="availability-stats">
      <div class="stat-item">
        <div class="stat-number">
          {{ detail?.items?.length }}
        </div>
        <div class="stat-label">
          总馆藏数
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-number">
          2
        </div>
        <div class="stat-label">
          在馆数
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-number">
          1
        </div>
        <div class="stat-label">
          借出数
        </div>
      </div>
    </div>

    <!-- 位置详情 -->
    <div class="location-details">
      <template v-for="item in data" :key="item.locationId">
        <h3 class="section-title">
          {{ item.locationName }}
        </h3>
        <div v-for="(child, index) in item.children" :key="index" class="location-item">
          <div class="location-row flex items-center justify-between">
            <span class="label">索书号:</span>
            <span class="value">
              <span class="value available">{{ child.processType }}</span>
              <span class="call-number">{{ child.callNo }}</span>
            </span>
          </div>
          <div class="location-row flex justify-between">
            <span class="label">条码号:</span>
            <span class="value">{{ child.barCode }}</span>
          </div>
          <div class="location-row flex justify-between">
            <span class="label">所属馆:</span>
            <span class="value">{{ item.locationName }}</span>
          </div>
        </div>
      </template>
      <div v-if="!detail?.items?.length" class="no-data mt--20">
        <div class="w-160 m-auto">
          <img class="w-100%" src="@/assets/image/book/nobook.png" alt="">
        </div>
        <p>暂无馆藏信息</p>
      </div>
    </div>

    <!-- 内容简介 -->
    <div class="content-summary">
      <h3 class="section-title">
        内容简介
      </h3>
      <div class="summary-text" v-html="detail?.description" />
    </div>
  </div>
</template>

<style scoped lang="less">
.book-detail {
  width: 375px;
  min-height: 100vh;
  padding: 10px;
  margin: 0 auto;
  background: linear-gradient( 180deg, #FFF 0%, #F4F8FF 100%);
  border-radius: 8px;
}

.book-info {
  display: flex;
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.book-cover {
  margin-right: 16px;

  .cover-image {
    position: relative;
    display: flex;
    width: 96px;
    height: 120px;
    padding: 8px;
    margin: 0 auto;
    font-weight: 600;
    line-height: 1.2;
    color: #fff;
    text-align: center;
    // 文字阴影增强立体感
    text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
    word-break: break-all;
    // 书籍纹理效果
    background-image:
      radial-gradient(circle at 20% 20%, rgb(255 255 255 / 5%) 1px, transparent 1px),
      radial-gradient(circle at 80% 80%, rgb(0 0 0 / 3%) 1px, transparent 1px),
      linear-gradient(45deg, transparent 30%, rgb(255 255 255 / 2%) 50%, transparent 70%);
    background-size: 8px 8px, 12px 12px, 20px 20px;
    border: 1px solid rgb(0 0 0 / 10%);
    border-radius: 4px;
    // 书籍立体效果
    box-shadow:
      0 4px 8px rgb(0 0 0 / 15%),
      0 2px 4px rgb(0 0 0 / 10%),
      inset 0 1px 0 rgb(255 255 255 / 20%);
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    // 书脊效果
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(to right,
        rgb(0 0 0 / 30%) 0%,
        rgb(0 0 0 / 10%) 50%,
        transparent 100%);
      border-radius: 2px 0 0 2px;
      content: '';
    }
    // 书页效果
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom,
        rgb(255 255 255 / 30%) 0%,
        rgb(255 255 255 / 10%) 50%,
        transparent 100%);
      border-radius: 0 2px 2px 0;
      content: '';
    }
    // 默认封面装饰
    .book-cover-decoration {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          pointer-events: none;

          .cover-lines {
            position: absolute;
            top: 12px;
            right: 8px;
            left: 8px;

            .line {
              height: 1px;
              margin-bottom: 6px;
              background: linear-gradient(to right,
                transparent 0%,
                rgb(255 255 255 / 30%) 20%,
                rgb(255 255 255 / 50%) 50%,
                rgb(255 255 255 / 30%) 80%,
                transparent 100%);
              border-radius: 1px;

              &.line-1 {
                width: 60%;
              }

              &.line-2 {
                width: 45%;
                margin-left: 8px;
              }

              &.line-3 {
                width: 70%;
                margin-left: 4px;
              }
            }
          }

          .cover-corner {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg,
              rgb(255 255 255 / 20%) 0%,
              transparent 50%);
            border: 1px solid rgb(255 255 255 / 40%);
            border-radius: 2px;

            &::before {
              position: absolute;
              top: 2px;
              left: 2px;
              width: 6px;
              height: 6px;
              border: 1px solid rgb(255 255 255 / 30%);
              border-radius: 1px;
              content: '';
            }
          }
        }
    // 标题文字容器
    .title-text {
      position: relative;
      z-index: 2;
      max-width: 100%;
      overflow: hidden;
      // 文字描边效果
      -webkit-text-stroke: 0.5px rgb(0 0 0 / 20%);
      text-stroke: 0.5px rgb(0 0 0 / 20%);
    }

    .cover-bg {
      position: relative;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      border-radius: 4px;
    }

    .ebook-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 2px 4px;
      font-size: 10px;
      color: #fff;
      background: #ff4757;
      border-radius: 2px;
      transform: rotate(90deg);
      transform-origin: center;
    }
  }
}

.book-meta {
  flex: 1;

  .book-title {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: #333;
  }

  .book-author {
    font-size: 14px;
    color: #666;
  }

  .book-publisher {
    margin-top: 20px;
    margin-bottom: 16px;
    font-size: 12px;
    color: #999;
  }

  .detail-link {
    span {
      font-size: 14px;
      color: #1890ff;
      cursor: pointer;
    }
  }
}

.availability-stats {
  display: flex;
  padding: 20px 16px;
  // border-bottom: 1px solid #f0f0f0;

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-number {
      margin-bottom: 4px;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }
  }
}

.location-details {
  padding: 16px;
  background: #fff;
  border-radius: 8px;

  .section-title {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #000;
  }

  .location-item {
    padding: 12px;
    margin-bottom: 12px;
    background: #f8f9fa;
    border-radius: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .location-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 60px;
        font-size: 14px;
        color: #666;
        flex-shrink: 0;
      }

      .value {
        font-size: 14px;
        color: #333;
        vertical-align: middle;

        &.available {
          width: 28px;
          height: 14px;
          padding: 4px;
          // margin-top: -2px;
          margin-right: 8px;
          font-size: 10px;
          // line-height: 10px;
          color: #1890ff;
          background: #EAEFFE;
          border-radius: 2px;
        }
      }

      .call-number {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.content-summary {
  padding: 16px;
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;

  .section-title {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #000;
  }

  .summary-text {
    font-size: 14px;
    line-height: 1.6;
    color: #666;
    text-align: justify;
  }
}

.no-data{
  p {
    margin-top: -24px;
    margin-bottom: 30px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #333;
    text-align: center;
  }
}
</style>
