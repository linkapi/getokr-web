var
    appModule = require('../../appModule'),
    templateShell = require('../../modules/shell/shell.html'),
    viewLogin = require('../../modules/login/login.html'),
    viewHome = require('../../modules/home/home.html'),
    viewCompanyOkr = require('../../modules/companyOkr/companyOkr.html'),
    viewTags = require('../../modules/tag/tag.html')
    viewUsers = require('../../modules/user/user.html'),
    viewAddUser = require('../../modules/user/addUser.html'),
    viewForgotPassword = require('../../modules/password/forgotPassword.html'),
    viewDiagram = require('../../modules/diagram/diagram.html'),
    viewFeed = require('../../modules/feed/feed.html'),
    viewPlannings = require('../../modules/planning/planning.html')
    viewObjectiveDetails = require('../../modules/objectiveDetails/objectiveDetails.html')
    viewTeam = require('../../modules/team/team.html')
    viewTeams = require('../../modules/teams/teams.html')
    viewUserDetails = require('../../modules/userDetails/userDetails.html')

appModule.config(RouteConfig);

RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function RouteConfig($stateProvider, $urlRouterProvider) {

    $stateProvider.state('login', {
        url: "/login",
        templateUrl: viewLogin,
        data: {
            pageTitle: 'Login',
        },
        controller: 'loginController as vm'
    });

        // New User Confirmation
    $stateProvider.state('login_validate', {
        url: "/login/:hash",
        templateUrl: viewLogin,
        data: {
            pageTitle: 'Confirmação de usuário',
        },
        controller: 'loginController as vm'
    });

    // Forgot Password
    $stateProvider.state('login_forgotPassword', {
        url: "/password/forgot",
        templateUrl: viewForgotPassword,
        data: {
            pageTitle: 'Esqueci minha senha',
        },
        controller: 'forgotPasswordController as vm'
    });

    // Forgot Password
    $stateProvider.state('login_forgotPassword_recover', {
        url: "/password/forgot/:token",
        templateUrl: viewForgotPassword,
        data: {
            pageTitle: 'Nova senha',
        },
        controller: 'forgotPasswordController as vm'
    });
    
    $stateProvider.state('getOkr', {
        url: "",
        abstract: true,
        templateUrl: templateShell,
        data: {
            pageTitle: 'shell',
        },
        controller: 'shellController as main'
    });

    $stateProvider.state('getOkr.objectives', {
        url: "/objectives",
        data: {
            pageTitle: 'Objetivos',
        },
        views: {
            'main': {
                templateUrl: viewHome,
                controller: 'homeController',
                controllerAs: 'vm'
            }
        }
    });

    $stateProvider.state('getOkr.strategy', {
        url: "/strategy",
        data: {
            pageTitle: 'Mapa estratégico',
        },
        views: {
            'main': {
                templateUrl: viewCompanyOkr,
                controller: 'companyOkrController',
                controllerAs: 'vm'
            }
        }
    });

    $stateProvider.state('getOkr.tag', {
        url: "/tags",
        data: {
            pageTitle: 'Tags',
        },
        views: {
            'main': {
                templateUrl: viewTags,
                controller: 'tagsController',
                controllerAs: 'vm'
            }
        }
    });


    // Users
    $stateProvider.state('getOkr.users', {
        url: "/users",
        data: {
            pageTitle: 'Usuários',
        },
        views: {
            'main': {
                templateUrl: viewUsers,
                controller: 'userController',
                controllerAs: 'vm'
            }
        }
    });


    // Diagram
    $stateProvider.state('getOkr.diagram', {
        url: "/diagram",
        data: {
            pageTitle: 'Diagrama',
        },
        views: {
            'main': {
                templateUrl: viewDiagram,
                controller: 'diagramController',
                controllerAs: 'vm'
            }
        }
    });

    // Team
    $stateProvider.state('getOkr.people', {
        url: "/people",
        data: {
            pageTitle: 'Pessoas',
        },
        views: {
            'main': {
                templateUrl: viewTeam,
                controller: 'teamController',
                controllerAs: 'vm'
            }
        }
    });

    // Teams
    $stateProvider.state('getOkr.teams', {
        url: "/teams",
        data: {
            pageTitle: 'Times',
        },
        views: {
            'main': {
                templateUrl: viewTeams,
                controller: 'teamsController',
                controllerAs: 'vm'
            }
        }
    });

    // Feeds
    $stateProvider.state('getOkr.feeds', {
        url: "/feeds",
        data: {
            pageTitle: 'Novidades',
        },
        views: {
            'main': {
                templateUrl: viewFeed,
                controller: 'feedController',
                controllerAs: 'vm'
            }
        }
    });

    // User Details
    $stateProvider.state('getOkr.userdetails', {
        url: "/userdetails/:id",
        data: {
            pageTitle: 'Detalhes de usuário',
        },
        views: {
            'main': {
                templateUrl: viewUserDetails,
                controller: 'userDetailsController',
                controllerAs: 'vm'
            }
        }
    });

    // Profile
    $stateProvider.state('getOkr.profile', {
        url: "/profile/:id",
        data: {
            pageTitle: 'Meu perfil',
        },
        views: {
            'main': {
                templateUrl: viewUserDetails,
                controller: 'userDetailsController',
                controllerAs: 'vm'
            }
        }
    });
       
    // New User
    $stateProvider.state('getOkr.user_new', {
        url: "/user/new",
        data: {
            pageTitle: 'Novo usuário',
        },
        views: {
            'main': {
                templateUrl: viewAddUser,
                controller: 'addUserController',
                controllerAs: 'vm'
            }
        }
    });

    // Edit user
    $stateProvider.state('getOkr.edit_user', {
        url: "/user/:id",
        data: {
            pageTitle: 'Editar Usuário',
        },
        views: {
            'main': {
                templateUrl: viewAddUser,
                controller: 'addUserController',
                controllerAs: 'vm'
            }
        }
    });

    // Planning
    $stateProvider.state('getOkr.plannings', {
        url: "/plannings",
        data: {
            pageTitle: 'Períodos de planejamento',
        },
        views: {
            'main': {
                templateUrl: viewPlannings,
                controller: 'planningController',
                controllerAs: 'vm'
            }
        }
    });

    $stateProvider.state('getOkr.objective', {
        url: "/objective/:id",
        data: {
            pageTitle: 'Detalhes do Objetivo',
        },
        views: {
            'main': {
                templateUrl: viewObjectiveDetails,
                controller: 'objectiveDetailsController',
                controllerAs: 'vm'
            }
        }
    });

   }
