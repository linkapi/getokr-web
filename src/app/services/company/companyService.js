var appModule = require('../../appModule');

var _company

appModule.service('companyService', CompanyService);

CompanyService.$inject = ['$http', 'Configuration']

function CompanyService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

CompanyService.prototype.getCompanyUsers = function (query) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'company/users',
        params: query
    });
};


CompanyService.prototype.getCompanyTags = function (company) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'tag/' + company
    });
};

CompanyService.prototype.findCompanyById = function (company) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'company/' + company
    });
};

CompanyService.prototype.editCompany = function (company) {
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'company/' + company._id,
        data: company
    });
};

CompanyService.prototype.getCompanyFactory = function () {
    if (_company)
        return _company;

    return;
};

CompanyService.prototype.setCompanyFactory = function (company) {
    //this.$localStorage.company = company;
    _company = company;
};
