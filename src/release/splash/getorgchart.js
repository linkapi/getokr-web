var getOkrChartW;
getOrkChart = function (b, a) {
    this.config = {
        theme: "ula",
        color: "blue",
        enableEdit: true,
        enableZoom: true,
        enableSearch: true,
        enableMove: true,
        enableGridView: false,
        enableDetailsView: true,
        enablePrint: false,
        enableExportToImage: false,
        enableZoomOnNodeDoubleClick: true,
        scale: "auto",
        linkType: "M",
        orientation: getOrkChart.RO_TOP,
        primaryFields: ["Name", "Title"],
        photoFields: ["Image"],
        idField: null,
        parentIdField: null,
        secondParentIdField: null,
        levelSeparation: 100,
        siblingSeparation: 30,
        subtreeSeparation: 40,
        removeNodeEvent: "",
        updateNodeEvent: "",
        updatedEvent: "",
        insertNodeEvent: "",
        createNodeEvent: "",
        clickNodeEvent: "",
        renderNodeEvent: "",
        embededDefinitions: "",
        maxDepth: 30,
        dataSource: null,
        customize: [],
        expandToLevel: 3,
        boxSizeInPercentage: {
            minBoxSize: {
                width: 5,
                height: 5
            },
            boxSize: {
                width: null,
                height: null
            },
            maxBoxSize: {
                width: 100,
                height: 100
            }
        },
        layout: null
    };
    var d = getOrkChart.util._6("colorScheme");
    if (d) {
        this.config.color = d
    }
    if (a) {
        for (var c in this.config) {
            if (typeof (a[c]) != "undefined") {
                this.config[c] = a[c]
            }
        }
    }
    this._d();
    this.version = "2.4.8";
    this.theme = getOrkChart.themes[this.config.theme];
    this.element = b;
    this.nodes = {};
    this._ao = [];
    this._al = [];
    this._zw = [];
    this._zt = 0;
    this._zv = 0;
    this._aJ = null;
    this._aj = [];
    this._zf = new getOrkChart.node(-1, null, null, null, 2, 2);
    this._zj = {
        found: [],
        showIndex: 0,
        oldValue: "",
        timer: ""
    };
    this._aP = {};
    this._aT = null;
    this._a4 = null;
    this._zE = null;
    this.scale = null;
    this.maxScale = null;
    this.maxScale = null;
    this._S = false;
    if (this.theme.defs) {
        this.config.embededDefinitions += this.theme.defs
    }
    for (id in this.config.customize) {
        if (this.config.customize[id].theme) {
            this.config.embededDefinitions += getOrkChart.themes[this.config.customize[id].theme].defs
        }
    }
    this._X = new getOrkChart._X(this.element);
    this._ae();
    this.load()
};
getOrkChart.prototype._ae = function () {
    this._f();
    var a = getOrkChart.INNER_HTML.replace("[theme]", this.config.theme).replace("[color]", this.config.color).replace(/\[height]/g, this._a1).replace(/\[toolbar-height]/g, this.theme.toolbarHeight);
    if (typeof (getOkrChartW) !== "undefined") {
        a = a.slice(0, -6);
        a += ""
    }
    this.element.innerHTML = a
};
getOrkChart.prototype.resize = function () {
    this._f();
    this._X._t.style.height = this._a1 + "px";
    this._X._u.style.height = this._a1 + "px";
    this._X._9.style.height = this._a1 + "px"
};
getOrkChart.prototype._f = function () {
    this._zN = get._c().msie ? this.element.clientWidth : window.getComputedStyle(this.element, null).width;
    this._zN = parseInt(this._zN);
    if (this._zN < 3) {
        this._zN = 1024;
        this.element.style.width = "1024px"
    }
    this._zH = get._c().msie ? this.element.clientHeight : window.getComputedStyle(this.element, null).height;
    this._zH = parseInt(this._zH);
    if (this._zH < 3) {
        this._zH = parseInt((this._zN * 9) / 16);
        this.element.style.height = this._zH + "px"
    }
    this._a2 = this._zN;
    this._a1 = this._zH - this.theme.toolbarHeight
};
getOrkChart.prototype.changeColorScheme = function (a) {
    if (this.config.color == a) {
        return
    }
    this._X._zY.className = this._X._zY.className.replace(this.config.color, a);
    this.config.color = a
};
getOrkChart.prototype._a7 = function () {
    this._ao = [];
    this._al = [];
    this._zw = [];
    getOrkChart._T(this, this._zf, 0);
    getOrkChart._zo(this, this._zf, 0, 0, 0);
    getOrkChart._zC(this)
};
getOrkChart.prototype._zQ = function (b, a) {
    if (this._ao[a] == null) {
        this._ao[a] = 0
    }
    if (this._ao[a] < b.h) {
        this._ao[a] = b.h
    }
};
getOrkChart.prototype._zA = function (b, a) {
    if (this._al[a] == null) {
        this._al[a] = 0
    }
    if (this._al[a] < b.w) {
        this._al[a] = b.w
    }
};
getOrkChart.prototype._zZ = function (b, a) {
    b.leftNeighbor = this._zw[a];
    if (b.leftNeighbor != null) {
        b.leftNeighbor.rightNeighbor = b
    }
    this._zw[a] = b
};
getOrkChart.prototype._2 = function (a) {
    switch (this.config.orientation) {
        case getOrkChart.RO_TOP:
        case getOrkChart.RO_TOP_PARENT_LEFT:
        case getOrkChart.RO_BOTTOM:
        case getOrkChart.RO_BOTTOM_PARENT_LEFT:
            return a.w;
        case getOrkChart.RO_RIGHT:
        case getOrkChart.RO_RIGHT_PARENT_TOP:
        case getOrkChart.RO_LEFT:
        case getOrkChart.RO_LEFT_PARENT_TOP:
            return a.h
    }
    return 0
};
getOrkChart.prototype._P = function (g, d, e) {
    if (d >= e) {
        return g
    }
    if (g._N() == 0) {
        return null
    }
    var f = g._N();
    for (var a = 0; a < f; a++) {
        var b = g._Y(a);
        var c = this._P(b, d + 1, e);
        if (c != null) {
            return c
        }
    }
    return null
};
getOrkChart.prototype._A = function () {
    var e = [];
    var g;
    if (this._X._v) {
        g = getOrkChart.util._7(this._X)
    } else {
        g = this._8()
    }
    e.push(getOrkChart.OPEN_SVG.replace("[defs]", this.config.embededDefinitions).replace("[viewBox]", g.toString()));
    for (var a in this.nodes) {
        var c = this.nodes[a];
        if (this.isCollapsed(c)) {
            continue
        }
        var d = c.draw(this.config);
        this._V("renderNodeEvent", {
            node: c,
            content: d
        });
        e.push(d.join(""));
        var b = c._Z(this.config);
        e.push(b)
    }
    if (this.config.secondParentIdField != null) {
        for (var a in this.nodes) {
            var f = this.nodes[a]._W(this.config);
            e.push(f)
        }
    }
    e.push(getOrkChart.buttons.draw());
    e.push(getOrkChart.CLOSE_SVG);
    return e.join("")
};
getOrkChart.prototype._r = function (a, i, c, b, g, h) {
    var d = a;
    var f = null;
    if (i) {
        f = i * ((this._a2 / 100) / (b.w + g))
    }
    var e = null;
    if (c) {
        e = c * ((this._a1 / 100) / (b.h + h))
    }
    if (f != null && e != null) {
        d = f > e ? e : f
    } else {
        if (f != null) {
            d = f
        } else {
            if (e != null) {
                d = e
            }
        }
    }
    return d
};
getOrkChart.prototype._8 = function () {
    var p = this.config.siblingSeparation / 2;
    var q = this.config.levelSeparation / 2;
    var o;
    var d;
    var a = 0;
    var b = 0;
    var c = this.nodes[Object.keys(this.nodes)[0]];
    var f = 0;
    var g = 0;
    var h = 0;
    var i = 0;
    for (var e in this.nodes) {
        var j = this.nodes[e];
        if (j.x > f) {
            f = j.x
        }
        if (j.y > g) {
            g = j.y
        }
        if (j.x < h) {
            h = j.x
        }
        if (j.y < i) {
            i = j.y
        }
    }
    if (this.config.boxSizeInPercentage != null) {
        var l = this.config.siblingSeparation;
        var m = this.config.levelSeparation;
        switch (this.config.orientation) {
            case getOrkChart.RO_RIGHT:
            case getOrkChart.RO_RIGHT_PARENT_TOP:
            case getOrkChart.RO_LEFT:
            case getOrkChart.RO_LEFT_PARENT_TOP:
                var l = this.config.levelSeparation;
                var m = this.config.siblingSeparation;
                break
        }
        this.scale = this._r(this.config.scale, this.config.boxSizeInPercentage.boxSize.width, this.config.boxSizeInPercentage.boxSize.height, c, l, m);
        this.minScale = this._r(0, this.config.boxSizeInPercentage.minBoxSize.width, this.config.boxSizeInPercentage.minBoxSize.height, c, l, m);
        this.maxScale = this._r(10000000, this.config.boxSizeInPercentage.maxBoxSize.width, this.config.boxSizeInPercentage.maxBoxSize.height, c, l, m)
    }
    switch (this.config.orientation) {
        case getOrkChart.RO_TOP:
        case getOrkChart.RO_TOP_PARENT_LEFT:
            o = Math.abs(h) + Math.abs(f) + this.theme.size[0];
            d = Math.abs(i) + Math.abs(g) + this.theme.size[1];
            var k = this._a2 / this._a1;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = (-d) / 2 + (g - i) / 2 + this.theme.size[1] / 2
                } else {
                    o = d * k;
                    a = (-o) / 2 + (f - h) / 2 + this.theme.size[0] / 2
                }
            } else {
                o = (this._a2) / this.scale;
                d = (this._a1) / this.scale;
                if (this.config.orientation == getOrkChart.RO_TOP) {
                    a = c.x - o / 2 + c.w / 2
                }
            }
            this.initialViewBoxMatrix = [-p + a, q + b, o + this.config.siblingSeparation, d];
            break;
        case getOrkChart.RO_BOTTOM:
        case getOrkChart.RO_BOTTOM_PARENT_LEFT:
            o = Math.abs(h) + Math.abs(f) + this.theme.size[0];
            d = Math.abs(i) + Math.abs(g);
            var k = this._a2 / this._a1;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = (-d) / 2 + (g - i) / 2
                } else {
                    o = d * k;
                    a = (-o) / 2 + (f - h) / 2 + this.theme.size[0] / 2
                }
            } else {
                o = (this._a2) / this.scale;
                d = (this._a1) / this.scale;
                if (this.config.orientation == getOrkChart.RO_BOTTOM) {
                    a = c.x - o / 2 + c.w / 2
                }
            }
            this.initialViewBoxMatrix = [-p + a, -q - d - b, o + this.config.siblingSeparation, d];
            break;
        case getOrkChart.RO_RIGHT:
        case getOrkChart.RO_RIGHT_PARENT_TOP:
            o = Math.abs(h) + Math.abs(f);
            d = Math.abs(i) + Math.abs(g) + this.theme.size[1];
            var k = this._a2 / this._a1;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = (-d) / 2 + (g - i) / 2 + this.theme.size[1] / 2
                } else {
                    o = d * k;
                    a = (-o) / 2 + (f - h) / 2
                }
            } else {
                o = (this._a2) / this.scale;
                d = (this._a1) / this.scale;
                if (this.orientation == getOrkChart.RO_RIGHT) {
                    b = c.y - d / 2 + c.h / 2
                }
            }
            this.initialViewBoxMatrix = [-o - q - a, -p + b, o, d + this.config.siblingSeparation];
            break;
        case getOrkChart.RO_LEFT:
        case getOrkChart.RO_LEFT_PARENT_TOP:
            o = Math.abs(h) + Math.abs(f) + this.theme.size[0];
            d = Math.abs(i) + Math.abs(g) + this.theme.size[1];
            var k = this._a2 / this._a1;
            var n = o / d;
            if (this.scale === "auto") {
                if (k < n) {
                    d = o / k;
                    b = (-d) / 2 + (g - i) / 2 + this.theme.size[1] / 2
                } else {
                    o = d * k;
                    a = (-o) / 2 + (f - h) / 2 + this.theme.size[0] / 2
                }
            } else {
                o = (this._a2) / this.scale;
                d = (this._a1) / this.scale;
                if (this.config.orientation == getOrkChart.RO_LEFT) {
                    b = c.y - d / 2 + c.h / 2
                }
            }
            this.initialViewBoxMatrix = [q + a, -p + b, o, d + this.config.siblingSeparation];
            break
    }
    return this.initialViewBoxMatrix.toString()
};
getOrkChart.prototype.draw = function (a) {
    this._X._a0();
    this._a7();
    this._X._t.innerHTML = this._A();
    this._X._a9();
    if (this.config.enableSearch) {
        this._X._zm.style.display = "inherit";
        this._X._aD.style.display = "inherit";
        this._X._za.style.display = "inherit"
    }
    if (this.config.enableZoom) {
        this._X._zL.style.display = "inherit";
        this._X._zK.style.display = "inherit"
    }
    if (this.config.enableGridView) {
        this._X._0.style.display = "inherit"
    }
    if (this.config.enablePrint) {
        this._X._zs.style.display = "inherit"
    }
    if (this.config.enableExportToImage) {
        this._X._D.style.display = "inherit"
    }
    if (this.config.enableMove) {
        this._X._zr.style.display = "inherit";
        this._X._am.style.display = "inherit";
        this._X._Q.style.display = "inherit";
        this._X._zB.style.display = "inherit"
    }
    this._e();
    this._X._zG();
    this._z(a);
    this.showMainView();
    return this
};
getOrkChart.prototype._z = function (a) {
    var g = [];
    for (var d in this.nodes) {
        if (this.nodes[d]._zJ == null || this.nodes[d]._zM == null) {
            continue
        }
        if (this.nodes[d]._zJ == this.nodes[d].x && this.nodes[d]._zM == this.nodes[d].y) {
            continue
        }
        var f = this._X.getNodeById(d);
        if (!f) {
            continue
        }
        g.push(this.nodes[d])
    }
    for (var c = 0; c < g.length; c++) {
        var e = g[c];
        var f = this._X.getNodeById(e.id);
        var b = getOrkChart.util._5(f);
        var h = b.slice(0);
        h[4] = e.x;
        h[5] = e.y;
        get._z(f, {
            transform: b
        }, {
            transform: h
        }, 200, get._z._aM, function (i) {
            if (a && g[g.length - 1].id == i[0].getAttribute("data-node-id")) {
                a()
            }
        })
    }
    if (a && g.length == 0) {
        a()
    }
};
getOrkChart.prototype._aS = function (c, b) {
    this._q(c, "mouseup", this._aX);
    this._q(c, "mouseleave", this._aX);
    var d = this;
    var a = 100;
    c.interval = setInterval(function () {
        switch (c) {
            case d._X._zr:
                d.move("right", a);
                break;
            case d._X._am:
                d.move("left", a);
                break;
            case d._X._Q:
                d.move("up", a);
                break;
            case d._X._zB:
                d.move("down", a);
                break
        }
        if (a > 10) {
            a--
        }
    }, 20)
};
getOrkChart.prototype._aX = function (b, a) {
    this._zd(b, "mouseup", this._aX);
    this._zd(b, "mouseleave", this._aX);
    clearInterval(b.interval)
};
getOrkChart.prototype.move = function (f, a, b) {
    var h = getOrkChart.util._7(this._X);
    var e = h.slice(0);
    var c = this.theme.size[0] / a;
    var d = this.theme.size[1] / a;
    var g = false;
    switch (f) {
        case "left":
            e[0] -= c;
            break;
        case "down":
            e[1] -= d;
            break;
        case "right":
            e[0] += c;
            break;
        case "up":
            e[1] += d;
            break;
        default:
            e[0] = f[0];
            e[1] = f[1];
            e[2] = f[2];
            e[3] = f[3];
            g = true;
            break
    }
    if (g) {
        get._z(this._X._v, {
            viewBox: h
        }, {
            viewBox: e
        }, 300, get._z._av, function () {
            if (b) {
                b()
            }
        })
    } else {
        this._X._v.setAttribute("viewBox", e)
    }
    return this
};
getOrkChart.prototype.isCollapsed = function (a) {
    if ((a.parent == this._zf) || (a.parent == null)) {
        return false
    }
    if (a.parent.collapsed != getOrkChart.EXPANDED) {
        return true
    } else {
        return this.isCollapsed(a.parent)
    }
    return false
};
getOrkChart.prototype._e = function () {
    if (this.config.enableGridView) {
        this._q(this._X._0, "click", this._zW);
        this._q(this._X._aq, "click", this._zS)
    }
    if (this.config.enablePrint) {
        this._q(this._X._zs, "click", this._zx)
    }
    if (this.config.enableExportToImage) {
        this._q(this._X._D, "click", this._C)
    }
    if (this.config.enableMove) {
        if ("ontouchstart" in window) {
            this._q(this._X._t, "touchstart", this._y, "canvasContainer");
            this._q(this._X._t, "touchmove", this._b, "canvasContainer");
            this._q(this._X._t, "touchend", this._g, "canvasContainer")
        } else {
            this._q(this._X._zr, "mousedown", this._aS);
            this._q(this._X._am, "mousedown", this._aS);
            this._q(this._X._Q, "mousedown", this._aS);
            this._q(this._X._zB, "mousedown", this._aS);
            this._q(this._X._t, "mousemove", this._aA);
            this._q(this._X._t, "mousedown", this._aQ);
            this._q(this._X._t, "mouseup", this._aZ);
            this._q(this._X._t, "mouseleave", this._aZ)
        }
    }
    this._q(window, "keydown", this._an);
    for (i = 0; i < this._X._aR.length; i++) {
        if ("ontouchstart" in window && "onorientationchange" in window) {
            this._q(this._X._aR[i], "touchstart", this._aF)
        } else {
            this._q(this._X._aR[i], "click", this._aF)
        }
    }
    for (i = 0; i < this._X._aY.length; i++) {
        if ("ontouchstart" in window && "onorientationchange" in window) {
            this._q(this._X._aY[i], "touchstart", this._aU);
            this._q(this._X._aY[i], "touchmove", this._aN);
            this._q(this._X._aY[i], "touchend", this._aH)
        } else {
            this._q(this._X._aY[i], "mousedown", this._aG);
            this._q(this._X._aY[i], "click", this._aV);
            this._q(this._X._aY[i], "mouseover", this._aB)
        }
    }
    this._q(this._X._o, "click", this._zg);
    if (this.config.enableZoom) {
        this._q(this._X._zK, "click", this._zO);
        this._q(this._X._zL, "click", this._zP);
        this._q(this._X._t, "DOMMouseScroll", this._zu);
        // this._q(this._X._t, "mousewheel", this._zu)
    }
    if (this.config.enableSearch) {
        this._q(this._X._aD, "click", this._aC);
        this._q(this._X._za, "click", this._zz);
        this._q(this._X._zm, "keyup", this._zi);
        this._q(this._X._zm, "paste", this._zk)
    }
    var b = "onorientationchange" in window,
        a = b ? "orientationchange" : "resize";
    this._q(window, a, this._zc);
    if ("ontouchstart" in window && "onorientationchange" in window) {
        this._q(this._X._u, "touchstart", this._zh, "detilsView");
        this._q(this._X._u, "touchmove", this._zy, "detilsView")
    }
};
getOrkChart.prototype._q = function (b, c, d, e) {
    if (!e) {
        e = ""
    }
    if (!b.getListenerList) {
        b.getListenerList = {}
    }
    if (b.getListenerList[c + e]) {
        return
    }

    function g(h, j) {
        return function () {
            if (j) {
                return j.apply(h, [this, arguments])
            }
        }
    }
    d = g(this, d);

    function f(h) {
        var j = d.apply(this, arguments);
        if (j === false) {
            h.stopPropagation();
            h.preventDefault()
        }
        return (j)
    }

    function a() {
        var h = d.call(b, window.event);
        if (h === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true
        }
        return (h)
    }
    if (b.addEventListener) {
        b.addEventListener(c, f, false)
    } else {
        b.attachEvent("on" + c, a)
    }
    b.getListenerList[c + e] = f
};
getOrkChart.prototype._zd = function (a, b) {
    if (a.getListenerList[b]) {
        var c = a.getListenerList[b];
        a.removeEventListener(b, c, false);
        delete a.getListenerList[b]
    }
};
getOrkChart.prototype._zU = function (b, a) {
    if (!this._E) {
        this._E = {}
    }
    if (!this._E[b]) {
        this._E[b] = new Array()
    }
    this._E[b].push(a)
};
getOrkChart.prototype._d = function () {
    if (this.config.removeNodeEvent) {
        this._zU("removeNodeEvent", this.config.removeNodeEvent)
    }
    if (this.config.updateNodeEvent) {
        this._zU("updateNodeEvent", this.config.updateNodeEvent)
    }
    if (this.config.createNodeEvent) {
        this._zU("createNodeEvent", this.config.createNodeEvent)
    }
    if (this.config.clickNodeEvent) {
        this._zU("clickNodeEvent", this.config.clickNodeEvent)
    }
    if (this.config.renderNodeEvent) {
        this._zU("renderNodeEvent", this.config.renderNodeEvent)
    }
    if (this.config.insertNodeEvent) {
        this._zU("insertNodeEvent", this.config.insertNodeEvent)
    }
    if (this.config.updatedEvent) {
        this._zU("updatedEvent", this.config.updatedEvent)
    }
};
getOrkChart.prototype._V = function (b, a) {
    if (!this._E) {
        return true
    }
    if (!this._E[b]) {
        return true
    }
    var d = true;
    if (this._E[b]) {
        var c;
        for (c = 0; c < this._E[b].length; c++) {
            if (this._E[b][c](this, a) === false) {
                d = false
            }
        }
    }
    return d
};
getOrkChart._X = function (a) {
    this.element = a;
    this._n
};
getOrkChart._X.prototype._a0 = function () {
    this._zY = this.element.getElementsByTagName("div")[0];
    var a = this._zY.children;
    this._zR = a[0];
    this._t = a[1];
    this._u = a[2];
    this._9 = a[3]
};
getOrkChart._X.prototype._a9 = function () {
    this._v = this._t.getElementsByTagName("svg")[0];
    this._a6 = this._v.getElementsByTagName("g")[0];
    this._zF = this._zR.getElementsByTagName("div")[0];
    var d = this._zF.getElementsByTagName("div")[0];
    var a = this._zF.getElementsByTagName("div")[1];
    var b = this._zF.getElementsByTagName("div")[2];
    this._zm = d.getElementsByTagName("input")[0];
    var c = d.getElementsByTagName("a");
    this._aD = c[1];
    this._za = c[0];
    this._zL = c[2];
    this._zK = c[3];
    this._0 = c[4];
    this._zs = c[5];
    this._D = c[6];
    this._m = this._u.getElementsByTagName("div")[0];
    this._i = this._u.getElementsByTagName("div")[1];
    this._aR = this._a6.querySelectorAll("[data-btn-action]");
    this._aY = this._a6.querySelectorAll("[data-node-id]");
    c = a.getElementsByTagName("a");
    this._o = c[0];
    c = b.getElementsByTagName("a");
    this._aq = c[0];
    this._zD = [];
    var e = this._v.getElementsByTagName("text");
    for (r = 0; r < e.length; r++) {
        this._zD.push(e[r])
    }
    this._zr = this._zY.getElementsByClassName("get-right")[0];
    this._am = this._zY.getElementsByClassName("get-left")[0];
    this._Q = this._zY.getElementsByClassName("get-down")[0];
    this._zB = this._zY.getElementsByClassName("get-up")[0]
};
getOrkChart._X.prototype._zb = function (a) {
    this._t.style.overflow = "auto";
    this._v.style.width = (a + "px")
};
getOrkChart._X.prototype._M = function () {
    return this._i.getElementsByTagName("input")[0]
};
getOrkChart._X.prototype._U = function () {
    var a = this._i.getElementsByTagName("input");
    var c = {};
    for (i = 1; i < a.length; i++) {
        var d = a[i].value;
        var b = a[i].parentNode.previousSibling.innerHTML;
        c[b] = d
    }
    return c
};
getOrkChart._X.prototype._I = function () {
    return this._i.getElementsByTagName("input")
};
getOrkChart._X.prototype._J = function () {
    var a = this._i.getElementsByTagName("select");
    for (i = 0; i < a.length; i++) {
        if (a[i].className == "get-oc-labels") {
            return a[i]
        }
    }
    return null
};
getOrkChart._X.prototype._K = function () {
    var a = this._i.getElementsByTagName("select");
    for (i = 0; i < a.length; i++) {
        if (a[i].className == "get-oc-select-parent") {
            return a[i]
        }
    }
    return null
};
getOrkChart._X.prototype.getNodeById = function (a) {
    return this._a6.querySelector("[data-node-id='" + a + "']")
};
getOrkChart._X.prototype.removeLinks = function () {
    var a = this._a6.querySelectorAll("[data-link-id]");
    var b = a.length;
    while (b--) {
        a[b].parentNode.removeChild(a[b])
    }
};
getOrkChart._X.prototype.getButtonByType = function (a) {
    return this._a6.querySelector("[data-btn-action='" + a + "']")
};
getOrkChart._X.prototype._zG = function (a) {
    var c;
    if (!a) {
        c = this._zD
    } else {
        c = this.getNodeById(a).getElementsByTagName("text")
    }
    for (i = 0; i < c.length; i++) {
        var e = c[i].getAttribute("x");
        var d = c[i].getAttribute("width");
        if (c[i].offsetParent === null) {
            return
        }
        var b = c[i].getComputedTextLength();
        while (b > d) {
            c[i].textContent = c[i].textContent.substring(0, c[i].textContent.length - 4);
            c[i].textContent += "...";
            b = c[i].getComputedTextLength()
        }
    }
};
getOrkChart.SCALE_FACTOR = 1.2;
getOrkChart.INNER_HTML = '<div class="get-[theme] get-[color] get-org-chart"><div class="get-oc-tb"><div><div style="height:[toolbar-height]px;"><input placeholder="Buscar Objetivo" type="text" /><a title="previous" class="get-prev get-disabled" href="javascript:void(0)">&nbsp;</a><a title="next" class="get-next get-disabled" href="javascript:void(0)">&nbsp;</a><a class="get-minus" title="zoom out" href="javascript:void(0)">&nbsp;</a><a class="get-plus" title="zoom in" href="javascript:void(0)">&nbsp;</a><a href="javascript:void(0)" class="get-grid-view" title="grid view">&nbsp;</a><a href="javascript:void(0)" class="get-print" title="print">&nbsp;</a><a href="javascript:void(0)" class="get-export-to-image" title="export to image">&nbsp;</a></div ><div style="height:[toolbar-height]px;"><a title="previous page" class="get-prev-page" href="javascript:void(0)">&nbsp;</a></div><div style="height:[toolbar-height]px;"><a title="previous page" class="get-prev-page" href="javascript:void(0)">&nbsp;</a></div></div></div><div class="get-oc-c" style="height:[height]px;"></div><div class="get-oc-v" style="height:[height]px;"><div class="get-image-pane"></div><div class="get-data-pane"></div></div><div class="get-oc-g" style="height:[height]px;"></div><div class="get-left"><div class="get-left-icon"></div></div><div class="get-right"><div class="get-right-icon"></div></div><div class="get-up"><div class="get-up-icon"></div></div><div class="get-down"><div class="get-down-icon"></div></div></div>';
getOrkChart.DETAILS_VIEW_INPUT_HTML = '<div data-field-name="[label]"><div class="get-label">[label]</div><div class="get-data"><input value="[value]"/></div></div>';
getOrkChart.DETAILS_VIEW_USER_LOGO = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"  xmlns:xml="http://www.w3.org/XML/1998/namespace" viewBox="0 0 50 50" class="get-user-logo" preserveAspectRatio="xMaxYMin meet"><g><path class="get-user-logo" d="M258.744,293.214c70.895,0,128.365-57.472,128.365-128.366c0-70.896-57.473-128.367-128.365-128.367 c-70.896,0-128.368,57.472-128.368,128.367C130.377,235.742,187.848,293.214,258.744,293.214z"/><path d="M371.533,322.432H140.467c-77.577,0-140.466,62.909-140.466,140.487v12.601h512v-12.601   C512,385.341,449.112,322.432,371.533,322.432z"/></g></svg>';
getOrkChart.DETAILS_VIEW_USER_LOGO = '<svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 482.9 482.9" style="enable-background:new 0 0 482.9 482.9;" xml:space="preserve" class="get-user-logo">    <path d="M239.7,260.2c0.5,0,1,0,1.6,0c0.2,0,0.4,0,0.6,0c0.3,0,0.7,0,1,0c29.3-0.5,53-10.8,70.5-30.5 c38.5-43.4,32.1-117.8,31.4-124.9c-2.5-53.3-27.7-78.8-48.5-90.7C280.8,5.2,262.7,0.4,242.5,0h-0.7c-0.1,0-0.3,0-0.4,0h-0.6 c-11.1,0-32.9,1.8-53.8,13.7c-21,11.9-46.6,37.4-49.1,91.1c-0.7,7.1-7.1,81.5,31.4,124.9C186.7,249.4,210.4,259.7,239.7,260.2z M164.6,107.3c0-0.3,0.1-0.6,0.1-0.8c3.3-71.7,54.2-79.4,76-79.4h0.4c0.2,0,0.5,0,0.8,0c27,0.6,72.9,11.6,76,79.4 c0,0.3,0,0.6,0.1,0.8c0.1,0.7,7.1,68.7-24.7,104.5c-12.6,14.2-29.4,21.2-51.5,21.4c-0.2,0-0.3,0-0.5,0l0,0c-0.2,0-0.3,0-0.5,0 c-22-0.2-38.9-7.2-51.4-21.4C157.7,176.2,164.5,107.9,164.6,107.3z"/> <path d="M446.8,383.6c0-0.1,0-0.2,0-0.3c0-0.8-0.1-1.6-0.1-2.5c-0.6-19.8-1.9-66.1-45.3-80.9c-0.3-0.1-0.7-0.2-1-0.3 c-45.1-11.5-82.6-37.5-83-37.8c-6.1-4.3-14.5-2.8-18.8,3.3c-4.3,6.1-2.8,14.5,3.3,18.8c1.7,1.2,41.5,28.9,91.3,41.7 c23.3,8.3,25.9,33.2,26.6,56c0,0.9,0,1.7,0.1,2.5c0.1,9-0.5,22.9-2.1,30.9c-16.2,9.2-79.7,41-176.3,41 c-96.2,0-160.1-31.9-176.4-41.1c-1.6-8-2.3-21.9-2.1-30.9c0-0.8,0.1-1.6,0.1-2.5c0.7-22.8,3.3-47.7,26.6-56 c49.8-12.8,89.6-40.6,91.3-41.7c6.1-4.3,7.6-12.7,3.3-18.8c-4.3-6.1-12.7-7.6-18.8-3.3c-0.4,0.3-37.7,26.3-83,37.8 c-0.4,0.1-0.7,0.2-1,0.3c-43.4,14.9-44.7,61.2-45.3,80.9c0,0.9,0,1.7-0.1,2.5c0,0.1,0,0.2,0,0.3c-0.1,5.2-0.2,31.9,5.1,45.3 c1,2.6,2.8,4.8,5.2,6.3c3,2,74.9,47.8,195.2,47.8s192.2-45.9,195.2-47.8c2.3-1.5,4.2-3.7,5.2-6.3 C447,415.5,446.9,388.8,446.8,383.6z"/> </svg>';
getOrkChart.DETAILS_VIEW_ID_INPUT = '<input value="[personId]" type="hidden"></input>';
getOrkChart.DETAILS_VIEW_ID_IMAGE = '<img src="[src]"  />';
getOrkChart.HIGHLIGHT_SCALE_FACTOR = 1.2;
getOrkChart.MOVE_FACTOR = 2;
getOrkChart.RO_BOTTOM = 1;
getOrkChart.RO_RIGHT = 2;
getOrkChart.RO_LEFT = 3;
getOrkChart.RO_TOP_PARENT_LEFT = 4;
getOrkChart.RO_BOTTOM_PARENT_LEFT = 5;
getOrkChart.RO_RIGHT_PARENT_TOP = 6;
getOrkChart.RO_LEFT_PARENT_TOP = 7;
getOrkChart.OPEN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="[viewBox]"><defs>[defs]</defs><g>';
getOrkChart.CLOSE_SVG = "</svg>";
getOrkChart.OPEN_NODE = '<g data-node-id="[data-node-id]" class="get-level-[level] [nodeCssClass]" transform="matrix(1,0,0,1,[x],[y])">';
getOrkChart.CLOSE_NODE = "</g>";
getOrkChart.NOT_DEFINED = 0;
getOrkChart.COLLAPSED = 1;
getOrkChart.EXPANDED = 2;
getOrkChart.MIXED_HIERARCHY_RIGHT_LINKS = 0;
getOrkChart._T = function (h, g, d) {
    var c = null;
    g.x = 0;
    g.y = 0;
    g._zq = 0;
    g._ap = 0;
    g.level = d;
    g.leftNeighbor = null;
    g.rightNeighbor = null;
    h._zQ(g, d);
    h._zA(g, d);
    h._zZ(g, d);
    if (g.collapsed == getOrkChart.NOT_DEFINED) {
        g.collapsed = (h.config.expandToLevel && h.config.expandToLevel <= d && g._N() ? getOrkChart.COLLAPSED : getOrkChart.EXPANDED)
    }
    if (g._N() == 0 || d == h.config.maxDepth) {
        c = g._1();
        if (c != null) {
            g._zq = c._zq + h._2(c) + h.config.siblingSeparation
        } else {
            g._zq = 0
        }
    } else {
        var f = g._N();
        for (var a = 0; a < f; a++) {
            var b = g._Y(a);
            getOrkChart._T(h, b, d + 1)
        }
        var e = g._H(h);
        e -= h._2(g) / 2;
        c = g._1();
        if (c != null) {
            g._zq = c._zq + h._2(c) + h.config.siblingSeparation;
            g._ap = g._zq - e;
            getOrkChart._w(h, g, d)
        } else {
            if (h.config.orientation <= 3) {
                g._zq = e
            } else {
                g._zq = 0
            }
        }
    }
};
getOrkChart._w = function (t, m, g) {
    var a = m._O();
    var b = a.leftNeighbor;
    var c = 1;
    for (var d = t.config.maxDepth - g; a != null && b != null && c <= d;) {
        var i = 0;
        var h = 0;
        var o = a;
        var f = b;
        for (var e = 0; e < c; e++) {
            o = o.getParent();
            f = f.getParent();
            i += o._ap;
            h += f._ap
        }
        var s = (b._zq + h + t._2(b) + t.config.subtreeSeparation) - (a._zq + i);
        if (s > 0) {
            var q = m;
            var n = 0;
            for (; q != null && q != f; q = q._1()) {
                n++
            }
            if (q != null) {
                var r = m;
                var p = s / n;
                for (; r != f; r = r._1()) {
                    r._zq += s;
                    r._ap += s;
                    s -= p
                }
            }
        }
        c++;
        if (a._N() == 0) {
            a = t._P(m, 0, c)
        } else {
            a = a._O()
        }
        if (a != null) {
            b = a.leftNeighbor
        }
    }
};
getOrkChart._zo = function (h, d, b, i, k) {
    if (b <= h.config.maxDepth) {
        var j = h._zv + d._zq + i;
        var l = h._zt + k;
        var c = 0;
        var e = 0;
        var a = false;
        switch (h.config.orientation) {
            case getOrkChart.RO_TOP:
            case getOrkChart.RO_TOP_PARENT_LEFT:
            case getOrkChart.RO_BOTTOM:
            case getOrkChart.RO_BOTTOM_PARENT_LEFT:
                c = h._ao[b];
                e = d.h;
                break;
            case getOrkChart.RO_RIGHT:
            case getOrkChart.RO_RIGHT_PARENT_TOP:
            case getOrkChart.RO_LEFT:
            case getOrkChart.RO_LEFT_PARENT_TOP:
                c = h._al[b];
                a = true;
                e = d.w;
                break
        }
        d.x = j;
        d.y = l;
        if (a) {
            var g = d.x;
            d.x = d.y;
            d.y = g
        }
        switch (h.config.orientation) {
            case getOrkChart.RO_BOTTOM:
            case getOrkChart.RO_BOTTOM_PARENT_LEFT:
                d.y = -d.y - e;
                break;
            case getOrkChart.RO_RIGHT:
            case getOrkChart.RO_RIGHT_PARENT_TOP:
                d.x = -d.x - e;
                break
        }
        if (d._N() != 0) {
            getOrkChart._zo(h, d._O(), b + 1, i + d._ap, k + c + h.config.levelSeparation)
        }
        var f = d._4();
        if (f != null) {
            getOrkChart._zo(h, f, b, i, k)
        }
    }
};
getOrkChart._zC = function (e) {
    e._zv = e._zf.x;
    e._zt = e._zf.y;
    if (e._aJ) {
        var b = e.nodes[e._aJ.id];
        var c = e._aJ.old_x - b.x;
        var d = e._aJ.old_y - b.y;
        for (var a in e.nodes) {
            if (e.nodes[a].isVisible()) {
                e.nodes[a].x += c;
                e.nodes[a].y += d
            }
        }
    }
    e._aJ = null
};
getOrkChart.node = function (d, f, h, c, g, e, a, b) {
    this.id = d;
    this.pid = f;
    this.spid = h;
    this.displayPid = null;
    this.data = c;
    this.w = g[0];
    this.h = g[1];
    this.parent = null;
    this.secondParent = null;
    this.displayParent = null;
    this.children = [];
    this.secondChildren = [];
    this.displayChildren = null;
    this.leftNeighbor = null;
    this.rightNeighbor = null;
    this.photoFields = e;
    this.type = "node";
    this.collapsed = a;
    this.color = b == undefined ? null : b;
    this.x = 0;
    this._zJ = null;
    this._zM = null;
    this.y = 0;
    this._zq = 0;
    this._ap = 0
};
getOrkChart.node.prototype.getParent = function () {
    if (this.displayParent != null) {
        return this.displayParent
    }
    return this.parent
};
getOrkChart.node.prototype.getChildren = function () {
    if (this.displayChildren != null) {
        return this.displayChildren
    }
    var a = [];
    for (i = 0; i < this.children.length; i++) {
        if (this.children[i].displayParent == null) {
            a.push(this.children[i])
        }
    }
    return a
};
getOrkChart.node.prototype.getImageUrl = function () {
    if (this.photoFields && this.data[this.photoFields[0]]) {
        return this.data[this.photoFields[0]]
    }
    return null
};
getOrkChart.node.prototype._N = function () {
    if (this.displayChildren == null && this.collapsed == getOrkChart.COLLAPSED) {
        return 0
    } else {
        if (this.getChildren() == null) {
            return 0
        } else {
            return this.getChildren().length
        }
    }
};
getOrkChart.node.prototype._1 = function () {
    if (this.leftNeighbor != null && this.leftNeighbor.getParent() == this.getParent()) {
        return this.leftNeighbor
    } else {
        return null
    }
};
getOrkChart.node.prototype.isVisible = function () {
    if (this.x == 0 && this.y == 0) {
        return false
    }
    return true
};
getOrkChart.node.prototype._4 = function () {
    if (this.rightNeighbor != null && this.rightNeighbor.getParent() == this.getParent()) {
        return this.rightNeighbor
    } else {
        return null
    }
};
getOrkChart.node.prototype._Y = function (a) {
    return this.getChildren()[a]
};
getOrkChart.node.prototype._H = function (a) {
    node = this._O();
    node1 = this._L();
    return node._zq + ((node1._zq - node._zq) + a._2(node1)) / 2
};
getOrkChart.node.prototype._O = function () {
    return this._Y(0)
};
getOrkChart.node.prototype._L = function () {
    return this._Y(this._N() - 1)
};
getOrkChart.node.prototype._Z = function (a) {
    if (!this.getChildren().length) {
        return []
    }
    var d = [];
    var p = 0,
        u = 0,
        q = 0,
        v = 0,
        r = 0,
        w = 0,
        t = 0,
        x = 0;
    var f = 0,
        l = 0,
        g = 0,
        m = 0,
        h = 0,
        n = 0,
        j = 0,
        o = 0;
    var c = null;
    var e = a.customize[this.id] && a.customize[this.id].theme ? getOrkChart.themes[a.customize[this.id].theme] : getOrkChart.themes[a.theme];
    switch (a.orientation) {
        case getOrkChart.RO_TOP:
        case getOrkChart.RO_TOP_PARENT_LEFT:
            p = this.x + (this.w / 2);
            u = this.y + this.h;
            f = this.x + (this.w);
            l = this.y + (this.h / 2);
            break;
        case getOrkChart.RO_BOTTOM:
        case getOrkChart.RO_BOTTOM_PARENT_LEFT:
            p = this.x + (this.w / 2);
            u = this.y;
            f = this.x + (this.w);
            l = this.y + (this.h / 2);
            break;
        case getOrkChart.RO_RIGHT:
        case getOrkChart.RO_RIGHT_PARENT_TOP:
            p = this.x;
            u = this.y + (this.h / 2);
            f = this.x + (this.w / 2);
            l = this.y + (this.h);
            break;
        case getOrkChart.RO_LEFT:
        case getOrkChart.RO_LEFT_PARENT_TOP:
            p = this.x + this.w;
            u = this.y + (this.h / 2);
            f = this.x + (this.w / 2);
            l = this.y + (this.h);
            break
    }
    for (var b = 0; b < this.getChildren().length; b++) {
        c = this.getChildren()[b];
        switch (a.orientation) {
            case getOrkChart.RO_TOP:
            case getOrkChart.RO_TOP_PARENT_LEFT:
                t = r = c.x + (c.w / 2);
                x = c.y;
                q = p;
                v = w = x - a.levelSeparation / 2;
                j = c.x + c.w;
                o = n = c.y + c.h / 2;
                h = g = c.x + c.w + a.siblingSeparation / 2;
                m = l;
                break;
            case getOrkChart.RO_BOTTOM:
            case getOrkChart.RO_BOTTOM_PARENT_LEFT:
                t = r = c.x + (c.w / 2);
                x = c.y + c.h;
                q = p;
                v = w = x + a.levelSeparation / 2;
                j = c.x + c.w;
                o = n = c.y + c.h / 2;
                h = g = c.x + c.w + a.siblingSeparation / 2;
                m = l;
                break;
            case getOrkChart.RO_RIGHT:
            case getOrkChart.RO_RIGHT_PARENT_TOP:
                t = c.x + c.w;
                x = w = c.y + (c.h / 2);
                v = u;
                q = r = t + a.levelSeparation / 2;
                j = h = c.x + c.w / 2;
                o = c.y + (c.h);
                g = f;
                m = n = c.y + c.h + a.siblingSeparation / 2;
                break;
            case getOrkChart.RO_LEFT:
            case getOrkChart.RO_LEFT_PARENT_TOP:
                t = c.x;
                x = w = c.y + (c.h / 2);
                v = u;
                q = r = t - a.levelSeparation / 2;
                j = h = c.x + c.w / 2;
                o = c.y + (c.h);
                g = f;
                m = n = c.y + c.h + a.siblingSeparation / 2;
                break
        }
        if (this.displayChildren == null && c.displayChildren != null && this.collapsed == getOrkChart.EXPANDED) {
            switch (a.orientation) {
                case getOrkChart.RO_TOP:
                case getOrkChart.RO_TOP_PARENT_LEFT:
                case getOrkChart.RO_BOTTOM:
                case getOrkChart.RO_BOTTOM_PARENT_LEFT:
                    d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + p + "," + u + " " + q + "," + v + " " + g + "," + v + " " + h + "," + n + " L" + j + "," + o + '"/>');
                    break;
                case getOrkChart.RO_RIGHT:
                case getOrkChart.RO_RIGHT_PARENT_TOP:
                case getOrkChart.RO_LEFT:
                case getOrkChart.RO_LEFT_PARENT_TOP:
                    d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + p + "," + u + " " + q + "," + v + " " + q + "," + m + " " + h + "," + n + " L" + j + "," + o + '"/>');
                    break
            }
        } else {
            if (this.displayChildren != null) {
                d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + f + "," + l + " " + g + "," + m + " " + h + "," + n + " L" + j + "," + o + '"/>')
            } else {
                if (this.collapsed == getOrkChart.EXPANDED) {
                    switch (a.linkType) {
                        case "M":
                            d.push('<path data-link-id="' + this.id + '" class="link"   d="M' + p + "," + u + " " + q + "," + v + " " + r + "," + w + " L" + t + "," + x + '"/>');
                            break;
                        case "B":
                            d.push('<path data-link-id="' + this.id + '" class="link"  d="M' + p + "," + u + " C" + q + "," + v + " " + r + "," + w + " " + t + "," + x + '"/>');
                            break
                    }
                }
            }
        }
        if (a.expandToLevel && this.displayChildren == null) {
            d.push(getOrkChart.buttons.expColl.replace("[display]", this.collapsed == getOrkChart.EXPANDED ? "none" : "block").replace(/\[xa]/g, (p - e.expandCollapseBtnRadius)).replace(/\[ya]/g, (u - e.expandCollapseBtnRadius)).replace(/\[start]/g, ((e.expandCollapseBtnRadius * 2) / 6)).replace(/\[middle]/g, (e.expandCollapseBtnRadius)).replace(/\[end]/g, ((e.expandCollapseBtnRadius * 2 / 6) * 5)).replace(/\[id]/g, this.id))
        }
    }
    return d.join("")
};
getOrkChart.node.prototype._W = function (c) {
    if (!this.secondChildren.length) {
        return []
    }
    var p = [];
    var r = 0,
        u = 0,
        t = 0,
        v = 0,
        a = 0,
        b = 0;
    var e = 0,
        g = 0,
        f = 0,
        h = 0;
    var j = 0,
        m = 0,
        l = 0,
        n = 0;
    var o = null;
    var q = c.customize[this.id] && c.customize[this.id].theme ? getOrkChart.themes[c.customize[this.id].theme] : getOrkChart.themes[c.theme];
    switch (c.orientation) {
        case getOrkChart.RO_TOP:
        case getOrkChart.RO_TOP_PARENT_LEFT:
            r = this.x + (this.w / 2);
            u = this.y + this.h;
            e = this.x + this.w;
            g = this.y + (this.h / 2);
            j = this.x;
            m = this.y + (this.h / 2);
            break;
        case getOrkChart.RO_BOTTOM:
        case getOrkChart.RO_BOTTOM_PARENT_LEFT:
            r = this.x + (this.w / 2);
            u = this.y;
            e = this.x + this.w;
            g = this.y + (this.h / 2);
            j = this.x;
            m = this.y + (this.h / 2);
            break;
        case getOrkChart.RO_RIGHT:
        case getOrkChart.RO_RIGHT_PARENT_TOP:
            r = this.x;
            u = this.y + (this.h / 2);
            e = this.x + this.w / 2;
            g = this.y + this.h;
            j = this.x + this.w / 2;
            m = this.y;
            break;
        case getOrkChart.RO_LEFT:
        case getOrkChart.RO_LEFT_PARENT_TOP:
            r = this.x + this.w;
            u = this.y + (this.h / 2);
            e = this.x + this.w / 2;
            g = this.y + this.h;
            j = this.x + this.w / 2;
            m = this.y;
            break
    }
    for (var d = this.secondChildren.length - 1; d >= 0; d--) {
        o = this.secondChildren[d];
        if (o.isCollapsed()) {
            continue
        }
        switch (c.orientation) {
            case getOrkChart.RO_TOP:
            case getOrkChart.RO_TOP_PARENT_LEFT:
                t = o.x + (o.w / 2);
                v = o.y;
                b = u;
                if (r > t) {
                    a = r - q.expandCollapseBtnRadius;
                    t += q.expandCollapseBtnRadius
                } else {
                    a = r + q.expandCollapseBtnRadius;
                    t -= q.expandCollapseBtnRadius
                }
                f = o.x;
                h = o.y + (o.h / 2);
                l = o.x + o.w;
                n = o.y + (o.h / 2);
                break;
            case getOrkChart.RO_BOTTOM:
            case getOrkChart.RO_BOTTOM_PARENT_LEFT:
                t = o.x + (o.w / 2);
                v = o.y + o.h;
                b = u;
                if (r > t) {
                    a = r - q.expandCollapseBtnRadius;
                    t += q.expandCollapseBtnRadius
                } else {
                    a = r + q.expandCollapseBtnRadius;
                    t -= q.expandCollapseBtnRadius
                }
                f = o.x;
                h = o.y + (o.h / 2);
                l = o.x + o.w;
                n = o.y + (o.h / 2);
                break;
            case getOrkChart.RO_RIGHT:
            case getOrkChart.RO_RIGHT_PARENT_TOP:
                t = o.x + o.w;
                v = yc = o.y + (o.h / 2);
                a = r;
                if (u > v) {
                    b = u - q.expandCollapseBtnRadius;
                    v += q.expandCollapseBtnRadius
                } else {
                    b = u + q.expandCollapseBtnRadius;
                    v -= q.expandCollapseBtnRadius
                }
                f = o.x + (o.w / 2);
                h = o.y;
                l = o.x + (o.w / 2);
                n = o.y + o.h;
                break;
            case getOrkChart.RO_LEFT:
            case getOrkChart.RO_LEFT_PARENT_TOP:
                t = o.x;
                v = yc = o.y + (o.h / 2);
                a = r;
                if (u > v) {
                    b = u - q.expandCollapseBtnRadius;
                    v += q.expandCollapseBtnRadius
                } else {
                    b = u + q.expandCollapseBtnRadius;
                    v -= q.expandCollapseBtnRadius
                }
                f = o.x + (o.w / 2);
                h = o.y;
                l = o.x + (o.w / 2);
                n = o.y + o.h;
                break
        }
        if (o.leftNeighbor == this) {
            p.push('<path data-link-id="' + this.id + '" class="link-second-parent"   d="M' + e + "," + g + "  L" + f + "," + h + '"/>')
        } else {
            if (o.rightNeighbor == this) {
                p.push('<path data-link-id="' + this.id + '" class="link-second-parent"   d="M' + j + "," + m + "  L" + l + "," + n + '"/>')
            } else {
                p.push('<path data-link-id="' + this.id + '" class="link-second-parent"   d="M' + a + "," + b + "  L" + t + "," + v + '"/>')
            }
        }
    }
    return p.join("")
};
getOrkChart.node.prototype.isCollapsed = function () {
    if (this.parent == null) {
        return false
    }
    if (this.parent.collapsed == getOrkChart.COLLAPSED) {
        return true
    } else {
        return this.parent.isCollapsed()
    }
    return true
};
getOrkChart.node.prototype.getMostDeepChild = function (c) {
    var b = this;

    function a(f, g) {
        if (f.collapsed == getOrkChart.EXPANDED || f.displayChildren != null) {
            for (var d = 0; d < f.getChildren().length; d++) {
                var e = g[f.getChildren()[d].id];
                if (e.level > b.level) {
                    b = e
                }
                a(f.getChildren()[d], g)
            }
        }
    }
    a(this, c);
    return b
};
getOrkChart.node.prototype.draw = function (a) {
    var h = [];
    var b = this.getImageUrl();
    var m = a.customize[this.id] && a.customize[this.id].theme ? getOrkChart.themes[a.customize[this.id].theme] : getOrkChart.themes[a.theme];
    var f = a.customize[this.id] && a.customize[this.id].theme ? " get-" + a.customize[this.id].theme : "";
    var e = a.customize[this.id] && a.customize[this.id].color ? " get-" + a.customize[this.id].color : "";
    if (f && !e) {
        e = " get-" + a.color
    }
    if (this.color != null && (this.displayChildren != null || this.displayParent != null)) {
        e += " get-" + this.color
    }
    if (e && !f) {
        f = " get-" + a.theme
    }
    var d = f + e;
    var l = b ? m.textPoints : m.textPointsNoImage;
    h.push(getOrkChart.OPEN_NODE.replace("[data-node-id]", this.id).replace("[x]", this._zJ == null ? this.x : this._zJ).replace("[y]", this._zM == null ? this.y : this._zM).replace("[level]", this.level).replace("[nodeCssClass]", d));
    for (themeProperty in m) {
        switch (themeProperty) {
            case "image":
                if (b) {
                    h.push(m.image.replace("[href]", b))
                }
                break;
            case "text":
                var j = 0;
                for (k = 0; k < a.primaryFields.length; k++) {
                    var g = l[j];
                    var c = a.primaryFields[k];
                    if (!g || !this.data || !this.data[c]) {
                        continue
                    }
                    h.push(m.text.replace("[index]", j).replace("[text]", this.data[c]).replace("[y]", g.y).replace("[x]", g.x).replace("[rotate]", g.rotate).replace("[width]", g.width));
                    j++
                }
                break;
            default:
                if (themeProperty != "size" && themeProperty != "toolbarHeight" && themeProperty != "textPoints" && themeProperty != "expandCollapseBtnRadius" && themeProperty != "textPointsNoImage") {
                    h.push(m[themeProperty])
                }
                break
        }
    }
    h.push(getOrkChart.CLOSE_NODE);
    return h
};
if (!getOrkChart) {
    var getOrkChart = {}
}
getOrkChart.themes = {
    annabel: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 210,
            y: 40,
            width: 290
        }, {
            x: 210,
            y: 65,
            width: 290
        }, {
            x: 210,
            y: 90,
            width: 290
        }, {
            x: 210,
            y: 115,
            width: 290
        }, {
            x: 210,
            y: 140,
            width: 290
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]"  x="20" y="-20" height="170" preserveAspectRatio="xMidYMid slice" width="170"/>'
    },
    sara: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 210,
            y: 40,
            width: 290
        }, {
            x: 210,
            y: 65,
            width: 290
        }, {
            x: 210,
            y: 90,
            width: 290
        }, {
            x: 210,
            y: 115,
            width: 290
        }, {
            x: 210,
            y: 140,
            width: 290
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<rect  x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]"  x="20" y="-20" height="170" preserveAspectRatio="xMidYMid slice" width="170"/>'
    },
    belinda: {
        size: [300, 300],
        toolbarHeight: 46,
        textPoints: [{
            x: 40,
            y: 70,
            width: 220
        }, {
            x: 40,
            y: 245,
            width: 220
        }, {
            x: 65,
            y: 270,
            width: 170
        }],
        textPointsNoImage: [{
            x: 30,
            y: 100,
            width: 240
        }, {
            x: 30,
            y: 140,
            width: 240
        }, {
            x: 30,
            y: 180,
            width: 240
        }, {
            x: 30,
            y: 220,
            width: 240
        }],
        expandCollapseBtnRadius: 20,
        box: '<circle class="get-box" cx="150" cy="150" r="150" />',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="getBelindaClip1"><rect x="0" y="75" width="300" height="150" /></clipPath><clipPath clip-path="url(#getBelindaClip1)" id="getBelindaClip2"><circle cx="150" cy="150" r="150" /></clipPath><image preserveAspectRatio="xMidYMid slice"  clip-path="url(#getBelindaClip2)" xlink:href="[href]" x="1" y="1" height="300"   width="300"/>'
    },
    cassandra: {
        size: [310, 140],
        toolbarHeight: 46,
        textPoints: [{
            x: 110,
            y: 50,
            width: 200
        }, {
            x: 110,
            y: 80,
            width: 200
        }, {
            x: 110,
            y: 105,
            width: 200
        }, {
            x: 110,
            y: 130,
            width: 200
        }],
        textPointsNoImage: [{
            x: 110,
            y: 50,
            width: 200
        }, {
            x: 110,
            y: 80,
            width: 200
        }, {
            x: 110,
            y: 105,
            width: 200
        }, {
            x: 110,
            y: 130,
            width: 200
        }],
        expandCollapseBtnRadius: 20,
        box: '<path class="get-box get-cassandra-border" d="M70 10 L70 0 L310 0 L310 10 M310 130 L310 140 L70 140 L70 130"/>',
        text: '<text width="[width]" class="get-text get-text-[index] get-cassandra-text" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="1" y="20" height="100" preserveAspectRatio="xMidYMid slice" width="100"/>'
    },
    deborah: {
        size: [222, 222],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 40,
            width: 202
        }, {
            x: 10,
            y: 200,
            width: 202
        }],
        textPointsNoImage: [{
            x: 10,
            y: 40,
            width: 202
        }, {
            x: 10,
            y: 200,
            width: 202
        }],
        expandCollapseBtnRadius: 20,
        image: '<clipPath id="getVivaClip"><path class="get-box" d="M35 0 L187 0 Q222 0 222 35 L222 187 Q222 222 187 222 L35 222 Q0 222 0 187 L0 35 Q0 0 35 0 Z"/></clipPath><image clip-path="url(#getVivaClip)" xlink:href="[href]" x="0" y="0" height="222" preserveAspectRatio="xMidYMid slice" width="222"/>',
        box: '<path class="get-text-pane" d="M222 172 Q222 222 187 222 L35 222 Q0 222 0 187 L0 172 Z"/><path class="get-text-pane" d="M35 0 L187 0 Q222 0 222 35 L222 50 L0 50 L0 50 Q0 0 35 0 Z"/><path class="get-box" d="M35 0 L187 0 Q222 0 222 35 L222 187 Q222 222 187 222 L35 222 Q0 222 0 187 L0 35 Q0 0 35 0 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>'
    },
    lena: {
        size: [481, 420],
        toolbarHeight: 46,
        textPoints: [{
            x: 40,
            y: 130,
            width: 280
        }, {
            x: 40,
            y: 325,
            width: 280
        }, {
            x: 40,
            y: 355,
            width: 280
        }, {
            x: 40,
            y: 385,
            width: 280
        }],
        textPointsNoImage: [{
            x: 40,
            y: 130,
            width: 280
        }, {
            x: 40,
            y: 190,
            width: 280
        }, {
            x: 40,
            y: 220,
            width: 280
        }, {
            x: 40,
            y: 250,
            width: 280
        }, {
            x: 40,
            y: 280,
            width: 280
        }, {
            x: 40,
            y: 310,
            width: 280
        }, {
            x: 40,
            y: 340,
            width: 280
        }],
        expandCollapseBtnRadius: 20,
        defs: '<linearGradient id="getNodeDef2"><stop class="get-def-stop-1" offset="0" /><stop class="get-def-stop-2" offset="1" /></linearGradient><linearGradient xlink:href="#getNodeDef2" id="getNodeDef1" y2="0.21591" x2="0.095527" y1="0.140963" x1="0.063497" />',
        box: '<path fill="#000000" fill-opacity="0.392157" fill-rule="nonzero" stroke-width="4" stroke-miterlimit="4" d="M15.266,67.6297 C66.2394,47.802 149.806,37.5153 149.806,37.5153 L387.9,6.06772 L413.495,199.851 C413.495,199.851 427.17,312.998 460.342,367.036 C382.729,399.222 245.307,419.23 245.307,419.23 L51.5235,444.825 L7.74078,113.339 C7.74078,113.339 0.7616,86.8934 15.266,67.6297 L15.266,67.6297 z" /><path fill="url(#getNodeDef1)" fill-rule="nonzero" stroke="#000000" stroke-width="4" stroke-miterlimit="4" d="M7.83745,60.562 C66.3108,43.7342 144.877,33.4476 144.877,33.4476 L382.972,2 L408.567,195.783 C408.567,195.783 417.334,271.777 450.506,325.814 C387.314,401.952 240.378,415.162 240.378,415.162 L46.5949,440.757 L2.81219,109.271 C2.81219,109.271 -0.98386,77.3975 7.83744,60.562 L7.83745,60.562 z" />',
        text: '<text transform="rotate(-8)" width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image transform="rotate(-8)" xlink:href="[href]" x="40" y="150" height="150" preserveAspectRatio="xMidYMid slice" width="280"/>'
    },
    monica: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 200,
            y: 40,
            width: 300
        }, {
            x: 210,
            y: 65,
            width: 290
        }, {
            x: 210,
            y: 90,
            width: 290
        }, {
            x: 200,
            y: 115,
            width: 300
        }, {
            x: 185,
            y: 140,
            width: 315
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="getMonicaClip"><circle cx="105" cy="65" r="85" /></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#getMonicaClip)" xlink:href="[href]" x="20" y="-20" height="170" width="170"/>'
    },
    ula: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 200,
            y: 40,
            width: 300
        }, {
            x: 210,
            y: 65,
            width: 290
        }, {
            x: 210,
            y: 90,
            width: 290
        }, {
            x: 200,
            y: 115,
            width: 300
        }, {
            x: 185,
            y: 140,
            width: 315
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="getMonicaClip"><circle cx="105" cy="65" r="85" /></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#getMonicaClip)" xlink:href="[href]" x="20" y="-20" height="170" width="170"/>'
    },
    mytheme: {
        size: [330, 260],
        toolbarHeight: 46,
        textPoints: [{
                x: 20,
                y: 45,
                width: 300
            },
            {
                x: 100,
                y: 100,
                width: 200
            },
            {
                x: 100,
                y: 125,
                width: 200
            },
            {
                x: 100,
                y: 150,
                width: 200
            }
        ],
        textPointsNoImage: [{
            x: 20,
            y: 170,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 115,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 85,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 55,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 25,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: -5,
            width: 350,
            rotate: 0
        }],
        expandCollapseBtnRadius: 20,
        box: '<rect x="0" y="0" height="260" width="330" rx="10" ry="10" class="get-box"></rect>' +
            '<g transform="matrix(0.25,0,0,0.25,123,142)"><path d="M48.014,42.889l-9.553-4.776C37.56,37.662,37,36.756,37,35.748v-3.381c0.229-0.28,0.47-0.599,0.719-0.951  c1.239-1.75,2.232-3.698,2.954-5.799C42.084,24.97,43,23.575,43,22v-4c0-0.963-0.36-1.896-1-2.625v-5.319  c0.056-0.55,0.276-3.824-2.092-6.525C37.854,1.188,34.521,0,30,0s-7.854,1.188-9.908,3.53C17.724,6.231,17.944,9.506,18,10.056  v5.319c-0.64,0.729-1,1.662-1,2.625v4c0,1.217,0.553,2.352,1.497,3.109c0.916,3.627,2.833,6.36,3.503,7.237v3.309  c0,0.968-0.528,1.856-1.377,2.32l-8.921,4.866C8.801,44.424,7,47.458,7,50.762V54c0,4.746,15.045,6,23,6s23-1.254,23-6v-3.043  C53,47.519,51.089,44.427,48.014,42.889z M51,54c0,1.357-7.412,4-21,4S9,55.357,9,54v-3.238c0-2.571,1.402-4.934,3.659-6.164  l8.921-4.866C23.073,38.917,24,37.354,24,35.655v-4.019l-0.233-0.278c-0.024-0.029-2.475-2.994-3.41-7.065l-0.091-0.396l-0.341-0.22  C19.346,23.303,19,22.676,19,22v-4c0-0.561,0.238-1.084,0.67-1.475L20,16.228V10l-0.009-0.131c-0.003-0.027-0.343-2.799,1.605-5.021  C23.253,2.958,26.081,2,30,2c3.905,0,6.727,0.951,8.386,2.828c1.947,2.201,1.625,5.017,1.623,5.041L40,16.228l0.33,0.298  C40.762,16.916,41,17.439,41,18v4c0,0.873-0.572,1.637-1.422,1.899l-0.498,0.153l-0.16,0.495c-0.669,2.081-1.622,4.003-2.834,5.713  c-0.297,0.421-0.586,0.794-0.837,1.079L35,31.623v4.125c0,1.77,0.983,3.361,2.566,4.153l9.553,4.776  C49.513,45.874,51,48.28,51,50.957V54z" fill="#FFFFFF"/></g>' +
            // '<g transform="matrix(1,0,0,1,20,190)" class="btn" data-action="edit"><path d="M5 0 L97 0 Q97 0 97 0 L97 45 Q97 45 97 45 L5 45 Q0 45 0 40 L0 5 Q0 0 5 0 Z"></path><text x="35" y="27" width="60">Edit</text></g>' +

            '<g transform="matrix(1,0,0,1,117,190)" class="btn" data-action="add"><path d="M5 0 L92 0 Q97 0 97 5 L97 40 Q97 45 92 45 L5 45 Q0 45 0 40 L0 5 Q0 0 5 0 Z"></path><circle cx="49" cy="23" r="10"></circle><line x1="42" y1="23" x2="56" y2="23"></line><line x1="49" y1="16" x2="49" y2="30"></line></g>',

        // '<g transform="matrix(1,0,0,1,214,190)" class="btn" data-action="preview"><path d="M0 0 L92 0 Q97 0 97 5 L97 40 Q97 45 92 45 L0 45 Q0 45 0 45 L0 0 Q0 0 0 0 Z"></path><text x="25" y="27" width="60">Profile</text></g>',

        text: '<text width="[width]" data-action="main" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>' +
            '<title>NameObjective</title>',
        image: '<clipPath id="clip"><circle cx="60" cy="120" r="40" /></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#clip)" xlink:href="[href]" x="30" y="90" height="50" width="50"/>',
        expandCollapseBtnRadius: 20
    },
    eve: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 210,
            y: 40,
            width: 290
        }, {
            x: 210,
            y: 65,
            width: 290
        }, {
            x: 210,
            y: 90,
            width: 290
        }, {
            x: 210,
            y: 115,
            width: 290
        }, {
            x: 210,
            y: 140,
            width: 290
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="20" y="-20" height="170" preserveAspectRatio="xMidYMid slice" width="170"/>'
    },
    tal: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 210,
            y: 40,
            width: 290
        }, {
            x: 210,
            y: 65,
            width: 290
        }, {
            x: 210,
            y: 90,
            width: 290
        }, {
            x: 210,
            y: 115,
            width: 290
        }, {
            x: 210,
            y: 140,
            width: 290
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="20" y="-20" height="170" preserveAspectRatio="xMidYMid slice" width="170"/>'
    },
    vivian: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 240,
            y: 40,
            width: 260
        }, {
            x: 250,
            y: 65,
            width: 250
        }, {
            x: 270,
            y: 90,
            width: 230
        }, {
            x: 290,
            y: 115,
            width: 210
        }, {
            x: 310,
            y: 140,
            width: 290
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<path class="get-box" d="M0 0 L500 0 L500 220 L0 220 Z"/>',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="getVivianClip"><polygon class="get-box" points="20,70 75,-20 185,-20 240,70 185,160 75,160"/></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#getVivianClip)" xlink:href="[href]" x="20" y="-20" height="200" width="300"/>'
    },
    ada: {
        size: [500, 220],
        toolbarHeight: 46,
        textPoints: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 240,
            y: 40,
            width: 260
        }, {
            x: 250,
            y: 65,
            width: 250
        }, {
            x: 270,
            y: 90,
            width: 230
        }, {
            x: 290,
            y: 115,
            width: 210
        }, {
            x: 310,
            y: 140,
            width: 290
        }],
        textPointsNoImage: [{
            x: 10,
            y: 200,
            width: 490
        }, {
            x: 10,
            y: 40,
            width: 490
        }, {
            x: 10,
            y: 65,
            width: 490
        }, {
            x: 10,
            y: 90,
            width: 490
        }, {
            x: 10,
            y: 115,
            width: 490
        }, {
            x: 10,
            y: 140,
            width: 490
        }],
        expandCollapseBtnRadius: 20,
        box: '<rect x="0" y="0" height="220" width="500" rx="10" ry="10" class="get-box" />',
        text: '<text width="[width]" class="get-text get-text-[index]" x="[x]" y="[y]">[text]</text>',
        image: '<clipPath id="getVivianClip"><polygon class="get-box" points="20,70 75,-20 185,-20 240,70 185,160 75,160"/></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#getVivianClip)" xlink:href="[href]" x="20" y="-20" height="200" width="300"/>'
    },
    helen: {
        size: [380, 190],
        toolbarHeight: 46,
        textPoints: [{
            x: 20,
            y: 170,
            width: 350,
            rotate: 0
        }, {
            x: 0,
            y: -380,
            width: 170,
            rotate: 90
        }, {
            x: 20,
            y: -5,
            width: 170,
            rotate: 0
        }],
        textPointsNoImage: [{
            x: 20,
            y: 170,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 115,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 85,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 55,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: 25,
            width: 350,
            rotate: 0
        }, {
            x: 20,
            y: -5,
            width: 350,
            rotate: 0
        }],
        expandCollapseBtnRadius: 20,
        text: '<text transform="rotate([rotate])"  width="[width]" class="get-text get-text-[index] get-helen-text" x="[x]" y="[y]">[text]</text>',
        image: '<image xlink:href="[href]" x="20" y="0" height="140" preserveAspectRatio="xMidYMid slice" width="350"/>'
    }
};
if (typeof (get) == "undefined") {
    get = {}
}
get._z = function (a, c, b, h, j, d) {
    var o;
    var e = 10;
    var l = 1;
    var n = 1;
    var m = h / e + 1;
    var k = document.getElementsByTagName("g");
    if (!a.length) {
        a = [a]
    }

    function f() {
        for (var s in b) {
            var t = getOrkChart.util._s(["top", "left", "right", "bottom"], s.toLowerCase()) ? "px" : "";
            switch (s.toLowerCase()) {
                case "d":
                    var v = j(((n * e) - e) / h) * (b[s][0] - c[s][0]) + c[s][0];
                    var w = j(((n * e) - e) / h) * (b[s][1] - c[s][1]) + c[s][1];
                    for (z = 0; z < a.length; z++) {
                        a[z].setAttribute("d", a[z].getAttribute("d") + " L" + v + " " + w)
                    }
                    break;
                case "transform":
                    if (b[s]) {
                        var q = c[s];
                        var p = b[s];
                        var r = [0, 0, 0, 0, 0, 0];
                        for (i in q) {
                            r[i] = j(((n * e) - e) / h) * (p[i] - q[i]) + q[i]
                        }
                        for (z = 0; z < a.length; z++) {
                            a[z].setAttribute("transform", "matrix(" + r.toString() + ")")
                        }
                    }
                    break;
                case "viewbox":
                    if (b[s]) {
                        var q = c[s];
                        var p = b[s];
                        var r = [0, 0, 0, 0];
                        for (i in q) {
                            r[i] = j(((n * e) - e) / h) * (p[i] - q[i]) + q[i]
                        }
                        for (z = 0; z < a.length; z++) {
                            a[z].setAttribute("viewBox", r.toString())
                        }
                    }
                    break;
                case "margin":
                    if (b[s]) {
                        var q = c[s];
                        var p = b[s];
                        var r = [0, 0, 0, 0];
                        for (i in q) {
                            r[i] = j(((n * e) - e) / h) * (p[i] - q[i]) + q[i]
                        }
                        var g = "";
                        for (i = 0; i < r.length; i++) {
                            g += parseInt(r[i]) + "px "
                        }
                        for (z = 0; z < a.length; z++) {
                            if (a[z] && a[z].style) {
                                a[z].style[s] = u
                            }
                        }
                    }
                    break;
                default:
                    var u = j(((n * e) - e) / h) * (b[s] - c[s]) + c[s];
                    for (z = 0; z < a.length; z++) {
                        if (a[z] && a[z].style) {
                            a[z].style[s] = u + t
                        }
                    }
                    break
            }
        }
        n = n + l;
        if (n > m + 1) {
            clearInterval(o);
            if (d) {
                d(a)
            }
        }
    }
    o = setInterval(f, e)
};
get._z._at = function (b) {
    var a = 2;
    if (b < 0) {
        return 0
    }
    if (b > 1) {
        return 1
    }
    return Math.pow(b, a)
};
get._z._aO = function (c) {
    var a = 2;
    if (c < 0) {
        return 0
    }
    if (c > 1) {
        return 1
    }
    var b = a % 2 == 0 ? -1 : 1;
    return (b * (Math.pow(c - 1, a) + b))
};
get._z._af = function (c) {
    var a = 2;
    if (c < 0) {
        return 0
    }
    if (c > 1) {
        return 1
    }
    c *= 2;
    if (c < 1) {
        return get._z._at(c, a) / 2
    }
    var b = a % 2 == 0 ? -1 : 1;
    return (b / 2 * (Math.pow(c - 2, a) + b * 2))
};
get._z._ag = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return -Math.cos(a * (Math.PI / 2)) + 1
};
get._z._aL = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return Math.sin(a * (Math.PI / 2))
};
get._z._av = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return -0.5 * (Math.cos(Math.PI * a) - 1)
};
get._z._ax = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return Math.pow(2, 10 * (a - 1))
};
get._z._aK = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return -Math.pow(2, -10 * a) + 1
};
get._z._ar = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return a < 0.5 ? 0.5 * Math.pow(2, 10 * (2 * a - 1)) : 0.5 * (-Math.pow(2, 10 * (-2 * a + 1)) + 2)
};
get._z._as = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return -(Math.sqrt(1 - a * a) - 1)
};
get._z._aI = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return Math.sqrt(1 - (a - 1) * (a - 1))
};
get._z._ac = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return a < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - ((2 * a) - 2) * ((2 * a) - 2)) + 1)
};
get._z._ze = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    if (a < (1 / 2.75)) {
        return 1 - 7.5625 * a * a
    } else {
        if (a < (2 / 2.75)) {
            return 1 - (7.5625 * (a - 1.5 / 2.75) * (a - 1.5 / 2.75) + 0.75)
        } else {
            if (a < (2.5 / 2.75)) {
                return 1 - (7.5625 * (a - 2.25 / 2.75) * (a - 2.25 / 2.75) + 0.9375)
            } else {
                return 1 - (7.5625 * (a - 2.625 / 2.75) * (a - 2.625 / 2.75) + 0.984375)
            }
        }
    }
};
get._z._aw = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return a * a * ((1.70158 + 1) * a - 1.70158)
};
get._z._aM = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return (a - 1) * (a - 1) * ((1.70158 + 1) * (a - 1) + 1.70158) + 1
};
get._z._ad = function (a) {
    if (a < 0) {
        return 0
    }
    if (a > 1) {
        return 1
    }
    return a < 0.5 ? 0.5 * (4 * a * a * ((2.5949 + 1) * 2 * a - 2.5949)) : 0.5 * ((2 * a - 2) * (2 * a - 2) * ((2.5949 + 1) * (2 * a - 2) + 2.5949) + 2)
};
get._z._az = function (c) {
    var b = 2;
    var a = b * c;
    return a * Math.exp(1 - a)
};
get._z._R = function (c) {
    var a = 2;
    var b = 2;
    return Math.exp(-a * Math.pow(c, b))
};
if (!getOrkChart) {
    var getOrkChart = {}
}
getOrkChart.buttons = {
    add: '<g style="display:none;" class="get-btn" data-btn-id="[id]" data-btn-action="add" transform="matrix(0.14,0,0,0.14,0,0)"><rect style="opacity:0" x="0" y="0" height="300" width="300" /><path  fill="#686868" d="M149.996,0C67.157,0,0.001,67.158,0.001,149.997c0,82.837,67.156,150,149.995,150s150-67.163,150-150 C299.996,67.156,232.835,0,149.996,0z M149.996,59.147c25.031,0,45.326,20.292,45.326,45.325 c0,25.036-20.292,45.328-45.326,45.328s-45.325-20.292-45.325-45.328C104.671,79.439,124.965,59.147,149.996,59.147z M168.692,212.557h-0.001v16.41v2.028h-18.264h-0.864H83.86c0-44.674,24.302-60.571,40.245-74.843 c7.724,4.15,16.532,6.531,25.892,6.601c9.358-0.07,18.168-2.451,25.887-6.601c7.143,6.393,15.953,13.121,23.511,22.606h-7.275 v10.374v13.051h-13.054h-10.374V212.557z M218.902,228.967v23.425h-16.41v-23.425h-23.428v-16.41h23.428v-23.425H218.9v23.425 h23.423v16.41H218.902z"/></g>',
    edit: '<g style="display:none;" class="get-btn" data-btn-id="[id]" data-btn-action="edit" transform="matrix(0.14,0,0,0.14,0,0)"><rect style="opacity:0" x="0" y="0" height="300" width="300" /><path fill="#686868" d="M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003 S232.835,0,149.996,0z M221.302,107.945l-14.247,14.247l-29.001-28.999l-11.002,11.002l29.001,29.001l-71.132,71.126 l-28.999-28.996L84.92,186.328l28.999,28.999l-7.088,7.088l-0.135-0.135c-0.786,1.294-2.064,2.238-3.582,2.575l-27.043,6.03 c-0.405,0.091-0.817,0.135-1.224,0.135c-1.476,0-2.91-0.581-3.973-1.647c-1.364-1.359-1.932-3.322-1.512-5.203l6.027-27.035 c0.34-1.517,1.286-2.798,2.578-3.582l-0.137-0.137L192.3,78.941c1.678-1.675,4.404-1.675,6.082,0.005l22.922,22.917 C222.982,103.541,222.982,106.267,221.302,107.945z"/></g>',
    del: '<g style="display:none;" class="get-btn" data-btn-id="[id]" data-btn-action="del" transform="matrix(0.14,0,0,0.14,0,0)"><rect style="opacity:0" x="0" y="0" height="300" width="300" /><path fill="#686868" d="M112.782,205.804c10.644,7.166,23.449,11.355,37.218,11.355c36.837,0,66.808-29.971,66.808-66.808 c0-13.769-4.189-26.574-11.355-37.218L112.782,205.804z"/> <path stroke="#686868" fill="#686868" d="M150,83.542c-36.839,0-66.808,29.969-66.808,66.808c0,15.595,5.384,29.946,14.374,41.326l93.758-93.758 C179.946,88.926,165.595,83.542,150,83.542z"/><path stroke="#686868" fill="#686868" d="M149.997,0C67.158,0,0.003,67.161,0.003,149.997S67.158,300,149.997,300s150-67.163,150-150.003S232.837,0,149.997,0z M150,237.907c-48.28,0-87.557-39.28-87.557-87.557c0-48.28,39.277-87.557,87.557-87.557c48.277,0,87.557,39.277,87.557,87.557 C237.557,198.627,198.277,237.907,150,237.907z"/></g>',
    details: '<g style="display:none;" class="get-btn" data-btn-id="[id]" data-btn-action="details" transform="matrix(0.14,0,0,0.14,0,0)"><rect style="opacity:0" x="0" y="0" height="300" width="300" /><path fill="#686868" d="M139.414,96.193c-22.673,0-41.056,18.389-41.056,41.062c0,22.678,18.383,41.062,41.056,41.062 c22.678,0,41.059-18.383,41.059-41.062C180.474,114.582,162.094,96.193,139.414,96.193z M159.255,146.971h-12.06v12.06 c0,4.298-3.483,7.781-7.781,7.781c-4.298,0-7.781-3.483-7.781-7.781v-12.06h-12.06c-4.298,0-7.781-3.483-7.781-7.781 c0-4.298,3.483-7.781,7.781-7.781h12.06v-12.063c0-4.298,3.483-7.781,7.781-7.781c4.298,0,7.781,3.483,7.781,7.781v12.063h12.06 c4.298,0,7.781,3.483,7.781,7.781C167.036,143.488,163.555,146.971,159.255,146.971z"/><path stroke="#686868" fill="#686868" d="M149.997,0C67.157,0,0.001,67.158,0.001,149.995s67.156,150.003,149.995,150.003s150-67.163,150-150.003 S232.836,0,149.997,0z M225.438,221.254c-2.371,2.376-5.48,3.561-8.59,3.561s-6.217-1.185-8.593-3.561l-34.145-34.147 c-9.837,6.863-21.794,10.896-34.697,10.896c-33.548,0-60.742-27.196-60.742-60.744c0-33.548,27.194-60.742,60.742-60.742 c33.548,0,60.744,27.194,60.744,60.739c0,11.855-3.408,22.909-9.28,32.256l34.56,34.562 C230.185,208.817,230.185,216.512,225.438,221.254z"/></g>',
    expColl: '<g transform="matrix(1,0,0,1,[xa],[ya])" class="btn-collapse" data-btn-id="[id]" data-btn-action="expColl"><circle cx="[middle]" cy="[middle]" r="[middle]" class="get-btn" /><line x1="[start]" y1="[middle]" x2="[end]" y2="[middle]" class="get-btn get-btn-line" /><line style="display:[display]" x1="[middle]" y1="[start]" x2="[middle]" y2="[end]" class="get-btn get-btn-line" /></g>'
};
getOrkChart.buttons.draw = function () {
    var a = [];
    a.push(getOrkChart.buttons.details);
    a.push(getOrkChart.buttons.edit);
    a.push(getOrkChart.buttons.add);
    a.push(getOrkChart.buttons.del);
    return a
};
if (typeof (get) == "undefined") {
    get = {}
}
get._c = function () {
    if (getOrkChart._c) {
        return getOrkChart._c
    }
    var g = navigator.userAgent;
    g = g.toLowerCase();
    var f = /(webkit)[ \/]([\w.]+)/;
    var e = /(opera)(?:.*version)?[ \/]([\w.]+)/;
    var d = /(msie) ([\w.]+)/;
    var c = /(mozilla)(?:.*? rv:([\w.]+))?/;
    var b = f.exec(g) || e.exec(g) || d.exec(g) || g.indexOf("compatible") < 0 && c.exec(g) || [];
    var a = {
        browser: b[1] || "",
        version: b[2] || "0"
    };
    getOrkChart._c = {
        msie: a.browser == "msie",
        webkit: a.browser == "webkit",
        mozilla: a.browser == "mozilla",
        opera: a.browser == "opera"
    };
    return getOrkChart._c
};
getOrkChart.util = {};
getOrkChart.util._7 = function (_X) {
    var viewBox = _X._v.getAttribute("viewBox");
    viewBox = "[" + viewBox + "]";
    return eval(viewBox.replace(/\ /g, ", "))
};
getOrkChart.util._5 = function (element) {
    var transform = element.getAttribute("transform");
    transform = transform.replace("matrix", "").replace("(", "").replace(")", "");
    transform = getOrkChart.util._zT(transform);
    transform = "[" + transform + "]";
    return eval(transform.replace(/\ /g, ", "))
};
getOrkChart.util._zT = function (a) {
    return a.replace(/^\s+|\s+$/g, "")
};
getOrkChart.util._s = function (a, c) {
    if (a && Array.isArray(a)) {
        var b = a.length;
        while (b--) {
            if (a[b] == c) {
                return true
            }
        }
    }
    return false
};
getOrkChart.util._G = function (b) {
    var a = "1";
    while (b[a]) {
        a++
    }
    return a
};
getOrkChart.util._6 = function (f) {
    var h = [],
        c;
    var d = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var e = 0; e < d.length; e++) {
        c = d[e].split("=");
        if (c && c.length == 2 && c[0] === f) {
            var a, b;
            var g = /(%[^%]{2})/;
            while ((encodedChar = g.exec(c[1])) != null && encodedChar.length > 1 && encodedChar[1] != "") {
                a = parseInt(encodedChar[1].substr(1), 16);
                b = String.fromCharCode(a);
                c[1] = c[1].replace(encodedChar[1], b)
            }
            return decodeURIComponent(escape(c[1]))
        }
    }
    return null
};
getOrkChart.util._zX = function (c) {
    if (window.ActiveXObject) {
        var a = new ActiveXObject("Microsoft.XMLDOM");
        a.async = "false";
        a.loadXML(c)
    } else {
        var b = new DOMParser();
        var a = b.parseFromString(c, "text/xml")
    }
    return a
};
getOrkChart.util._ah = function (a) {
    if (a == null || typeof (a) == "undefined" || a == "" || a == -1) {
        return true
    }
    return false
};
getOrkChart.util._ab = function (a) {
    return (typeof a !== "undefined" && a !== null)
};
getOrkChart.util._a3 = function (b, a) {
    var c = b.getBoundingClientRect();
    var d = a.touches[0].pageX - c.left;
    var f = a.touches[0].pageY - c.top;
    var g = a.touches[1].pageX - c.left;
    var h = a.touches[1].pageY - c.top;
    return Math.sqrt((d - g) * (d - g) + (f - h) * (f - h))
};
getOrkChart.util._a5 = function (b, a) {
    var c = b.getBoundingClientRect();
    var g = a.touches[0].pageX - c.left;
    var h = a.touches[0].pageY - c.top;
    var i = a.touches[1].pageX - c.left;
    var j = a.touches[1].pageY - c.top;
    var d = ((g - i) / 2 + i) / (c.width / 100);
    var f = ((h - j) / 2 + j) / (c.height / 100);
    return [d, f]
};
getOrkChart.util._aW = function (a, b, c) {
    var d = a.getBoundingClientRect();
    var g = b - d.left;
    var h = c - d.top;
    var e = (g) / (d.width / 100);
    var f = (h) / (d.height / 100);
    return [e, f]
};
getOrkChart.util._zV = function (b, a) {
    var c = b.getBoundingClientRect();
    var d = a.touches[0].pageX - c.left;
    var f = a.touches[0].pageY - c.top;
    return Math.sqrt((d - t2x) * (d - t2x) + (f - t2y) * (f - t2y))
};
getOrkChart.util._3 = function (a) {
    var b = ["darkred", "pink", "darkorange", "orange", "lightgreen", "green", "lightteal", "teal", "lightblue", "blue", "darkpurple", "purple", "mediumdarkblue", "darkblue", "cordovan", "darkcordovan", "neutralgrey"];
    var c = b.indexOf(a);
    b.splice(c, 1);
    var d = Math.floor((Math.random() * 16) + 1);
    return b[d]
};
getOrkChart.prototype.showDetailsView = function (d) {
    var h = this.nodes[d];
    var f = (h.parent == this._zf);
    var b = function (p, n, q) {
        var l = f ? 'style="display:none;"' : "";
        var r = "<select " + l + 'class="get-oc-select-parent"><option value="' + p + '">--select parent--</option>';
        var o = null;
        for (var k in n) {
            o = n[k];
            if (h == o) {
                continue
            }
            var s = "";
            for (i = 0; i < q.length; i++) {
                var m = q[i];
                if (!o.data || !o.data[m]) {
                    continue
                }
                if (s) {
                    s = s + ", " + o.data[m]
                } else {
                    s += o.data[m]
                }
            }
            if (o.id == p) {
                r += '<option selected="selected" value="' + o.id + '">' + s + "</option>"
            } else {
                r += '<option value="' + o.id + '">' + s + "</option>"
            }
        }
        r += "</select>";
        return r
    };
    var a = function (l, k) {
        var n = '<select class="get-oc-labels"><option value="">--other--</option>';
        var m;
        for (i = 0; i < k.length; i++) {
            if (!getOrkChart.util._s(l, k[i])) {
                m += '<option value="' + k[i] + '">' + k[i] + "</option>"
            }
        }
        n += m;
        n += "</select>";
        if (!m) {
            n = ""
        }
        return n
    };
    var c = "";
    var g = [];
    c += b(h.pid, this.nodes, this.config.primaryFields);
    c += getOrkChart.DETAILS_VIEW_ID_INPUT.replace("[personId]", h.id);
    for (label in h.data) {
        c += getOrkChart.DETAILS_VIEW_INPUT_HTML.replace(/\[label]/g, label).replace("[value]", h.data[label]);
        g.push(label)
    }
    c += a(g, this._aj);
    this._X._i.innerHTML = c;
    var e = h.getImageUrl ? h.getImageUrl() : "";
    if (e) {
        this._X._m.innerHTML = getOrkChart.DETAILS_VIEW_ID_IMAGE.replace("[src]", e)
    } else {
        this._X._m.innerHTML = getOrkChart.DETAILS_VIEW_USER_LOGO
    }
    this._k();
    var j = this.config.customize[h.id] && this.config.customize[h.id].theme ? getOrkChart.themes[this.config.customize[h.id].theme].toolbarHeight : this.theme.toolbarHeight;
    this._X._t.style.top = "-9999px";
    this._X._t.style.left = "-9999px";
    this._X._u.style.top = j + "px";
    this._X._u.style.left = "0px";
    this._X._u.style.position = "relative";
    this._X._9.style.top = "-9999px";
    this._X._9.style.left = "-9999px";
    this._X._9.innerHTML = "";
    this._X._i.style.opacity = 0;
    this._X._m.style.opacity = 0;
    get._z(this._X._m, {
        opacity: 0
    }, {
        opacity: 1
    }, 400, get._z._aL);
    get._z(this._X._zF, {
        top: 0
    }, {
        top: -j
    }, 200, get._z._aL);
    get._z(this._X._i, {
        opacity: 0
    }, {
        opacity: 1
    }, 200, get._z._ag)
};
getOrkChart.prototype._k = function () {
    var a = this._X._I();
    if (this._X._J()) {
        this._q(this._X._J(), "change", this._j)
    }
};
getOrkChart.prototype._j = function (l, a) {
    var m = this._X._U();
    var k = this._X._J();
    var h = k.value;
    for (var c = 0; c < k.options.length; c++) {
        if (h == k.options[c].value) {
            k.options[c] = null
        }
    }
    if (!h) {
        return
    }
    var b = this._X._i.innerHTML;
    var e = getOrkChart.DETAILS_VIEW_INPUT_HTML.replace(/\[label]/g, h).replace("[value]", "");
    var d = b.indexOf('<select class="get-oc-labels">');
    this._X._i.innerHTML = b.substring(0, d) + e + b.substring(d, b.length);
    var f = this._X._I();
    var g = 1;
    for (c in m) {
        f[g].value = m[c];
        g++
    }
    this._k()
};
getOrkChart.prototype._zg = function (e, a) {
    if (this._S) {
        var b = this._X._M().value;
        var d;
        if (this._X._K() && this._X._K().value) {
            d = this._X._K().value
        }
        var c = this._X._U();
        this.updateNode(b, d, c);
        this._S = false
    }
    this.showMainView()
};
getOrkChart.prototype._zW = function () {
    this.showGridView()
};
getOrkChart.prototype.showGridView = function () {
    var a = '<table cellpadding="0" cellspacing="0" border="0">';
    a += "<tr>";
    a += "<th>ID</th><th>Parent ID</th>";
    for (i = 0; i < this._aj.length; i++) {
        var c = this._aj[i];
        a += "<th>" + c + "</th>"
    }
    a += "</tr>";
    for (var b in this.nodes) {
        var d = this.nodes[b];
        var f = (i % 2 == 0) ? "get-even" : "get-odd";
        var e = d.data;
        a += '<tr class="' + f + '">';
        a += "<td>" + d.id + "</td>";
        a += "<td>" + d.pid + "</td>";
        for (j = 0; j < this._aj.length; j++) {
            var c = this._aj[j];
            var g = e[c];
            a += "<td>";
            a += g ? g : "&nbsp;";
            a += "</td>"
        }
        a += "</tr>"
    }
    a += "</table>";
    this._X._9.innerHTML = a;
    this._X._t.style.top = "-9999px";
    this._X._t.style.left = "-9999px";
    this._X._u.style.top = "-9999px";
    this._X._u.style.left = "-9999px";
    this._X._9.style.top = this.theme.toolbarHeight + "px";
    this._X._9.style.left = "0px";
    get._z(this._X._9, {
        left: 100,
        opacity: 0
    }, {
        left: 0,
        opacity: 1
    }, 200, get._z._aK);
    get._z(this._X._zF, {
        top: 0
    }, {
        top: -this.theme.toolbarHeight * 2
    }, 200, get._z._aL)
};
getOrkChart.prototype._zS = function (b, a) {
    this.showMainView()
};
getOrkChart.prototype.showMainView = function () {
    this._X._t.style.top = this.theme.toolbarHeight + "px";
    this._X._t.style.left = "0px";
    this._X._u.style.top = "-9999px";
    this._X._u.style.left = "-9999px";
    this._X._9.style.top = "-9999px";
    this._X._9.style.left = "-9999px";
    this._X._9.innerHTML = "";
    if (this._X._zF.style.top != 0 && this._X._zF.style.top != "" && this._X._zF.style.top != "0px") {
        get._z(this._X._zF, {
            top: -46
        }, {
            top: 0
        }, 200, get._z._aL)
    }
};
getOrkChart.prototype._zx = function (b, a) {
    this.print()
};
getOrkChart.prototype.print = function () {
    var b = this,
        d = this._X.element,
        k = this._X._zR,
        g = [],
        h = d.parentNode,
        j = k.style.display,
        a = document.body,
        c = a.childNodes,
        e;
    if (b._ay) {
        return
    }
    b._ay = true;
    for (e = 0; e < c.length; e++) {
        var f = c[e];
        if (f.nodeType === 1) {
            g[e] = f.style.display;
            f.style.display = "none"
        }
    }
    k.style.display = "none";
    a.appendChild(d);
    window.focus();
    window.print();
    setTimeout(function () {
        h.appendChild(d);
        for (e = 0; e < c.length; e++) {
            var i = c[e];
            if (i.nodeType === 1) {
                i.style.display = g[e]
            }
        }
        k.style.display = j;
        b._ay = false
    }, 1000)
};
getOrkChart.prototype._zO = function () {
    this.zoom(true, true)
};
getOrkChart.prototype._zP = function () {
    this.zoom(false, true)
};
getOrkChart.prototype._zh = function (b, a) {
    this._zn = this._X._u.scrollTop + a[0].touches[0].pageY
};
getOrkChart.prototype._zy = function (b, a) {
    this._X._u.scrollTop = this._zn - a[0].touches[0].pageY
};
getOrkChart.prototype._zu = function (d, b) {
    this._X._n = undefined;
    var a = b[0].wheelDelta ? b[0].wheelDelta / 40 : b[0].detail ? -b[0].detail : 0;
    if (a) {
        var e = a > 0;
        var c = getOrkChart.util._aW(this._X._v, b[0].pageX, b[0].pageY);
        this.zoom(e, false, c)
    }
    return b[0].preventDefault() && false
};
getOrkChart.prototype._zc = function (b, a) {
    var c = this;
    window.setTimeout(function () {
        c.resize()
    }, 300)
};
getOrkChart.prototype._aA = function (g, b) {
    this._X._n = undefined;
    if (this._aP.dragStart) {
        this._X._t.style.cursor = "move";
        var e = (b[0].pageX - this._X._t.offsetLeft);
        var f = (b[0].pageY - this._X._t.offsetTop);
        var j = getOrkChart.util._7(this._X);
        var k = j[2] / this._a2;
        var c = j[3] / this._a1;
        var a = k > c ? k : c;
        j[0] = -((e - this._aP.dragStart.x) * a) + this._aP.dragStart.viewBoxLeft;
        j[1] = -((f - this._aP.dragStart.y) * a) + this._aP.dragStart.viewBoxTop;
        j[0] = parseInt(j[0]);
        j[1] = parseInt(j[1]);
        this._X._v.setAttribute("viewBox", j.toString())
    }
    if (this.config.enableMove) {
        var i = this;
        if (this._aE) {
            clearTimeout(this._aE);
            this._aE = setTimeout(d, 4000);
            return
        }

        function h() {
            get._z(i._X._zr, {
                right: -30,
                opacity: 0
            }, {
                right: 1,
                opacity: 0.8
            }, 500, get._z._ax);
            get._z(i._X._am, {
                left: -30,
                opacity: 0
            }, {
                left: 1,
                opacity: 0.8
            }, 500, get._z._ax);
            get._z(i._X._zB, {
                top: 19,
                opacity: 0
            }, {
                top: 49,
                opacity: 0.8
            }, 500, get._z._ax);
            get._z(i._X._Q, {
                bottom: -30,
                opacity: 0
            }, {
                bottom: 1,
                opacity: 0.8
            }, 500, get._z._ax)
        }

        function d() {
            get._z(i._X._zr, {
                right: 1,
                opacity: 0.8
            }, {
                right: -30,
                opacity: 0
            }, 500, get._z._ax, function () {
                i._aE = null
            });
            get._z(i._X._am, {
                left: 1,
                opacity: 0.8
            }, {
                left: -30,
                opacity: 0
            }, 500, get._z._ax, function () {
                i._aE = null
            });
            get._z(i._X._zB, {
                top: 49,
                opacity: 0.8
            }, {
                top: 19,
                opacity: 0
            }, 500, get._z._ax, function () {
                i._aE = null
            });
            get._z(i._X._Q, {
                bottom: 1,
                opacity: 0.8
            }, {
                bottom: -30,
                opacity: 0
            }, 500, get._z._ax, function () {
                i._aE = null
            })
        }
        h();
        this._aE = setTimeout(d, 4000)
    }
};
getOrkChart.prototype._aQ = function (b, a) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = "none";
    var c = getOrkChart.util._7(this._X);
    this._aP.dragStart = {
        x: (a[0].pageX - this._X._t.offsetLeft),
        y: (a[0].pageY - this._X._t.offsetTop),
        viewBoxLeft: c[0],
        viewBoxTop: c[1]
    }
};
getOrkChart.prototype._aZ = function (b, a) {
    this._aP.dragStart = null;
    this._X._t.style.cursor = "default"
};
getOrkChart.prototype.zoom = function (c, a, b) {
    if (this._zI) {
        return false
    }
    this._zI = true;
    var i = this;
    var j = getOrkChart.util._7(this._X);
    var f = j.slice(0);
    var h = j[2];
    var g = j[3];
    if (c === true) {
        j[2] = j[2] / (getOrkChart.SCALE_FACTOR * 1.2);
        j[3] = j[3] / (getOrkChart.SCALE_FACTOR * 1.2)
    } else {
        if (c === false) {
            j[2] = j[2] * (getOrkChart.SCALE_FACTOR * 1.2);
            j[3] = j[3] * (getOrkChart.SCALE_FACTOR * 1.2)
        } else {
            j[2] = j[2] / (c);
            j[3] = j[3] / (c)
        }
    }
    if (!b) {
        b = [50, 50]
    }
    j[0] = f[0] - (j[2] - h) / (100 / b[0]);
    j[1] = f[1] - (j[3] - g) / (100 / b[1]);
    var d = this._a2 / j[2];
    var e = this._a1 / j[3];
    this.scale = d > e ? e : d;
    if (this.scale < this.minScale) {
        this.scale = this.minScale;
        j[2] = this._a2 / this.scale;
        j[3] = this._a1 / this.scale;
        j[0] = f[0] - (j[2] - h) / (100 / b[0]);
        j[1] = f[1] - (j[3] - g) / (100 / b[1])
    }
    if (this.scale > this.maxScale) {
        this.scale = this.maxScale;
        j[2] = this._a2 / this.scale;
        j[3] = this._a1 / this.scale;
        j[0] = f[0] - (j[2] - h) / (100 / b[0]);
        j[1] = f[1] - (j[3] - g) / (100 / b[1])
    }
    if (a) {
        get._z(this._X._v, {
            viewBox: f
        }, {
            viewBox: j
        }, 300, get._z._aM, function () {
            i._zI = false
        })
    } else {
        this._X._v.setAttribute("viewBox", j.toString());
        this._zI = false
    }
    return false
};
getOrkChart.prototype._aC = function (c, b) {
    if (c.className.indexOf("get-disabled") > -1) {
        return false
    }
    var a = this;
    clearTimeout(this._zj.timer);
    this._zj.timer = setTimeout(function () {
        a._zj.currentIndex++;
        a._l();
        a._aa()
    }, 100)
};
getOrkChart.prototype._zz = function (c, b) {
    if (c.className.indexOf("get-disabled") > -1) {
        return false
    }
    var a = this;
    clearTimeout(this._zj.timer);
    this._zj.timer = setTimeout(function () {
        a._zj.currentIndex--;
        a._l();
        a._aa()
    }, 100)
};
getOrkChart.prototype._zi = function (c, b) {
    var a = this;
    clearTimeout(this._zj.timer);
    this._zj.timer = setTimeout(function () {
        a._zj.found = a._F(a._X._zm.value);
        a._zj.currentIndex = 0;
        a._l();
        a._au();
        a._aa()
    }, 500)
};
getOrkChart.prototype._zk = function (c, b) {
    var a = this;
    clearTimeout(this._zj.timer);
    this._zj.timer = setTimeout(function () {
        a._zj.currentIndex = 0;
        a._zj.found = a._F(a._X._zm.value);
        a._au();
        a._l();
        a._aa()
    }, 100)
};
getOrkChart.prototype._aa = function () {
    if (this._zj.found.length) {
        this.highlightNode(this._zj.found[this._zj.currentIndex].node.id)
    }
};
getOrkChart.prototype.highlightNode = function (c) {
    var a = this;

    function b() {
        var d = a.nodes[c];
        var e = getOrkChart.util._7(a._X);
        var f = d.x - a.initialViewBoxMatrix[2] / 2 + d.w / 2;
        var g = d.y - a.initialViewBoxMatrix[3] / 2 + d.h / 2;
        a.move([f, g, a.initialViewBoxMatrix[2], a.initialViewBoxMatrix[3]], null, function () {
            var i = a._X.getNodeById(c);
            var h = getOrkChart.util._5(i);
            var j = h.slice(0);
            j[0] = getOrkChart.HIGHLIGHT_SCALE_FACTOR;
            j[3] = getOrkChart.HIGHLIGHT_SCALE_FACTOR;
            j[4] = j[4] - ((d.w / 2) * (getOrkChart.HIGHLIGHT_SCALE_FACTOR - 1));
            j[5] = j[5] - ((d.h / 2) * (getOrkChart.HIGHLIGHT_SCALE_FACTOR - 1));
            get._z(i, {
                transform: h
            }, {
                transform: j
            }, 200, get._z._ag, function (k) {
                get._z(k[0], {
                    transform: j
                }, {
                    transform: h
                }, 200, get._z._aL, function () {})
            })
        })
    }
    if (this.isCollapsed(this.nodes[c])) {
        this.expand(this.nodes[c].parent, b)
    } else {
        b()
    }
};
getOrkChart.prototype._au = function (a) {};
getOrkChart.prototype._l = function () {
    if ((this._zj.currentIndex < this._zj.found.length - 1) && (this._zj.found.length != 0)) {
        this._X._aD.className = this._X._aD.className.replace(" get-disabled", "")
    } else {
        if (this._X._aD.className.indexOf(" get-disabled") == -1) {
            this._X._aD.className = this._X._aD.className + " get-disabled"
        }
    }
    if ((this._zj.currentIndex != 0) && (this._zj.found.length != 0)) {
        this._X._za.className = this._X._za.className.replace(" get-disabled", "")
    } else {
        if (this._X._za.className.indexOf(" get-disabled") == -1) {
            this._X._za.className = this._X._za.className + " get-disabled"
        }
    }
};
getOrkChart.prototype._F = function (g) {
    var e = [];
    if (g == "") {
        return e
    }
    if (g.toLowerCase) {
        g = g.toLowerCase()
    }
    for (var b in this.nodes) {
        var f = this.nodes[b];
        for (m in f.data) {
            if (m == this.config.photoFields[0]) {
                continue
            }
            var c = -1;
            if (getOrkChart.util._ab(f) && getOrkChart.util._ab(f.data[m])) {
                var d = f.data[m].toString().toLowerCase();
                c = d.indexOf(g)
            }
            if (c > -1) {
                e.push({
                    indexOf: c,
                    node: f
                });
                break
            }
        }
    }

    function a(h, i) {
        if (h.indexOf < i.indexOf) {
            return -1
        }
        if (h.indexOf > i.indexOf) {
            return 1
        }
        return 0
    }
    e.sort(a);
    return e
};
getOrkChart.prototype._aB = function (g, a) {
    var c = g.getAttribute("data-node-id");
    var e = this.nodes[c];
    var f = e.x + e.w - 15;
    var d = e.x - 30;
    var h = e.y - 30;
    var b = e.y + e.h - 15;
    if (this.config.enableDetailsView) {
        this._zp("details", f, h, c)
    }
    if (this.config.enableEdit == true || getOrkChart.util._s(this.config.enableEdit, c)) {
        this._zp("add", f, b, c);
        this._zp("edit", d, h, c);
        this._zp("del", d, b, c)
    }
};
getOrkChart.prototype._aG = function (i, c) {
    var b = c[0];
    b.preventDefault();
    this._aB(i, c);
    var h = new Date().getTime();
    var k = this;
    if (this._aT == null) {
        this._aT = {
            time: h
        };
        return
    }
    if (b.touches && b.touches.length && b.touches.length > 1) {
        this._aT = null;
        return
    }
    if (!this.config.enableZoomOnNodeDoubleClick) {
        this._aT = null;
        return
    }
    var l = h - this._aT.time;
    if ((l < 400) && (l > 0)) {
        this._aP.dragStart = null;
        var d = i.getAttribute("data-node-id");
        var g = this.nodes[d];
        var m = getOrkChart.util._7(this._X);
        var f = m.slice(0);
        if (!this._aT.viewBox || this._aT.id != d) {
            var f = getOrkChart.util._7(this._X);
            var a = f[2] / f[3];
            f[2] = g.w * 1.5;
            f[3] = f[2] / a;
            f[0] = (g.x - (g.w / 4));
            f[1] = (g.y - (f[3] / 2) + g.h / 2);
            this.move(f);
            if (this._aT.viewBox) {
                m = this._aT.viewBox
            }
            this._aT = {
                id: d,
                viewBox: m
            }
        } else {
            this.move(this._aT.viewBox);
            this._aT = null
        }
    }
    if (this._aT) {
        this._aT.time = h
    }
};
getOrkChart.prototype._zp = function (a, d, e, c) {
    var b = this._X.getButtonByType(a);
    b.style.display = "block";
    b.setAttribute("transform", "matrix(0.14,0,0,0.14," + d + "," + e + ")");
    b.setAttribute("data-btn-id", c)
};
getOrkChart.prototype._aV = function (d, a) {
    var b = d.getAttribute("data-node-id");
    var c = this.nodes[b];
    if (!this._V("clickNodeEvent", {
            node: c
        })) {
        return
    }
};
getOrkChart.prototype._aF = function (d, b) {
    b[0].preventDefault();
    var c = d.getAttribute("data-btn-id");
    var a = d.getAttribute("data-btn-action");
    if (a == "del") {
        this.removeNode(c)
    } else {
        if (a == "add") {
            this.insertNode(c)
        } else {
            if (a == "details") {
                this.showDetailsView(c)
            } else {
                if (a == "edit") {
                    this.showEditView(c)
                } else {
                    if (a == "expColl") {
                        this.expandOrCollapse(c)
                    }
                }
            }
        }
    }
};
getOrkChart.prototype.showEditView = function (a) {
    this._S = true;
    this.showDetailsView(a)
};
getOrkChart.prototype.expand = function (b, a) {
    var c = this;
    b.collapsed = getOrkChart.EXPANDED;
    if ((b.parent == this._zf) || (b.parent == null)) {
        this.loadFromJSON(this.nodes, true, function () {
            c._V("updatedEvent");
            a()
        })
    } else {
        this.expand(b.parent, a)
    }
};

getOrkChart.prototype.expandOrCollapse = function (a) {
    var c = this;
    var b = this.nodes[a];
    this._aJ = {
        id: a,
        old_x: b.x,
        old_y: b.y
    };
    if (b.collapsed == getOrkChart.EXPANDED) {
        b.collapsed = getOrkChart.COLLAPSED
    } else {
        b.collapsed = getOrkChart.EXPANDED
    }
    this.loadFromJSON(this.nodes, true, function () {
        if (b.collapsed == getOrkChart.EXPANDED) {
            c.moveToMostDeepChildForNode(b)
        }
        c._V("updatedEvent")
    })
};
getOrkChart.prototype.moveToMostDeepChildForNode = function (b) {
    var c = getOrkChart.util._7(this._X);
    b = b.getMostDeepChild(this.nodes);
    var d = this.config.siblingSeparation / 2;
    var e = this.config.levelSeparation / 2;
    var a = c.slice(0);
    switch (this.config.orientation) {
        case getOrkChart.RO_TOP:
        case getOrkChart.RO_TOP_PARENT_LEFT:
            a[1] = ((b.y + b.h)) - c[3] + e;
            if (c[1] < a[1]) {
                this.move(a)
            }
            break;
        case getOrkChart.RO_BOTTOM:
        case getOrkChart.RO_BOTTOM_PARENT_LEFT:
            a[1] = b.y - e;
            if (c[1] > a[1]) {
                this.move(a)
            }
            break;
        case getOrkChart.RO_RIGHT:
        case getOrkChart.RO_RIGHT_PARENT_TOP:
            a[0] = b.x - d;
            if (c[0] > a[0]) {
                this.move(a)
            }
            break;
        case getOrkChart.RO_LEFT:
        case getOrkChart.RO_LEFT_PARENT_TOP:
            a[0] = ((b.x + b.w)) - c[2] + d;
            if (c[0] < a[0]) {
                this.move(a)
            }
            break
    }
};
getOrkChart.prototype.insertNode = function (d, a, b) {
    var f = this;
    var e = this.nodes[d];
    this._aJ = {
        id: d,
        old_x: e.x,
        old_y: e.y
    };
    if (b == undefined) {
        b = getOrkChart.util._G(this.nodes)
    }
    if (a == undefined || a == null) {
        a = {};
        this.config.primaryFields.forEach(function (g) {
            a[g] = g
        })
    }
    var c = this._h(b, d, null, a, false);
    if (!this._V("insertNodeEvent", {
            node: c
        })) {
        this.removeNode(c.id);
        return
    }
    c.x = e.x;
    c.y = e.y;
    this.loadFromJSON(this.nodes, true, function () {
        f.moveToMostDeepChildForNode(f.nodes[c.id]);
        f._V("updatedEvent")
    });
    return c
};
getOrkChart.prototype.removeNode = function (b) {
    var e = this;
    if (!this._V("removeNodeEvent", {
            id: b
        })) {
        return
    }
    var a = this.nodes[b];
    var d = a.parent;
    for (j = 0; j < a.children.length; j++) {
        a.children[j].pid = d.id
    }
    var c = this._X.getNodeById(b);
    c.parentNode.removeChild(c);
    delete this.nodes[b];
    this.loadFromJSON(this.nodes, true, function () {
        e._V("updatedEvent")
    })
};
getOrkChart.prototype.updateNode = function (b, d, a) {
    var e = this;
    var c = this.nodes[b];
    c.pid = d;
    c.data = a;
    if (this._V("updateNodeEvent", {
            node: c
        })) {
        this.loadFromJSON(this.nodes, true, function () {
            e._V("updatedEvent")
        })
    }
};
getOrkChart.prototype._h = function (d, f, g, c, a, b) {
    var h = this.config.customize[d] && this.config.customize[d].theme ? getOrkChart.themes[this.config.customize[d].theme] : this.theme;
    a = (a == undefined ? getOrkChart.NOT_DEFINED : a);
    var e = new getOrkChart.node(d, f, g, c, h.size, this.config.photoFields, a, b);
    if (!this._V("createNodeEvent", {
            node: e
        })) {
        return null
    }
    if (this.nodes[d]) {
        e._zJ = this.nodes[d].x;
        e._zM = this.nodes[d].y
    } else {
        e._zJ = null;
        e._zM = null
    }
    this.nodes[d] = e;
    for (label in e.data) {
        if (!getOrkChart.util._s(this._aj, label)) {
            this._aj.push(label)
        }
    }
    return e
};
getOrkChart.prototype._C = function (b, a) {
    this.exportToImage()
};
getOrkChart.prototype.exportToImage = function () {
    var d = document.getElementById("getExportChartDiv");
    if (!d) {
        d = document.createElement("div");
        d.style.display = "none";
        d.style.width = "1px";
        d.style.height = "1px";
        d.style.position = "absolute";
        d.style.top = "-10000px";
        d.style.left = "-10000px";
        d.id = "getExportChartDiv"
    }
    document.body.appendChild(d);
    var b = JSON.parse(JSON.stringify(this.config));
    b.scale = 1;
    b.expandToLevel = null;
    var o = new getOrkChart(d, b);
    var j = 0;
    var k = 0;
    var l = 0;
    var m = 0;
    for (var g in o.nodes) {
        var n = o.nodes[g];
        if (n.x > j) {
            j = n.x
        }
        if (n.y > k) {
            k = n.y
        }
        if (n.x < l) {
            l = n.x
        }
        if (n.y < m) {
            m = n.y
        }
    }
    width = j;
    height = k;
    var r = (l - this.config.subtreeSeparation) + "," + (m) + "," + (j + this.theme.size[0] + this.config.subtreeSeparation * 2) + "," + (k + this.theme.size[1]);
    o._X._v.setAttribute("viewBox", r);
    var q = "png";
    var a = document.getElementById("getExportChartCanvas");
    if (!a) {
        a = document.createElement("canvas");
        a.width = width;
        a.height = height;
        a.style.position = "absolute";
        a.style.top = "-10000px";
        a.style.left = "-10000px";
        a.id = "getExportChartCanvas";
        document.body.appendChild(a)
    }
    var c = a.getContext("2d");
    var h = d.getElementsByTagName("image");

    function p(t, s) {
        if (!t) {
            s()
        } else {
            var u = new XMLHttpRequest();
            u.onload = function () {
                var v = new FileReader();
                v.onloadend = function () {
                    t.href.baseVal = v.result;
                    s()
                };
                v.readAsDataURL(u.response)
            };
            u.open("GET", t.href.baseVal);
            u.responseType = "blob";
            u.send()
        }
    }

    function e(u, t, s) {
        p(u[t], function () {
            if (u.length > t - 1) {
                t++;
                var v = u[t];
                if (!v) {
                    s()
                } else {
                    e(u, t, s)
                }
            }
        })
    }

    function f() {
        function t(w) {
            var v = new MouseEvent("click", {
                view: window,
                bubbles: false,
                cancelable: true
            });
            var u = document.createElement("a");
            u.setAttribute("download", "getokrchart.png");
            u.setAttribute("href", w);
            u.setAttribute("target", "_blank");
            u.dispatchEvent(v)
        }
        var s = "";
        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("get-org-chart.css") != -1) {
                s = document.styleSheets[i].href;
                break
            }
            if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("getokrchart.css") != -1) {
                s = document.styleSheets[i].href;
                break
            }
        }
        get._a._B(s, null, function (u) {
            var v = (new XMLSerializer()).serializeToString(o._X._v);
            v = v.replace("<svg", '<svg width="' + width + '" height="' + height + '" ').replace("<defs/>", '<defs/><g class="' + o._X._zY.className + '"><g class="get-oc-tb"><g class="get-oc-c">').replace("</defs>", '</defs><g class="' + o._X._zY.className + '"><g class="get-oc-tb"><g class="get-oc-c">').replace("<defs/>", '<defs><style type="text/css">' + u + "</style></defs>").replace("</defs>", '<style type="text/css">' + u + "</style></defs>").replace("</svg>", "</g></g></g></svg>");
            var w = window.URL || window.webkitURL || window;
            var x = new Image();
            var y = new Blob([v], {
                type: "image/svg+xml;charset=utf-8"
            });
            var z = w.createObjectURL(y);
            x.onload = function () {
                c.drawImage(x, 0, 0);
                w.revokeObjectURL(z);
                var A = a.toDataURL("image/png").replace("image/png", "image/octet-stream");
                t(A)
            };
            x.src = z
        })
    }
    e(h, 0, function () {
        f()
    })
};
getOrkChart.prototype.load = function () {
    var a = this.config.dataSource;
    if (!a) {
        return
    }
    if (a.constructor && (a.constructor.toString().indexOf("HTML") > -1)) {
        this.loadFromHTMLTable(a)
    } else {
        if (typeof (a) == "string") {
            this.loadFromXML(a)
        } else {
            a = JSON.parse(JSON.stringify(this.config.dataSource));
            this.loadFromJSON(a)
        }
    }
};
getOrkChart.prototype.loadFromJSON = function (g, p, a) {
    this._zt = 0;
    this._zv = 0;
    this._zf = new getOrkChart.node(-1, null, null, null, 2, 2);
    if (p) {
        for (var e in g) {
            if (this.nodes[e] && !this.nodes[e].isVisible()) {
                this.nodes[e].x = this.nodes[e].parent.x;
                this.nodes[e].y = this.nodes[e].parent.y
            }
            this._h(e, g[e].pid, g[e].spid, g[e].data, g[e].collapsed, g[e].color)
        }
    } else {
        var f = Object.keys(g[0])[0];
        var l = Object.keys(g[0])[1];
        var q = null;
        if (this.config.idField) {
            f = this.config.idField
        }
        if (this.config.parentIdField) {
            l = this.config.parentIdField
        }
        if (this.config.secondParentIdField) {
            q = this.config.secondParentIdField
        }
        for (var d = 0; d < g.length; d++) {
            var e = g[d][f];
            var m = g[d][l];
            var s = null;
            delete g[d][f];
            delete g[d][l];
            if (q != null) {
                s = g[d][q];
                delete g[d][q]
            }
            this._h(e, m, s, g[d])
        }
    }
    for (var e in this.nodes) {
        var k = this.nodes[e];
        var n = this.nodes[k.pid];
        if (!n) {
            n = this._zf
        }
        k.parent = n;
        var c = n.children.length;
        n.children[c] = k;
        if (k.spid != null && k.spid != "") {
            var t = this.nodes[k.spid];
            k.secondParent = t;
            var o = t.secondChildren.length;
            t.secondChildren[o] = k
        }
    }
    if (this.config.layout == getOrkChart.MIXED_HIERARCHY_RIGHT_LINKS) {
        for (var e in this.nodes) {
            var k = this.nodes[e];
            var n = this.nodes[k.pid];
            var j = e;
            if (k.children.length == 0) {
                for (z = 0; z < n.children.length; z++) {
                    var b = n.children[z];
                    if (b.children.length == 0 && b != this.nodes[j] && b.displayPid == null && b.displayChildren == null) {
                        if (this.nodes[j].color == null) {
                            this.nodes[j].color = getOrkChart.util._3(this.config.color)
                        }
                        b.color = this.nodes[j].color;
                        b.displayPid = j;
                        b.displayParent = this.nodes[j];
                        if (this.nodes[j].displayChildren == null) {
                            this.nodes[j].displayChildren = []
                        }
                        var c = this.nodes[j].displayChildren.length;
                        this.nodes[j].displayChildren[c] = b;
                        j = b.id
                    }
                }
            }
        }
    }
    this.draw(a)
};
getOrkChart.prototype.loadFromHTMLTable = function (c) {
    var d = c.rows[0];
    var g = [];
    for (var e = 1; e < c.rows.length; e++) {
        var h = c.rows[e];
        var b = {};
        for (var f = 0; f < h.cells.length; f++) {
            var a = h.cells[f];
            b[d.cells[f].innerHTML] = a.innerHTML
        }
        g.push(b)
    }
    this.loadFromJSON(g)
};
getOrkChart.prototype.loadFromXML = function (c) {
    var a = this;
    var b = [];
    get._a._B(c, null, function (d) {
        a._ak = 0;
        a._ai(d, null, true, b);
        a.loadFromJSON(b)
    }, "xml")
};
getOrkChart.prototype.loadFromXMLDocument = function (b) {
    var a = [];
    var c = getOrkChart.util._zX(b);
    this._ak = 0;
    this._ai(c, null, true, a);
    this.loadFromJSON(a)
};
getOrkChart.prototype._ai = function (m, l, d, h) {
    var a = this;
    if (m.nodeType == 1) {
        if (m.attributes.length > 0) {
            var c = {};
            a._ak++;
            c.id = a._ak;
            c.pid = l;
            for (var g = 0; g < m.attributes.length; g++) {
                var b = m.attributes.item(g);
                c[b.nodeName] = b.nodeValue
            }
            h.push(c);
            if (d) {
                d = false
            }
        }
    }
    if (m.hasChildNodes()) {
        if (!d) {
            l = a._ak
        }
        for (var e = 0; e < m.childNodes.length; e++) {
            var f = m.childNodes.item(e);
            var k = f.nodeName;
            if (f.nodeType == 3) {
                continue
            }
            this._ai(f, l, d, h)
        }
    }
};
if (typeof (get) == "undefined") {
    get = {}
}
get._a = {};
get._a._zU = function () {
    var a;
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest()
    } else {
        return new ActiveXObject("Microsoft.XMLHTTP")
    }
};
get._a._zl = function (f, a, d, c, b, e) {
    var g = get._a._zU();
    g.open(d, f, e);
    g.onreadystatechange = function () {
        if (!get._c().msie && c == "xml" && g.readyState == 4) {
            a(g.responseXML)
        } else {
            if (get._c().msie && c == "xml" && g.readyState == 4) {
                try {
                    var i = new DOMParser();
                    var j = i.parseFromString(g.responseText, "text/xml");
                    a(j)
                } catch (h) {
                    var j = new ActiveXObject("Microsoft.XMLDOM");
                    j.loadXML(g.responseText);
                    a(j)
                }
            } else {
                if (g.readyState == 4) {
                    a(g.responseText)
                }
            }
        }
    };
    if (d == "POST") {
        g.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    }
    g.send(b)
};
get._a._B = function (g, b, a, c, f) {
    var e = [];
    for (var d in b) {
        e.push(encodeURIComponent(d) + "=" + encodeURIComponent(b[d]))
    }
    get._a._zl(g + "?" + e.join("&"), a, "GET", c, null, f)
};
get._a._a8 = function (g, b, a, c, f) {
    var e = [];
    for (var d in b) {
        e.push(encodeURIComponent(d) + "=" + encodeURIComponent(b[d]))
    }
    get._a._zl(g, a, "POST", c, e.join("&"), f)
};
getOrkChart.prototype._y = function (d, b) {
    var a = b[0];
    var c = new Date().getTime();
    if (b[0].touches.length == 1) {
        var f = getOrkChart.util._7(this._X);
        this._aP.dragStart = {
            x: (b[0].touches[0].pageX - this._X._t.offsetLeft),
            y: (b[0].touches[0].pageY - this._X._t.offsetTop),
            viewBoxLeft: f[0],
            viewBoxTop: f[1]
        }
    }
    if (b[0].touches.length == 2) {
        this._aP.dragStart = null;
        this._p = null;
        this._a4 = getOrkChart.util._a3(this._X._v, a)
    }
};
getOrkChart.prototype._b = function (j, d) {
    var c = d[0];
    c.preventDefault();
    if (d[0].touches.length == 1) {
        this._X._n = undefined;
        if (this._aP.dragStart) {
            var g = (d[0].touches[0].pageX - this._X._t.offsetLeft);
            var h = (d[0].touches[0].pageY - this._X._t.offsetTop);
            this._X._t.style.cursor = "move";
            var l = getOrkChart.util._7(this._X);
            var m = l[2] / this._a2;
            var f = l[3] / this._a1;
            var a = m > f ? m : f;
            l[0] = -((g - this._aP.dragStart.x) * a) + this._aP.dragStart.viewBoxLeft;
            l[1] = -((h - this._aP.dragStart.y) * a) + this._aP.dragStart.viewBoxTop;
            l[0] = parseInt(l[0]);
            l[1] = parseInt(l[1]);
            this._X._v.setAttribute("viewBox", l.toString())
        }
    }
    if (d[0].touches.length == 2) {
        var b = getOrkChart.util._a3(this._X._v, d[0]);
        var k = 1 + ((b - this._a4) / (this._a4 / 100)) / 100;
        var i = getOrkChart.util._a5(this._X._v, d[0]);
        this.zoom(k, null, i);
        this._a4 = b
    }
};
getOrkChart.prototype._g = function (d, b) {
    var a = b[0];
    var c = new Date().getTime()
};
getOrkChart.prototype._aU = function (i, c) {
    var b = c[0];
    this._aV(i, c);
    this._aB(i, c);
    var h = new Date().getTime();
    var j = this;
    if (this._aT == null) {
        this._aT = {
            time: h
        };
        return
    }
    if (b.touches && b.touches.length && b.touches.length > 1) {
        this._aT = null;
        return
    }
    if (!this.config.enableZoomOnNodeDoubleClick) {
        this._aT = null;
        return
    }
    var k = h - this._aT.time;
    if ((k < 400) && (k > 0)) {
        this._aP.dragStart = null;
        var d = i.getAttribute("data-node-id");
        var g = this.nodes[d];
        var l = getOrkChart.util._7(this._X);
        var f = l.slice(0);
        if (!this._aT.viewBox || this._aT.id != d) {
            var f = getOrkChart.util._7(this._X);
            var a = f[2] / f[3];
            f[2] = g.w * 1.5;
            f[3] = f[2] / a;
            f[0] = (g.x - (g.w / 4));
            f[1] = (g.y - (f[3] / 2) + g.h / 2);
            this.move(f);
            if (this._aT.viewBox) {
                l = this._aT.viewBox
            }
            this._aT = {
                id: d,
                viewBox: l
            }
        } else {
            this.move(this._aT.viewBox);
            this._aT = null
        }
    }
    if (this._aT) {
        this._aT.time = h
    }
};
getOrkChart.prototype._aN = function (c, b) {
    var a = b[0];
    a.preventDefault()
};
getOrkChart.prototype._aH = function (c, b) {
    var a = b[0];
    if (a.touches && a.touches.length && a.touches.length == 0) {
        this._aT = null
    }
};
