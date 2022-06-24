import Vue from 'vue';
// eslint-disable-next-line import/extensions,import/order
import App from './App.vue';
import './theme/index.css';
import '../icon/iconfont.css';
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Divider,
  Image,
  Calendar,
  Backtop,
  PageHeader,
  CascaderPanel,
  Loading,
  MessageBox,
  Message,
  Notification,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vuescroll from 'vuescroll';
import Vuebar from 'vuebar';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'vue-happy-scroll/docs/happy-scroll.css';
// 日期选择器
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
// 日期中文
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

import VueI18n from 'vue-i18n';
// eslint-disable-next-line import/order
import prodConfig from './productionConfig';
import adjustColumnWidth from '@/helper/adjustColumnWidth';
import {getMainToken} from '@/helper/IritaHelper';
import 'spinkit/spinkit.css';

/* 引入自定义修饰器 */

import {fetchAllTokens} from '@/service/api';
import directives from './directives';
import store from './vuex/index';
import router from './router/index';

Vue.use(Vuebar);

Vue.prototype.$adjustColumnWidth = adjustColumnWidth;

Vue.use(directives);

locale.use(prodConfig.lang === 'EN' ? lang : zhLocale);
Vue.use(vuescroll, {
  ops: {}, // 在这里设置全局默认配置
  name: 'vue-scroll', // 在这里自定义组件名字，默认是vueScroll
});

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: prodConfig.lang === 'EN' ? 'EN' : 'CN',
  messages: {
    // eslint-disable-next-line global-require
    CN: require('../lang/CN-Cindy'),
    // eslint-disable-next-line global-require
    EN: require('../lang/EN-Cindy'),
  },
});

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.use(Tag);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Slider);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Spinner);
Vue.use(Badge);
Vue.use(Card);
Vue.use(Rate);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(ColorPicker);
Vue.use(Transfer);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Link);
Vue.use(Divider);
Vue.use(Image);
Vue.use(Calendar);
Vue.use(Backtop);
Vue.use(PageHeader);
Vue.use(CascaderPanel);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('config');
}, false);

Vue.config.productionTip = false;
(async function () {
  let failedIndex = 0;

  async function queryMainToken() {
    const mainToken = await getMainToken().catch(() => {
      if (failedIndex <= 4) {
        setTimeout(() => {
          queryMainToken();
          // eslint-disable-next-line no-plusplus
          failedIndex++;
        }, 500);
      } else {
        // eslint-disable-next-line no-use-before-define
        store.state.mainToken = '';
      }
    });
    if (mainToken) {
      const upperCaseMainToken = mainToken && mainToken.symbol.toUpperCase();
      store.state.mainToken = upperCaseMainToken;
    }
  }

  queryMainToken();
}());

Vue.directive('debounce', {
  inserted(el, binding) {
    const [fn, event = 'click', time = 300] = binding.value;
    let timer;
    el.addEventListener(event, () => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => fn(), time);
    });
  },
});

const getAllToken = async () => {
  const allToken = await fetchAllTokens();
  sessionStorage.setItem('allToken', JSON.stringify(allToken));
};
getAllToken();

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
