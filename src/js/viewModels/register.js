/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['appController', 'knockout', 'services/common', 'utils/Util', 'utils/Validators', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojvalidationgroup', 'ojs/ojcheckboxset'],
  function (app, ko, service, Utils, Validators) {

    function RegisterViewModel() {

      const self = this;

      self.validators = Validators;

      self.verifyContactNMLS = function (event) {

        let nmlsnumber = self.form.contactnmlsnumber();

        if (nmlsnumber && nmlsnumber.replace(/\s/g, '').length) {
          app.loadingText("Verifying Individual NMLS")
          app.loading(true);
          service.getNMLSDetailsByType({
            nmlstype: 'CONTACT',
            nmlsnumber: nmlsnumber
          }).then(response => {
            self.form.firstName(response.firstname);
            self.form.lastName(response.lastname);
            self.form.companynmlsnumber(response.nmlsnumber);
            self.form.companyname(response.companyname);
            app.loading(false);
          }).catch(err => {
            app.loading(false);
            app.error(err);
          });
        }
      }

      self.verifyCompanyNMLS = function (event) {
        let nmlsnumber = self.form.companynmlsnumber();

        if (nmlsnumber && nmlsnumber.replace(/\s/g, '').length) {
          app.loadingText("Verifying Company NMLS")
          app.loading(true);
          service.getNMLSDetailsByType({
            nmlstype: 'COMPANY',
            nmlsnumber: nmlsnumber
          }).then(response => {
            self.form.companyname(response.companyname);
            app.loading(false);
          }).catch(err => {
            app.loading(false);
            app.error(err);
          });
        }

      }

      self.form = {
        nocontactnmls: ko.observableArray(['N']),
        contactnmlsnumber: ko.observable(),
        firstName: ko.observable(),
        lastName: ko.observable(),

        nocompanynmls: ko.observableArray(['N']),
        companynmlsnumber: ko.observable(),
        companyname: ko.observable(),

        email: ko.observable(),
        password: ko.observable(),

        agreed: ko.observableArray(['N']),

      }

      self.form.nocompanynmls.subscribe(function(newValue){
        
        if(newValue && newValue.includes('Y'))
          self.form.companynmlsnumber('');
      });


      
      self.form.nocontactnmls.subscribe(function(newValue){
        
        if(newValue && newValue.includes('Y'))
          self.form.contactnmlsnumber('');
      });

      self.confirmPassword = ko.observable();

      self.equalToPassword = {

        validate: function (value) {
          var compareTo = self.form.password.peek();
          if (!value && !compareTo)
            return;
          else if (value !== compareTo) {
            throw new Error("The passwords must match");
          }
          return;
        }.bind(this)
      };


      self.form.password.subscribe(function (newValue) {
        var cPassword = document.getElementById("confirmPassword");
        var cpUIVal = cPassword.value;

        if (newValue && cpUIVal) {
          cPassword.validate();
        }
      });

      self.register = function () {
        if (!Utils.formHasErrors('tracker')) {
          app.loadingText("Creating an Account")
          app.loading(true);
          let form = Utils.unpackObservable(self.form);

          service.register(form).then(result => {
            app.loading(false);

            //temp// app.confirm("Enrollment", "Registration Successful");
            app.router.go({
              path: 'login'
            });

          }).catch(error => {
            app.loading(false);
            app.error(error);
          });

        }

      }

    }

    return RegisterViewModel;
  }
);