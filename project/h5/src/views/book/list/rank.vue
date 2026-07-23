<script setup lang='ts'>
import dayjs from 'dayjs'
import { getBookRankListApi } from '@/api/book'
import { createApiPicker } from '@/components/OpenApiPicker'
import { requireImage } from '@/utils/require'
import BookCard from '@/views/book/components/card/index.vue'
import { useBookDetail } from '@/views/book/hooks'
import List from '@/views/index/components/List/index.vue'

const { openDetail } = useBookDetail()
async function loadData(params: any) {
  // 书籍排行榜数据
  const mockData = [
    {
      id: 1,
      title: '百年孤独',
      author: '加西亚·马尔克斯',
      desc: '魔幻现实主义的巅峰之作，讲述了布恩迪亚家族七代人的传奇故事。作品融合了拉丁美洲的历史与现实，展现了人类命运的复杂性和永恒性。',
      img: requireImage('image/book/book-img.png'),
      rank: 1,
    },
    {
      id: 2,
      title: '局外人',
      author: '阿尔贝·加缪',
      desc: '存在主义文学经典，通过默尔索的视角探讨了现代社会中人的异化、荒诞与真实。作品简洁而深刻，被誉为20世纪最重要的文学作品之一。',
      img: requireImage('image/book/book-img.png'),
      rank: 2,
    },
    {
      id: 3,
      title: '活着',
      author: '余华',
      desc: '中国当代文学经典，讲述了福贵跌宕起伏的人生故事。作品以平实的笔触描绘了普通人在历史洪流中的生存状态，深刻反映了人性的坚韧与生命的珍贵。',
      img: requireImage('image/book/book-img.png'),
      rank: 3,
    },
    {
      id: 4,
      title: '三体',
      author: '刘慈欣',
      desc: '中国科幻文学的里程碑之作，构建了宏大的宇宙观和文明观。作品融合了物理学、哲学和文学，探讨了人类文明在宇宙中的命运与选择。',
      img: requireImage('image/book/book-img.png'),
      rank: 4,
    },
    {
      id: 5,
      title: '红楼梦',
      author: '曹雪芹',
      desc: '中国古典文学巅峰之作，以贾宝玉、林黛玉的爱情悲剧为主线，展现了封建社会的兴衰变迁。作品人物形象丰满，情节结构严谨，被誉为"中国古典小说之最"。',
      img: requireImage('image/book/book-img.png'),
      rank: 5,
    },
    {
      id: 6,
      title: '1984',
      author: '乔治·奥威尔',
      desc: '反乌托邦文学经典，描绘了一个极权主义社会的恐怖图景。作品深刻揭示了权力与控制的本质，对现代政治和社会制度产生了深远影响。',
      img: requireImage('image/book/book-img.png'),
      rank: 6,
    },
    {
      id: 7,
      title: '小王子',
      author: '安托万·德·圣-埃克苏佩里',
      desc: '世界儿童文学经典，通过小王子的星际旅行，探讨了爱、生命、友谊等永恒主题。作品语言优美，寓意深刻，适合所有年龄段的读者。',
      img: requireImage('image/book/book-img.png'),
      rank: 7,
    },
    {
      id: 8,
      title: '人间失格',
      author: '太宰治',
      desc: '日本文学经典，以自传体形式展现了主人公叶藏内心的挣扎与痛苦。作品深刻反映了现代人的精神危机和生存困境，具有强烈的现实意义。',
      img: requireImage('image/book/book-img.png'),
      rank: 8,
    },
    {
      id: 9,
      title: '追风筝的人',
      author: '卡勒德·胡赛尼',
      desc: '阿富汗裔美国作家代表作，讲述了阿米尔与哈桑之间跨越阶级的友谊故事。作品以阿富汗的历史变迁为背景，深刻探讨了救赎、背叛与宽恕的主题。',
      img: requireImage('image/book/book-img.png'),
      rank: 9,
    },
    {
      id: 10,
      title: '白鹿原',
      author: '陈忠实',
      desc: '中国当代文学经典，以白鹿原上白、鹿两家的恩怨纠葛为主线，展现了关中平原半个世纪的历史变迁。作品具有浓郁的地域特色和深厚的历史内涵。',
      img: requireImage('image/book/book-img.png'),
      rank: 10,
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
  loadData: getBookRankListApi,
  resultField: 'list',
  pageSize: 10,
  notPageList: true,
  formatData: (data) => {
    return data.map((e, i) => {
      return {
        title: e.tm,
        author: e.zrz,
        desc: e.cbs,
        publisher: e.cbs,
        publishYear: e.cbn,
        callNos: [e.ssh],
        isbn: e.isbn,
        rank: i + 1,
        num: e.borrowNum,
      }
    })
  },
})

const searchForm = ref({
  beginTime: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endTime: dayjs().format('YYYY-MM-DD'),
  date: 1,
  _date: '最近一个月',
})

const { open } = createApiPicker({
  value: searchForm,
  field: 'date',
  showLabelField: '_date',
  props: {
    title: '日期选择',
    columns: [
      {
        text: '最近一个月',
        value: 1,
      },
      {
        text: '最近三个月',
        value: 2,
      },
      {
        text: '最近半年',
        value: 3,
      },
      {
        text: '最近一年',
        value: 4,
      },
    ],
  },
  onConfirm: () => {
    if (searchForm.value.date === 1) {
      searchForm.value.beginTime = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
      searchForm.value.endTime = dayjs().format('YYYY-MM-DD')
    }
    else if (searchForm.value.date === 2) {
      searchForm.value.beginTime = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
      searchForm.value.endTime = dayjs().format('YYYY-MM-DD')
    }
    else if (searchForm.value.date === 3) {
      searchForm.value.beginTime = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
      searchForm.value.endTime = dayjs().format('YYYY-MM-DD')
    }
    else if (searchForm.value.date === 4) {
      searchForm.value.beginTime = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
      searchForm.value.endTime = dayjs().format('YYYY-MM-DD')
    }
    listRef.value.refresh()
  },
})
</script>

<template>
  <div class="book-page">
    <div class="mj-header" @click="open">
      {{ searchForm._date }} <svg-icon name="down" color="#97A0B4" />
    </div>
    <List
      ref="listRef" :config="{
        ...config,
        params: searchForm,
      }"
      :empty-img="requireImage('image/index/empty.png')"
    >
      <template #default="{ data }">
        <BookCard :data="data" class="mb-8" :show-num="true" @click="openDetail(data)">
          <template #right>
            <div v-if="data.rank <= 3" class="rank-num">
              <img class="w-100%" :src="requireImage(`image/book/rank-${data.rank}.png`)" alt="">
            </div>
            <div v-else class="rank-num mt--8!">
              <p>{{ data.rank.toString().padStart(2, '0') }}</p>
            </div>
          </template>
        </BookCard>
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .book-page {
    padding: 10px;
    padding-top: 52px;

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

  .rank-num {
    width: 64px;
    margin-top: -8px;
    margin-right: -12px;
    font-size: 32px;
    font-weight: 600;
    line-height: 45px;
    color: #C4C6CD;
    text-align: center;
    flex-shrink: 0;
  }
</style>
