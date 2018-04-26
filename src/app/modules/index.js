module.exports = function () {
    require('./shell/shellController')
    require('./config/config')
    require('./config/routeConfig')
    require('./component/qsUtil')

    // login
    require('./login/loginController')

    // Main
    require('./home/homeController')

    // CompanyOkr
    require('./companyOkr/companyOkrController')

    //Tag
    require('./tag/tagController');

    //Diagram
    require('./diagram/diagramController');

    //Feeds
    require('./feed/feedController');

    // Planning
    require('./planning/planningController')

    // Objective Details
    require('./objectiveDetails/objectiveDetailsController')

    // Objective Details
    require('./userDetails/userDetailsController')

    // Main
    require('./user/userController')
    require('./user/addUserController')

    // Team
    require('./team/teamController')

    // Teams
    require('./teams/teamsController')

    //Forgot Password
    require('./password/forgotPasswordController')

    // Planning Session
    require('./modal/planningSession/planningSessionController')

    // Key Result
    require('./modal/keyResult/keyResultController')

    //Change Password
    require('./modal/resetPassword/resetPasswordController')

    // Check-in
    require('./modal/checkIn/checkInController')

    // keyResultList
    require('./modal/keyResultList/keyResultListController')

    //Customize GetOKR
    require('./modal/customizeGetokr/customizeGetokrController')

    // Objective
    require('./modal/objective/objectiveController')

    // CheckIn Graph
    require('./modal/checkInGraph/checkInGraphController')

    // Team modal
    require('./modal/team/teamModalController')

    //Companies modal
    require('./modal/companies/companiesController')
};
