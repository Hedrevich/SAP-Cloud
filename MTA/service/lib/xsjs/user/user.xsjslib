var PreparedStatementLib = $.import('xsjs', 'preparedStatement').lib;

var user = function (connection, prefix, tableName) {

    const PREFIX = prefix;
    const USER_TABLE = prefix + tableName;
    /*
            const USER = $.session.securityContext.userInfo.familyName ?
                $.session.securityContext.userInfo.familyName + " " + $.session.securityContext.userInfo.givenName :
                $.session.getUsername().toLocaleLowerCase(),
    */

    this.doGet = function () {
      const result = connection.executeQuery('SELECT * FROM "HiMTA::User"');
            result.forEach(x => $.trace.error(JSON.stringify(x)));

        $.response.status = $.net.http.OK;
        $.response.setBody(JSON.stringify(result));
    };


    this.doPost = function (oUser) {

        $.trace.error("oUser:   " + JSON.stringify(oUser));
        //Get Next ID Number
        oUser.usid = getNextval(`${PREFIX}usid`);

        //generate query
        const statement = PreparedStatementLib.createPreparedInsertStatement(USER_TABLE, oUser);
        //execute update
        connection.executeUpdate(statement.sql, statement.aValues);

        connection.commit();
        $.response.status = $.net.http.CREATED;
        $.response.setBody(JSON.stringify(oUser));
    };


    this.doPut = function (oUser) {
        //generate query
        let oResult = {
            aParams: [],
            aValues: [],
            sql: "",
        };

        oResult.sql = `UPDATE "${USER_TABLE}" SET "name"='${oUser.name}' WHERE "usid"=${oUser.usid};`;

        $.trace.error("sql to update: " + oResult.sql);

        //execute update
        connection.executeUpdate(oResult.sql, oResult.aValues);

        connection.commit();
        $.response.status = $.net.http.OK;
        $.response.setBody(JSON.stringify(oUser));
    };

    this.doDelete = function (usid) {
        const statement = PreparedStatementLib.createPreparedDeleteStatement(USER_TABLE, {usid: usid});
        connection.executeUpdate(statement.sql, statement.aValues);

        connection.commit();
        $.response.status = $.net.http.OK;
        $.response.setBody(JSON.stringify({}));
    };

    function getNextval(sSeqName) {
        const statement = `select "${sSeqName}".NEXTVAL as "ID" from dummy`;

        const result = connection.executeQuery(statement);

        if (result.length > 0) {
            $.trace.error("ID: "+result[0].ID);
            return result[0].ID;
        } else {
            throw new Error('ID was not generated');
        }
    }

};
