import { TX_TYPE } from '@/constant/index';

export const isMultisend = (item) => {
  return item?.type === TX_TYPE.multisend && item?.msg?.outputs?.length;
};

export const isRespondService = (item) => {
  return item?.type === TX_TYPE.respond_service && item?.msg?.request_id;
};

export const isDenomAndId = (item) => {
  if (item?.type === TX_TYPE.transfer_nft && item?.msg?.denom && item?.msg?.id) {
    return true;
  }

  const types = [TX_TYPE.burn_nft, TX_TYPE.edit_nft, TX_TYPE.mint_nft];

  return types.some((v) => item?.type === v);
};

export const isFeedNameAndCreator = (item) => {
  if (item?.type === TX_TYPE.create_feed && item?.msg?.feed_name && item?.msg?.creator) {
    return true;
  }

  const types = [TX_TYPE.start_feed, TX_TYPE.edit_feed, TX_TYPE.pause_feed];

  return types.some((v) => item?.type === v);
};

export const isConsumer = (item) => {
  return item?.type === TX_TYPE.request_rand && item?.msg?.consumer;
};

export const isClientId = (item) => {
  if (item?.type === TX_TYPE.update_client && item?.msg?.client_id) {
    return true;
  }

  const types = [TX_TYPE.create_client];

  return types.some((v) => item?.type === v);
};

export const isConsumerReqIdServiceName = (item) => {
  if (item?.msg?.consumer && item?.msg?.request_context_id && item?.msg?.service_name) {
    return true;
  }

  const types = [TX_TYPE.call_service, TX_TYPE.respond_service];

  return types.some((v) => item?.type === v);
};
