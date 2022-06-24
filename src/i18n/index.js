import VueI18n from 'vue-i18n';
import prodConfig from '@/productionConfig';

export default new VueI18n({
  locale: prodConfig.lang === 'EN' ? 'EN' : 'CN',
  messages: {
    CN: require('../../lang/CN-Cindy'),
    EN: require('../../lang/EN-Cindy'),
  },
});
