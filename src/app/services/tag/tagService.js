var appModule = require('../../appModule');

appModule.service('tagService', TagService);

var _filter

TagService.$inject = ['$http', 'Configuration']

function TagService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

TagService.prototype.getCompanyTags = function (company) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'tag/' + company
    });
}

TagService.prototype.create = function (newTag) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'tag',
        data: newTag
    });
}

TagService.prototype.delete = function (id) {
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'tag/' + id
    });
}

TagService.prototype.getFilterFactory = function () {
    return _filter
};

TagService.prototype.setFilterFactory = function (filter) {
    _filter = filter
};
