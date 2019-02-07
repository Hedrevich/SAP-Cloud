const Userlib = $.import('xsjs.user', 'user').user;

const PREFIX = "HiMTA::";
const TABLE_NAME = "User";

const userLib = new Userlib(
    $.hdb.getConnection({ treatDateAsUTC: true}),
    PREFIX,
    TABLE_NAME
);
(function () {
    (function handleRequest() {
        try {
            switch ($.request.method) {

                case $.net.http.GET : {
                    userLib.doGet();
                    break;
                }
                case $.net.http.PUT : {
                    userLib.doPut(JSON.parse($.request.body.asString()));
                    break;
                }
                case $.net.http.POST : {
                    userLib.doPost(JSON.parse($.request.body.asString()));
                    break;
                }
                case $.net.http.DEL : {
                   userLib.doDelete(JSON.parse($.request.parameters.get("usid")));
                   break;
                }
                default: {
                    $.response.status = $.net.http.METHOD_NOT_ALLOWED;
                }
            }
        } catch (e) {
                $.response.status = $.net.http.BAD_REQUEST;
                $.response.setBody(e.message);
        }
    }());
}());
