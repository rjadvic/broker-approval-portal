define([], function () {

    let MIDDLEWARE_CONTEXT_ROOT = "ACCMW";

    return {

        // API_URL: window.location.protocol + "//" + window.location.host + "/" + MIDDLEWARE_CONTEXT_ROOT,

        //API_URL: 'https://accmortgageapi.azurewebsites.net/api',
        //API_URL: 'https://accmortgagedev.azurewebsites.net/api',
        API_URL: 'https://accmortgage1.azurewebsites.net/api',
        //API_URL: 'http://localhost:7073/api',
        //API_URL: 'http://c5daa0934318.ngrok.io',

        HTTP: {
            STATUS_OK: 200,
            STATUS_UNAUTHORIZED: 401,
            STATUS_SERVER_ERROR: 500
        },

        OPTION_SETS: {
            JOB_TITLE: {
                NAME: 'nwp_contacttype',
                ENTITY_NAME: ''
            }
        },

        GUID_EMPTY: '00000000-0000-0000-0000-000000000000',
        HTTP_REQUEST_TIMEOUT: 10000,

        ALL_ROUTES: [{
            path: '^(?!(error|dashboard|customers|about|login|register|resetPassword|company|contacts|documents|resources|profile|)$).*$',
            redirect: 'error'
        },
        {
            path: '',
            redirect: 'login'
        },
        {
            path: 'dashboard',
            detail: {
                label: 'Dashboard',
            }
        },
        {
            path: 'company',
            detail: {
                label: 'Company'
            }
        },
        {
            path: 'contacts',
            detail: {
                label: 'Contacts'
            }
        },
        {
            path: 'documents',
            detail: {
                label: 'Documents'
            }
        },
        {
            path: 'resources',
            detail: {
                label: 'Resources'
            }
        },
        {
            path: 'profile',
            detail: {
                label: 'Profile'
            }
        },

        {
            path: 'login',
            detail: {
                label: 'Login'
            }
        },
        {
            path: 'register',
            detail: {
                label: 'Register'
            }
        },
        {
            path: 'resetPassword',
            detail: {
                label: 'Reset Password'
            }
        },
        {
            path: 'error',
            detail: {
                label: 'Error'
            }
        }
        ],

        DEFAULT_ROUTES: [{
            path: '^(?!(error|login|register|)$).*$',
            redirect: 'error'
        },
        {
            path: '',
            redirect: 'login'
        },
        {
            path: 'login',
            detail: {
                label: 'Login'
            }
        },
        {
            path: 'register',
            detail: {
                label: 'Register'
            }
        },
        {
            path: 'error',
            detail: {
                label: 'Error'
            }
        }
        ],

        STATES: {
            '7ec09edb-6cf0-ea11-a815-000d3a337dd2': 'AK',
            '7cc09edb-6cf0-ea11-a815-000d3a337dd2': 'AL',
            '82c09edb-6cf0-ea11-a815-000d3a337dd2': 'AR',
            '80c09edb-6cf0-ea11-a815-000d3a337dd2': 'AZ',
            '84c09edb-6cf0-ea11-a815-000d3a337dd2': 'CA',
            '86c09edb-6cf0-ea11-a815-000d3a337dd2': 'CO',
            '88c09edb-6cf0-ea11-a815-000d3a337dd2': 'CT',
            '8ac09edb-6cf0-ea11-a815-000d3a337dd2': 'DE',
            '8cc09edb-6cf0-ea11-a815-000d3a337dd2': 'FL',
            '8ec09edb-6cf0-ea11-a815-000d3a337dd2': 'GA',
            '90c09edb-6cf0-ea11-a815-000d3a337dd2': 'HI',
            '98c09edb-6cf0-ea11-a815-000d3a337dd2': 'IA',
            '92c09edb-6cf0-ea11-a815-000d3a337dd2': 'ID',
            '94c09edb-6cf0-ea11-a815-000d3a337dd2': 'IL',
            '96c09edb-6cf0-ea11-a815-000d3a337dd2': 'IN',
            '9ac09edb-6cf0-ea11-a815-000d3a337dd2': 'KS',
            '9cc09edb-6cf0-ea11-a815-000d3a337dd2': 'KY',
            '9ec09edb-6cf0-ea11-a815-000d3a337dd2': 'LA',
            'a4c09edb-6cf0-ea11-a815-000d3a337dd2': 'MA',
            'a2c09edb-6cf0-ea11-a815-000d3a337dd2': 'MD',
            'a0c09edb-6cf0-ea11-a815-000d3a337dd2': 'ME',
            'a6c09edb-6cf0-ea11-a815-000d3a337dd2': 'MI',
            'a8c09edb-6cf0-ea11-a815-000d3a337dd2': 'MN',
            'acc09edb-6cf0-ea11-a815-000d3a337dd2': 'MO',
            'aac09edb-6cf0-ea11-a815-000d3a337dd2': 'MS',
            'aec09edb-6cf0-ea11-a815-000d3a337dd2': 'MT',
            'bcc09edb-6cf0-ea11-a815-000d3a337dd2': 'NC',
            'bec09edb-6cf0-ea11-a815-000d3a337dd2': 'ND',
            'b0c09edb-6cf0-ea11-a815-000d3a337dd2': 'NE',
            'b4c09edb-6cf0-ea11-a815-000d3a337dd2': 'NH',
            'b6c09edb-6cf0-ea11-a815-000d3a337dd2': 'NJ',
            'b8c09edb-6cf0-ea11-a815-000d3a337dd2': 'NM',
            'b2c09edb-6cf0-ea11-a815-000d3a337dd2': 'NV',
            'bac09edb-6cf0-ea11-a815-000d3a337dd2': 'NY',
            'c0c09edb-6cf0-ea11-a815-000d3a337dd2': 'OH',
            'c2c09edb-6cf0-ea11-a815-000d3a337dd2': 'OK',
            'c4c09edb-6cf0-ea11-a815-000d3a337dd2': 'OR',
            'c6c09edb-6cf0-ea11-a815-000d3a337dd2': 'PA',
            'c8c09edb-6cf0-ea11-a815-000d3a337dd2': 'RI',
            'cac09edb-6cf0-ea11-a815-000d3a337dd2': 'SC',
            'ccc09edb-6cf0-ea11-a815-000d3a337dd2': 'SD',
            'cec09edb-6cf0-ea11-a815-000d3a337dd2': 'TN',
            'd0c09edb-6cf0-ea11-a815-000d3a337dd2': 'TX',
            'd2c09edb-6cf0-ea11-a815-000d3a337dd2': 'UT',
            'd6c09edb-6cf0-ea11-a815-000d3a337dd2': 'VA',
            'd4c09edb-6cf0-ea11-a815-000d3a337dd2': 'VT',
            'd8c09edb-6cf0-ea11-a815-000d3a337dd2': 'WA',
            'dcc09edb-6cf0-ea11-a815-000d3a337dd2': 'WI',
            'dac09edb-6cf0-ea11-a815-000d3a337dd2': 'WV',
            'dec09edb-6cf0-ea11-a815-000d3a337dd2': 'WY'
        },


        MONTHS: [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ]
    }
})