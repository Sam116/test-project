import scrollableTable from './scrollable-table'
import layoutInit from './layout'
import polyfills from './polyfills'
import elementsClick from './elements-click-test';
import extForm from './ext-form';

document.addEventListener('DOMContentLoaded', function () {

    polyfills();

    layoutInit();

    scrollableTable();

    elementsClick();

    extForm();

});
