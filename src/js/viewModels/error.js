define(['appController'],
  function (app) {
    function ErrorViewModel() {
      app.isLoggedIn(false);
      app.loading(false);

      this.errorCode = "";
      this.errorMessage = "Session Expired :(";
      this.errorSummary = "Please login again to continue";
      this.errorDescription = "";//"That's an error due to an invalid session";

      this.goHome = function () {
        app.router.go({
          path: 'login'
        });
      }
    }
    return ErrorViewModel;
  }
);