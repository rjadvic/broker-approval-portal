define(['appController', 'knockout', 'services/common', 'utils/Util', 'ojs/ojarraydataprovider', 'utils/Validators', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojvalidationgroup'],
  function (app, ko, service, Utils, ArrayDataProvider, Validators) {

    function ProfileViewModel() {

      const self = this;

      self.validators = Validators;

      self.form = {
        oldpassword: ko.observable(null),
        password: ko.observable(),
      }

      self.profile = {
        firstname: ko.observable(),
        lastname: ko.observable(),
        emailaddress: ko.observable(),
      }

      
      service.getUserProfile().then(profile=>{
        Utils.mapDataToObservable(profile,self.profile);
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

      self.updateProfile = function () {
        if (!Utils.formHasErrors('profile')) {
          app.loading(true);
          let form = Utils.unpackObservable(self.profile);

          service.updateProfile(form).then(result => {
            app.loading(false);
            app.confirm("Profile details updated");
          }).catch(error => {
            app.loading(false);
            app.error("Update Profile", error);
          });
        }
      }

      
      self.changePassword = function () {
        if (!Utils.formHasErrors('password')) {
          app.loading(true);
          let form = Utils.unpackObservable(self.form);

          service.changePassword(form).then(result => {
            app.loading(false);
            app.confirm("Password updated");
            self.form.oldpassword(self.form.password());
          }).catch(error => {
            app.loading(false);
            app.error("Update Password", error);
          });
        }
      }

    }

    return ProfileViewModel;
  }
);