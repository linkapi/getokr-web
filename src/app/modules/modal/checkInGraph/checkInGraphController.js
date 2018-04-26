'use strict'

var appModule = require('../../../appModule');

appModule.controller('checkInGraphController', CheckInGraphController);

CheckInGraphController.$inject = ['$uibModalInstance', 'userService', 'keyResultService', '$window']

function CheckInGraphController($uibModalInstance, userService, keyResultService, $window) {
    this.$uibModalInstance = $uibModalInstance
    this.keyResultService = keyResultService
    this.$window = $window
    this.keyResult
    this.data = []
    this.loaded = false

}

CheckInGraphController.prototype.initialize = function () {
    var that = this

    that.keyResult = that.keyResultService.getKeyResultFactory()
    that.loaded = true

    that.generateData()


};

CheckInGraphController.prototype.generateData = function () {
    var that = this

    _.forEach(that.keyResult.checkIns, function (checkIn, index) {
        if (that.keyResult.format == 'percent')
            that.data.push({
                x: checkIn._id.insertDate,
                y: (checkIn._id.value * 100)
            })
        else
            that.data.push({
                x: checkIn._id.insertDate,
                y: checkIn._id.value
            })
    })

    that.generateGraph()
};

CheckInGraphController.prototype.generateGraph = function () {
    var that = this,
        ctx = angular.element('#myChart'),
        myChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Progresso',
                    data: that.data,
                    lineTension: 0,
                    backgroundColor: [
                        'rgba(134, 175, 73, 0.2)'
                    ],
                    borderColor: [
                        'rgba(134, 175, 73, 1)'
                    ]
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    backgroundColor: 'rgba(134, 175, 73, 1)',
                    position: 'average',
                    displayColors: false,
                    callbacks: {
                        label: function (tooltipItems, data) {
                            if (that.keyResult.format == 'percent')
                                return 'Valor: ' + tooltipItems.yLabel + '%, Data: ' + moment(tooltipItems.xLabel).format('L')

                            if (that.keyResult.format == 'money')
                                return 'Valor: R$' + tooltipItems.yLabel.toFixed(2).replace('.', ',') + ', Data: ' + moment(tooltipItems.xLabel).format('L')

                            return 'Valor: ' + tooltipItems.yLabel + ', Data: ' + moment(tooltipItems.xLabel).format('L')
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        ticks: {
                            callback: function (label, index, labels) {
                                return moment(labels[index]).format('L')
                            }
                        },
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0
                        }
                    }],
                }
            }
        });

}

CheckInGraphController.prototype.closeModal = function () {
    var that = this
    that.$uibModalInstance.close();
};

CheckInGraphController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}
