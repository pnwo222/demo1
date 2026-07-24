<script setup lang='ts'>
import { getBookSearchApi } from '@/api/book/index'
import { useStorage } from '@/hooks/system/useStorage'
import router from '@/router'
// import { requireImage } from '@/utils/require'
import BookCard from '@/views/book/components/card/index.vue'
import { useBookFilter } from '@/views/book/hooks'
import List from '@/views/index/components/List/index.vue'

const { searchWord, searchFiled } = router.currentRoute.value.query

const searchForm = ref({
  ids: '1,2,3',
  isShow: false,
  searchWord,
  searchFiled,
})

const listRef = ref()

const config = ref({
  loadData: getBookSearchApi,
  resultField: 'records',
  pageSize: 10,
})

const { openFilter } = useBookFilter((selectedIds) => {
  searchForm.value.ids = selectedIds
  console.log(toRaw(searchForm.value))
  listRef.value.refresh()
})

const idsNum = computed(() => {
  return searchForm.value.ids.length
})

function openFilterData() {
  openFilter({
    list: [
      {
        title: '煮着',
        id: 1,
        children: [
          {
            title: '莎士比亚',
            value: 1,
          },
          {
            title: '莎士比亚',
            value: 2,
          },
          {
            title: '莎士比亚',
            value: 3,
          },
          {
            title: '莎士比亚',
            value: 4,
          },
          {
            title: '莎士比亚',
            value: 5,
          },
          {
            title: '莎士比亚',
            value: 6,
          },
          {
            title: '莎士比亚',
            value: 7,
          },
          {
            title: '莎士比亚',
            value: 9,
          },
          {
            title: '莎士比亚',
            value: 10,
          },
          {
            title: '莎士比亚',
            value: 8,
          },
          {
            title: '莎士比亚',
            value: 12,
          },
          {
            title: '莎士比亚',
            value: 13,
          },
          {
            title: '莎士比亚',
            value: 14,
          },
          {
            title: '莎士比亚',
            value: 15,
          },
          {
            title: '莎士比亚',
            value: 17,
          },
          {
            title: '莎士比亚',
            value: 18,
          },
          {
            title: '莎士比亚',
            value: 16,
          },
          {
            title: '莎士比亚',
            value: 19,
          },
        ],
      },
      {
        title: '主办社',
        id: 2,
        children: [
          {
            title: '莎士比亚',
            value: 21,
          },
          {
            title: '莎士比亚',
            value: 22,
          },

        ],
      },
      {
        title: '主办社2',
        id: 3,
        children: [
          {
            title: '莎士比亚',
            value: 24,
          },

        ],
      },
    ],
    defaultData: searchForm.value.ids,
  })
}

function handleSwitchChange(value: boolean) {
  listRef.value.refresh()
}

function toDetail(data: any) {
  useStorage.ss.set('bookDetail', data)
  router.push({
    path: '/book/detail',
    query: {
      id: data.id,
    },
  })
}
</script>

<template>
  <div class="mj-header">
    <div class="h-text flex items-center justify-between">
      <div class="text">
        共<span>{{ listRef?.state?.total }}</span>个检索结果
      </div>
      <!-- <div class="icon" :class="{ active: idsNum }" @click="openFilterData">
        筛选 <span v-if="idsNum">·{{ idsNum }}</span>
        <svg-icon name="filter" :size="16" :color="idsNum ? '#2D65F9' : '#999'" class="ml-4" />
      </div> -->
    </div>
    <div class="h-filter flex items-center mt-6">
      只显示馆藏 <van-switch v-model="searchForm.isShow" size="16" class="ml-8" @change="handleSwitchChange" />
    </div>
  </div>
  <div class="book-page">
    <List
      ref="listRef" :config="{
        ...config,
        params: searchForm,
      }"
      empty-text="暂无搜索结果"
      :empty-img="requireImage('image/index/empty.png')"
    >
      <template #default="{ data }">
        <BookCard :data="data" class="mb-8" :show-pub="true" @click="toDetail(data)" />
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .mj-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 800;
    width: 100%;
    height: 72px;
    padding: 10px 20px;
    background: #fff;

    .h-text {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #666;
    }

    .h-filter {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #666;
    }

    .text {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #333;

      >span {
        margin: 0 6px;
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        color: #333;
      }
    }

    .icon {
      &.active {
        color: #2D65F9;
      }
    }
  }

  .book-page {
    padding: 10px;
    padding-top: 82px;

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
