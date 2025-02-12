define(['utils/Util',
  'constants/constants', 'services/common', 'knockout', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
  'ojs/ojoffcanvas', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojmessages', 'ojs/ojprogress', 'ojs/ojbutton', 'ojs/ojdialog'
],
  function (Util, Constants, Service, ko, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils) {
    function NavigationData() {

      let applicationForm = {
        path: 'dashboard',
        detail: {
          label: 'Application',
          iconClass: 'oj-ux-ico-add-edit-page'
        }
      };

      let company = {
        path: 'company',
        detail: {
          label: 'Company',
          iconClass: 'oj-ux-ico-office'
        }
      };

      let contacts = {
        path: 'contacts',
        detail: {
          label: 'Contacts',
          iconClass: 'oj-ux-ico-contact'
        }
      };

      let documents = {
        path: 'documents',
        detail: {
          label: 'Documents',
          iconClass: 'oj-ux-ico-documents'
        }
      };


      let resources = {
        path: 'resources',
        detail: {
          label: 'Resources',
          iconClass: 'oj-ux-ico-folders'
        }
      };

      return {
        applicationForm,
        company,
        contacts,
        documents,
        resources
      }
    }

    function CommonDialog(application) {
      const self = this;

      self.body = ko.observable('');
      self.title = ko.observable('');

      self.callback = ko.observable('signOut');

      self.invokeCallback = function () {
        Util.closeDialog('CommonDialog');

        let callback = self.callback() || null;

        if (callback && typeof application[callback] == 'function')
          application[callback]()
      }

      self.open = function (title = null, body = null, callbackFunction = null) {

        self.body(body || '');
        self.title(title || '');

        if (callbackFunction) self.callback(callbackFunction);

        Util.openDialog('CommonDialog');

      }
    }

    function ControllerViewModel() {

      var self = this;

      self.dialog = new CommonDialog(self);

      self.isLoggedIn = ko.observable(false);

      self.isSubmitted = ko.observable(false);

      self.isSubmitted.subscribe(newValue => {
        if (newValue === true || newValue === 'true') {
          self.navigationListItems([self.pages.company, self.pages.contacts, self.pages.documents, self.pages.resources]);
        } else {
          self.navigationListItems([self.pages.applicationForm]);
        }
      });

      self.user = ko.observable({});

      self.applicationMessages = ko.observableArray([]);

      self.loading = ko.observable(true);

      self.loadingText = ko.observable('Loading...');

      self.loading.subscribe((loading) => {

        let loader = document.getElementById('loader');

        if (loading) {
          loader.style.display = 'flex'
        } else {
          loader.style.display = 'none';
          self.loadingText('Loading...');
        }

      });

      self.pages = NavigationData();

      self.initializeRoutes = function (RouteCollection, skipHistory = false) {

        if (self.router)
          self.router.destroy();

        self.router = new CoreRouter(RouteCollection, {
          urlAdapter: new UrlParamAdapter(),
        });

        self.moduleAdapter = new ModuleRouterAdapter(self.router);

        self.selection = new KnockoutRouterAdapter(self.router);

        return self.router;

      }

      self.updateNavdrawer = function () {
        self.selection = new KnockoutRouterAdapter(self.router);
      }

      self.initializeRoutes(Constants.ALL_ROUTES, true);

      if (localStorage.token) {

        Service.authenticate().then((result) => {

          self.isLoggedIn(true);




          localStorage.setItem('email', result.email);

          localStorage.setItem('applicationsubmitted', result.applicationsubmitted);

          localStorage.setItem('companyid', result.companyid);

          localStorage.setItem('contactid', result.contactid);

          localStorage.setItem('nmlsverified', result.nmlsverified);


          //self.isSubmitted(response.applicationsubmitted);
          // self.initializeRoutes(Constants.ALL_ROUTES);

          self.isSubmitted((localStorage.getItem('applicationsubmitted') === "true") || false);

          if (self.isSubmitted()) {
            self.router.go({
              path: 'company'
            });
          } else {
            self.router.go({
              path: 'dashboard'
            });
          }

          self.loading(false);

        }).catch(_ => {
          self.router.sync();
          self.loading(false);
        });

      } else {
        self.router.sync();
        setTimeout(() => {
          self.loading(false);
        }, 500);
      }

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      self.navigationListItems = ko.observableArray([self.pages.applicationForm]);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(self.navigationListItems, {
        keyAttributes: "path"
      });

      // Drawer
      // Close offcanvas on medium and larger screens
      // this.mdScreen.subscribe(() => {
      //   OffcanvasUtils.close(this.drawerParams);
      // });
      // this.drawerParams = {
      //   displayMode: 'push',
      //   selector: '#navDrawer',
      //   content: '#pageContent'
      // };
      // // Called by navigation drawer toggle button and after selection of nav drawer item
      // this.toggleDrawer = () => {
      //   this.navDrawerOn = true;
      //   return OffcanvasUtils.toggle(this.drawerParams);
      // }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("ACC Mortgage");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable(self.user.email || "");

      // Footer
      this.footerLinks = [{
        name: 'About ACC Mortgage',
        linkId: 'aboutAcc',
        linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about'
      },
      {
        name: "Contact Us",
        id: "contactUs",
        linkTarget: "http://www.oracle.com/us/corporate/contact/index.html"
      },
      {
        name: "Legal Notices",
        id: "legalNotices",
        linkTarget: "http://www.oracle.com/us/legal/index.html"
      },
      {
        name: "Terms Of Use",
        id: "termsOfUse",
        linkTarget: "http://www.oracle.com/us/legal/terms/index.html"
      },
      {
        name: "Your Privacy Rights",
        id: "yourPrivacyRights",
        linkTarget: "http://www.oracle.com/us/legal/privacy/index.html"
      },
      ];

      self.signOut = async function () {

        let timeoutDialog = document.getElementById('TimeoutDialog');
        if (timeoutDialog)
          timeoutDialog.close();

        self.isLoggedIn(false);
        localStorage.setItem('token', '');

        self.router.go({
          path: 'login'
        });

      };

      self.openProfile = async function () {

        self.router.go({
          path: 'profile'
        });

      };

    }

    ControllerViewModel.prototype.error = function (summary, message) {
      let severity = 'error';

      this.applicationMessages.push({
        severity: severity,
        summary: summary,
        detail: message,
        autoTimeout: 0,
      });
    };

    ControllerViewModel.prototype.info = function (summary, message) {
      let severity = 'info';
      this.applicationMessages.push({
        severity: severity,
        summary: summary,
        detail: message,
        autoTimeout: 0,
      });
    };

    ControllerViewModel.prototype.confirm = function (summary, message) {
      let severity = 'confirmation';
      this.applicationMessages.push({
        severity: severity,
        summary: summary,
        detail: message,
        autoTimeout: 0,
      });
    };

    return new ControllerViewModel();
  }
);