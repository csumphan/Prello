
function contains(objList, bid){
    for(var x=0; x < objList.length; x++) {
        if(objList[x].toString() === bid){
            return true;
        }
    }
    return false;
}

module.exports = contains;
