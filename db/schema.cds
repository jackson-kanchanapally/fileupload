namespace com.my.upload;
using {managed,cuid} from '@sap/cds/common';

entity Stock:managed,cuid {
 
    name     : String(10);
    exg     : String(10);
    price    : String(10);
}
