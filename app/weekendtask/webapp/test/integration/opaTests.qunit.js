sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'weekendtask/test/integration/FirstJourney',
		'weekendtask/test/integration/pages/UploadedDataList',
		'weekendtask/test/integration/pages/UploadedDataObjectPage'
    ],
    function(JourneyRunner, opaJourney, UploadedDataList, UploadedDataObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('weekendtask') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheUploadedDataList: UploadedDataList,
					onTheUploadedDataObjectPage: UploadedDataObjectPage
                }
            },
            opaJourney.run
        );
    }
);