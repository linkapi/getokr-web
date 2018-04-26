var appModule = require('../../appModule');

appModule.service('notificationService', NotificationService);

NotificationService.$inject = ['$http', 'Configuration']

function NotificationService($http, Configuration) {
    this.$http = $http;
    this.Configuration = Configuration;
}

NotificationService.prototype.getNotification = function (notification) {
    return this.$http({
        method: 'GET',
        url: this.Configuration.serviceUrl + 'notification/' + notification
    });
};


NotificationService.prototype.newNotification = function (notification) {
    return this.$http({
        method: 'POST',
        url: this.Configuration.serviceUrl + 'notification',
        data: notification
    });


};

NotificationService.prototype.updateNotification = function (notification) {
    return this.$http({
        method: 'PATCH',
        url: this.Configuration.serviceUrl + 'notification/' + notification._id,
        data: notification
    });
};

NotificationService.prototype.deactivateNotification = function (notification) {
    console.log("entrou")
    return this.$http({
        method: 'DELETE',
        url: this.Configuration.serviceUrl + 'notification/' + notification._id
    });
};
