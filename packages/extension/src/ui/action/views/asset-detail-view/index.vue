<template>
  <div class="asset-detail-view__container">
    <div class="asset-detail-view__overlay" @click="close()"></div>
    <div class="asset-detail-view__wrap">
      <a class="asset-detail-view__close" @click="close()">
        <close-icon />
      </a>

      <div class="asset-detail-view__token-info">
        <img :src="token.icon" />

        <div class="asset-detail-view__token-info-name">
          <h4>{{ token.name }}</h4>
          <p>{{ token.symbol }}</p>
        </div>
      </div>

      <div
        v-if="token.priceChangePercentage !== 0"
        class="asset-detail-view__token-sparkline"
      >
        <img :src="token.sparkline" />

        <div
          v-if="token.priceChangePercentage !== 0"
          class="asset-detail-view__token-sparkline-price"
        >
          <h4>${{ token.valuef }}</h4>
          <p
            :class="{
              down: token.priceChangePercentage < 0,
              up: token.priceChangePercentage >= 0,
            }"
          >
            <sparkline-up v-if="token.priceChangePercentage >= 0" />
            <sparkline-down v-if="token.priceChangePercentage < 0" />

            {{ token.priceChangePercentage.toFixed(2) }}%
          </p>
        </div>
      </div>

      <div class="asset-detail-view__token-divider"></div>

      <div class="asset-detail-view__token-balance">
        <h6>Balance</h6>
        <h4>
          {{ token.balancef }} <span>{{ token.symbol }}</span>
        </h4>
        <p>${{ token.balanceUSDf }}</p>
      </div>

      <!-- <div class="asset-detail-view__action">
        <action-menu></action-menu>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import CloseIcon from "@action/icons/common/close-icon.vue";
import SparklineUp from "@action/icons/asset/sparkline-up.vue";
import SparklineDown from "@action/icons/asset/sparkline-down.vue";
// import ActionMenu from "@action/components/action-menu/index.vue";
import { AssetsType } from "@/types/provider";

defineProps({
  token: {
    type: Object as PropType<AssetsType>,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  (e: "close:popup"): void;
}>();
const close = () => {
  emit("close:popup");
};
</script>

<style lang="less">
@import "~@action/styles/theme.less";

.asset-detail-view {
  width: 100%;
  height: auto;
  box-sizing: border-box;

  &__wrap {
    background: @white;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.039),
      0px 7px 24px rgba(0, 0, 0, 0.19);
    border-radius: 12px;
    box-sizing: border-box;
    width: 360px;
    height: auto;
    z-index: 107;
    position: relative;
    height: auto;
    overflow-x: hidden;
    padding: 24px;
  }

  &__container {
    width: 800px;
    height: 600px;
    left: 0;
    top: 0px;
    position: fixed;
    z-index: 105;
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  &__overlay {
    background: rgba(0, 0, 0, 0.32);
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    position: absolute;
    z-index: 106;
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 300ms ease-in-out;
    font-size: 0;

    &:hover {
      background: @black007;
    }
  }

  &__token {
    &-info {
      display: flex;
      box-sizing: border-box;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;

      img {
        width: 48px;
        height: 48px;
        box-shadow: inset 0px 0px 1px rgba(0, 0, 0, 0.16);
        border-radius: 100%;
        margin-right: 16px;
      }

      &-name {
        h4 {
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          color: @primaryLabel;
          margin: 0;
        }

        p {
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.5px;
          color: @secondaryLabel;
          margin: 0;
          text-transform: uppercase;
        }
      }
    }
    &-sparkline {
      display: flex;
      box-sizing: border-box;
      justify-content: flex-start;
      align-items: center;
      flex-direction: row;
      margin-top: 16px;

      img {
        width: 48px;
        margin-right: 16px;
      }

      &-price {
        h4 {
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          color: @primaryLabel;
          margin: 0;
        }
        p {
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0.5px;
          margin: 0;
        }
      }
    }
    &-divider {
      margin: 24px 0 24px -24px;
      height: 1px;
      width: calc(~"100% + 48px");
      background: @gray02;
    }
    &-balance {
      margin: 0 0 16px 0;

      h6 {
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        letter-spacing: 0.15px;
        color: @primaryLabel;
        margin: 0;
      }
      h4 {
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 32px;
        color: @primaryLabel;
        margin: 0;

        span {
          font-variant: small-caps;
        }
      }
      p {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        margin: 0;
        color: @secondaryLabel;
      }
    }
  }
  &__action {
    margin: 0 0 -12px -12px;
    width: calc(~"100% + 24px");
  }
}
</style>
