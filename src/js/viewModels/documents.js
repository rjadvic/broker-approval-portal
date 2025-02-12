define(['downloadjs', 'knockout', 'appController', 'services/common', 'utils/Util', 'constants/constants', 'ojs/ojarraydataprovider', 'ojs/ojbutton', 'ojs/ojlabel', 'ojs/ojformlayout', 'ojs/ojinputtext', 'ojs/ojvalidationgroup', 'ojs/ojselectsingle', 'ojs/ojdialog', 'ojs/ojdefer', 'ojs/ojcheckboxset', 'ojs/ojtable', 'ojs/ojlistview', 'ojs/ojlistitemlayout', 'ojs/ojradioset', 'ojs/ojfilepicker'],
  function (download, ko, app, service, Utils, Constants, ArrayDataProvider) {

    function Form() {

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


      // self.downloadTemplate = function (event, context) {
      //   template = context.currentTarget.getAttribute('url') || null;
      //   if (template) window.open(template);
      // }


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

      self.save = function () {}

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

    }


    function DocumentsViewModel() {
      const self = this;

      self.disabled = false;

      self.document = new Form();
      self.document.load();

    }
    return DocumentsViewModel;
  }
);