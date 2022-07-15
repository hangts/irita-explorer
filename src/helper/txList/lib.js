import { TX_TYPE } from '@/constant/index';

export const isMultisend = (item) => {
  return item?.type === TX_TYPE.multisend;
  // && item?.msg?.outputs?.length;
};

export const isRespondService = (item) => {
  return item?.type === TX_TYPE.respond_service;
  // && item?.msg?.request_id;
};

export const isDenomAndId = (item) => {
  const types = [TX_TYPE.burn_nft, TX_TYPE.edit_nft, TX_TYPE.mint_nft, TX_TYPE.transfer_nft];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.denom && item?.msg?.id;
};

export const isFeedNameAndCreator = (item) => {
  const types = [TX_TYPE.start_feed, TX_TYPE.edit_feed, TX_TYPE.pause_feed, TX_TYPE.create_feed];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.feed_name && item?.msg?.creator;
};

export const isConsumer = (item) => {
  return item?.type === TX_TYPE.request_rand;
  // && item?.msg?.consumer;
};

export const isClientId = (item) => {
  const types = [TX_TYPE.create_client, TX_TYPE.update_client];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.client_id;
};

export const isConsumerReqIdServiceName = (item) => {
  const types = [TX_TYPE.call_service, TX_TYPE.respond_service];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.consumer && item?.msg?.request_context_id && item?.msg?.service_name;
};

export const isIdSenderName = (item) => {
  return (
    item?.type === TX_TYPE.issue_denom
    // && item?.msg?.id && item?.msg?.name && item?.msg?.sender
  );
};

export const isChannelIdPortId = (item) => {
  const types = [
    TX_TYPE.channel_open_init,
    TX_TYPE.channel_open_confirm,
    TX_TYPE.channel_open_try,
    TX_TYPE.channel_open_ack,
  ];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.channel_id && item?.msg?.port_id;
};

export const isClientIdConnectionId = (item) => {
  const types = [
    TX_TYPE.connection_open_init,
    TX_TYPE.connection_open_confirm,
    TX_TYPE.connection_open_try,
    TX_TYPE.connection_open_ack,
  ];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.connection_id && item?.msg?.client_id;
};

export const isDigestDigestAlgo = (item) => {
  return (
    item?.type === TX_TYPE.create_record
    // && item?.msg?.contents?.length
    // && item?.msg?.contents[0]?.digest
    // && item?.msg?.contents[0]?.digest_algo
  );
};

export const isSymbolMinUnitOwner = (item) => {
  return (
    item?.type === TX_TYPE.issue_token
    // && item?.msg?.symbol
    // && item?.msg?.owner
    // && item?.msg?.min_unit
  );
};

export const isReceiver = (item) => {
  return item?.type === TX_TYPE.acknowledge_packet;
  // && item?.msg?.packet?.data?.receiver;
};

export const isSymbolOwner = (item) => {
  return item?.type === TX_TYPE.edit_token;
  // && item?.msg?.symbol && item?.msg?.owner;
};

export const isSymbolDstOwnerSrcOwner = (item) => {
  return (
    item?.type === TX_TYPE.transfer_token_owner
    // && item?.msg?.symbol
    // && item?.msg?.dst_owner
    // && item?.msg?.src_owner
  );
};

export const isSymbolOwner2 = (item) => {
  return (
    item?.type === TX_TYPE.mint_token
    // &&
    // item?.msg?.owner &&
    // item?.msg?.symbol &&
    // item?.msg?.amount &&
    // item?.msg?.to
  );
};

export const isSymbolSender = (item) => {
  return (
    item?.type === TX_TYPE.burn_token
    // && item?.msg?.sender && item?.msg?.symbol && item?.msg?.amount
  );
};

export const isProposalIdOptionVoter = (item) => {
  return (
    item?.type === TX_TYPE.vote
    // && item?.msg?.option && item?.msg?.proposal_id && item?.msg?.voter
  );
};

export const isProposalIdDepositor = (item) => {
  return item?.type === TX_TYPE.deposit;
  // && item?.msg?.depositor && item?.msg?.proposal_id;
};

export const isTitle = (item) => {
  return item?.type === TX_TYPE.submit_proposal;
  // && item?.msg?.content?.title;
};

export const isConsumerRequestContextId = (item) => {
  const types = [
    TX_TYPE.pause_request_context,
    TX_TYPE.start_request_context,
    TX_TYPE.update_request_context,
    TX_TYPE.kill_request_context,
  ];
  const flag = types.some((v) => item?.type === v);

  return flag;
  // &&
  // item?.type === TX_TYPE.kill_request_context &&
  // item?.msg?.consumer &&
  // item?.msg?.request_context_id
};

export const isAuthorServiceName = (item) => {
  return item?.type === TX_TYPE.define_service;
  // && item?.msg?.author && item?.msg?.name;
};

export const isOwnerProviderServiceName = (item) => {
  const types = [
    TX_TYPE.bind_service,
    TX_TYPE.refund_service_deposit,
    TX_TYPE.disable_service_binding,
    TX_TYPE.enable_service_binding,
    TX_TYPE.update_service_binding,
  ];

  const flag = types.some((v) => item?.type === v);

  return flag;
  // && item?.msg?.owner && item?.msg?.provider && item?.msg?.service_name;
};

export const isServiceName = (item) => {
  return (
    item?.type === TX_TYPE.update_request_context
    // && item?.msg?.ex && item?.msg?.ex?.service_name
  );
};

export const isNftIdSenderDestChain = (item) => {
  return (
    item?.type === TX_TYPE.tibc_nft_transfer
    // &&
    // item?.msg?.id &&
    // item?.msg?.sender &&
    // item?.msg?.dest_chain
  );
};

export const isNftIdReceiverSourceChain = (item) => {
  return (
    item?.type === TX_TYPE.tibc_recv_packet
    // &&
    // item?.msg?.packet?.data?.id &&
    // item?.msg?.packet?.data?.receiver &&
    // item?.msg?.packet?.source_chain
  );
};

export const isNftIdSenderDestChain2 = (item) => {
  return (
    item?.type === TX_TYPE.tibc_acknowledge_packet
    // &&
    // item?.msg?.packet?.id &&
    // item?.msg?.packet?.data?.sender &&
    // item?.msg?.packet?.destination_chain
  );
};

export const isSequenceSourceChainSigner = (item) => {
  return (
    item?.type === TX_TYPE.clean_packet
    // &&
    // item?.msg?.clean_packet?.sequence &&
    // item?.msg?.clean_packet?.source_chain &&
    // item?.msg?.signer
  );
};

export const isSigner = (item) => {
  return item?.type === TX_TYPE.recv_clean_packet;
  // && item?.msg?.signer;
};

export const isChainNameSigner = (item) => {
  return item?.type === TX_TYPE.tibc_update_client;
  // && item?.msg?.chain_name && item?.msg?.signer;
};

export const isSenderReceiverDenomId = (item) => {
  return (
    item?.type === TX_TYPE.transfer_denom
    // &&
    // item?.msg?.id &&
    // item?.msg?.sender &&
    // item?.msg?.recipient
  );
};
