using { com.my.upload as stockSchema } from '../db/schema';

service Stocks {
    entity Stock as projection on stockSchema.Stock;
    
  action uploadStockData(jsonData: String);
}
annotate Stocks.Stock with  @odata.draft.enabled ;
annotate Stocks.Stock with @(

     UI.LineItem           : [
        {
            Label: 'Stock Name',
            Value: name
        },
        {
            Label: 'Exchange',
            Value: exg
        },
        {
            Label: 'Price',
            Value: price
        }  
        ],
UI.FieldGroup #Stock: {
        $Type: 'UI.FieldGroupType',
        Data : [
         {
            Label: 'Stock Name',
            Value: name
        },
        {
            Label: 'Exchange',
            Value: exg
        },
        {
            Label: 'Price',
            Value: price
        } 
        ],
},
 UI.Facets             : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'StockFacet',
        Label : 'Stock facets',
        Target: '@UI.FieldGroup#Stock'
    }, ]
);