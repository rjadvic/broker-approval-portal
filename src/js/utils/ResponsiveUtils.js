define(['ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils'], function (responsiveUtils, responsiveKnockoutUtils) {

    let isSmallScreen = responsiveKnockoutUtils.createMediaQueryObservable(
        responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.SM_DOWN));

    let isMediumScreen = responsiveKnockoutUtils.createMediaQueryObservable(
        responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.MD_ONLY));

    let isLargeScreen = responsiveKnockoutUtils.createMediaQueryObservable(
        responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP));

    return {
        isSmallScreen: isSmallScreen,
        isMediumScreen: isMediumScreen,
        isLargeScreen: isLargeScreen
    }
})