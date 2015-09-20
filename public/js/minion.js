/*
req = {
    reqApi: ??,
    reqPath: ??,
    reqMethod: ??,
    reqDate: ??,
    reqStatus: ??,
    reqDelta: ??,
    reqError: ??,
    clientIP: client.IP,
    clientUserAgent: client.userAgent,
    clientISP: client.isp,
    clientNetwork: ??,
    clientProvince: client.province,
    clientCity: client.city,
    clientDistrict: client.district
}
*/
var local = remote_ip_info; // from userns.dnspod.cn:5353
var form  = document.getElementById("collector");
form.elements.client_ip.value  = local.ip;
form.elements.isp.value        = local.isp;
form.elements.network.value    = local.network;
form.elements.province.value   = local.province;
form.elements.city.value       = local.city;
form.elements.district.value   = local.district;
form.elements.client_ip.value  = local.ip;
form.elements.user_agent.value = navigator.userAgent;


var logArea = document.getElementById("logarea");
function log(message) {
    node = document.createTextNode("["+ (new Date()).toLocaleTimeString() +
                                   "] " + message + "\n");
    logArea.appendChild(node);
}

AV.initialize("QfyeouUjk2B95bJ3EYz2bTOA", "V9FSYpM8vXVF54xglOBVaxbV");
var EchoRequest = AV.Object.extend("EchoRequest");

function simulateCreatingObject() {
    var myreq = {
        reqApi: AV.serverURL,
        reqMethod: 'POST',
        reqPath: 'classes',
        clientIP:        form.elements.client_ip.value,
        clientISP:       form.elements.isp.value,
        clientNetwork:   form.elements.network.value,
        clientProvince:  form.elements.province.value,
        clientCity:      form.elements.city.value,
        clientDistrict:  form.elements.district.value,
        clientUserAgent: form.elements.user_agent.value,
    };

    var message = myreq.reqMethod + " " + myreq.reqPath;

    var echo = new EchoRequest();
    var obj  = new AV.Object("TestObject");
    myreq.reqStart = new Date();
    obj.save({name: "minion"}, {
        success: function(obj) {
            myreq.reqDelta = new Date() - myreq.reqStart;
            myreq.reqStatus = 201;
            echo.save(myreq);
            log("[ok " + myreq.reqDelta + "ms] " + message);
            obj.destroy();
        },
        error: function(obj, error) {
            myreq.reqDelta  = new Date() - myreq.reqStart;
            myreq.reqStatus = error.code;
            myreq.reqError  = error.message;
            echo.save(myreq);
            log("[error " + myreq.reqDelta + "ms] " +
                message + ": " + error.code + " " + error.message);
        }
    });
}

function simulateCreatingFile() {
    var myreq = {
        reqApi: AV.serverURL,
        reqMethod: 'POST',
        reqPath: 'files',
        clientIP:        form.elements.client_ip.value,
        clientISP:       form.elements.isp.value,
        clientNetwork:   form.elements.network.value,
        clientProvince:  form.elements.province.value,
        clientCity:      form.elements.city.value,
        clientDistrict:  form.elements.district.value,
        clientUserAgent: form.elements.user_agent.value,
    };

    var echo = new EchoRequest();
    var file = new AV.File("hello.txt", {base64: "SSdtIExlYW5DbG91ZCByb2JvdCwgbmljZSB0byBtZWV0IHlvdSEK"});

    var message = myreq.reqMethod + " " + myreq.reqPath;

    myreq.reqStart = new Date();
    file.save().then(function(f) {
        myreq.reqDelta = new Date() - myreq.reqStart;
        myreq.reqStatus = 201;
        echo.save(myreq);
        log("[ok " + myreq.reqDelta + "ms] " + message);
        f.destroy();
    }, function(f, error) {
        myreq.reqDelta  = new Date() - myreq.reqStart;
        myreq.reqStatus = error.code;
        myreq.reqError  = error.message;
        echo.save(myreq);
        log("[error " + myreq.reqDelta + "ms] " +
            message + ": " + error.code + " " + error.message);
    });
}

log("Start to test LeanCloud API...");

setInterval(function() {
    simulateCreatingObject();
    simulateCreatingFile();
}, 1000 * 10);
