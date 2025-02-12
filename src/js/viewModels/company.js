define(['utils/Validators', 'knockout', 'appController', 'services/common', 'utils/Util', 'constants/constants', 'ojs/ojarraydataprovider', 'utils/Validators', 'ojs/ojbutton', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojselectsingle', 'ojs/ojradioset', 'ojs/ojcheckboxset', 'ojs/ojpopup'],
  function (Validators, ko, app, service, Utils, Constants, ArrayDataProvider, Validators) {

    function LOV() {

      const self = this;

      self.validators = Validators;

      self.data = {
        accountExecutive: ko.observableArray([]),
        state: ko.observableArray([]),

        brokerType: ko.observableArray([{
          label: 'Residential',
          value: "1"
        },
        {
          label: 'Business Purpose Loans Only',
          value: "2"
        },
        ]),
        officeType: ko.observableArray([{
          label: 'Main Office',
          value: "true"
        },
        {
          label: 'Branch Office',
          value: "false"
        },
        ])
      }

      self.providers = {
        accountExecutive: new ArrayDataProvider(self.data.accountExecutive, {
          keyAttributes: 'systemuserid',
          textFilterAttributes: ['fullname']
        }),
        state: new ArrayDataProvider(self.data.state, {
          keyAttributes: 'stateid',
          textFilterAttributes: ['statecode']
        }),
        brokerType: new ArrayDataProvider(self.data.brokerType, {
          keyAttributes: 'value',
          textFilterAttributes: ['label']
        }),
        officeType: new ArrayDataProvider(self.data.officeType, {
          keyAttributes: 'value',
          textFilterAttributes: ['label']
        }),
      }

      self.text = {
        accountExecutive: (context) => context.data.fullname,
        state: (context) => context.data.statecode,
        brokerType: (context) => context.data.label,
        officeType: (context) => context.data.label,
      }

    }

    function Form() {

      const self = this;

      self.fields = {
        companyid: ko.observable(),
        isbranchoffice: ko.observableArray(["false"]),
        nmlsnumber: ko.observable(),
        nmlsname: ko.observable(),

        name: ko.observable(),
        phone: ko.observable(),
        addressline1: ko.observable(),
        addressline2: ko.observable(),
        fax: ko.observable(),
        city: ko.observable(),
        state: ko.observable(),
        zipcode: ko.observable(),
        brokerType: ko.observable("1"),

        accountexecutiveacc: ko.observable(null),
        comments: ko.observable(''),

        nmlscompanyname: ko.observable(),
        nmlsstatus: ko.observable(),

        websiteurl: ko.observable(),
      }


      self.isBranch = ko.computed(() => {
        if (self.fields.isbranchoffice() && self.fields.isbranchoffice().length) {
          return (self.fields.isbranchoffice()[0] == 'true')
        }
        return false;
      });

      self.save = async function () {
        try {

          if (self.fields.isbranchoffice().length == 0)
            self.fields.isbranchoffice(['false'])
          let payload = Utils.unpackObservable(self.fields);

          if (!Utils.formHasErrors('NMLS') && !Utils.formHasErrors('company') && !Utils.formHasErrors('account-executive')) {
            await service.saveCompanyDetails(payload);
            app.confirm("Saved Successfully");
          }

        } catch (error) {
          app.error("Error", error);
        }
      }

      self.load = async function () {
        try {

          let details = await service.getCompanyDetails();
          Utils.mapDataToObservable(details, self.fields);

          self.fields.isbranchoffice(details.isbranchoffice ? ['true'] : ['false']);
          self.fields.brokerType(details.brokertype ? details.brokertype + "" : "1");
          self.fields.phone(details.phone || '');

        } catch (error) {
          app.error("Error", error);
        }
      }

      // self.verifyNMLS = async function () {

      //   app.loadingText('Verifying NMLS Number');
      //   app.loading(true);

      //   let payload = {
      //     companyid: self.fields.companyid(),
      //     nmlsnumber: self.fields.nmlsnumber(),
      //   }

      //   service.verifyCompanyNMLS(payload).then(res => {

      //     if (!res.nmlsstatus || res.nmlsstatus == 'Invalid') {
      //       app.error("Error", "Invalid NMLS Number");
      //     } else {
      //       app.confirm("Success", "NMLS Verified");
      //       self.fields.nmlscompanyname(res.nmlscompanyname);
      //       if (!self.fields.name())
      //         self.fields.name(res.nmlscompanyname);
      //     }
      //     app.loading(false);
      //   }).catch(err => {
      //     app.error("Error", err);
      //     app.loading(false);
      //   });
      // }

      self.verifyNMLS = async function () {

        if (self.fields.nmlsnumber() && self.fields.nmlsnumber().length > 0) {

          app.loadingText('Verifying NMLS Number');
          app.loading(true);

          let payload = {
            companyid: self.fields.companyid(),
            nmlsnumber: self.fields.nmlsnumber(),
          }

          service.isUniqueNMLS(payload).then(res => {
            app.loading(false);
          }).catch(err => {
            // app.error("Error", err);
            app.dialog.open("NMLS Already Registered", "The company associated with this NMLS number is already registered. Please contact your ACC account executive to request credentials to access company data.", 'signOut');

            app.loading(false);
          });
        }

      }

    }

    function CompanyViewModel() {

      app.loading(true);
      const self = this;

      self.validator = Validators;

      self.nmlsverified = ko.observable(localStorage.getItem('nmlsverified') == 'true');

      self.disabled = false;
      self.LOV = new LOV();

      self.company = new Form();

      Promise.all([service.getAllStates(), service.getAccountExecutives()]).then(([states, executives]) => {

        self.LOV.data.state(states);
        self.LOV.data.accountExecutive(executives);

        self.company.load().then(_ => {
          app.loading(false);
        }).catch(_ => {
          app.loading(false);
        });

      }).catch(error => {
        app.loading(false);
      });

      app.router.beforeStateChange.subscribe(function (args) {
        var state = args.state;
        var accept = args.accept;
        if (Utils.formHasErrors('NMLS') || Utils.formHasErrors('company') || Utils.formHasErrors('account-executive')) {
          accept(Promise.reject('model is dirty'));
        } else {
          self.company.save();
        }
      });

    }
    return CompanyViewModel;
  }
);