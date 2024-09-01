sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'weekendtask/test/integration/FirstJourney',
		'weekendtask/test/integration/pages/StockList',
		'weekendtask/test/integration/pages/StockObjectPage'
    ],
    function(JourneyRunner, opaJourney, StockList, StockObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('weekendtask') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStockList: StockList,
					onTheStockObjectPage: StockObjectPage
                }
            },
            opaJourney.run
        );
    }
);