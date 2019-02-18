var JsonFormatter = $.import('xsjs', 'JsonFormatter').formatter;


const sTABLE_NAME = "HiMTA::Author";
const sAUTHOR_ID = "HiMTA::author_id";

//OK
function authorsCreate(param){
    $.trace.error(JSON.stringify(param));
    var after = param.afterTableName;

    //Get Input New Record Values
    var	pStmt = param.connection.prepareStatement("select * from \"" + after + "\"");
    var oResult = pStmt.executeQuery();

    var oAuthorItems = JsonFormatter.recordSetToJSON(oResult, "items");
    var oAuthor = oAuthorItems.items[0];
    $.trace.error(JSON.stringify(oAuthor));

    //Get Next Personnel Number
    pStmt = param.connection.prepareStatement(`select "${sAUTHOR_ID}".NEXTVAL from dummy`);
    var result = pStmt.executeQuery();

    while (result.next()) {
<<<<<<< HEAD
        oAuthor.author_id = result.getString(1);
=======
        oAuthor.auhtor_id = result.getString(1);
>>>>>>> 7598c80ff2b81b7cfc8304403632cb4d11030d9a
    }

    $.trace.error(JSON.stringify(oAuthor));

    pStmt.close();
    //Insert Record into DB Table and Temp Output Table
    for( var i = 0; i < 2; i++){
        var pStmt;
        if(i < 1){
            pStmt = param.connection.prepareStatement(`insert into \"${sTABLE_NAME}\" values(?,?)` );
        }else{
            pStmt = param.connection.prepareStatement("TRUNCATE TABLE \"" + after + "\"" );
            pStmt.executeUpdate();
            pStmt.close();
            pStmt = param.connection.prepareStatement("insert into \"" + after + "\" values(?,?)" );
        }
        pStmt.setString(1, oAuthor.author_id.toString());
        pStmt.setString(2, oAuthor.name.toString());
        pStmt.executeUpdate();
        pStmt.close();
    }
}
