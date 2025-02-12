define(['ojs/ojcore', 'ojs/ojconverter-number', 'ojs/ojvalidation'], function (oj, NumberConverter) {
    var dateConverterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);

    var dateConverter = (pattern = "dd-MM-yyyy") =>
        dateConverterFactory.createConverter({
            pattern
        });


    var numberConverter = new NumberConverter.IntlNumberConverter();

    return {
        number: numberConverter,
        date: dateConverter,
    }
});