define(['downloadjs', 'knockout', 'appController', 'services/common', 'utils/Util', 'constants/constants', 'ojs/ojarraydataprovider', 'ojs/ojbutton', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojselectsingle', 'ojs/ojdialog', 'ojs/ojdefer', 'ojs/ojcheckboxset', 'ojs/ojtable', 'ojs/ojlistview', 'ojs/ojlistitemlayout', 'ojs/ojradioset', 'ojs/ojfilepicker'],
  function (download, ko, app, service, Utils, Constants, ArrayDataProvider) {

    function Form() {

      const self = this;
      self.data = ko.observableArray([]);

      self.provider = new ArrayDataProvider(self.data, {
        keyAttributes: ['accresourcesid']
      });

      self.fields = {

        accresourcesid: ko.observable(),
        name: ko.observable(),
        description: ko.observable(),
        templateurl: ko.observable(),
      }


      self.downloadTemplate = function (event, context) {
        
        template = context.currentTarget.getAttribute('url') || null;
        if (template) window.open(template);
      }

      self.load = async function () {
        try {

          app.loading(true);

          self.data(await service.getAllResources());

          app.loading(false);
        } catch (error) {
          app.error("Error", error);
          app.loading(false);
        }
      }

    }


    function ResourcesViewModel() {
      const self = this;

      self.disabled = false;

      self.resource = new Form();
      self.resource.load();

    }
    return ResourcesViewModel;
  }
);