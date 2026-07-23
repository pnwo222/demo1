<script setup lang='ts'>
import dayjs from 'dayjs'
import { getBookNewListApi } from '@/api/book'
import { createApiPicker } from '@/components/OpenApiPicker'
import { requireImage } from '@/utils/require'
import BookCard from '@/views/book/components/card/index.vue'
import { useBookDetail } from '@/views/book/hooks'
import List from '@/views/index/components/List/index.vue'

const { openDetail } = useBookDetail()
async function loadData(params: any) {
  // 模拟数据
  const mockData = [
    {
      id: 1,
      title: '百年孤独',
      author: '加西亚·马尔克斯',
      desc: '魔幻现实主义的巅峰之作，布恩迪亚家族七代人的传奇故事，展现了拉丁美洲的历史变迁和人性百态。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 2,
      title: '活着',
      author: '余华',
      desc: '讲述了一个人和他的命运之间的友情，这是最为感人的友情，因为他们互相感激，同时也互相仇恨。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 3,
      title: '1984',
      author: '乔治·奥威尔',
      desc: '反乌托邦小说的经典之作，描绘了一个极权主义社会的恐怖图景，对现代政治和社会制度进行了深刻的反思。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 4,
      title: '红楼梦',
      author: '曹雪芹',
      desc: '中国古典四大名著之一，以贾、史、王、薛四大家族的兴衰为背景，展现了封建社会的种种矛盾和悲剧。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 5,
      title: '三体',
      author: '刘慈欣',
      desc: '中国科幻文学的里程碑作品，讲述了地球文明与三体文明的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 6,
      title: '平凡的世界',
      author: '路遥',
      desc: '以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛，刻画了社会各阶层众多普通人的形象。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 7,
      title: '围城',
      author: '钱钟书',
      desc: '中国现代文学史上的经典之作，以幽默讽刺的笔调，描绘了抗战初期知识分子的群相。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 8,
      title: '白夜行',
      author: '东野圭吾',
      desc: '日本推理小说大师东野圭吾的代表作，讲述了一个跨越19年的悬疑故事，展现了人性的复杂与黑暗。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 9,
      title: '解忧杂货店',
      author: '东野圭吾',
      desc: '温暖治愈的奇幻小说，通过一家神奇的杂货店，连接了过去与现在，展现了人与人之间的温情与救赎。',
      img: requireImage('image/demo/tx.png'),
    },
    {
      id: 10,
      title: '小王子',
      author: '安托万·德·圣-埃克苏佩里',
      desc: '法国文学经典，通过小王子的星际旅行，探讨了爱、友谊、责任等人生主题，适合所有年龄段的读者。',
      img: requireImage('image/demo/tx.png'),
    },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: mockData,
        total: 10,
      })
    }, 1000)
  })
}

const listRef = ref()

const config = ref({
  loadData: getBookNewListApi,
  resultField: 'list',
  notPageList: true,
  pageSize: 10,
  formatData: (data) => {
    return data.map((e) => {
      return {
        title: e.tm,
        author: e.zrz,
        desc: e.cbs,
        publisher: e.cbs,
        publishYear: e.cbn,
        callNos: [e.ssh],
        isbn: e.isbn,
      }
    })
  },
})

const searchForm = ref({
  // startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  // endDate: dayjs().format('YYYY-MM-DD'),
  // date: 1,
  // _date: '最近一个月',
  beginTime: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
})

// const { open } = createApiPicker({
//   value: searchForm,
//   field: 'date',
//   showLabelField: '_date',
//   props: {
//     title: '日期选择',
//     columns: [
//       {
//         text: '最近一个月',
//         value: 1,
//       },
//       {
//         text: '最近三个月',
//         value: 2,
//       },
//       {
//         text: '最近半年',
//         value: 3,
//       },
//       {
//         text: '最近一年',
//         value: 4,
//       },
//     ],
//   },
//   onConfirm: () => {
//     if (searchForm.value.date === 1) {
//       searchForm.value.startDate = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
//       searchForm.value.endDate = dayjs().format('YYYY-MM-DD')
//     }
//     else if (searchForm.value.date === 2) {
//       searchForm.value.startDate = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
//       searchForm.value.endDate = dayjs().format('YYYY-MM-DD')
//     }
//     else if (searchForm.value.date === 3) {
//       searchForm.value.startDate = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
//       searchForm.value.endDate = dayjs().format('YYYY-MM-DD')
//     }
//     else if (searchForm.value.date === 4) {
//       searchForm.value.startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
//       searchForm.value.endDate = dayjs().format('YYYY-MM-DD')
//     }
//     listRef.value.refresh()
//   },
// })
</script>

<template>
  <div class="book-page">
    <!-- <div class="mj-header" @click="open">
      {{ searchForm._date }} <svg-icon name="down" color="#97A0B4" />
    </div> -->
    <List
      ref="listRef" :config="{
        ...config,
        params: searchForm,
      }"
    >
      <template #default="{ data }">
        <BookCard :data="data" class="mb-8" show-desc @click="openDetail(data)" />
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .book-page {
    padding: 10px;
    // padding-top: 52px;

    .mj-header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      color: #333;
      text-align: center;
      background: #FFF;
    }

    .card {
      position: relative;
      padding: 12px 16px;
      padding-top: 0;
      margin-top: 10px;
      background: #fff;
      border-radius: 8px;

      .time {
        height: 40px;
        padding-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        line-height: 40px;
        color: #333;
        border-bottom: 1px solid #f7f7f7;
      }

      .title {
        position: relative;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #333;

        span {
          color: #666;
        }
      }

      .dot {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px 6px;
        font-size: 14px;
        color: #00B578;
        background: rgb(0 181 120 / 10%);
        border-radius: 4px;

        &.error {
          color: #858A99;
          background: #F3F3F4;
        }
      }
    }
  }
</style>
