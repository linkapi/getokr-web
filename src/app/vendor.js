module.exports = function () {
    /* Styles */
    require("./scss/style.scss");

    /* JS */
    require('angular');
    require('angular-ui-router');
    require('angular-ui-bootstrap');
    require('bootstrap');
    require('metismenu');
    require('ngstorage');
    require('angular-xeditable')
    require('ng-lodash');
    require('ng-draggable');
    require('checklist-model');
    require('angular-route');
    require('ui-select');
    require('angular-input-masks');
    require('angular-sanitize');
    require('angular-filter');
    require('angular-loading-bar');
    require('ng-infinite-scroll');
    require('moment');
    require('moment/locale/pt-br');
    require('humanize-duration');
    require('angular-ui-mask');
    require('angular-input-masks');
    require('sweetalert');
    require('lodash');
    require('ng-file-upload');

    //drag
    require('angular-ui-sortable');

    //wizard
    require('ng-dialog');

    //tour
    require('angular-hotkeys');
    require('ngSmoothScroll');
    require('ez-ng');

    require('chart.js');

    //Bibliotecas inexistentes no NPM
    require('./customLibs/angular-tags-0.2.10-tpls');
    require('./customLibs/angular-bootstrap-multiselect.min');

    //Bibliotecas incompativeis com o webpack mexidas para funcionar com o mesmo
    require('./customLibs/angular-title');
    require('./customLibs/icheck');
    require('./customLibs/angular-moment');
    require('./customLibs/angular-notify');
    require('./customLibs/angular-google-analytics');
    require('./customLibs/customPopover');

};
