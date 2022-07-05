import txCommonTable from './txCommonTable';
import SignerColunmn from './SignerColunmn';
import txCommonLatestTable from './txCommonLatestTable';
import { needAddColumn } from './allTxTableColumnConfig';

// 通过交易类型 txtype 拼接columns
export const getColumnByTxTyp = (txType) => {
  if (txType && needAddColumn[txType]) {
    return [...txCommonTable, ...needAddColumn[txType], ...txCommonLatestTable];
  }

  return [...txCommonTable, ...SignerColunmn, ...txCommonLatestTable];
};
