'use strict';
define(['utils/Util', 'constants/constants'], function (Util, Constants) {

    function commonService() {

        function authenticate() {
            return new Promise(function (resolve, reject) {
                let url = '/authstatus'
                Util.fetch(url, {
                    method: 'POST',
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function isUniqueNMLS(payload) {
            return new Promise(function (resolve, reject) {
                let url = '/getcheckisexistnmlsnumber'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function login(credentials) {
            return new Promise((resolve, reject) => {
                let url = '/Login'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            })
        }

        function register(data) {
            return new Promise(function (resolve, reject) {
                let url = '/registration'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                }).then(result => {

                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function loginUsingJWT() {

            return new Promise(function (resolve, reject) {

                let JWT = Util.getUrlVars()['jwt'] || null;
                let designatedRoute = Util.getUrlVars()['root'] || null;
                let token = localStorage.getItem('token') || null;

                if (JWT) {

                    let url = `/employee/userAuth`;
                    Util.fetch(url, {
                        method: 'POST',
                        body: JSON.stringify({
                            'jwtToken': JWT,
                            'token': token
                        })
                    }).then(result => {

                        if (result.statusCode == Constants.HTTP.STATUS_OK) {
                            localStorage.setItem('token', result.data.token);
                            result.data.designatedRoute = designatedRoute || 'home';
                            return resolve(result.data);
                        }

                        return reject(result.message);

                    });

                } else {
                    if (token) {
                        let url = `/api/checkToken`;

                        Util.fetch(url).then(result => {
                            if (result.statusCode == Constants.HTTP.STATUS_OK) {
                                result.data.designatedRoute = designatedRoute || 'home';
                                return resolve(result.response);
                            }
                            return reject(result.message);
                        }).catch((error) => {
                            console.log('error', error);
                            return reject(error);

                        })
                    } else {
                        return reject("No JWT Provided");
                    }
                }
            });
        }

        function getCompanyDetails() {

            return new Promise(function (resolve, reject) {
                let url = '/getcompanybyid'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        companyid: localStorage.getItem('companyid')
                    })
                }).then(result => {

                    if (result.status == Constants.HTTP.STATUS_OK) {

                        if (result.response.accountexecutiveacc == Constants.GUID_EMPTY)
                            result.response.accountexecutiveacc = null;
                        if (result.response.state == Constants.GUID_EMPTY)
                            result.response.state = null;

                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getCompanyContacts() {
            return new Promise(function (resolve, reject) {
                let url = '/getcontactbyid'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        companyid: localStorage.getItem('companyid')
                    })
                }).then(result => {

                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function saveContact(contact) {
            return new Promise(function (resolve, reject) {
                let url = '/savecontact'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(contact),
                }).then(result => {

                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }



        function saveCompanyDetails(details) {
            return new Promise(function (resolve, reject) {
                let url = '/savecompany'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(details),
                }).then(result => {

                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function saveContact(contact) {
            return new Promise(function (resolve, reject) {
                let url = '/savecontact'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(contact),
                }).then(result => {

                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                })
            });
        }

        function getAccountExecutives() {
            return new Promise(function (resolve, reject) {
                let url = '/getaccountexecutive'
                Util.fetch(url, {
                    method: 'POST',
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {

                        //sort unassigned at top;
                        const existingData = [...result.response];
                        const unassigned = existingData.find(x => x.fullname === 'Professor');
                        const others = existingData.filter(x => x.fullname !== 'Professor');
                        result.response = [unassigned, ...others];

                        return resolve(result.response);

                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function deleteContact(contactid) {
            return new Promise(function (resolve, reject) {
                let url = '/deletecontact'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        contactid
                    })
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function fakeLogin(credentials) {
            return new Promise((resolve, reject) => {
                return resolve({
                    email: "fakeuser@abc.com",
                    token: "faketoken"
                });
            });

        }

        function verifyContactNMLS(data) {
            return new Promise(function (resolve, reject) {
                let url = '/verifycontactnmls'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getAllDocuments(companyid) {
            return new Promise(function (resolve, reject) {
                let url = '/getdocumentbycompanyid'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        companyid
                    })
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function downloadDocument(attachmentid) {
            return new Promise(function (resolve, reject) {
                let url = '/getattachmentbyattachmentid'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        attachmentid
                    })
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function uploadDocument(document) {
            return new Promise(function (resolve, reject) {
                let url = '/savedocument'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(document)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function verifyCompanyNMLS(payload) {
            return new Promise(function (resolve, reject) {
                let url = '/verifycompanynmls'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function updateSteps(payload) {
            payload.companyid = localStorage.getItem('companyid');
            return new Promise(function (resolve, reject) {
                let url = '/updateapplicationstep'
                Util.fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(payload)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getConfiguration(key) {
            return new Promise(function (resolve, reject) {
                let url = '/getaccconfigbykey'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        key
                    })
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function submitApplication() {
            return new Promise(function (resolve, reject) {
                let url = '/submitapplication'
                Util.fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify({
                        companyid: localStorage.getItem('companyid')
                    })
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getAllResources() {
            return new Promise(function (resolve, reject) {
                let url = '/getaccresource'
                Util.fetch(url, {
                    method: 'GET',
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getOptionSet(optionSetName, entityName = null) {
            return new Promise(function (resolve, reject) {
                let url = `/optionset?optionSetName=${optionSetName}&entityName=${entityName}`
                Util.fetch(url, {
                    method: 'GET',
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getUserProfile() {
            return new Promise(function (resolve, reject) {
                let url = '/getuserprofile'
                Util.fetch(url, {
                    method: 'GET',
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function updateProfile(profile) {
            return new Promise(function (resolve, reject) {
                let url = '/saveuserprofile'
                Util.fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(profile)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function changePassword(data) {
            data.companyid = localStorage.getItem('companyid');
            data.email = localStorage.getItem('email');
            return new Promise(function (resolve, reject) {
                let url = '/changepassword'
                Util.fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function sendPasswordResetLink(email) {
            return new Promise(function (resolve, reject) {
                let url = '/resetpassword'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        email
                    })
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function verifyKeyAndResetPassword(data) {
            return new Promise(function (resolve, reject) {
                let url = '/validateresetpasswordkey'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getNMLSDetailsByType(data) {
            return new Promise(function (resolve, reject) {
                let url = '/getdetailsbynmls'
                Util.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }


        function changePassword(data) {
            data.companyid = localStorage.getItem('companyid');
            data.email = localStorage.getItem('email');
            return new Promise(function (resolve, reject) {
                let url = '/changepassword'
                Util.fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        function getAllStates() {
            return new Promise(function (resolve, reject) {
                let url = '/states'
                Util.fetch(url, {
                    method: 'GET',
                }).then(result => {
                    if (result.status == Constants.HTTP.STATUS_OK) {
                        return resolve(result.response || []);
                    }
                    return reject(result.errormessage);
                }).catch(err => {
                    return reject(err);
                })
            });
        }

        return {
            login: login,
            authenticate: authenticate,
            loginUsingJWT: loginUsingJWT,
            register: register,

            getCompanyDetails: getCompanyDetails,
            saveCompanyDetails: saveCompanyDetails,
            getCompanyContacts: getCompanyContacts,
            saveContact: saveContact,
            getAccountExecutives: getAccountExecutives,
            deleteContact: deleteContact,
            verifyContactNMLS: verifyContactNMLS,
            verifyCompanyNMLS: verifyCompanyNMLS,

            getAllDocuments: getAllDocuments,
            uploadDocument: uploadDocument,
            downloadDocument: downloadDocument,

            getConfiguration: getConfiguration,
            submitApplication: submitApplication,

            getAllResources: getAllResources,
            getUserProfile: getUserProfile,
            updateProfile: updateProfile,
            changePassword: changePassword,
            updateSteps: updateSteps,

            sendPasswordResetLink: sendPasswordResetLink,
            verifyKeyAndResetPassword: verifyKeyAndResetPassword,
            isUniqueNMLS: isUniqueNMLS,
            getAllStates: getAllStates,

            getOptionSet: getOptionSet,

            getNMLSDetailsByType: getNMLSDetailsByType
        };

    }

    return commonService();
});