import i18n from '@/i18n';
import { TX_TYPE, PubKeyAlgorithm, LEVEL_TX_TYPE, TX_TYPE_DISPLAY } from '../constant';
import prodConfig from '../productionConfig';
import Tools from '../util/Tools';

export class TxHelper {
  // The corresponding IBC Denom was deduced through the IBC Packet path
  static getOriginalDenomFromPacket(ibc_package, type) {
    let denom_result = '';
    if (ibc_package && typeof ibc_package === 'object') {
      const { source_port, source_channel, destination_port, destination_channel, data } =
        ibc_package;
      const prefix_sc = `${source_port}/${source_channel}/`;
      const prefix_dc = `${destination_port}/${destination_channel}/`;
      const { denom } = data;
      if (
        (type && type === TX_TYPE.timeout_packet) ||
        (type && type === TX_TYPE.acknowledge_packet)
      ) {
        if (denom.startsWith(prefix_sc)) {
          denom_result = `ibc/${Tools.sha256(denom).toUpperCase()}`;
        } else if (denom.includes(source_port)) {
          denom_result = `ibc/${Tools.sha256(denom).toUpperCase()}`;
        } else {
          denom_result = denom;
        }
      } else if (denom.startsWith(prefix_sc)) {
        const denom_clear_prefix = denom.replace(prefix_sc, '');
        if (denom_clear_prefix.indexOf('/') == -1) {
          denom_result = denom_clear_prefix;
        } else {
          denom_result = `ibc/${Tools.sha256(denom_clear_prefix).toUpperCase()}`;
        }
      } else {
        const denom_add_prefix = `${prefix_dc}${denom}`;
        denom_result = `ibc/${Tools.sha256(denom_add_prefix).toUpperCase()}`;
      }
    }
    return denom_result;
  }

  static getFromAndToAddressFromMsg(msgs) {
    const res = {
      from: '--',
      to: '--',
    };
    if (!msgs || !msgs.msg) return res;
    const { type, msg } = msgs;
    switch (type) {
      case TX_TYPE.send:
        res.from = msg.from_address;
        res.to = msg.to_address;
        break;
      case TX_TYPE.transfer:
        res.from = msg.sender;
        res.to = msg.receiver;
        break;
      case TX_TYPE.recv_packet:
        res.from = msg.packet.data.sender;
        res.to = msg.packet.data.receiver;
        break;
      case TX_TYPE.timeout_packet:
        res.from = msg.packet.data.sender;
        res.to = msg.packet.data.receiver;
        break;
      case TX_TYPE.define_service:
        res.from = msg.author;
        break;
      case TX_TYPE.bind_service:
        res.from = msg.provider;
        break;
      case TX_TYPE.update_service_binding:
        res.from = msg.provider;
        break;
      case TX_TYPE.disable_service_binding:
        res.from = msg.provider;
        break;
      case TX_TYPE.enable_service_binding:
        res.from = msg.provider;
        break;
      case TX_TYPE.refund_service_deposit:
        res.from = msg.provider;
        break;
      case TX_TYPE.call_service:
        res.from = msg.consumer;
        if (msg.providers.length === 0) {
          res.to = '--';
        } else if (msg.providers.length > 1) {
          res.to = msg.providers;
        } else {
          res.to = msg.providers[0];
        }
        break;
      case TX_TYPE.respond_service:
        res.from = msg.provider;
        if (msg.ex && msg.ex.consumer) {
          res.to = msg.ex.consumer;
        }
        break;
      case TX_TYPE.pause_request_context:
        res.from = msg.consumer;
        break;
      case TX_TYPE.start_request_context:
        res.from = msg.consumer;
        break;
      case TX_TYPE.kill_request_context:
        res.from = msg.consumer;
        break;
      case TX_TYPE.update_request_context:
        res.from = msg.consumer;
        break;
      case TX_TYPE.create_record:
        res.from = msg.creator;
        break;
      case TX_TYPE.burn_nft:
        res.from = msg.sender;
        break;
      case TX_TYPE.transfer_nft:
        res.from = msg.sender;
        res.to = msg.recipient;
        break;
      case TX_TYPE.edit_nft:
        res.from = msg.sender;
        break;
      case TX_TYPE.issue_denom:
        res.from = msg.sender;
        break;
      case TX_TYPE.mint_nft:
        res.from = msg.sender;
        res.to = msg.recipient;
        break;
      case TX_TYPE.create_identity:
        res.to = msg.owner;
        break;
      case TX_TYPE.update_identity:
        res.to = msg.owner;
        break;
      case TX_TYPE.delegate:
        res.from = msg.delegator_address;
        res.to = msg.validator_address;
        break;
      case TX_TYPE.begin_unbonding:
        res.from = msg.validator_address;
        res.to = msg.delegator_address;
        break;
      case TX_TYPE.withdraw_delegator_reward:
        res.from = msg.validator_address;
        res.to = msg.delegator_address;
        break;
      case TX_TYPE.begin_redelegate:
        res.from = msg.validator_src_address;
        res.to = msg.validator_dst_address;
        break;
      case TX_TYPE.issue_token:
        res.from = msg.owner;
        break;
      case TX_TYPE.edit_token:
        res.from = msg.owner;
        break;
      case TX_TYPE.mint_token:
        res.from = msg.owner;
        res.to = msg.to;
        break;
      case TX_TYPE.transfer_token_owner:
        res.from = msg.src_owner;
        res.to = msg.dst_owner;
        break;
      case TX_TYPE.deposit:
        res.from = msg.depositor;
        break;
      case TX_TYPE.vote:
        res.from = msg.voter;
        break;
      case TX_TYPE.submit_proposal:
        res.from = msg.proposer;
        break;
      case TX_TYPE.add_liquidity:
        res.from = msg.sender;
        break;
      case TX_TYPE.remove_liquidity:
        res.from = msg.sender;
        break;
      case TX_TYPE.swap_order:
        res.from = msg.input && msg.input.address;
        res.to = msg.output && msg.output.address;
        break;
      case TX_TYPE.create_htlc:
        res.from = msg.sender;
        res.to = msg.to;
        break;
      case TX_TYPE.claim_htlc:
        res.from = msg.sender;
        res.to = msg.recipient;
        break;
      case TX_TYPE.set_withdraw_address:
        res.from = msg.delegator_address;
        res.to = msg.withdraw_address;
        break;
      case TX_TYPE.burn_token:
        res.from = msg.sender;
        break;
      case TX_TYPE.multisend:
        res.from = msg.inputs && msg.inputs.length > 0 ? msg.inputs[0].address : '';
        break;
      case TX_TYPE.grant_allowance:
      case TX_TYPE.revoke_allowance:
        res.from = msg.granter;
        res.to = msg.grantee;
        break;
      default:
        break;
    }
    return res;
  }

  static getPubKeyAlgorithm(algorithm) {
    return PubKeyAlgorithm[String(algorithm)];
  }

  static getValidationTxsOperator(message) {
    if (message) {
      const { msg } = message;
      let operator;
      const txType = message.type || '--';
      switch (txType) {
        case TX_TYPE.create_validator:
          operator = msg.validator_address ? msg.validator_address : '--';
          break;
        case TX_TYPE.edit_validator:
          operator = msg.validator_address ? msg.validator_address : '--';
          break;
        case TX_TYPE.unjail:
          operator = msg.address ? msg.address : '--';
          break;
        case TX_TYPE.withdraw_validator_commission:
          operator = msg.validator_address || '--';
          break;
        default:
          operator = '--';
      }
      return operator;
    }
  }

  // static formatTxTypeData(TxTypeData) {
  //   const retOptions = [];
  //   const map = new Map();
  //   let index = 0;
  //   const TX_TYPE_DISPLAY = {};
  //   let lang = 'en';
  //   if (prodConfig.lang === 'EN') {
  //     lang = 'en';
  //   } else {
  //     lang = 'cn';
  //   }
  //   TxTypeData.forEach((txType) => {
  //     const module = txType['module_' + `${lang}`];
  //     const type = txType['type_' + `${lang}`];
  //     if (!map.has(module)) {
  //       retOptions.push({
  //         label: module,
  //         value: module,
  //         children: [],
  //       });
  //       map.set(module, index);
  //       index++;
  //     }
  //     retOptions[map.get(module)].children.push({
  //       label: type,
  //       value: txType.typeName,
  //     });
  //
  //     TX_TYPE_DISPLAY[txType.typeName] = type;
  //   });
  //   // retOptions.filter(module => { module.children.length > 0 })
  //
  //   retOptions.forEach((module, index) => {
  //     if (module.children.length === 0) {
  //       retOptions.splice(index, 1);
  //     }
  //   });
  //
  //   const txType = {
  //     txTypeData: TxTypeData,
  //     txTypeDataOptions: retOptions,
  //     TX_TYPE_DISPLAY,
  //   };
  //   sessionStorage.setItem('txType', JSON.stringify(txType));
  //   return txType;
  // }

  // abandon
  static formatTxType(txTypeArray) {
    let allTxType = [];
    const tansferObj = {
      value: LEVEL_TX_TYPE.Transfer,
      label: LEVEL_TX_TYPE.Transfer,
      children: [],
    };
    // 新增farm
    const farmObj = {
      value: LEVEL_TX_TYPE.Farm,
      label: LEVEL_TX_TYPE.Farm,
      children: [],
    };
    const stakingObj = {
      value: LEVEL_TX_TYPE.Staking,
      label: LEVEL_TX_TYPE.Staking,
      children: [],
    };
    const iServiceObj = {
      value: LEVEL_TX_TYPE.iService,
      label: LEVEL_TX_TYPE.iService,
      children: [],
    };
    const nftObj = {
      value: LEVEL_TX_TYPE.NFT,
      label: LEVEL_TX_TYPE.NFT,
      children: [],
    };
    const tibcObj = {
      value: LEVEL_TX_TYPE.TIBC,
      label: LEVEL_TX_TYPE.TIBC,
      children: [],
    };
    const coinswapObj = {
      value: LEVEL_TX_TYPE.Coinswap,
      label: LEVEL_TX_TYPE.Coinswap,
      children: [],
    };
    const identityObj = {
      value: LEVEL_TX_TYPE.Identity,
      label: LEVEL_TX_TYPE.Identity,
      children: [],
    };
    const ibcObj = {
      value: LEVEL_TX_TYPE.IBC,
      label: LEVEL_TX_TYPE.IBC,
      children: [],
    };
    const htlcObj = {
      value: LEVEL_TX_TYPE.HTLC,
      label: LEVEL_TX_TYPE.HTLC,
      children: [],
    };
    const crossChainObj = {
      value: LEVEL_TX_TYPE.crossChain,
      label: LEVEL_TX_TYPE.crossChain,
      children: [],
    };
    const oracleObj = {
      value: LEVEL_TX_TYPE.Oracle,
      label: LEVEL_TX_TYPE.Oracle,
      children: [],
    };
    const randomObj = {
      value: LEVEL_TX_TYPE.Random,
      label: LEVEL_TX_TYPE.Random,
      children: [],
    };
    const recordObj = {
      value: LEVEL_TX_TYPE.Record,
      label: LEVEL_TX_TYPE.Record,
      children: [],
    };
    const assetObj = {
      value: LEVEL_TX_TYPE.Asset,
      label: LEVEL_TX_TYPE.Asset,
      children: [],
    };
    const govObj = {
      value: LEVEL_TX_TYPE.Gov,
      label: LEVEL_TX_TYPE.Gov,
      children: [],
    };
    const othersObj = {
      value: LEVEL_TX_TYPE.Other,
      label: LEVEL_TX_TYPE.Other,
      children: [],
    };
    const smartContractObj = {
      value: LEVEL_TX_TYPE.SmartContract,
      label: LEVEL_TX_TYPE.SmartContract,
      children: [],
    };
    txTypeArray.forEach((item) => {
      switch (item.typeName) {
        // smartContractObj
        case TX_TYPE.ddc_1155:
          smartContractObj.children.push({
            value: TX_TYPE.ddc_1155,
            label: TX_TYPE_DISPLAY[TX_TYPE.ddc_1155],
          });
          break;
        case TX_TYPE.ddc_721:
          smartContractObj.children.push({
            value: TX_TYPE.ddc_721,
            label: TX_TYPE_DISPLAY[TX_TYPE.ddc_721],
          });
          break;
        case TX_TYPE.ddc_other:
          smartContractObj.children.push({
            value: TX_TYPE.ddc_other,
            label: TX_TYPE_DISPLAY[TX_TYPE.ddc_other],
          });
          break;
        // farm
        // #region

        case TX_TYPE.stake:
          farmObj.children.push({
            value: TX_TYPE.stake,
            label: TX_TYPE_DISPLAY[TX_TYPE.stake],
          });
          break;

        case TX_TYPE.unstake:
          farmObj.children.push({
            value: TX_TYPE.unstake,
            label: TX_TYPE_DISPLAY[TX_TYPE.unstake],
          });
          break;

        case TX_TYPE.harvest:
          farmObj.children.push({
            value: TX_TYPE.harvest,
            label: TX_TYPE_DISPLAY[TX_TYPE.harvest],
          });
          break;

        case TX_TYPE.create_pool:
          farmObj.children.push({
            value: TX_TYPE.create_pool,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_pool],
          });
          break;

        case TX_TYPE.create_pool_with_community_pool:
          farmObj.children.push({
            value: TX_TYPE.create_pool_with_community_pool,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_pool_with_community_pool],
          });
          break;

        case TX_TYPE.destroy_pool:
          farmObj.children.push({
            value: TX_TYPE.destroy_pool,
            label: TX_TYPE_DISPLAY[TX_TYPE.destroy_pool],
          });
          break;

        case TX_TYPE.adjust_pool:
          farmObj.children.push({
            value: TX_TYPE.adjust_pool,
            label: TX_TYPE_DISPLAY[TX_TYPE.adjust_pool],
          });
          break;

        // #endregion

        case TX_TYPE.send:
          tansferObj.children.push({
            value: TX_TYPE.send,
            label: TX_TYPE_DISPLAY[TX_TYPE.send],
          });
          break;

        case TX_TYPE.multisend:
          tansferObj.children.push({
            value: TX_TYPE.multisend,
            label: TX_TYPE_DISPLAY[TX_TYPE.multisend],
          });
          break;

        case TX_TYPE.delegate:
          stakingObj.children.push({
            value: TX_TYPE.delegate,
            label: TX_TYPE_DISPLAY[TX_TYPE.delegate],
          });
          break;
        case TX_TYPE.begin_redelegate:
          stakingObj.children.push({
            value: TX_TYPE.begin_redelegate,
            label: TX_TYPE_DISPLAY[TX_TYPE.begin_redelegate],
          });
          break;
        case TX_TYPE.set_withdraw_address:
          stakingObj.children.push({
            value: TX_TYPE.set_withdraw_address,
            label: TX_TYPE_DISPLAY[TX_TYPE.set_withdraw_address],
          });
          break;
        case TX_TYPE.begin_unbonding:
          stakingObj.children.push({
            value: TX_TYPE.begin_unbonding,
            label: TX_TYPE_DISPLAY[TX_TYPE.begin_unbonding],
          });
          break;
        case TX_TYPE.withdraw_delegator_reward:
          stakingObj.children.push({
            value: TX_TYPE.withdraw_delegator_reward,
            label: TX_TYPE_DISPLAY[TX_TYPE.withdraw_delegator_reward],
          });
          break;
        case TX_TYPE.fund_community_pool:
          stakingObj.children.push({
            value: TX_TYPE.fund_community_pool,
            label: TX_TYPE_DISPLAY[TX_TYPE.fund_community_pool],
          });
          break;
        case TX_TYPE.withdraw_validator_commission:
          stakingObj.children.push({
            value: TX_TYPE.withdraw_validator_commission,
            label: TX_TYPE_DISPLAY[TX_TYPE.withdraw_validator_commission],
          });
          break;
        case TX_TYPE.create_validator:
          stakingObj.children.push({
            value: TX_TYPE.create_validator,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_validator],
          });
          break;
        case TX_TYPE.edit_validator:
          stakingObj.children.push({
            value: TX_TYPE.edit_validator,
            label: TX_TYPE_DISPLAY[TX_TYPE.edit_validator],
          });
          break;
        case TX_TYPE.unjail:
          stakingObj.children.push({
            value: TX_TYPE.unjail,
            label: TX_TYPE_DISPLAY[TX_TYPE.unjail],
          });
          break;

        case TX_TYPE.define_service:
          iServiceObj.children.push({
            value: TX_TYPE.define_service,
            label: TX_TYPE_DISPLAY[TX_TYPE.define_service],
          });
          break;
        case TX_TYPE.bind_service:
          iServiceObj.children.push({
            value: TX_TYPE.bind_service,
            label: TX_TYPE_DISPLAY[TX_TYPE.bind_service],
          });
          break;
        case TX_TYPE.call_service:
          iServiceObj.children.push({
            value: TX_TYPE.call_service,
            label: TX_TYPE_DISPLAY[TX_TYPE.call_service],
          });
          break;
        case TX_TYPE.respond_service:
          iServiceObj.children.push({
            value: TX_TYPE.respond_service,
            label: TX_TYPE_DISPLAY[TX_TYPE.respond_service],
          });
          break;
        case TX_TYPE.disable_service_binding:
          iServiceObj.children.push({
            value: TX_TYPE.disable_service_binding,
            label: TX_TYPE_DISPLAY[TX_TYPE.disable_service_binding],
          });
          break;
        case TX_TYPE.enable_service_binding:
          iServiceObj.children.push({
            value: TX_TYPE.enable_service_binding,
            label: TX_TYPE_DISPLAY[TX_TYPE.enable_service_binding],
          });
          break;
        case TX_TYPE.update_service_binding:
          iServiceObj.children.push({
            value: TX_TYPE.update_service_binding,
            label: TX_TYPE_DISPLAY[TX_TYPE.update_service_binding],
          });
          break;
        case TX_TYPE.start_request_context:
          iServiceObj.children.push({
            value: TX_TYPE.start_request_context,
            label: TX_TYPE_DISPLAY[TX_TYPE.start_request_context],
          });
          break;
        case TX_TYPE.kill_request_context:
          iServiceObj.children.push({
            value: TX_TYPE.kill_request_context,
            label: TX_TYPE_DISPLAY[TX_TYPE.kill_request_context],
          });
          break;
        case TX_TYPE.pause_request_context:
          iServiceObj.children.push({
            value: TX_TYPE.pause_request_context,
            label: TX_TYPE_DISPLAY[TX_TYPE.pause_request_context],
          });
          break;
        case TX_TYPE.update_request_context:
          iServiceObj.children.push({
            value: TX_TYPE.update_request_context,
            label: TX_TYPE_DISPLAY[TX_TYPE.update_request_context],
          });
          break;
        case TX_TYPE.service_set_withdraw_address:
          iServiceObj.children.push({
            value: TX_TYPE.service_set_withdraw_address,
            label: TX_TYPE_DISPLAY[TX_TYPE.service_set_withdraw_address],
          });
          break;
        case TX_TYPE.refund_service_deposit:
          iServiceObj.children.push({
            value: TX_TYPE.refund_service_deposit,
            label: TX_TYPE_DISPLAY[TX_TYPE.refund_service_deposit],
          });
          break;
        case TX_TYPE.withdraw_earned_fees:
          iServiceObj.children.push({
            value: TX_TYPE.withdraw_earned_fees,
            label: TX_TYPE_DISPLAY[TX_TYPE.withdraw_earned_fees],
          });
          break;
        case TX_TYPE.issue_denom:
          nftObj.children.push({
            value: TX_TYPE.issue_denom,
            label: TX_TYPE_DISPLAY[TX_TYPE.issue_denom],
          });
          break;
        case TX_TYPE.mint_nft:
          nftObj.children.push({
            value: TX_TYPE.mint_nft,
            label: TX_TYPE_DISPLAY[TX_TYPE.mint_nft],
          });
          break;
        case TX_TYPE.edit_nft:
          nftObj.children.push({
            value: TX_TYPE.edit_nft,
            label: TX_TYPE_DISPLAY[TX_TYPE.edit_nft],
          });
          break;
        case TX_TYPE.transfer_nft:
          nftObj.children.push({
            value: TX_TYPE.transfer_nft,
            label: TX_TYPE_DISPLAY[TX_TYPE.transfer_nft],
          });
          break;
        case TX_TYPE.burn_nft:
          nftObj.children.push({
            value: TX_TYPE.burn_nft,
            label: TX_TYPE_DISPLAY[TX_TYPE.burn_nft],
          });
          break;
        // 新增TIBC相关
        case TX_TYPE.tibc_nft_transfer:
          tibcObj.children.push({
            value: TX_TYPE.tibc_nft_transfer,
            label: TX_TYPE_DISPLAY[TX_TYPE.tibc_nft_transfer],
          });
          break;
        case TX_TYPE.tibc_recv_packet:
          tibcObj.children.push({
            value: TX_TYPE.tibc_recv_packet,
            label: TX_TYPE_DISPLAY[TX_TYPE.tibc_recv_packet],
          });
          break;
        case TX_TYPE.tibc_acknowledge_packet:
          tibcObj.children.push({
            value: TX_TYPE.tibc_acknowledge_packet,
            label: TX_TYPE_DISPLAY[TX_TYPE.tibc_acknowledge_packet],
          });
          break;
        case TX_TYPE.clean_packet:
          tibcObj.children.push({
            value: TX_TYPE.clean_packet,
            label: TX_TYPE_DISPLAY[TX_TYPE.clean_packet],
          });
          break;
        case TX_TYPE.recv_clean_packet:
          tibcObj.children.push({
            value: TX_TYPE.recv_clean_packet,
            label: TX_TYPE_DISPLAY[TX_TYPE.recv_clean_packet],
          });
          break;
        case TX_TYPE.tibc_update_client:
          tibcObj.children.push({
            value: TX_TYPE.tibc_update_client,
            label: TX_TYPE_DISPLAY[TX_TYPE.tibc_update_client],
          });
          break;
        // 新增nft
        case TX_TYPE.transfer_denom:
          nftObj.children.push({
            value: TX_TYPE.transfer_denom,
            label: TX_TYPE_DISPLAY[TX_TYPE.transfer_denom],
          });
          break;

        case TX_TYPE.add_liquidity:
          coinswapObj.children.push({
            value: TX_TYPE.add_liquidity,
            label: TX_TYPE_DISPLAY[TX_TYPE.add_liquidity],
          });
          break;
        case TX_TYPE.remove_liquidity:
          coinswapObj.children.push({
            value: TX_TYPE.remove_liquidity,
            label: TX_TYPE_DISPLAY[TX_TYPE.remove_liquidity],
          });
          break;
        case TX_TYPE.swap_order:
          coinswapObj.children.push({
            value: TX_TYPE.swap_order,
            label: TX_TYPE_DISPLAY[TX_TYPE.swap_order],
          });
          break;
        case TX_TYPE.create_identity:
          identityObj.children.push({
            value: TX_TYPE.create_identity,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_identity],
          });
          break;
        case TX_TYPE.update_identity:
          identityObj.children.push({
            value: TX_TYPE.update_identity,
            label: TX_TYPE_DISPLAY[TX_TYPE.update_identity],
          });
          break;
        case TX_TYPE.recv_packet:
          if (prodConfig && prodConfig.txDetail && prodConfig.txDetail.ibc) {
            crossChainObj.children.push({
              value: TX_TYPE.recv_packet,
              label: TX_TYPE_DISPLAY[TX_TYPE.recv_packet],
            });
          } else {
            ibcObj.children.push({
              value: TX_TYPE.recv_packet,
              label: TX_TYPE_DISPLAY[TX_TYPE.recv_packet],
            });
          }
          break;
        case TX_TYPE.transfer:
          if (prodConfig && prodConfig.txDetail && prodConfig.txDetail.ibc) {
            othersObj.children.push({
              value: TX_TYPE.transfer,
              label: TX_TYPE_DISPLAY[TX_TYPE.transfer],
            });
          } else {
            ibcObj.children.push({
              value: TX_TYPE.transfer,
              label: TX_TYPE_DISPLAY[TX_TYPE.transfer],
            });
          }
          break;
        case TX_TYPE.timeout_packet:
          if (prodConfig && prodConfig.txDetail && prodConfig.txDetail.ibc) {
            othersObj.children.push({
              value: TX_TYPE.timeout_packet,
              label: TX_TYPE_DISPLAY[TX_TYPE.timeout_packet],
            });
          } else {
            ibcObj.children.push({
              value: TX_TYPE.timeout_packet,
              label: TX_TYPE_DISPLAY[TX_TYPE.timeout_packet],
            });
          }
          break;
        // prodConfig.txDetail.ibc
        case TX_TYPE.create_client:
          if (prodConfig && prodConfig.txDetail && prodConfig.txDetail.ibc) {
            crossChainObj.children.push({
              value: TX_TYPE.create_client,
              label: TX_TYPE_DISPLAY[TX_TYPE.create_client],
            });
          } else {
            othersObj.children.push({
              value: TX_TYPE.create_client,
              label: TX_TYPE_DISPLAY[TX_TYPE.create_client],
            });
          }
          break;
        // prodConfig.txDetail.ibc
        case TX_TYPE.update_client:
          if (prodConfig && prodConfig.txDetail && prodConfig.txDetail.ibc) {
            crossChainObj.children.push({
              value: TX_TYPE.update_client,
              label: TX_TYPE_DISPLAY[TX_TYPE.update_client],
            });
          } else {
            ibcObj.children.push({
              value: TX_TYPE.update_client,
              label: TX_TYPE_DISPLAY[TX_TYPE.update_client],
            });
          }
          break;
        case TX_TYPE.create_feed:
          oracleObj.children.push({
            value: TX_TYPE.create_feed,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_feed],
          });
          break;
        case TX_TYPE.start_feed:
          oracleObj.children.push({
            value: TX_TYPE.start_feed,
            label: TX_TYPE_DISPLAY[TX_TYPE.start_feed],
          });
          break;
        case TX_TYPE.edit_feed:
          oracleObj.children.push({
            value: TX_TYPE.edit_feed,
            label: TX_TYPE_DISPLAY[TX_TYPE.edit_feed],
          });
          break;
        case TX_TYPE.pause_feed:
          oracleObj.children.push({
            value: TX_TYPE.pause_feed,
            label: TX_TYPE_DISPLAY[TX_TYPE.pause_feed],
          });
          break;
        case TX_TYPE.request_rand:
          randomObj.children.push({
            value: TX_TYPE.request_rand,
            label: TX_TYPE_DISPLAY[TX_TYPE.request_rand],
          });
          break;
        case TX_TYPE.create_record:
          recordObj.children.push({
            value: TX_TYPE.create_record,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_record],
          });
          break;
        case TX_TYPE.issue_token:
          assetObj.children.push({
            value: TX_TYPE.issue_token,
            label: TX_TYPE_DISPLAY[TX_TYPE.issue_token],
          });
          break;
        case TX_TYPE.edit_token:
          assetObj.children.push({
            value: TX_TYPE.edit_token,
            label: TX_TYPE_DISPLAY[TX_TYPE.edit_token],
          });
          break;
        case TX_TYPE.mint_token:
          assetObj.children.push({
            value: TX_TYPE.mint_token,
            label: TX_TYPE_DISPLAY[TX_TYPE.mint_token],
          });
          break;
        case TX_TYPE.burn_token:
          assetObj.children.push({
            value: TX_TYPE.burn_token,
            label: TX_TYPE_DISPLAY[TX_TYPE.burn_token],
          });
          break;
        case TX_TYPE.transfer_token_owner:
          assetObj.children.push({
            value: TX_TYPE.transfer_token_owner,
            label: TX_TYPE_DISPLAY[TX_TYPE.transfer_token_owner],
          });
          break;
        case TX_TYPE.submit_proposal:
          govObj.children.push({
            value: TX_TYPE.submit_proposal,
            label: TX_TYPE_DISPLAY[TX_TYPE.submit_proposal],
          });
          break;
        case TX_TYPE.deposit:
          govObj.children.push({
            value: TX_TYPE.deposit,
            label: TX_TYPE_DISPLAY[TX_TYPE.deposit],
          });
          break;
        case TX_TYPE.vote:
          govObj.children.push({
            value: TX_TYPE.vote,
            label: TX_TYPE_DISPLAY[TX_TYPE.vote],
          });
          break;
        case TX_TYPE.create_htlc:
          htlcObj.children.push({
            value: TX_TYPE.create_htlc,
            label: TX_TYPE_DISPLAY[TX_TYPE.create_htlc],
          });
          break;
        case TX_TYPE.claim_htlc:
          htlcObj.children.push({
            value: TX_TYPE.claim_htlc,
            label: TX_TYPE_DISPLAY[TX_TYPE.claim_htlc],
          });
          break;
        // case TX_TYPE.refund_htlc:
        //     othersObj.children.push({
        //         value: TX_TYPE.refund_htlc,
        //         label: TX_TYPE_DISPLAY[TX_TYPE.refund_htlc]
        //     });
        // break;
        case TX_TYPE.verify_invariant:
          othersObj.children.push({
            value: TX_TYPE.verify_invariant,
            label: TX_TYPE_DISPLAY[TX_TYPE.verify_invariant],
          });
          break;
        case TX_TYPE.add_profiler:
          othersObj.children.push({
            value: TX_TYPE.add_profiler,
            label: TX_TYPE_DISPLAY[TX_TYPE.add_profiler],
          });
          break;
        case TX_TYPE.add_trustee:
          othersObj.children.push({
            value: TX_TYPE.add_trustee,
            label: TX_TYPE_DISPLAY[TX_TYPE.add_trustee],
          });
          break;
        case TX_TYPE.delete_profiler:
          othersObj.children.push({
            value: TX_TYPE.delete_profiler,
            label: TX_TYPE_DISPLAY[TX_TYPE.delete_profiler],
          });
          break;
        case TX_TYPE.delete_trustee:
          othersObj.children.push({
            value: TX_TYPE.delete_trustee,
            label: TX_TYPE_DISPLAY[TX_TYPE.delete_trustee],
          });
          break;
        case TX_TYPE.submit_evidence:
          othersObj.children.push({
            value: TX_TYPE.submit_evidence,
            label: TX_TYPE_DISPLAY[TX_TYPE.submit_evidence],
          });
          break;
        case TX_TYPE.upgrade_client:
          othersObj.children.push({
            value: TX_TYPE.upgrade_client,
            label: TX_TYPE_DISPLAY[TX_TYPE.upgrade_client],
          });
          break;
        case TX_TYPE.submit_misbehaviour:
          othersObj.children.push({
            value: TX_TYPE.submit_misbehaviour,
            label: TX_TYPE_DISPLAY[TX_TYPE.submit_misbehaviour],
          });
          break;
        case TX_TYPE.connection_open_init:
          othersObj.children.push({
            value: TX_TYPE.connection_open_init,
            label: TX_TYPE_DISPLAY[TX_TYPE.connection_open_init],
          });
          break;
        case TX_TYPE.connection_open_try:
          othersObj.children.push({
            value: TX_TYPE.connection_open_try,
            label: TX_TYPE_DISPLAY[TX_TYPE.connection_open_try],
          });
          break;
        case TX_TYPE.connection_open_ack:
          othersObj.children.push({
            value: TX_TYPE.connection_open_ack,
            label: TX_TYPE_DISPLAY[TX_TYPE.connection_open_ack],
          });
          break;
        case TX_TYPE.connection_open_confirm:
          othersObj.children.push({
            value: TX_TYPE.connection_open_confirm,
            label: TX_TYPE_DISPLAY[TX_TYPE.connection_open_confirm],
          });
          break;
        case TX_TYPE.channel_open_init:
          othersObj.children.push({
            value: TX_TYPE.channel_open_init,
            label: TX_TYPE_DISPLAY[TX_TYPE.channel_open_init],
          });
          break;
        case TX_TYPE.channel_open_try:
          othersObj.children.push({
            value: TX_TYPE.channel_open_try,
            label: TX_TYPE_DISPLAY[TX_TYPE.channel_open_try],
          });
          break;
        case TX_TYPE.channel_open_ack:
          othersObj.children.push({
            value: TX_TYPE.channel_open_ack,
            label: TX_TYPE_DISPLAY[TX_TYPE.channel_open_ack],
          });
          break;
        case TX_TYPE.channel_open_confirm:
          othersObj.children.push({
            value: TX_TYPE.channel_open_confirm,
            label: TX_TYPE_DISPLAY[TX_TYPE.channel_open_confirm],
          });
          break;
        case TX_TYPE.channel_close_init:
          othersObj.children.push({
            value: TX_TYPE.channel_close_init,
            label: TX_TYPE_DISPLAY[TX_TYPE.channel_close_init],
          });
          break;
        case TX_TYPE.channel_close_confirm:
          othersObj.children.push({
            value: TX_TYPE.channel_close_confirm,
            label: TX_TYPE_DISPLAY[TX_TYPE.channel_close_confirm],
          });
          break;
        case TX_TYPE.timeout_on_close_packet:
          othersObj.children.push({
            value: TX_TYPE.timeout_on_close_packet,
            label: TX_TYPE_DISPLAY[TX_TYPE.timeout_on_close_packet],
          });
          break;
        case TX_TYPE.acknowledge_packet:
          othersObj.children.push({
            value: TX_TYPE.acknowledge_packet,
            label: TX_TYPE_DISPLAY[TX_TYPE.acknowledge_packet],
          });
          break;
        case TX_TYPE.grant_allowance:
          othersObj.children.push({
            value: TX_TYPE.grant_allowance,
            label: TX_TYPE_DISPLAY[TX_TYPE.grant_allowance],
          });
          break;
        case TX_TYPE.revoke_allowance:
          othersObj.children.push({
            value: TX_TYPE.revoke_allowance,
            label: TX_TYPE_DISPLAY[TX_TYPE.revoke_allowance],
          });
          break;
        default:
      }
    });

    // 添加Farm

    allTxType.push(
      tansferObj,
      nftObj,
      tibcObj,
      identityObj,
      ibcObj,
      stakingObj,
      coinswapObj,
      farmObj,
      htlcObj,
      assetObj,
      govObj,
      oracleObj,
      randomObj,
      recordObj,
      iServiceObj,
      crossChainObj,
      smartContractObj,
      othersObj
    );
    allTxType = allTxType.filter((item) => item.children.length);
    allTxType.forEach((item) => {
      if (item?.children?.length && item.children.length > 1) {
        if (
          item.children.some((item) => {
            return (
              item.value !== TX_TYPE.ddc_721 &&
              item.value !== TX_TYPE.ddc_1155 &&
              item.value !== TX_TYPE.ddc_other
            );
          })
        ) {
          item.children.unshift({
            label: 'secondaryAll',
            value: i18n.t('ExplorerLang.common.all'),
          });
        }
      }
    });
    return allTxType;
  }

  static getTxTypeArray(data, value) {
    let TxTypeArray = [''];
    data.forEach((item) => {
      if (item.children && item.children.length) {
        item.children.forEach((it) => {
          if (it.value === value) {
            TxTypeArray = [item.value, it.value];
          }
        });
      }
    });

    return TxTypeArray;
  }

  static getDisplayTxType(types = []) {
    let type = types[0] || '';
    if (type && types.length > 1) {
      types.forEach((item) => {
        if (type.length > item.length) {
          type = item;
        }
      });
    }
    return type;
  }
}
