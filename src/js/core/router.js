define(['ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', ], function (CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter) {

    const self = this;

    self.instance = null;

    self.moduleAdapter = null;
    self.selection = null;

    self.initialize = function (RouteCollection) {
        return new Promise((resolve, reject) => {

            ;
            if (self.instance) {
                self.instance.destroy();
            }

            self.instance = new CoreRouter(RouteCollection, {
                urlAdapter: new UrlParamAdapter()
            }); 

            self.moduleAdapter = new ModuleRouterAdapter(self.instance);
            self.selection = new KnockoutRouterAdapter(self.instance);

            resolve(self.instance);
        });

    };

    self.sync = function () {
        return instance.sync();
    }

    self.go = function (destination) {
        self.instance.go({
            path: destination
        });
    }

    return {
        instance,
        moduleAdapter,
        selection,
        initialize,
        sync,
        go
    };

})