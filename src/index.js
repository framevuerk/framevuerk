// Utils
import { each } from './utility/utils';

// Components
import ThemeProvider from './components/ThemeProvider.vue';
import Layout from './components/Layout.vue';
import Content from './components/Content.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Sidebar from './components/Sidebar.vue';
import List from './components/List.vue';
import ListItem from './components/ListItem.vue';
import Menu from './components/Menu.vue';
import Form from './components/Form.vue';
import FormElement from './components/FormElement.vue';
import InputGroup from './components/InputGroup.vue';
import InputBox from './components/InputBox.vue';
import Input from './components/Input.vue';
import Button from './components/Button.vue';
import Select from './components/Select.vue';
import SelectOption from './components/SelectOption.vue';
import Slider from './components/Slider.vue';
import SlideContent from './components/SlideContent.vue';
import SlideLabel from './components/SlideLabel.vue';
import Table from './components/Table.vue';
import TableField from './components/TableField.vue';
import TableRow from './components/TableRow.vue';
import Dialog from './components/Dialog.vue';
import Check from './components/Check.vue';
import Switch from './components/Switch.vue';
import Loading from './components/Loading.vue';
import Pagination from './components/Pagination.vue';
import Datepicker from './components/Datepicker.vue';

const install = (vue, userOptions = {}) => {
  const defaultOptions = {
    prefix: 'fv',
  };
  const options = {
    ...defaultOptions,
    ...userOptions,
  };
  each({
    ThemeProvider,
    Layout,
    Content,
    Header,
    Footer,
    Sidebar,
    List,
    ListItem,
    Form,
    FormElement,
    InputGroup,
    InputBox,
    Input,
    Button,
    Select,
    SelectOption,
    Slider,
    SlideContent,
    SlideLabel,
    Table,
    TableField,
    TableRow,
    Dialog,
    Loading,
    Pagination,
    Check,
    Switch,
    Menu,
    Datepicker,
  }, (key, component) => {
    vue.component(`${options.prefix}${key}`, component);
  });
};

export {
  install,
  ThemeProvider,
  Layout,
  Content,
  Header,
  Footer,
  Sidebar,
  List,
  ListItem,
  Form,
  FormElement,
  InputGroup,
  Input,
  InputBox,
  Button,
  Select,
  SelectOption,
  Slider,
  SlideContent,
  SlideLabel,
  Table,
  TableField,
  TableRow,
  Dialog,
  Loading,
  Pagination,
  Check,
  Switch,
  Menu,
  Datepicker,
};

export default {
  install,
};
