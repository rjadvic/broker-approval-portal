define(['knockout', 'utils/Util', 'constants/constants', 'services/common', 'appController', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojcheckboxset', 'ojs/ojvalidationgroup'],
  function (ko, Utils, Constants, service, app) {

    function LoginForm() {
      const self = this;

      self.fields = {
        email: ko.observable(app.userLogin()),
        password: ko.observable(),
        rememberme: ko.observable(['N'])
      }

      self.valid = function () {
        let form = document.getElementById('loginForm');
        if (!form) return false;
        if (form.valid === "valid") {
          return true;
        } else {
          form.showMessages();
          form.focusOn("@firstInvalidShown");
          return false;
        }
      }

      self.submit = function () {
        if (self.valid()) {

          let credentials = Utils.unpackObservable(self.fields);

          app.loading(true);
          app.loadingText("Signing in...")
          service.login(credentials).then(result => {

            localStorage.clear();
            //result.applicationsubmitted = false;

            app.user({
              email: result.email,
              token: result.token,
              companyid: result.companyid,
              contactid: result.contactid,
              applicationsubmitted: result.applicationsubmitted
            });


            localStorage.setItem('email', result.email);

            localStorage.setItem('token', result.token);

            localStorage.setItem('companyid', result.companyid);

            localStorage.setItem('contactid', result.contactid);

            localStorage.setItem('applicationsubmitted', result.applicationsubmitted);

            localStorage.setItem('nmlsverified', result.nmlsverified);

            app.isLoggedIn(true);
            app.isSubmitted(result.applicationsubmitted);

            // app.initializeRoutes(Constants.ALL_ROUTES).sync();

            self.updateSteps(result.applicationstep);

            if (result.applicationsubmitted) {

              if (result.nmlsverified) {

                app.router.go({
                  path: 'documents'
                });

              }
              else {

                app.router.go({
                  path: 'company'
                });

              }

            } else {
              app.router.go({
                path: 'dashboard'
              });
            }

            //temp// app.confirm("Success", "Logged in");

          }).catch(error => {
            app.error("Login", error);
          }).finally(_ => {
            app.loading(false);
          });

        }
        return false;
      }


      function resolveStepStatus(status) {
        return status == 3 ? "confirm" : status == 2 ? "error" : "";
      }

      self.updateSteps = function (steps) {

        switch (steps.currentapplicationstep) {
          case 1:
            localStorage.setItem("currentStep", "INFORMATION");
            break;
          case 2:
            localStorage.setItem("currentStep", "COMPANY_INFO");
            break;
          case 3:
            localStorage.setItem("currentStep", "CONTACTS");
            break;
          case 4:
            localStorage.setItem("currentStep", "DOCUMENTS");
            break;
          case 5:
            localStorage.setItem("currentStep", "SUBMIT");
            break;
        }

        localStorage.setItem("INFORMATION", resolveStepStatus(steps.informationstepstatus));
        localStorage.setItem("COMPANY_INFO", resolveStepStatus(steps.companystepstatus));
        localStorage.setItem("CONTACTS", resolveStepStatus(steps.contactstepstatus));
        localStorage.setItem("DOCUMENTS", resolveStepStatus(steps.documentstepstatus));
        localStorage.setItem("SUBMIT", resolveStepStatus(steps.submitstepstatus));

      }

    }

    function LoginViewModel() {

      self.form = new LoginForm();

      this.register = function () {
        app.router.go({
          path: 'register'
        });
      }

      this.resetPassword = function () {
        app.router.go({
          path: 'resetPassword'
        });
      }

    }

    return LoginViewModel;
  }
);