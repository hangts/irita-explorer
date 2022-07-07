import Vue from 'vue';
import VueI18n from 'vue-i18n';
import prodConfig from '../productionConfig.js';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: prodConfig.lang == 'EN' ? 'EN' : 'CN',
  messages: {
    CN: require('../../lang/CN-Cindy'),
    EN: require('../../lang/EN-Cindy'),
  },
});
export const EVENTS_TYPE = {
  writeAcknowledgement: 'write_acknowledgement',
  packet_ack: 'packet_ack',
};
// 链上
export const TX_TYPE = {
  // service
  define_service: 'define_service',
  bind_service: 'bind_service',
  call_service: 'call_service',
  respond_service: 'respond_service',
  update_service_binding: 'update_service_binding',
  disable_service_binding: 'disable_service_binding',
  enable_service_binding: 'enable_service_binding',
  refund_service_deposit: 'refund_service_deposit',
  pause_request_context: 'pause_request_context',
  start_request_context: 'start_request_context',
  kill_request_context: 'kill_request_context',
  update_request_context: 'update_request_context',
  service_set_withdraw_address: 'service/set_withdraw_address',
  withdraw_earned_fees: 'withdraw_earned_fees',
  // Record
  create_record: 'create_record',
  // nft
  burn_nft: 'burn_nft',
  transfer_nft: 'transfer_nft',
  edit_nft: 'edit_nft',
  issue_denom: 'issue_denom',
  mint_nft: 'mint_nft',
  // 新增
  transfer_denom: 'transfer_denom', // 新增

  // Token
  issue_token: 'issue_token',
  edit_token: 'edit_token',
  mint_token: 'mint_token',
  transfer_token_owner: 'transfer_token_owner',
  burn_token: 'burn_token',

  // Bank
  send: 'send',
  multisend: 'multisend',
  // Crisis
  verify_invariant: 'verify_invariant',
  // Evidence
  submit_evidence: 'submit_evidence',
  // Staking
  begin_unbonding: 'begin_unbonding',
  edit_validator: 'edit_validator',
  create_validator: 'create_validator',
  delegate: 'delegate',
  begin_redelegate: 'begin_redelegate',
  // Slashing
  unjail: 'unjail',
  // Distribution
  set_withdraw_address: 'set_withdraw_address',
  withdraw_delegator_reward: 'withdraw_delegator_reward',
  withdraw_validator_commission: 'withdraw_validator_commission',
  fund_community_pool: 'fund_community_pool',
  // Gov
  deposit: 'deposit',
  vote: 'vote',
  submit_proposal: 'submit_proposal',
  // Coinswap
  add_liquidity: 'add_liquidity',
  remove_liquidity: 'remove_liquidity',
  swap_order: 'swap_order',
  // Htlc
  create_htlc: 'create_htlc',
  claim_htlc: 'claim_htlc',
  // refund_htlc: 'refund_htlc', //删除
  // Guardian
  add_profiler: 'add_profiler',
  delete_profiler: 'delete_profiler',
  add_trustee: 'add_trustee',
  delete_trustee: 'delete_trustee',
  // Oracle
  create_feed: 'create_feed',
  start_feed: 'start_feed',
  pause_feed: 'pause_feed',
  edit_feed: 'edit_feed',

  // Identity
  create_identity: 'create_identity',
  update_identity: 'update_identity',
  // IBC
  transfer: 'transfer',
  timeout_packet: 'timeout_packet',
  recv_packet: 'recv_packet', // 和公有链ibc交易类型名称一致
  create_client: 'create_client', // 和公有链ibc交易类型名称一致
  update_client: 'update_client', // 和公有链ibc交易类型名称一致

  // IBC => Other
  // create_client: 'create_client',
  // update_client: 'update_client',

  upgrade_client: 'upgrade_client',
  submit_misbehaviour: 'submit_misbehaviour',
  connection_open_init: 'connection_open_init',
  connection_open_try: 'connection_open_try',
  connection_open_ack: 'connection_open_ack',
  connection_open_confirm: 'connection_open_confirm',
  channel_open_init: 'channel_open_init',
  channel_open_try: 'channel_open_try',
  channel_open_ack: 'channel_open_ack',
  channel_open_confirm: 'channel_open_confirm',
  channel_close_init: 'channel_close_init',
  channel_close_confirm: 'channel_close_confirm',
  timeout_on_close_packet: 'timeout_on_close_packet',
  acknowledge_packet: 'acknowledge_packet',

  // Random
  request_rand: 'request_rand',

  // TiBC
  tibc_nft_transfer: 'tibc_nft_transfer',
  tibc_recv_packet: 'tibc_recv_packet',
  tibc_acknowledge_packet: 'tibc_acknowledge_packet',
  clean_packet: 'clean_packet',
  recv_clean_packet: 'recv_clean_packet',
  tibc_update_client: 'tibc_update_client',

  // Farm
  stake: 'stake',
  unstake: 'unstake',
  harvest: 'harvest',
  create_pool: 'create_pool',
  create_pool_with_community_pool: 'create_pool_with_community_pool',
  destroy_pool: 'destroy_pool',
  adjust_pool: 'adjust_pool',

  // EVM智能合约
  bsn_ddc: 'ethereum_tx',
  ddc_721: 'ddc_721',
  ddc_1155: 'ddc_1155',
  ddc_other: 'ddc_other',

  // Fee grant 链账户授权
  grant_allowance: 'grant_allowance',
  revoke_allowance: 'revoke_allowance',
};

// 展示 abandon
export const TX_TYPE_DISPLAY = {
  // Smart contract
  bsn_ddc: 'BSN-DDC 合约',
  ddc_721: 'BSN-DDC 721 Official contract',
  ddc_1155: 'BSN-DDC 1155 Official contract',
  ddc_other: 'BSN-Other',
  // farm
  stake: 'Stake',
  unstake: 'Unstake',
  harvest: 'Harvest',
  create_pool: 'Create Pool',
  create_pool_with_community_pool: 'Create Pool With Community Pool',
  destroy_pool: 'Destroy Pool',
  adjust_pool: 'Adjust Pool',

  // service
  define_service: 'Define Service',
  bind_service: 'Bind Service',
  call_service: 'Call Service',
  respond_service: 'Respond Service',
  update_service_binding: 'Update Service Binding',
  disable_service_binding: 'Disable Service Binding',
  enable_service_binding: 'Enable Service Binding',
  refund_service_deposit: 'Refund Service Deposit',
  pause_request_context: 'Pause Request Context',
  start_request_context: 'Start Request Context',
  kill_request_context: 'Kill Request Context',
  update_request_context: 'Update Request Context',
  'service/set_withdraw_address': 'Service Set Withdraw Address',
  withdraw_earned_fees: 'Withdraw Earned Fees',
  // Record
  create_record: 'Create Record',
  // nft
  burn_nft: 'NFT Burn',
  transfer_nft: 'NFT Transfer',
  edit_nft: 'NFT Edit',
  issue_denom: 'Denom Issue ',
  mint_nft: 'NFT Mint',
  transfer_denom: 'Denom Transfer', // 新增

  // Token
  issue_token: 'Issue Token',
  edit_token: 'Edit Token',
  mint_token: 'Mint Token',
  transfer_token_owner: 'Transfer Token Owner',
  burn_token: 'Burn Token',
  // Bank
  send: 'Transfer',
  multisend: 'Multi Send',
  // Crisis
  verify_invariant: 'VerifyInvariant',
  // Evidence
  submit_evidence: 'SubmitEvidence',
  // Staking
  begin_unbonding: 'Undelegate',
  edit_validator: 'Edit Validator',
  create_validator: 'Create Validator',
  delegate: 'Delegate',
  begin_redelegate: 'Begin Redelegate',
  // Slashing
  unjail: 'Unjail',
  // Distribution
  set_withdraw_address: 'Set Withdraw Address',
  withdraw_delegator_reward: 'Withdraw Reward',
  withdraw_validator_commission: 'Withdraw Commission',
  fund_community_pool: 'Fund Community Pool',
  // Gov
  deposit: 'Deposit',
  vote: 'Vote',
  submit_proposal: 'Submit Proposal',
  // Coinswap
  add_liquidity: 'Add Liquidity',
  remove_liquidity: 'Remove Liquidity',
  swap_order: 'Swap Order',
  // Htlc
  create_htlc: 'Create Hash Lock',
  claim_htlc: 'Claim Hash Lock',
  // refund_htlc: 'RefundHTLC', // 删除
  // Guardian
  add_profiler: 'AddProfiler',
  delete_profiler: 'DeleteProfiler',
  add_trustee: 'AddTrustee',
  delete_trustee: 'DeleteTrustee',
  // Oracle
  create_feed: 'Create Feed',
  start_feed: 'Start Feed',
  pause_feed: 'Pause Feed',
  edit_feed: 'Edit Feed',
  // CrossChain 联盟链
  recv_packet: 'IBC Transfer In', // 和公有链ibc交易类型名称一致
  create_client: 'IBC Create Client', // 和公有链ibc交易类型名称一致
  update_client: 'IBC Update Client', // 和公有链ibc交易类型名称一致
  // Identity
  create_identity: 'CreateIdentity',
  update_identity: 'UpdateIdentity',
  // IBC
  transfer: 'IBC Transfer Out',
  timeout_packet: 'IBC Timeout Packet',
  // recv_packet: 'recv_packet',

  // IBC => Other
  // create_client: 'create_client',
  // update_client: 'update_client',
  upgrade_client: 'IBC Upgrade Client',
  submit_misbehaviour: 'IBC Submit Misbehaviour',
  connection_open_init: 'IBC Connection Open Init',
  connection_open_try: 'IBC Connection Open Try',
  connection_open_ack: 'IBC Connection Open Ack',
  connection_open_confirm: 'IBC Connection Open Confirm',
  channel_open_init: 'IBC Channel Open Init',
  channel_open_try: 'IBC Channel Open Try',
  channel_open_ack: 'IBC Channel Open Ack',
  channel_open_confirm: 'IBC Channel Open Confirm',
  channel_close_init: 'IBC Channel Close Init',
  channel_close_confirm: 'IBC Channel Close Confirm',
  timeout_on_close_packet: 'IBC Timeout On Close Packet',
  acknowledge_packet: 'IBC Acknowledge Packet',

  // Random
  request_rand: 'Request Rand',
  // TiBC
  tibc_nft_transfer: 'TIBC NFT Transfer Out',
  tibc_recv_packet: 'TIBC NFT Transfer In',
  tibc_acknowledge_packet: 'TIBC Acknowledge Packet',
  clean_packet: 'TIBC Clean Packet Out',
  recv_clean_packet: 'TIBC Clean Packet In',
  tibc_update_client: 'TIBC Update Client',
};

export const LEVEL_TX_TYPE = {
  SmartContract: 'Smart Contract',
  Farm: 'Farm',
  Transfer: 'Transfer',
  Staking: 'Staking',
  iService: 'iService',
  NFT: 'NFT',
  TIBC: 'TIBC', // 新增
  Coinswap: 'Coinswap',
  Identity: 'Identity',
  IBC: 'IBC',
  HTLC: 'Hash Lock',
  Oracle: 'Oracle',
  Random: 'Random',
  Record: 'Record',
  Asset: 'Asset',
  Gov: 'Gov',
  Other: 'Others',
  crossChain: 'CrossChain',
  Feegrant: 'Fee Grant',
};

export const TX_STATUS = {
  success: 1,
  fail: 0,
};

export const ValidatorStatus = {
  bonded: 'bonded',
  unbonding: 'unbonding',
  unbonded: 'unbonded',
};

export const ColumnMinWidth = {
  txHash: '135',
  txHashShort: '113', // Validator Details
  addressTxHash: '135',
  respondHash: '138',
  requestHash: '138',
  blockHeight: '85',
  blockListHeight: '85',
  txType: '258',
  minTxType: '150',
  govTxType: '120',
  address: '165',
  iaaAddress: '139',
  time: prodConfig.isShowUTC === false ? '158' : '205',
  txn: '115',
  blockAge: '150',
  // validatirName: '120',
  validatirName: '155',
  votingPower: '120',
  publickKey: '450',
  denom: '150',
  tokenId: '120',
  denomId: '150',
  schema: '380',
  URI: '260',
  respondTimes: '129',
  available: '100',
  qos: '195',
  // requestId: '150',
  requestId: '155',
  state: '127',
  serviceName: '135',
  No: '50',
  price: '120',
  deposit: '120',
  nftCount: '100',
  identity: '300',
  idPubKey: '220',
  idPubKeyFull: '650',
  pubKeyAlgo: '120',
  certificate: '220',
  certificateFull: '650',
  credentials: '220',
  commission: '110',
  bondedTokens: '155',
  uptime: '100',
  // selfBond: '125',
  selfBond: '130',
  delegators: '121',
  bondHeight: '122',
  unbondingHeight: '155',
  // amount: '115',
  amount: '130',
  amountAndDenom: '150',
  delegationsAmount: '165',
  delegationTxsAmount: '155',
  delegationTxsFrom: '146',
  shares: '251',
  fee: '160',
  // fee: '100',
  // feeAndDenom: "110",
  consensus: '340',
  proposerPriority: '200',
  message: '90',
  validatorMoniker: '150',
  validatorSelfBond: '150',
  nftListDenom: '100',
  nftListDate: '280',
  // timestamp: '145',
  timestamp: prodConfig.isShowUTC === false ? '158' : '205',
  symbol: '121',
  assetListowner: '430',
  totalSupply: '160',
  maxSupply: '150',
  mintable: '120',
  proposalId: '56',
  proposalID: '105',
  proposalTitle: '185',
  proposalType: '173',
  proposalStatusIcon: '133',
  proposalStatus: '115',
  strip: '120',
  voteOption: '120',
  submited: '128',
  proposer: '245',
  validatorValue: '120',
  votingPowerValue: '120',
  ownerDetailDelegationsAmount: '135',
  listDenom: '60',
};

export const ModuleMap = {
  100: {
    title: '区块浏览',
    link: '/blocks',
  },
  101: {
    title: '交易浏览',
    link: '/txs',
  },
  102: {
    title: '共识节点',
    link: '/validators',
  },
  103: {
    title: '数据对象',
    link: '/nftAsset',
  },
  104: {
    title: '数据类别',
    link: '/denoms',
  },
  105: {
    title: '服务浏览',
    link: '/services',
  },
  106: {
    title: '身份ID',
    link: '/identities',
  },
  107: {
    title: 'Validators',
    link: '/staking',
  },
  108: {
    title: 'Delegation Txs',
    link: '/txs/delegations',
  },
  109: {
    title: 'Validation Txs',
    link: '/txs/validations',
  },
  110: {
    title: 'Native Asset',
    link: '/assets/ntvassets',
  },
  111: {
    title: 'Native Asset',
    link: '/assets/ntvassetstxs',
  },
  112: {
    title: 'Proposals',
    link: '/gov/proposals',
  },
  113: {
    title: 'Gov Txs',
    link: '/txs/governance',
  },
  114: {
    title: '${mainToken} Rich List',
    link: '/stats/rich',
  },
  115: {
    title: '${mainToken} Stats',
    link: '/stats/stats',
  },
  117: {
    title: 'BSN-DDC',
    link: '/ddc',
  },
};
export const NETWORK_ICON = {
  'Mainnet IRISHUB': 'iconfont iconiris',
  'Testnet FUXI': 'iconfont iconfuxi1',
  'Testnet NYANCAT': 'iconfont iconcaihongmao',
  'Testnet GOZ': 'iconfont iconGOZ',
  'Testnet BIFROST': 'iconfont iconBI-01',
  'Testnet STARGATE': 'iconfont iconStargate',
  'Mainnet CosmosHub': 'iconfont iconCosmosHub',
  'Mainnet WenChang': 'iconfont iconBianjie_wenchanglian_Logo-02',
  'Testnet IRITA': 'iconfont iconxingzhuangjiehe1',
  'Mainnet DaTang': 'iconfont iconhuaban',
  'Testnet DaTang': 'iconfont iconhuaban',
};
export const CHAIN_ICON = {
  Bifrost: { icon: 'iconfont iconBI-01' },
  STARGATE: { icon: 'iconfont iconStargate' },
  'Cosmos Hub': { icon: 'iconfont iconCosmosHub' },
  NYANCAT: { icon: 'iconfont iconcaihongmao' },
  IRISHUB: { icon: 'iconfont iconiris' },
  WENCHANG:{ icon: 'iconfont iconBianjie_wenchanglian_Logo-02' },
  datangchain: {icon:'iconfont iconhuaban'},
  WENCHANGTESTNET: {icon:'iconfont iconxingzhuangjiehe1'},
};
const CHAINID = {};
CHAINID.IRISHUB = 'Mainnet IRISHUB';
CHAINID.FUXI = 'Testnet FUXI';
CHAINID.NYANCAT = 'Testnet NYANCAT';
CHAINID.GOZTESTNET = 'Testnet GOZ';
CHAINID.BIFROST = 'Testnet BIFROST';
CHAINID.STARGATE = 'Testnet STARGATE';
CHAINID.COSMOSHUB = 'Mainnet CosmosHub';
CHAINID.WENCHANG = 'Mainnet WenChang';
CHAINID.IRITA = 'Testnet IRITA';
CHAINID.DATANGCHAINMAIN = 'Mainnet DaTang';
CHAINID.DATANGCHAINTESTNET = 'Testnet DaTang';

export const pageTitleConfig = {
  BlockchainBlocks: 'Block List',
  BlockchainBlocksBlockDetails: 'Block Details',
  BlockchainTransactions: 'Transaction List',
  BlockchainTransactionsTransactionDetails: 'Transaction Details',
  StakingValidators: 'Validator List',
  StakingValidatorsValidatorDetails: 'Validator Details',
  StakingDelegationTxs: 'Delegation Txs List',
  StakingValidationTxs: 'Validation Txs List',
  Transfer: 'Transfer List',
  AssetNativeAsset: 'Native Asset List',
  AssetNativeAssetTxs: 'Native Asset Txs List',
  GovParameters: 'Parameter List',
  GovProposals: 'Proposal List',
  GovProposalsProposalDetails: 'Proposal Details',
  GovGovTxs: 'Gov Txs List',
  StatsRichList: '${mainToken} Rich List',
  StatsRichListAddress: 'Address',
  StatsStats: '${mainToken} Stats Analyse',
};

export const PubKeyAlgorithm = {
  0: 'UnknownPubKeyAlgorithm',
  1: 'RSA',
  2: 'DSA',
  3: 'ECDSA',
  4: 'ED25519',
  5: 'SM2',
};

export const TxStatus = {
  0: 'Fail',
  1: 'Success',
};

export const numFormat = {
  num: '0.00',
};

export const validator_Status = {
  active: 'Active',
  candidate: 'Candidate',
  jailed: 'Jailed',
};

export const decimals = {
  amount: 2,
  fee:
    prodConfig.fee && (prodConfig.fee.decimals || prodConfig.fee.decimals === 0)
      ? prodConfig.fee.decimals
      : 2,
  shares: 4,
};

export default {
  CHAINID,
};

export const monikerNum = {
  validatorList: 8,
  home: 12,
  otherTable: 11,
};

export const NFT_AND_DENOM_SPLIT_NUM = {
  num: 8,
  uriNum: 20,
};

export const proposalStatus = {
  passed: 'Passed',
  rejected: 'Rejected',
  votingPeriod: 'VotingPeriod',
  depositPeriod: 'DepositPeriod',
};

export const proposalType = {
  ParameterChangeProposal: 'ParameterChange',
  SoftwareUpgradeProposal: 'SoftwareUpgrade',
  CancelSoftwareUpgradeProposal: 'CancelSoftwareUpgrade',
  CommunityPoolSpendProposal: 'CommunityPoolSpend',
  TextProposal: 'Text',
};

export const voteOptions = {
  1: 'yes',
  2: 'abstain',
  3: 'no',
  4: 'no_with_veto',
};

export const formatVoteOptions = {
  yes: 'Yes',
  abstain: 'Abstain',
  no: 'No',
  no_with_veto: 'NoWithVeto',
};

// 需和配置文件的产品名一致
export const product = {
  bifrost: 'Bifrost',
  stargate: 'STARGATE',
  cosmosHub: 'Cosmos Hub',
  nyancat: 'NYANCAT',
  irishub: 'IRISHUB',
  cschainOtc: 'CSChain-OTC',
  datangchain: 'datangchain',
};

export const ibcDenomPrefix = 'ibc/';

export const DISTRIBUTION = {
  '1-5': {
    name: 'No. 1-5',
  },
  '6-10': {
    name: 'No. 6-10',
  },
  '11-50': {
    name: 'No. 11-50',
  },
  '51-100': {
    name: 'No. 51-100',
  },
  '101-500': {
    name: 'No. 101-500',
  },
  '501-1000': {
    name: 'No. 501-1000',
  },
  '1001-': {
    name: 'No. 1001-',
  },
};

export const COSMOS_ADDRESS_PREFIX = 'cosmos';
export const IRIS_ADDRESS_PREFIX = 'iaa';

export const PRODUCT_WENCHANG = 'WENCHANG'; // 可用于判断是文昌链项目
export const PRODUCT_WENCHANG_TESTNET = 'WENCHANGTESTNET'; // 可用于判断是文昌链项目
export const DTC_ADDRESS_PREFIX = 'dtc';
export const DDC_TYPE_LIST = {
  1: 'DDC721',
  2: 'DDC1155',
};
export const UGAS = 'ugas'; // 用于比对ugas
export const STATISTICAL = {
  LATEST_BLOCK_HEIGHT: 200,
  TRANSACTIONS_ID: 201,
  BLOCKS_ID: 202,
  AVG_BLOCK_TIME_ID: 203,
  ASSETS_ID: 204,
  DENOMS_ID: 205,
  I_SERVICES: 206,
  IDENTITIES_ID: 207,
  VALIDATOR_COUNT_ID: 208,
  BOND_TOKENS_ID: 209,
  COMMUNITY_POOL_ID: 210,
  ADDRESS_COUNT_ID: 211,
};
