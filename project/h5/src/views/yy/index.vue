<script setup lang='ts'>
import type { IVisitRecord } from '@/api/index/yy/types'
import dayjs from 'dayjs'
import { getVisitPage } from '@/api/index/yy'
import { useStorage } from '@/hooks/system/useStorage'
import router from '@/router'
import List from '@/views/index/components/List/index.vue'
import { auditStatusMap, reasonMap } from './data'

const listRef = ref()

const searchForm = ref({
  auditStatus: '',
})

const config = {
  loadData: getVisitPage,
  resultField: 'records',
  pageSize: 10,
}

function toDetail(record: IVisitRecord) {
  useStorage.ss.set('yyDetail', record)
  router.push({
    path: '/yy/detail',
  })
}

function changeTab(e) {
  console.log('[changeTab]', e)
  if (!e) {
    delete searchForm.value.auditStatus
  }
  else {
    searchForm.value.auditStatus = e
  }
  listRef.value.refresh()
}
</script>

<template>
  <div class="yy-page">
    <div class="yy-header">
      <van-tabs class="f-tab" :swipe-threshold="4" @change="changeTab">
        <van-tab title="全部" name="" />
        <van-tab title="已通过" :name="1" />
        <van-tab title="待被访人审核" :name="2" />
        <van-tab title="待部门领导审核" :name="3" />
        <van-tab title="未通过" :name="4" />
      </van-tabs>
    </div>
    <List
      ref="listRef" :config="{
        ...config,
        params: searchForm,
      }"
      empty-text="暂无记录"
    >
      <template #default="{ data }: { data: IVisitRecord }">
        <div class="card" @click="toDetail(data)">
          <div class="time flex items-center">
            <svg-icon class="mr-8" name="clock" :size="14" color="#4E6CB5" />
            {{ dayjs(data.startTime).format('YYYY.MM.DD') }} {{ data.estimateArrivalTime }}
          </div>
          <div class="big-title relative">
            <h1 class="elipsis w-200">
              {{ Number(data.visitFor) === 4 ? data.visitForExplain : reasonMap[data.visitFor] }}
            </h1>

            <div class="tag">
              <!-- <van-tag v-if="data.auditStatus === '2' || data.auditStatus === '3'" color="#F3F3F4" text-color="#858A99">
                {{ auditStatusMap[data.auditStatus] }}
              </van-tag> -->
              <van-tag v-if="data.auditStatus === '2' || data.auditStatus === '3'" color="rgba(0, 181, 120, .1)" text-color="rgba(0, 181, 120, 1)">
                {{ auditStatusMap[data.auditStatus] }}
              </van-tag>
              <van-tag v-else-if="data.auditStatus === '1'" color="rgba(0, 181, 120, .1)" text-color="rgba(0, 181, 120, 1)">
                {{ auditStatusMap[data.auditStatus] }}
              </van-tag>
              <van-tag v-else-if="data.auditStatus === '4'" color="#F3F3F4" text-color="#858A99">
                {{ auditStatusMap[data.auditStatus] }}
              </van-tag>
            </div>
          </div>
          <div class="title mt-10 px-16">
            <div>
              <span>被&nbsp;&nbsp;访&nbsp;&nbsp;人：</span>
              <span>{{ data.intervieweeName }}</span>
            </div>
            <div>
              <span>拜访日期：</span>
              <span>{{ dayjs(data.startTime).format('YYYY.MM.DD') }}</span>
            </div>
            <div>
              <span>拜访部门：</span>
              <span>{{ data.visitDept }}</span>
            </div>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .yy-page {
    padding: 10px;
    padding-top: 48px;

    .yy-header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 48px;
      font-size: 14px;
      font-weight: 400;
      line-height: 48px;
      color: #333;
      text-align: center;
      background: #FFF;
    }

    .card {
      position: relative;
      padding: 12px 0;
      padding-top: 0;
      margin-top: 10px;
      overflow: hidden;
      background: #fff;
      border-radius: 8px;

      .time {
        height: 32px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 32px;
        color: #1B3D96;
        background: linear-gradient( 94deg, rgb(77 143 255 / 40%) 0%, rgb(75 220 207 / 30%) 100%);
      }

      .title {
        position: relative;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #1B3D96;

        >div {
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            &:first-child {
              color: #666;
            }

            &:last-child {
              color: #333;
            }
          }
        }
      }

      .big-title {
        padding: 0 16px;
        margin-top: 16px;

        h1 {
          font-size: 18px;
          font-weight: 500;
          line-height: 25px;
          color: #333;
        }

        .tag {
          position: absolute;
          top: 0;
          right: 16px;

          :deep(.van-tag) {
            height: 23px;
            padding: 2px 8px;
            font-size: 14px;
            line-height: 23px;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
