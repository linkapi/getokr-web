'use strict'

var appModule = require('../../appModule');

appModule.controller('diagramController', DiagramController);

DiagramController.$inject = ['objectiveService', 'userService', '$scope', 'companyService', '$window', 'planningSessionService', '$localStorage', '$rootScope', 'modalService']

function DiagramController(objectiveService, userService, $scope, companyService, $window, planningSessionService, $localStorage, $rootScope, modalService) {
    this.objectiveService = objectiveService
    this.userService = userService
    this.modalService = modalService
    this.companyService = companyService
    this.user = userService.getUserFactory()
    this.$scope = $scope
    this.$window = $window
    this.planningSessionService = planningSessionService
    this.$localStorage = $localStorage
    this.$rootScope = $rootScope
    this.tags = []
    this.tagsForSelection = []
    this.childrenOfChildren = []
    this.idsUseds = []
    this.secondChilds = []
    this.childsObjectives = []
    this.loadPlanningsView = false
    this.timesLoaded = 0
    this.filter = {
        company: userService.getUserFactory().company,
        tags: [],
        hierarchy: '',
        active: true
    }
    this.objectiveSearch;

    var that = this

    this.$rootScope.$on('cfpLoadingBar:completed', function (event, args) {
        that.loadView = true
    })

    this.$rootScope.$on('cfpLoadingBar:started', function (event, args) {
        that.loadView = false
    })

    this.$rootScope.$on('cfpLoadingBar:loading', function (event, args) {
        that.loadView = false
    })

    this.initialize()

}

DiagramController.prototype.initialize = function () {
    var that = this

    this.loadTags()
    that.loadPlannings()

    that.timesLoaded++
}

DiagramController.prototype.loadObjectives = function () {
    var that = this,
        planningId,
        query = {}

    that.childsObjectives = []
    that.planningSessionService.setCompanyPlanningFactory(that.selectedCompanyPlanning)

    that.filter.hierarchy = "!main"

    if (!that.selectedPlanning)
        return

    if (!that.plannings.length)
        return

    planningId = that.selectedPlanning._id

    if (that.selectedCompanyPlanning && !that.selectedPlanning._id) {
        that.selectedPlanning = that.selectedCompanyPlanning.childPlannings[that.selectedCompanyPlanning.childPlannings.length - 1]

        if (that.selectedCompanyPlanning.childPlannings.length)
            planningId = that.selectedPlanning._id || that.selectedPlanning.data._id
        else
            that.objectives = []
    } else
        that.objectives = []

    query.planning = that.selectedCompanyPlanning._id
    query.deactivate = false

    that.objectiveService.getObjectivesByPlanning(query)
        .then(function (res) {
            that.objectives = res.data
            that.objectiveService.setObjectiveListFactory(that.objectives)

            if (!that.objectives.length && that.timesLoaded == 1) {
                swal("Você ainda não possui objetivos!", "O diagrama ficará disponível assim que um objetivo for criado.", "warning");
                that.$window.history.back();
            }

            if (!that.objectives.length && that.timesLoaded > 1)
                swal("Não há diagrama!", "Troque sua pesquisa para gerar um diagrama.", "warning");

            _.forEach(that.objectives, function (objective) {
                var progress = objective.progress
                that.childsObjectives.push({
                    id: objective._id,
                    parentId: null,
                    Name: objective.name,
                    Image: "https://s3.amazonaws.com/getokr-storage/trophy.png",
                    Progress: (isNaN(progress) ? 0 : progress) + '% concluído',
                    Object: objective

                })
            });

            query.planning = planningId
            query.hierarchy = ['child', 'none']
            query.deactivate = false
            that.objectiveService.getObjectivesByPlanning(query)
                .then(function (res) {
                    var sonsObjectives = res.data

                    _.forEach(sonsObjectives, function (son) {
                        var progress = son.progress,
                            keys = that.calculateLength(son.keyResults)
                        that.childsObjectives.push({
                            id: son._id,
                            parentId: (son.mainObjective) ? son.mainObjective._id : null,
                            Name: son.name,
                            Image: "https://s3.amazonaws.com/getokr-storage/target.png",
                            Progress: (isNaN(progress) ? 0 : progress) + '% concluído',
                            User: (son.owner) ? son.owner.firstName + ' ' + son.owner.lastName : son.team.name,
                            keyResults: "Resultados Chaves " + keys,
                            Object: son
                        })
                    });
                    Promise.all(that.childsObjectives)
                        .then(function (res) {
                            that.drawDiagram(that.childsObjectives)
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                })
        })
        .catch(function (err) {
            console.log(err)
        })
}

DiagramController.prototype.filterObjectivesByTags = function (childObjective, filterTags) {
    var tagNotFound = false

    _.forEach(filterTags, function (tag) {
        if ((_.indexOf(childObjective._id.tags, tag)) == -1) {
            tagNotFound = true
        }
    })
    return tagNotFound
}

DiagramController.prototype.loadPlannings = function () {
    var that = this

    var query = {
        type: 'company'
    }

    that.planningSessionService.getPlanningsByType(query)
        .then(function (res) {
            that.companyPlannings = res.data

            if (!that.companyPlannings)
                return

            if (that.$localStorage.selectedCompanyPlanning != undefined) {
                that.selectedCompanyPlanning = JSON.parse(that.$localStorage.selectedCompanyPlanning)

                that.planningSessionService.getPlanningById(that.selectedCompanyPlanning)
                    .then(function (res) {
                        that.selectedCompanyPlanning = res.data
                        that.plannings = that.selectedCompanyPlanning.childPlannings

                        that.saveSelectedCompanyPlanning()
                        that.setSelectedPlanning(that.selectedCompanyPlanning)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            } else {
                that.selectedCompanyPlanning = that.companyPlannings[that.companyPlannings.length - 1]
                if (that.selectedCompanyPlanning) {
                    that.plannings = that.selectedCompanyPlanning.childPlannings
                    that.saveSelectedCompanyPlanning()
                    that.setSelectedPlanning(that.selectedCompanyPlanning)
                }
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}

DiagramController.prototype.setSelectedPlanning = function (selectedCompanyPlanning) {
    var that = this

    if (that.selectedCompanyPlanning.childPlannings) {
        that.filterChildPlannings(that.selectedCompanyPlanning)

        if (that.$localStorage.selectedPlanning != undefined)
            that.selectedPlanning = JSON.parse(that.$localStorage.selectedPlanning)

        if (!that.selectedPlanning) {
            that.selectedPlanning = that.plannings[that.plannings.length - 1]
            that.saveSelectedObjectivePlanning()
        }
    }
    that.loadObjectives()
}

DiagramController.prototype.saveSelectedObjectivePlanning = function () {
    if (this.selectedPlanning) {
        delete this.$localStorage.selectedPlanning
        this.$localStorage.selectedPlanning = JSON.stringify(this.selectedPlanning)
        this.$window.location.reload()
    }

}

DiagramController.prototype.saveSelectedCompanyPlanning = function () {
    if (this.selectedCompanyPlanning) {
        delete this.$localStorage.selectedCompanyPlanning
        this.$localStorage.selectedCompanyPlanning = JSON.stringify(this.selectedCompanyPlanning._id)
    }
}

DiagramController.prototype.filterChildPlannings = function (planning) {
    this.plannings = planning.childPlannings

    this.planningSessionService.setPlanningListFactory(this.plannings)

    this.selectedPlanning = planning.childPlannings[planning.childPlannings.length - 1]

    if (!this.selectedPlanning)
        this.objectives = []
};

DiagramController.prototype.loadTags = function () {
    var that = this

    this.companyService.getCompanyTags(that.user.company)
        .then(function (res) {
            that.tags = res.data.map(function (tag) {
                that.tagsForSelection.push(tag.name);
                return {
                    name: tag.name,
                    letter: tag.name.substring(0, 1).toUpperCase()
                }
            })
        })
        .catch(function (err) {
            console.log(err)
        })
}

DiagramController.prototype.setupTag = function () {
    var toggle = angular.element('.tag-component .dropdown-toggle');
    var searchBar = angular.element('.tag-component .dropdown-header input');
    var select = angular.element('.tag-component .appointment-tag-toggle');

    toggle.html('<span> Tags</span>');
    toggle.addClass('fa fa-tags appointment-tags-toggle');
    searchBar.attr('placeholder', 'Pesquisar tag');
};

DiagramController.prototype.calculateLength = function (keyResults) {

    if (keyResults == undefined)
        return 1

    var length = keyResults.length
    _.forEach(keyResults, function (key) {
        if (!key._id.isActive)
            length--
    })
    return length
}

DiagramController.prototype.changeSelectedPlanning = function () {
    this.loadObjectives()
    this.saveSelectedObjectivePlanning()
}

DiagramController.prototype.changeSelectedCompanyPlanning = function () {
    this.filterChildPlannings(this.selectedCompanyPlanning)
    this.loadObjectives()
    this.saveSelectedCompanyPlanning()
}

DiagramController.prototype.mixpanel = function (msg) {
    mixpanel.track(msg);
}

DiagramController.prototype.drawDiagram = function (childsObjectives) {
    var that = this;
    var modalService = that.modalService
    var okrchart = new getOkrChart(document.getElementById("people"), {
        linkType: "B",
        theme: "mytheme",
        enableSearch: true,
        enableEdit: false,
        enableDetailsView: false,
        expandToLevel: 100,
        scale: 0.7,
        primaryFields: ["Name", "User", "Progress", "keyResults"],
        color: "neutralgrey",
        updatedEvent: function () {
            initDiagram();
        },
        orientation: getOkrChart.RO_LEFT_PARENT_TOP,
        dataSource: childsObjectives,
        renderNodeEvent: renderNodeEventHandler
    });


    function renderNodeEventHandler(sender, args) {
        args.content[2] = args.content[2].replace("NameObjective", args.node.data.Name);
        if (args.node.data.Object.hierarchy == 'main') {
            args.content[1] = args.content[1].replace("btn", "nobtn");
            args.content[3] = args.content[3].replace("text", "text class='fontMain' x='100' y='140'");
            args.content[4] = args.content[4].replace("image", "image preserveAspectRatio='xMidYMid slice' clip-path='url(#clip)' x='30' y='100' height='65' width='65'");
            args.content[4] = args.content[4].replace("circle", "circle cx='60' cy='130'");
        }

        if (!args.node.data.Object.keyResults.length && args.node.data.Object.hierarchy != 'main') {
            args.content[1] = args.content[1].replace("btn", "nobtn")
        }

        if (args.node.data.Object.hierarchy != 'main') {
            args.content[2] = args.content[2].replace("main", "child")
            args.content[2] = args.content[2].replace("get-text", "get-text text-underline")
        }

    }

    function getNodeByClickedBtn(el) {
        while (el.parentNode) {
            el = el.parentNode;
            if (el.getAttribute("data-node-id"))
                return el;
        }
        return null;
    }

    var initDiagram = function () {
        var btns = document.getElementsByClassName("btn-key");
        var btnCollapse = document.getElementsByClassName("btn-collapse");
        var objectives = document.getElementsByClassName("get-text-0");
        var svgview = document.getElementsByTagName("svg");


        for (var i = 0; i < objectives.length; i++) {
            objectives[i].addEventListener("click", function (e) {
                var nodeElement = getNodeByClickedBtn(this);
                var action = this.getAttribute("data-action");
                var id = nodeElement.getAttribute("data-node-id");
                var level = nodeElement.getAttribute("class");
                switch (action) {
                    case "child":
                        location.href = '#/objective/' + id;
                        break;
                }
            })
        }

        for (var i = 0; i < svgview.length; i++) {
            svgview[i].addEventListener("wheel", function (e) {
                e.stopPropagation();
                var delta = e.deltaY
                var viewBox = svgview[0].getAttribute("viewBox").split(/\s+|,/)
                var value0 = viewBox[0],
                    value1 = Number(viewBox[1]) + Number(delta),
                    value2 = viewBox[2],
                    value3 = viewBox[3]

                svgview[0].setAttribute('viewBox', value0 + "," + value1 + "," + value2 + "," + value3);
            });
        }


        for (var i = 0; i < btnCollapse.length; i++) {
            btnCollapse[i].addEventListener("click", function () {});
        }

        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function () {
                var nodeElement = getNodeByClickedBtn(this);
                var action = this.getAttribute("data-action");
                var id = nodeElement.getAttribute("data-node-id");
                var node = okrchart.nodes[id];

                switch (action) {
                    case "add":
                        modalService.searchModal('keyResultList', node.data.Object)
                        break;
                }
            });
        }
        that.loadPlanningsView = true
    }
    initDiagram();
}
