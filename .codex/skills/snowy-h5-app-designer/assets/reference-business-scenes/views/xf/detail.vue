<script setup lang='ts'>
import type { IClientXf } from '@/api/xf/types'
import dayjs from 'dayjs'
import { useStorage } from '@/hooks/system/useStorage'

const detail = useStorage.ss.get('xfDetail') as IClientXf
</script>

<template>
  <div class="detail p-10">
    <div class="card">
      <div class="shop">
        <div class="tx">
          <img class="w-full h-full" src="@/assets/image/default-shop.png" alt="">
        </div>
        <div class="title mt-12">
          {{ detail?.payMerchant }}
        </div>
        <div class="price mt-15">
          {{ detail?.payAmount }}
        </div>
        <div class="status mt-8 mb-48">
          交易成功
        </div>
      </div>

      <div class="history px-14">
        <div>
          <div>支付时间</div>
          <div>{{ dayjs(detail?.payDate).format('YYYY.MM.DD') }} {{ detail?.payTime }}</div>
        </div>
        <div>
          <div>支付流水号</div>
          <div>{{ detail?.payId }}</div>
        </div>
        <div>
          <div>支付类型</div>
          <div>{{ detail?.payType }}</div>
        </div>
        <div>
          <div>备注</div>
          <div>{{ detail?.notes }}</div>
        </div>
        <!-- <div>
          <div>付款方式</div>
          <div>微信支付</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .detail {
    .card {
      width: 355px;
      height: 422px;
      padding: 44px 10px;
      background: #FFF;
      border-radius: 4px;

      .shop {
        text-align: center;
        border-bottom: 1px solid rgb(231 231 231 / 100%);

        .tx {
          width: 40px;
          height: 40px;
          margin: 0 auto;
          // background: #000;
        }

        .title {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #333;
        }

        .price {
          font-size: 24px;
          font-weight: 600;
          line-height: 33px;
          color: #333;
        }

        .status {
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #999;
        }
      }
    }

    .history {
      padding-top: 24px;

      >div {
        display: flex;
        margin-bottom: 16px;

        >div {
          &:first-child {
            width: 80px;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #666;
          }

          &:last-child {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #333;
          }
        }
      }
    }
  }
</style>
