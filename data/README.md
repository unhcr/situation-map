## Data API

Data to be used within the site should be formatted in the following way, using standardized [GeoJSON](http://www.geojson.org/) specifications. Currently, the site is running off of a static API that has been generated. 

### Population of Concern data
*For the regional or emergency level (Country=0) views of the data, settlement numbers should be formatted as follows:*
``` json
{
    "type": "FeatureCollection",
    "features": [
        {     "type": "Feature",
              "id": 1,
              "geometry": {"type": "Point", "coordinates": [lon,lat]},     // settlement coordinates
              "properties": {  											   // individual numbers for each settlement 
              	"countryname": "Niger",
              	"regionname": "Abala (dpt.)", 
              	"settlementname": " Kizamou (Ind. Reg.*)",               	
				"DEM_04_F": 192, 
				"DEM_04_M": 192, 
				"DEM_1217_F": 88, 
				"DEM_1217_M": 89, 
				"DEM_1859_F": 253, 
				"DEM_1859_M": 260, 
				"DEM_511_F": 193, 
				"DEM_511_M": 179, 
				"DEM_60_F": 23, 
				"DEM_60_M": 18,
              	"totalhh": 527, 
              	"totalrefpop": 2781,
              	"icon": "https://dl.dropbox.com/u/29368453/camp-bg-30px.png"
              }                                                          
        }, ...
    ]
}
```

### Relief Activities 
``` json
{
    "type": "FeatureCollection",
    "features": [
    	{	"type": "Feature",
    		"geometry": {"coordinates": [1.95420096, 14.587458697], "type": "Point"}, 
    		"id": 1, 
    		"properties": {
    			"country": "Niger", 
    			"name": " Mangaize (Camp) (Ind. Reg.*)", 
    			"num_partners": 15, 
    			"num_sectors": 10, 
    			"region": "Ouallam (dpt.)", 
    			"sectors": {
    				"Camp Management": {
    					"num": 1, 
    					"partners": ["IRW"]
    				}, 
    				"Core Relief Items (CRIs)": {
    					"num": 2, 
    					"partners": ["UNHCR", "UNICEF"]
    				}, 
    				"Food": {
    					"num": 3, 
    					"partners": ["CR-N", "WFP", "IRW"]
    				}, 
    				"Health": {
    					"num": 4, 
    					"partners": ["OMS", "GoN/MoH", "MSF-CH", "UNICEF"]
    				}, 
    				"Logistics": {
    					"num": 2, 
    					"partners": ["CADEV", "OIM / IOM"]
    				}, 
    				"Nutrition": {
    					"num": 2, 
    					"partners": ["MSF-CH", "WFP"]
    				}, 
    				"Protection": {
    					"num": 2, 
    					"partners": ["UNHCR", "GoN"]
    				}, 
    				"Registration": {
    					"num": 3, 
    					"partners": ["CADEV", "UNHCR", "CNE"]
    				}, 
    				"Shelter": {
    					"num": 2, 
    					"partners": ["UNICEF", "UNHCR"]
    				}, 
    				"Water & Sanitation": {
    					"num": 3, 
    					"partners": ["CR-Q", "Oxfam", "Word Vision"]
    				}
    			}
    		}
    	}, ...
    ]
}
```

### Infrastructure 

``` json
{
    "type": "FeatureCollection",
    "features": [
    	{	"type": "Feature",
    		"id": 1,
    		"geometry": {"coordinates": [-4.6677, 12.046], "type": "Point"}, 
    		"properties": {
    			"icon": "https://dl.dropbox.com/u/29368453/unhcr-border-crossing-bg-30px.png", 
    			"name": "Faramana", 
    			"type": "Border Crossing Point"
    		}
    	}, ...
    ]
}
```
