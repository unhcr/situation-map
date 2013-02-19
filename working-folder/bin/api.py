import sys, csv, os
import simplejson as json
from itertools import groupby

# ------------------------

data_file = open('../unhcr-bysettlement-country0.geojson', "rb").read()
data = json.loads(data_file)

api = {"type": "FeatureCollection","features": []}
for d in data['features']:
    d['properties']['countryname'] = d['properties']['countyname']
    d['properties']['icon'] = "https://dl.dropbox.com/u/29368453/camp-bg-30px.png"
    del d['properties']['countyname']
    api['features'].append(d)

data_writeout = json.dumps(api, sort_keys=True)
f_out = open('../../data/unhcr-refugees-bysettlement-mali.geojson', 'wb')
f_out.writelines(data_writeout)
f_out.close()   

# ------------------------

# ------------------------

data_file = open('../unhcr-border-crossing.geojson', "rb").read()
data = json.loads(data_file)

api = {"type": "FeatureCollection","features": []}
for d in data['features']:
    d['properties']['icon'] = "https://dl.dropbox.com/u/29368453/unhcr-border-crossing-bg-30px.png"
    api['features'].append(d)

data_writeout = json.dumps(api, sort_keys=True)
f_out = open('../../data/unhcr-infrastructure-border-crossing-mali.geojson', 'wb')
f_out.writelines(data_writeout)
f_out.close()   

# ------------------------


data_file = open('../unhcr-3w-country0.geojson', "rb").read()
data3W = json.loads(data_file)

api = {"type": "FeatureCollection","features": []}
rowid = 0
for d,data in groupby(sorted(data3W['features'], key=lambda x: x['properties']['settlementname']), lambda x: x['properties']['settlementname']):
    rowid = rowid + 1
    settlement = d
    country = []
    region = []
    geo = []
    sectors = {}
    num_partners = []
    num_sectors = []
    for a,b in groupby(sorted(data, key=lambda x: x['properties']['sector']), lambda x: x['properties']['sector']): 
        if a not in num_sectors:
            num_sectors.append(a)
        sectors[a] = {}
        partners = []
        for p in b: 
            if p['properties']['countyname'] not in country:
                country.append(p['properties']['countyname'])
            if p['properties']['regionname'] not in region:
                region.append(p['properties']['regionname'])
            if p['properties']['partner'] not in partners:
                partners.append(p['properties']['partner'])
            geo.append(p['geometry'])
            if p['properties']['partner'] not in num_partners:
                num_partners.append(p['properties']['partner'])
        sectors[a]['num'] = len(partners)
        sectors[a]['partners'] = partners
    country = {
        'type': "Feature",
        'id': rowid,
        'geometry': geo[0],
        'properties': {
            'name': settlement,
            'country': country[0],
            'region': region[0],
            'sectors': sectors,
            'num_sectors': len(num_sectors),
            'num_partners': len(num_partners)
            }
        }
    api['features'].append(country)

data_writeout = json.dumps(api, sort_keys=True)
f_out = open('../../data/unhcr-relief-3w-mali.geojson', 'wb')
f_out.writelines(data_writeout)
f_out.close()   
