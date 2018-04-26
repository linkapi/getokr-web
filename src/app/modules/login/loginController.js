'use strict';

var appModule = require('../../appModule'),
    templateCompanies = require("../../modules/modal/companies/companies.html")

LoginController.$inject = ['$stateParams', '$localStorage', '$location', 'loginService', 'userService', 'companyService', 'modalService', '$uibModal'];

function LoginController($stateParams, $localStorage, $location, loginService, userService, companyService, modalService, $uibModal) {
    this.$stateParams = $stateParams;
    this.$localStorage = $localStorage
    this.$location = $location
    this.loginService = loginService
    this.userService = userService
    this.companyService = companyService
    this.modalService = modalService
    this.$uibModal = $uibModal
    this.hash
    this.newPasswordConfirm = ''
    this.newUser = {}

    this.initialize()
}

LoginController.prototype.initialize = function () {
    var that = this

    this.user = {
        username: "",
        password: ""
    };

    var token = this.loginService.getTokenFactory();

    if (token) {
        that.$location.path('/profile/' + this.userService.getUserFactory()._id)

    } else if (this.$stateParams.hash) {
        that.userService.getUserHash(this.$stateParams.hash)
            .then(function (res) {
                that.hash = true
            })
            .catch(function (err) {
                console.log(err);
                that.$location.path('/login')
            });
    }

};

LoginController.prototype.login = function () {
    var that = this;

    if (!this.user.username) {
        this.validate = "emailEmpty";
        this.errorMessage(this.validate);
        return;
    }

    if (!this.user.password) {
        this.validate = "passwordEmpty";
        this.errorMessage(this.validate);
        return;
    }

    this.loginService.getIn(this.user)
        .then(function (data) {
            that.loginService.setTokenFactory(data.data.access_token);
            return that.loginService.login();
        })
        .then(function (data) {
            var user = data.data
            if (user.companies.length <= 1) {
                user.company = user.companies[0]
                that.userService.setUserFactory(user);
                that.$location.path('/profile/' + that.userService.getUserFactory()._id);

            } else {
                var modalInstance = that.$uibModal.open({
                    templateUrl: templateCompanies,
                    controller: 'companiesController as vm',
                    size: 'md',
                    resolve: {
                        items: function () {
                            return user
                        }
                    }
                });

                modalInstance.result
                    .then(function (res) {
                        that.userService.setUserFactory(user);
                        that.$location.path('/profile/' + that.userService.getUserFactory()._id);
                    })

                    .catch(function (err) {
                        console.log(err);
                    });
            }

            that.companyService.findCompanyById(user.company)
                .then(function (res) {
                    if (!res.data.isActive) {
                        that.validate = "planExpired";
                        that.errorMessage(that.validate);
                        delete that.$localStorage.token
                        return
                    }

                    var mixpanel_person = {
                        "$email": user.username,
                        "$first_name": user.firstName,
                        "$administrator": user.isAdministrator,
                        "$canCreate": user.canCreate,
                        "$company": res.data.fantasyName,
                        "$created_at": user.insertDate
                    };

                    mixpanel.identify(user.username);
                    mixpanel.people.set(mixpanel_person);

                    var created_at = new Date(user.insertDate);
                    created_at = (created_at.getTime() - created_at.getMilliseconds()) / 1000;

                    mixpanel.track("Login Realizado");


                })
                .catch(function (err) {
                    console.log(err)
                })


            return;
        })
        .catch(function (err) {
            if (err.status == 400) {
                that.validate = "invalidLogin";
                that.errorMessage(that.validate);
            }
            console.log(err);
        });
};


LoginController.prototype.addUser = function () {
    var that = this

    if (that.newUser.password != that.newPasswordConfirm && !that.newUser.password) {
        swal("Senhas divergentes!", "A senha informada não confere com a confirmação de senha.", "error");
        return;
    }

    that.newUser.hash = that.$stateParams.hash

    that.userService.updateUserByHash(that.newUser)
        .then(function (res) {
            swal("Usuário criado!", "Parabéns, você está pronto para usar o getOkr. Faça seu login.", "success");
        })
        .catch(function (err) {
            console.log(err);
        })
        .finally(function () {
            that.$location.path('/login')
        })
}


LoginController.prototype.forgotPassword = function (email) {
    var that = this;
    this.loginService.forgotPassword(email)
        .then(function (data) {
            that.resetPassword = false;
            that.userEmail = '';
            that.$location.path('/strategy');
        })
        .catch(function (err) {
            console.log(err);
        });
};

LoginController.prototype.errorMessage = function (validate) {
    var message = '';

    switch (validate) {
        case "emailEmpty":
            swal({
                title: "Informações faltando!",
                text: "Preencha o campo usuário, por favor..",
                timer: 2000,
                showConfirmButton: true,
                class: 'warning'
            });
            break;
        case "passwordEmpty":
            swal({
                title: "Informações faltando!",
                text: "Preencha o campo senha, por favor..",
                timer: 2000,
                showConfirmButton: true,
                class: 'warning'
            });
            break;
        case "invalidLogin":
            swal({
                title: "Login não efetuado!",
                text: "Usuário e/ou senha inválidos",
                timer: 2000,
                showConfirmButton: true,
                class: 'warning'
            });
            break;
        case "planExpired":
            swal({
                title: "Login não efetuado!",
                text: "O seu plano expirou..",
                timer: 2000,
                showConfirmButton: true,
                class: 'warning'
            });
            break;
            return
    }
}

appModule.controller('loginController', LoginController);
