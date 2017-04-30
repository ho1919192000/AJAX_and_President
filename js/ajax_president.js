
function timedGetJson(url, timeout) {
    "use strict";
    var request = new XMLHttpRequest();
    request.timeout = timeout;
    request.ontimeout = function (status) {
        console.log('Request to ' + url + ' timed out after ' + timeout + ' ms');
    };
    request.open('GET', url);
    request.onloadend = function () {
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText).presidents.president;
            handleData(data);
        } else {
            console.log("something wrong!");
        }
    };
    request.send(null);
}
/*----------------------------------------------------------*/
function handleData(data) {
    "use strict";
    var pName;
    var pOffice;
    var result;
    var parent = document.getElementById('presidentTable');
    var attributes = ['Number', 'Name', 'Date', 'Took Office', 'Left Office']; //for table header
    var properityName = ['number', 'name', 'date', 'took_office', 'left_office'];
    buildTable(data, parent, attributes, 'president', properityName);

    document.getElementById('search').onclick = function () {
        document.getElementById('result').value = "";

        pName = document.getElementById('name').value;
        pOffice = document.getElementById('took_office').value;
        result = filterResult(parent, data, attributes, pName, pOffice);
        buildTable(result, parent, attributes, 'president', properityName);
        console.log(result);
        if (result.length === 0 || result[0] === "" || result[0] === null) {
            document.getElementById("noResult").value = "Cannot find any result!";
        } else {
            document.getElementById("noResult").value = "";
        }
    };
    document.getElementById('clear').onclick = function () {
        parent.innerHTML = "";
        document.getElementById('result').value = "";
        document.getElementById('name').value = "";
        document.getElementById('took_office').value = "";
        buildTable(data, parent, attributes, 'president', properityName);
        document.getElementById("noResult").value = "";

    }
}

/*----------------------------------------------------------*/

function filterResult(parent, data, attributes, pName, pOffice) {
    "use strict";
    var result = [];

    if (pName !== null && pName !== "") {
        result = data.filter((el) => el.name.toLowerCase().indexOf(pName.toLowerCase()) > -1)

        if (pOffice !== null && pOffice !== "") {
            result = result.filter((el) => el.took_office.toLowerCase().indexOf(pOffice.toLowerCase()) > -1)
        }

    } else if (pOffice !== null && pOffice !== "") {
        result = data.filter((el) => el.took_office.toLowerCase().indexOf(pOffice.toLowerCase()) > -1)
    }

    return result;
}
/*----------------------------------------------------------*/

var capitalize = function (s) {
    "use strict";
    return s.charAt(0).toUpperCase() + s.slice(1);
};
var buildHeader = function (titles, trAtt, thAtt) {
    "use strict";
    var i, th, len, tr = document.createElement('tr');
    if (trAtt) { //set class for table row (optional)
        tr.setAttribute('class', trAtt);
    }
    len = titles.length;
    for (i = 0; i < len; i++) {
        th = document.createElement('th');
        if (thAtt) { //set class for table header (optional)
            th.setAttribute('class', thAtt);
        }
        th.appendChild(document.createTextNode(capitalize(titles[i])));
        tr.appendChild(th);
    }
    return tr;
};

var buildRow = function (row, propertyNames) {
    "use strict";
    var i, td, tr = document.createElement('tr'),
        len = propertyNames.length; //5
    for (i = 0; i < len; i++) {
        if (typeof row[propertyNames[i]] === 'undefined' || !row[propertyNames[i]]) {
            row[propertyNames[i]] = "N/A";
        }
        td = document.createElement('td');
        td.setAttribute('class', propertyNames[i]);
        td.appendChild(document.createTextNode(row[propertyNames[i]]));
        tr.appendChild(td);
    }
    return tr;
};

var buildTable = function (data, parent, attr, tClass, prop) {
    "use strict";
    var i, table = document.createElement('table'),
        len = data.length; //45
    parent.innerHTML = "";
    table.setAttribute('class', tClass); // To allow CSS
    // Add Header
    table.appendChild(buildHeader(attr));
    // For each row of data in the array, add it.
    for (i = 0; i < len; i++) {
        table.appendChild(buildRow(data[i], prop));
    }
    parent.appendChild(table);
    document.getElementById("result").value = len + " units."
};
/*----------------------------------------------------------*/
document.body.onload = function () {
    "use strict";
    var url1 = 'http://schwartzcomputer.com/ICT4570/Resources/USPresidents.json';
    timedGetJson(url1, 3000);
};