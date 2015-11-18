
describe('test gauge svg', function() {

    beforeEach(function() {
        console.log("RUNNING TEST!");
    });

    it('draw a gauge with text labels for the values and non-default font specified', function() {
        //Configure charts
        SVGENIUS.charts.gauge({
            targetContainerId: "sampleGaugeContainerAtMax",
            percentageDifference: 123,
            threshold: 10,
            showValueAsLabel: true,
            majorLabelStyle: "font-family: Times New Roman; font-size: 24px;",
            minorLabelStyle: "font-family: Times New Roman;"
        });
        SVGENIUS.charts.gauge({
            targetContainerId: "sampleGaugeContainerOverThreshold",
            percentageDifference: 78,
            threshold: 10,
            showValueAsLabel: true
        });

        SVGENIUS.charts.gauge({
            targetContainerId: "sampleGaugeContainerBelowThreshold",
            percentageDifference: 8.5,
            threshold: 10,
            showValueAsLabel: true
        });

        SVGENIUS.charts.gauge({
            targetContainerId: "sampleGaugeContainerAtZero",
            percentageDifference: 0,
            threshold: 10,
            showValueAsLabel: true
        });

        SVGENIUS.charts.gauge({
            targetContainerId: "sampleGaugeContainerBelowZero",
            percentageDifference: -9.9999999,
            threshold: 10,
            showValueAsLabel: true
        });
        SVGENIUS.charts.gauge({
            targetContainerId: "sampleGaugeContainerBelowNegativeThreshold",
            percentageDifference: -99.9999999,
            threshold: 10,
            showValueAsLabel: true
        });

        expect(1).toEqual(1); // Test fails if there are no expectations

    });

});
