<script setup lang='ts'>
import dayjs from 'dayjs'

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  showDesc: {
    type: Boolean,
    default: false,
  },
  showPub: {
    type: Boolean,
    default: false,
  },
  showNum: {
    type: Boolean,
    default: false,
  },
  showFooterTime: {
    type: Boolean,
    default: false,
  },
})

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
</script>

<template>
  <div class="book-card p-12">
    <div class="flex justify-between relative">
      <div class="img">
        <div
          class="title-display"
          :style="{
            backgroundColor: getRandomColor(data?.title),
            fontSize: getFontSize(data?.title),
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
            {{ getDisplayTitle(data?.title) }}
          </div>
        </div>
      </div>
      <div class="text ml-12 flex-1">
        <h1>{{ data?.title }}</h1>
        <p class="author">
          {{ data?.author }}
        </p>

        <div :class="[showNum ? 'mt-7' : (showPub ? 'mt-24' : 'mt-12')]">
          <p v-if="showDesc" class="ellipsis-3">
            {{ data?.desc }}
          </p>
          <template v-if="showPub">
            <p>出版社：{{ data?.publisher }}</p>
            <p>出版日期：{{ data?.publishYear }}</p>
          </template>
          <p v-if="showNum" class="num">
            <van-icon name="manager" color="#999999" /> 借阅次数：{{ data.num }}
          </p>
        </div>
      </div>

      <slot name="right" />
    </div>
    <div v-if="showFooterTime" class="footer-time">
      <p>借出时间：{{ data?.loanDate }}</p>
      <p class="mt-4">
        应还时间：{{ data?.normReturnDate }}
      </p>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .book-card {
    position: relative;
    width: 355px;
    min-height: 136px;
    overflow: hidden;
    background: #FFF;
    border-radius: 8px;

    .img {
      width: 106px;
      height: 106px;

      .title-display {
        position: relative;
        display: flex;
        width: 80%;
        height: 100%;
        padding: 8px;
        margin: 0 auto;
        font-weight: 600;
        line-height: 1.2;
        color: white;
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
      }

      img {
        height: 100%;
      }
    }

    .text {
      h1 {
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        color: #333;
      }

      p {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #666;

        &.author {
          // min-height: 34px;
          margin-top: 4px;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #333;
        }

        &.num {
          display: inline-block;
          padding: 4px 11px;
          font-size: 12px;
          font-weight: 400;
          color: #999;
          text-align: center;
          background: #F6F6F6;
          border-radius: 20px;
        }
      }
    }

    .footer-time {
      padding: 8px 12px;
      margin-top: 12px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #666;
      background: #F4F8FF;
    }
  }
</style>
