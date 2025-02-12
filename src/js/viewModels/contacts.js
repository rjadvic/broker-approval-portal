define(['knockout', 'appController', 'services/common', 'utils/Util', 'constants/constants', 'ojs/ojarraydataprovider', 'utils/Validators', 'ojs/ojbutton', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojselectsingle', 'ojs/ojdialog', 'ojs/ojdefer', 'ojs/ojcheckboxset', 'ojs/ojtable', 'ojs/ojradioset'],
  function (ko, app, service, Utils, Constants, ArrayDataProvider, Validators) {

    function LOV() {

      const self = this;

      self.data = {
        jobTitle: ko.observableArray([]),
      }

      self.providers = {
        jobTitle: new ArrayDataProvider(self.data.jobTitle, {
          keyAttributes: 'value',
          textFilterAttributes: ['label']
        }),
      }

      self.text = {
        jobTitle: (context) => context.data.label,
      }

    }

    function Form() {

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
        
        self.fields.isportaluser(context.row.isportaluser? true : false);

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
            //temp// app.confirm("Success", "");
            app.loading(false);
          }

        } catch (error) {
          app.error("Error", error);
          app.loading(false);
        }
      }

      self.save = function () {}

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

    function ContactsViewModel() {
      const self = this;

      self.contact = new Form();
      self.validator = Validators;
      self.disabled = false;
      self.LOV = new LOV();

      self.contact.load();

      service.getOptionSet(Constants.OPTION_SETS?.JOB_TITLE?.NAME, Constants.OPTION_SETS?.JOB_TITLE?.ENTITY_NAME)
      .then(optionSetValues => {

        self.LOV.data.jobTitle(optionSetValues.map(osv => {
          osv.value = osv.value + '';
          return osv;
        }));
      });

    }
    return ContactsViewModel;
  }
);