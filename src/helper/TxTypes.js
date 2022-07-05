import { getAllTxTypes } from '@/service/api';
import prodConfig from '@/productionConfig';

// 单例模式减少请求，合并整合使用关系。
class TxTypes {
  typeData = null;

  txType = null;

  async getData() {
    if (this.typeData) {
      return this.typeData;
    }

    this.typeData = getAllTxTypes().catch((e) => {
      throw e;
    });

    this.typeData = await this.typeData;
    // this.typeData = this.typeData.data;
    return this.typeData;
  }

  formatTxTypeData() {
    let retOptions = [];
    const map = new Map();
    let index = 0; // map的value，处理树形结构时，为了更快的找到父级（这里只有两层，可以这样写）
    const TX_TYPE_DISPLAY = {};
    const lang = prodConfig.lang === 'EN' ? 'en' : 'cn';

    // 把平铺的typeData根据module拼装成树形结构（两层）
    this.typeData?.data?.forEach((typeItem) => {
      const module = typeItem[`module_${lang}`];
      const type = typeItem[`type_${lang}`];

      if (!map.has(module)) {
        retOptions.push({
          label: module,
          value: module,
          children: [],
        });
        map.set(module, index); // 设置当前module的值，方便子元素找到父元素。
        index++;
      }

      const parentIndex = map.get(module);
      retOptions[parentIndex].children.push({
        label: type,
        value: typeItem.typeName,
      });

      TX_TYPE_DISPLAY[typeItem.typeName] = type;
    });

    retOptions = retOptions.filter((module) => module.children.length > 0);

    this.txType = {
      txTypeData: this.typeData?.data || [],
      txTypeDataOptions: retOptions,
      TX_TYPE_DISPLAY,
    };
    // 这里在TabsComponents切换的时候用到，涉及页面比较多，暂时多存一下，整合所有涉及的使用页面再删除
    sessionStorage.setItem('txType', JSON.stringify(this.txType));

    return this.txType;
  }
}

export default new TxTypes();
