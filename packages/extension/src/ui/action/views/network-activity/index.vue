<template>
  <div class="container">
    <custom-scrollbar
      class="network-activity__scroll-area"
      :settings="scrollSettings({ suppressScrollX: true })"
    >
      <div class="network-activity">
        <network-activity-total
          :crypto-amount="cryptoAmount"
          :fiat-amount="fiatAmount"
          :symbol="props.network.currencyName"
        />

        <network-activity-action v-bind="$attrs" />
        <div v-if="activities.length">
          <network-activity-transaction
            v-for="(item, index) in activities"
            :key="index + `${forceUpdateVal}`"
            :activity="item"
            :network="network"
          />
        </div>
        <!-- <div class="network-activity__header">July</div>

        <network-activity-transaction
          v-for="(item, index) in transactionsTwo"
          :key="index"
          :transaction="item"
        /> -->
      </div>
    </custom-scrollbar>

    <network-activity-loading
      v-if="activities.length === 0"
      :is-empty="isNoActivity"
    ></network-activity-loading>
  </div>
</template>

<script setup lang="ts">
import NetworkActivityTotal from "./components/network-activity-total.vue";
import NetworkActivityAction from "./components/network-activity-action.vue";
import NetworkActivityTransaction from "./components/network-activity-transaction.vue";
import CustomScrollbar from "@action/components/custom-scrollbar/index.vue";
import {
  computed,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  toRaw,
  toRef,
  watch,
} from "vue";
import { AccountsHeaderData } from "../../types/account";
import accountInfo from "@action/composables/account-info";
import { BaseNetwork } from "@/types/base-network";
import scrollSettings from "@/libs/utils/scroll-settings";

import {
  Activity,
  ActivityStatus,
  EthereumRawInfo,
  SubscanExtrinsicInfo,
} from "@/types/activity";
import NetworkActivityLoading from "./components/network-activity-loading.vue";
import { ProviderName } from "@/types/provider";
import ActivityState from "@/libs/activity-state";

const props = defineProps({
  network: {
    type: Object as PropType<BaseNetwork>,
    default: () => ({}),
  },
  accountInfo: {
    type: Object as PropType<AccountsHeaderData>,
    default: () => ({}),
  },
});

const { cryptoAmount, fiatAmount } = accountInfo(
  toRef(props, "network"),
  toRef(props, "accountInfo")
);

const forceUpdateVal = ref(0);
const isNoActivity = ref(false);
const activities = ref<Activity[]>([]);
const selectedAddress = computed(
  () => props.accountInfo.selectedAccount?.address || ""
);
const apiPromise = props.network.api();
const activityState = new ActivityState();

const activityCheckTimers: any[] = [];
const activityAddress = computed(() =>
  props.network.displayAddress(props.accountInfo.selectedAccount!.address)
);
const updateVisibleActivity = (activity: Activity): void => {
  activities.value.forEach((act, idx) => {
    if (act.transactionHash === activity.transactionHash) {
      activities.value[idx] = activity;
    }
  });
  forceUpdateVal.value++;
};

const checkActivity = (activity: Activity): void => {
  activity = toRaw(activity);
  const timer = setInterval(() => {
    apiPromise.then((api) => {
      api.getTransactionStatus(activity.transactionHash).then((info) => {
        if (info) {
          if (props.network.provider === ProviderName.ethereum) {
            const evmInfo = info as EthereumRawInfo;
            activity.status = evmInfo.status
              ? ActivityStatus.success
              : ActivityStatus.failed;
            activity.rawInfo = evmInfo;
            activityState
              .updateActivity(activity, {
                address: activityAddress.value,
                network: props.network.name,
              })
              .then(() => updateVisibleActivity(activity));
          } else if (props.network.provider === ProviderName.polkadot) {
            const subInfo = info as SubscanExtrinsicInfo;
            if (!subInfo.pending) {
              activity.status = subInfo.success
                ? ActivityStatus.success
                : ActivityStatus.failed;
              activity.rawInfo = subInfo;
              activityState
                .updateActivity(activity, {
                  address: activityAddress.value,
                  network: props.network.name,
                })
                .then(() => updateVisibleActivity(activity));
            }
          }
          clearInterval(timer);
        }
      });
    });
  }, 5000);
  activityCheckTimers.push(timer);
};
const selectedNetworkName = computed(() => props.network.name);
const setActivities = () => {
  activities.value = [];
  isNoActivity.value = false;
  if (props.accountInfo.selectedAccount)
    props.network.getAllActivity(activityAddress.value).then((all) => {
      activities.value = all;
      isNoActivity.value = all.length === 0;
      activities.value.forEach((act) => {
        if (act.status === ActivityStatus.pending) checkActivity(act);
      });
    });
  else activities.value = [];
};

watch([selectedAddress, selectedNetworkName], setActivities);
onMounted(() => {
  setActivities();
  activityCheckTimers.forEach((timer) => clearInterval(timer));
});
onUnmounted(() => {
  activityCheckTimers.forEach((timer) => clearInterval(timer));
});
</script>

<style lang="less" scoped>
@import "~@action/styles/theme.less";
@import "~@action/styles/custom-scroll.less";

.container {
  width: 100%;
  height: 600px;
  background-color: @white;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
  margin: 0;
  padding-top: 0;
  box-sizing: border-box;

  .deposit {
    left: 0;
  }
}

.network-activity {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  &__scroll-area {
    position: relative;
    margin: auto;
    width: 100%;
    max-height: 540px;
    margin: 0;
    padding: 68px 0 0 0 !important;
    box-sizing: border-box;
    .ps__rail-y {
      right: 3px !important;
      margin: 59px 0 !important;
    }
    &.ps--active-y {
      padding-right: 0;
    }
  }

  &__header {
    padding: 8px 20px 0 20px;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: @primaryLabel;
    margin: 0;
  }
}
</style>
