define(['constants/constants', 'ojs/ojcorerouter', 'ojs/ojurlparamadapter'], function (Constants, CoreRouter, UrlParamAdapter) {

    async function _fetch(endpointURL, options = {}) {

        options.method = options.method || 'POST';

        options.headers = {
            'token': localStorage.getItem('token'),
            'Content-Type': 'application/json;charset=utf-8',
            // 'x-functions-key': 'ytlDsjE3vaMkli14OuNeuQ1HXSxuV9ONcLfiCo5IFtqm/T4Z00au2Q=='
            //'x-functions-key': 'rOgSMT1aUdSbpC7MSD4Ys26tJ4USPvugL31WexkNVcfvVFWizoZD2Q==' //Dev
            'x-functions-key': 'AygmHPrIGarBWHlQaZnoCXVJH/pXEqzHJdMSd3MgGaaT4TTZNNtGhQ==' //Prod
        };

        return new Promise(function (resolve, reject) {

            let url = Constants.API_URL + endpointURL;

            return fetch(url, options).then(response => {
                if (response.status !== 200) {
                    throw response;
                }
                return response.json();
            }).then(json => resolve(json)).catch(async HttpErrorResponse => {
                // 
                // app.router.go({
                //     path: 'error'
                // });

                if (HttpErrorResponse.status == 401 || HttpErrorResponse.status == 403) {
                    // if (localStorage.token != "[Invalid Token]") {
                    //     localStorage.token = "[Invalid Token]";
                    //     window.location.reload(true);
                    // }

                    let timeoutDialog = document.getElementById('TimeoutDialog');
                    if (timeoutDialog) {
                        timeoutDialog.open();
                    }

                    reject("Session Expired");
                } else {
                    reject(HttpErrorResponse.statusText);
                }

            });

        });
    }

    function random(max = 99999999) {
        return Math.floor(Math.random() * max) + 1;
    }

    function convertDate(input_date) {
        //input_date = "2001-01-02"
        var arrDate = input_date.split("-");
        return arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
    }

    function toJETDate(date = new Date(), daysToAdd = 0) {
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString().split('T')[0];
    }

    function toJSDate(JETDate) {
        return new Date(JETDate);
    }

    function getPosition(string, subString, index) {
        return string.split(subString, index).join(subString).length;
    }

    function getUrlVars() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function mapToLOV(KVObject) {
        let options = [];
        for (let [key, value] of Object.entries(KVObject)) {
            options.push({
                "value": key,
                "label": value
            });
        }
        return options;
    };

    function mapDataToObservable(source, target) {
        for (let [attributeName] of Object.entries(target)) {

            let attributeValue = ['Y', 'N'].includes(source[attributeName]) ? [source[attributeName]] : source[attributeName] || null;

            if (typeof target[attributeName] == 'function')
                target[attributeName](attributeValue);
            else
                target[attributeName] = attributeValue;
        }
    };

    function arrayToLOV(array = []) {
        return array.map(element => {
            return {
                "value": element,
                "label": element
            }
        });
    }

    function unpackObservable(ob) {

        let object = {};
        for (let [attributeName, value] of Object.entries(ob)) {

            value = typeof value === 'function' ? value() : value;

            if (Array.isArray(value) && value.length === 1 && ['Y', 'N', 'true', 'false'].some(element => value.includes(element))) {
                object[attributeName] = value[0];
            } else {
                object[attributeName] = value;
            }

        }
        return object;
    }

    function formHasErrors(formID) {
        const tracker = document.getElementById(formID);


        if (!tracker || tracker.valid === "valid") {
            return false;
        } else {
            tracker.showMessages();
            tracker.focusOn("@firstInvalidShown");
            return true;
        }
    }

    function openDialog(id) {
        document.getElementById(id).open();
    }

    function closeDialog(id) {
        document.getElementById(id).close();
    }

    function sortByKey(array, attributeName) {
        return array.sort(function (a, b) {
            var x = a[attributeName];
            var y = b[attributeName];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function getCurrentDate(d = new Date()) {
        return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
            .map(n => n < 10 ? `0${n}` : `${n}`).join('-');
    }

    return {
        getUrlVars: getUrlVars,
        mapToLOV: mapToLOV,
        arrayToLOV: arrayToLOV,
        unpackObservable: unpackObservable,
        formHasErrors: formHasErrors,
        convertDate: convertDate,
        random: random,
        fetch: _fetch,
        mapDataToObservable: mapDataToObservable,
        openDialog: openDialog,
        closeDialog: closeDialog,
        sortByKey: sortByKey,
        getCurrentDate: getCurrentDate,
        toJETDate: toJETDate,
        toJSDate: toJSDate,
        getPosition: getPosition
    }
})