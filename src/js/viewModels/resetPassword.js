define(['appController', 'knockout', 'services/common', 'utils/Util', 'ojs/ojarraydataprovider', 'utils/Validators', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojvalidationgroup'],
  function (app, ko, service, Utils, ArrayDataProvider, Validators) {

    function ResetPasswordViewModel() {

      app.loading(true);

      const self = this;

      self.key = ko.observable(Utils.getUrlVars()['key'] || null)

      self.validators = Validators;

      self.email = ko.observable();
      self.password = ko.observable();

      self.confirmPassword = ko.observable();

      if (self.key() != null) {
        let payload = {
          passwordmanagementkey: self.key()
        }

        service.verifyKeyAndResetPassword(payload).then(result => {

          self.email(result.email);
          app.loading(false);
        }).catch(error => {
          app.error("Error", error);
          self.key(null);
          app.loading(false);
        })

      }
      else{
        app.loading(false);
      }
      
      self.equalToPassword = {
        validate: function (value) {
          var compareTo = self.password.peek();
          if (!value && !compareTo)
            return;
          else if (value !== compareTo) {
            throw new Error("The passwords must match");
          }
          return;
        }.bind(this)
      };

      self.password.subscribe(function (newValue) {
        var cPassword = document.getElementById("confirmPassword");
        var cpUIVal = cPassword.value;

        if (newValue && cpUIVal) {
          cPassword.validate();
        }
      });

      self.resetPassword = function () {
        if (!Utils.formHasErrors('tracker')) {
          app.loading(true);

          let payload = {
            passwordmanagementkey: self.key(),
            newpassword: self.password()
          };

          service.verifyKeyAndResetPassword(payload).then(result => {
            app.loading(false);

            app.confirm("Reset Password", "Success, please login using your new password.");
            app.router.go({
              path: 'login'
            });

          }).catch(error => {
            app.loading(false);
          });

        }

      }

      self.sendEmail = function () {
        if (!Utils.formHasErrors('tracker')) {
          app.loading(true);

          service.sendPasswordResetLink(self.email()).then(result => {
            app.loading(false);

            app.confirm("Reset Password", "Please check your email");
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

    return ResetPasswordViewModel;
  }
);