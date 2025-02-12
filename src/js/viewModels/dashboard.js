define(['downloadjs', 'appController', 'services/common', 'constants/constants', 'utils/Validators', 'knockout', 'utils/Util', 'ojs/ojarraydataprovider', 'utils/ResponsiveUtils', 'ojs/ojtrain', 'ojs/ojbutton', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojselectsingle', 'ojs/ojdialog', 'ojs/ojdefer', 'ojs/ojcheckboxset', 'ojs/ojtable', 'ojs/ojlistview', 'ojs/ojlistitemlayout', 'ojs/ojradioset', 'ojs/ojfilepicker', 'ojs/ojcheckboxset'],
  function (download, app, service, Constants, Validators, ko, Utils, ArrayDataProvider, ResponsiveUtils) {

    function LOV() {

      const self = this;

      self.data = {
        accountExecutive: ko.observableArray([]),
        state: ko.observableArray([]),

        jobTitle: ko.observableArray([]),
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
        }
        ]),
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
        jobTitle: new ArrayDataProvider(self.data.jobTitle, {
          keyAttributes: 'value',
          textFilterAttributes: ['label']
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
        jobTitle: (context) => context.data.label,
        brokerType: (context) => context.data.label,
        officeType: (context) => context.data.label,
      }

    }

    function CompanyForm() {

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

        accountexecutiveacc: ko.observable(),
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


          if (self.fields.accountexecutiveacc() == '')
            app.error("ERROR", "No Account Executive")
          await service.saveCompanyDetails(payload);


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

    function ContactForm() {

      const self = this;
      self.contacts = ko.observableArray([]);

      self.contactsProvider = new ArrayDataProvider(self.contacts, {
        keyAttributes: ['nmlsnumber']
      });

      self.selectedContact;

      self.columns = [{
        "headerText": "Full Name",
        "resizable": "enabled",
        "headerStyle": "font-weight: bold; width: 21%",
        "template": "fullNameTemplate",
      },
      {
        "headerText": "Job Title",
        "field": "contacttype",
        "resizable": "enabled",
        "headerStyle": "font-weight: bold; width: 12%",
        "template": "jobTitleTemplate"
      },
      {
        "headerText": "NMLS Number",
        "field": "nmlsnumber",
        "resizable": "enabled",
        "headerStyle": "font-weight: bold; width: 12%",
      },
      {
        "headerText": "Email",
        "field": "emailaddress",
        "resizable": "enabled",
        "headerStyle": "font-weight: bold; width: 25%",
      },
      {
        "headerText": "Telephone",
        "field": "telephone",
        "resizable": "enabled",
        "headerStyle": "font-weight: bold; width: 15%",
      },
      {
        "headerText": "Primary",
        "field": "isprimarycontact",
        "resizable": "enabled",
        "headerStyle": "font-weight: bold; width: 10%",
        "template": "primaryTemplate"
      },
      {
        "headerText": "Actions",
        "resizable": "enabled",
        "sortable": "disabled",
        "class": "oj-sm-helper-align-end",
        "headerStyle": "font-weight: bold; width: 5%",
        "template": "actionTemplate"
      },
      ];

      self.fields = {
        contactid: ko.observable('00000000-0000-0000-0000-000000000000'),
        nmlsnumber: ko.observable(),
        nmlscontactname: ko.observable(),
        firstname: ko.observable(),
        middlename: ko.observable(),
        lastname: ko.observable(),
        emailaddress: ko.observable(),
        telephone: ko.observable(),
        mobile: ko.observable(),
        contacttype: ko.observable(),
        jobtitleother: ko.observable(),
        isprimarycontact: ko.observableArray(["false"]),

        isportaluser: ko.observable(false),
      }

      self.add = function () {
        self.fields.contactid('00000000-0000-0000-0000-000000000000');
        self.fields.nmlsnumber(null);
        self.fields.nmlscontactname(null);
        self.fields.firstname(null);
        self.fields.middlename(null);
        self.fields.lastname(null);
        self.fields.emailaddress(null);
        self.fields.telephone(null);
        self.fields.mobile(null);
        self.fields.contacttype(null);
        self.fields.jobtitleother(null);
        self.fields.isprimarycontact(["false"]);

        Utils.openDialog('ContactDialog');
      }

      self.edit = function (event, context) {
        Utils.mapDataToObservable(context.row, self.fields);

        self.fields.isprimarycontact([context.row.isprimarycontact + "" || 'false']);

        self.fields.isportaluser(context.row.isportaluser ? true : false);

        Utils.openDialog('ContactDialog');
      }

      self.saveContact = async function () {

        try {


          if (!Utils.formHasErrors('contact_tracker')) {
            app.loading(true);

            let newContact = Utils.unpackObservable(self.fields);

            if (newContact.contactid == null)
              delete newContact.contactid;
            //HACK
            if (newContact.isprimarycontact !== 'true')
              newContact.isprimarycontact = 'false';

            //TEMP
            newContact['companyid'] = localStorage.getItem('companyid');
            let response = await service.saveContact(newContact);

            // response.isprimarycontact = [response.isprimarycontact || 'false'];


            let index = self.contacts().findIndex(contact => contact.contactid == response.contactid);
            if (index > -1) {
              self.contacts().splice(index, 1, response);
              self.contacts(self.contacts());
            } else {
              self.contacts.push(response);
            }
            Utils.closeDialog('ContactDialog');
            app.loading(false);
          }

        } catch (error) {
          app.error("Error", error);
          app.loading(false);
        }
      }

      self.save = function () { }

      self.delete = function (event, context) {
        if (context.row) {
          let index = self.contacts().findIndex(contact => contact.contactid == context.row.contactid);
          if (index > -1) {
            service.deleteContact(context.row.contactid);
            self.contacts().splice(index, 1);
            self.contacts(self.contacts());
          }
        }
      }

      self.load = async function () {
        try {

          app.loading(true);

          let contacts = await service.getCompanyContacts();

          self.contacts(contacts);

          app.loading(false);
        } catch (error) {
          app.error("Error", error);
          app.loading(false);
        }
      }

      self.verifyNMLS = async function () {

        app.loadingText('Verifying NMLS Number');
        app.loading(true);

        let payload = {
          contactid: self.fields.contactid(),
          nmlsnumber: self.fields.nmlsnumber(),
        }

        service.verifyContactNMLS(payload).then(res => {
          if (!res.nmlsstatus || res.nmlsstatus == 'Invalid') {
            app.error("Error", "Invalid NMLS Number");
          } else {
            //temp// app.confirm("Success", "NMLS Verified");
            let [firstname, lastname] = res.nmlscontactname.split(' ');
            self.fields.nmlscontactname(res.nmlscontactname);
            self.fields.firstname(firstname);
            self.fields.lastname(lastname);
          }
          app.loading(false);
        }).catch(err => {
          app.error("Error", err);
          app.loading(false);
        });
      }


    }

    function DocumentForm() {

      const self = this;
      self.data = ko.observableArray([]);

      self.noAttachment = '00000000-0000-0000-0000-000000000000';

      self.provider = new ArrayDataProvider(self.data, {
        keyAttributes: ['companydocumentid']
      });

      self.selectedDocument;

      self.onDocumentSelect = async function (event) {
        var file;
        if (event.detail.files && event.detail.files.length) {

          app.loadingText("Uploading Document")
          app.loading(true);

          file = event.detail.files[0];
          var base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });

          //;
          let payload = {
            companydocumentid: event.target.id,
            documentname: file.name,
            mimetype: file.type,
            documentbody: base64.split('base64,')[1]
          }

          service.uploadDocument(payload).then(_ => {
            self.load()
            //temp// app.confirm("Success", "Document Uploaded");
            app.loading(false);
          }).catch(_ => {
            app.error("Error", _);
            app.loading(false);
          });

        }
      }


      self.download = async function (context, event) {

        try {
          if (event.target.id && event.target.id != self.noAttachment) {
            app.loading(true);
            let data = await service.downloadDocument(event.target.id);

            download(window.atob(data.documentdescription), data.documentname, data.mimetype);
            app.loading(false);
          }
        } catch (error) {
          app.error("Error", error);
          app.loading(false);
        }
      }

      self.fields = {

        companyid: ko.observable(),
        companydocumentid: ko.observable(),
        documentname: ko.observable(),
        documentdescription: ko.observable(),
        companyname: ko.observable(),
        templateurl: ko.observable(),

        accdocumentannotationid: ko.observable(),

        required: ko.observableArray([false]),

        accdocument: ko.observable(),
        accdocumentname: ko.observable(),
        accdescription: ko.observable(),
        createdon: ko.observable(),

        mimetype: ko.observable(),
        documentbody: ko.observable(),
        istemplate: ko.observable(),
        attachmentid: ko.observable('00000000-0000-0000-0000-000000000000'),
        required: ko.observable(false)

      }


      self.downloadTemplate = async function (event, context) {
        templateGUID = context.currentTarget.getAttribute('url') || null;

        try {
          if (templateGUID) {
            app.loadingText("Downloading");
            app.loading(true);

            let data = await service.downloadDocument(templateGUID);

            download(window.atob(data.documentdescription), data.documentname, data.mimetype);
            app.loading(false);
          }
        } catch (err) {
          app.error(err);
          app.loading(false);
        }
      }

      self.save = function () { }

      // self.delete = function (event, context) {
      //   if (context.row) {
      //     let index = self.contacts().findIndex(contact => contact.contactid == context.row.contactid);
      //     if (index > -1) {
      //       service.deleteContact(context.row.contactid);
      //       self.contacts().splice(index, 1);
      //       self.contacts(self.contacts());
      //     }
      //   }
      // }

      self.load = async function () {
        try {

          app.loading(true);

          let documents = await service.getAllDocuments(localStorage.getItem('companyid'));

          self.data(documents);

          app.loading(false);
        } catch (error) {
          app.error("Error", error);
          app.loading(false);
        }
      }

      // self.verifyNMLS = async function () {
      //   app.loading(true);

      //   let payload = {
      //     contactid: self.fields.contactid(),
      //     nmlsnumber: self.fields.nmlsnumber(),
      //   }

      //   service.verifyContactNMLS(payload).then(res => {
      //     if (!res.nmlsstatus || res.nmlsstatus == 'Invalid') {
      //       //temp// app.error("Error", "Invalid NMLS Number");
      //     } else {
      //       //temp// app.confirm("Success", "NMLS Verified");
      //       self.fields.nmlscontactname(res.nmlscontactname);
      //     }
      //     app.loading(false);
      //   }).catch(err => {
      //     //temp// app.error("Error", err);
      //   });
      // }

    }

    function DashboardViewModel() {

      const self = this;

      self.applicationSubmitted = ko.observable(false);

      self.nmlsverified = ko.observable(localStorage.getItem('nmlsverified') == 'true');

      app.loading(true);
      if (!app.isLoggedIn()) {
        app.router.go({
          path: 'error'
        });
      }

      self.LOV = new LOV();

      self.Screen = ResponsiveUtils;

      self.Screen.columns = ko.computed(() => {
        if (self.Screen.isSmallScreen()) return 1;
        else if (self.Screen.isMediumScreen()) return 2;
        else if (self.Screen.isLargeScreen()) return 2;
      });

      service.getOptionSet(Constants.OPTION_SETS?.JOB_TITLE?.NAME, Constants.OPTION_SETS?.JOB_TITLE?.ENTITY_NAME)
        .then(optionSetValues => {

          self.LOV.data.jobTitle(optionSetValues.map(osv => {
            osv.value = osv.value + '';
            return osv;
          }));
        });

      service.getAllStates().then(states => {
        self.LOV.data.state(states);
      }).catch(error => {
        self.LOV.data.state([]);
      });

      service.getAccountExecutives().then(executives => {
        self.LOV.data.accountExecutive(executives);
      }).catch(error => {
        self.LOV.data.accountExecutive([]);
      });

      self.InfoPage = ko.observable();
      self.SubmitPage = ko.observable();

      self.getByKey = async function (key) {
        var response = await service.getConfiguration(key);
        return response.value;
      }

      self.getByKey('InfoPage').then(HTML => {
        app.loading(false);
        self.InfoPage(HTML);
      }).catch(_ => {
        app.loading(false)
      });

      self.getByKey('SubmitPage').then(HTML => {
        app.loading(false);
        self.SubmitPage(HTML);
      }).catch(_ => {
        app.loading(false)
      });

      self.selectedStepValue = ko.observable('INFORMATION');
      self.selectedStepLabel = ko.observable('');

      self.disabled = ko.computed(function () {
        return self.selectedStepValue() === 'SUBMIT';
      }, self);

      self.validator = Validators;

      self.isFormReadonly = ko.observable(false);

      self.company = new CompanyForm();

      self.contact = new ContactForm();

      self.document = new DocumentForm();

      // let userStepHistoryJSON = localStorage.getItem(localStorage.getItem('companyid')) || "[]";
      // let userStepHistory = JSON.parse(userStepHistoryJSON);

      self.stepArray =
        ko.observableArray([{
          label: 'Information',
          id: 'INFORMATION',
          messageType: localStorage.getItem('INFORMATION') || '', //userStepHistory['INFORMATION'] || ''
        },
        {
          label: 'Company Info',
          id: 'COMPANY_INFO',
          form: self.company,
          messageType: localStorage.getItem('COMPANY_INFO') || '', //userStepHistory['COMPANY_INFO'] || ''
        },
        {
          label: 'Contacts',
          id: 'CONTACTS',
          form: self.contact,
          messageType: localStorage.getItem('CONTACTS') || '', //userStepHistory['CONTACTS'] || ''
        },
        {
          label: 'Documents',
          id: 'DOCUMENTS',
          form: self.document,
          messageType: localStorage.getItem('DOCUMENTS') || '', //userStepHistory['DOCUMENTS'] || ''
        },
        ]);


      if (localStorage.getItem('currentStep')) {
        self.selectedStepValue(localStorage.getItem('currentStep'));
        let step = self.stepArray().find(item => item.id === localStorage.getItem('currentStep'));
        if (step && step.form) {
          step.form.load();
        }
      }


      //It is being called by the train to make sure the form is valid before moving on to `the next step.
      self.validate = function (event) {

        var nextStep = event.detail.toStep;
        var previousStep = event.detail.fromStep;

        var tracker = document.getElementById("tracker");

        if (!tracker) return;
        if (tracker.valid === "valid") {
          if (!['SUBMIT'].includes(previousStep.id))
            previousStep.messageType = 'confirmation';

          if (previousStep.form) previousStep.form.save();

          if (nextStep.form) nextStep.form.load();

          document.getElementById("train").updateStep(previousStep.id, previousStep);
          self.selectedStepValue(nextStep.id);

          localStorage.setItem('currentStep', nextStep.id);
          localStorage.setItem(previousStep.id, previousStep.messageType);

          let payload = {};

          switch (nextStep.id) {
            case "INFORMATION":
              payload.currentapplicationstep = 1;
              break;
            case "COMPANY_INFO":
              payload.currentapplicationstep = 2;
              break;
            case "CONTACTS":
              payload.currentapplicationstep = 3;
              break;
            case "DOCUMENTS":
              payload.currentapplicationstep = 4;
              break;
            case "SUBMIT":
              payload.currentapplicationstep = 5;
              break;
          }

          let StepMessageType = 1; //None
          switch (previousStep.messageType) {
            case "error":
              StepMessageType = 2;
              break;
            case "confirmation":
              StepMessageType = 3;
              break;
          }

          switch (previousStep.id) {
            case "INFORMATION":
              payload.informationstepstatus = StepMessageType;
              break;
            case "COMPANY_INFO":
              payload.companystepstatus = StepMessageType
              break;
            case "CONTACTS":
              payload.contactstepstatus = StepMessageType;
              break;
            case "DOCUMENTS":
              payload.documentstepstatus = StepMessageType;
              break;
            case "SUBMIT":
              payload.submitstepstatus = StepMessageType;
              break;
          }

          service.updateSteps(payload);

        } else {
          event.preventDefault();
          previousStep.messageType = 'error';
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
          return;
        }

        if (previousStep.id == 'CONTACTS' && !self.contact.contacts().length) {
          previousStep.messageType = 'error';
        }

        if (['DOCUMENTS'].includes(previousStep.id)) {
          previousStep.messageType = 'error';
        }

      }

      self.updateStepForm = function (event) { }

      self.nextStep = function () {

        var train = document.getElementById('train');
        var next = train.getNextSelectableStep();
        if (next != null) {
          document.getElementById(next).click();
        }
      }

      self.previousStep = function () {
        var train = document.getElementById('train');
        var prev = train.getPreviousSelectableStep();
        if (prev != null) {
          document.getElementById(prev).click();
        }
      }

      self.submitApplication = async function () {

        app.loadingText("Submitting Application");
        app.loading(true);

        //   let appSubmittedMessage = `<div class="green">
        //   <h5>Application Submitted</h5><br />
        //   Thank you for your Application <br />
        //   If you have any questions please contact us at <a
        //     href="mailto:contact@accmortgage.com">contact@accmortgage.com</a> or call us on <a
        //     href="tel:1800258285">+1800 258 285</a>
        // </div>`;

        //   self.getByKey('SubmitApplication').then(HTML => {
        //     app.loading(false);
        //     self.SubmitPage(HTML);
        //   }).catch(_ => {
        //     app.loading(false)
        //   });

        setTimeout(async function () {

          await service.submitApplication();

          self.applicationSubmitted(true);

          app.router.go({
            path: 'company'
          });

          app.router.sync().then(_=>{
            app.isSubmitted(true);
            localStorage.setItem('applicationsubmitted', true);
          });            

        }, 250);
      }
    }


    return DashboardViewModel
  }
);