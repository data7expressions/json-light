# Json Light

>Json Light is a json compressor, generating a new simplified json file from a schema definition.
>
>The schema can be written by us or generated by the library itself.
>
>Json Light extracts the property tags from a json object and stores the values in an array.
>

## Features

- Compress json generating a new valid json
- Allows to get schema from json data
- In the event that you do not want to pass the schema to the compress function, it will be generated from the data and stored within the resulting json, allowing it to be later decompressed without the need to pass the schema
- CLI

## Methods

### .schema(data:any)

get schema from json data

- Params:
  - data : json data

### .compress(data:any, schema?:string)

get a compressed json

- Params:
  - data : json data
  - schema : schema (optional)

### .decompress(data:any, schema?:string)

decompress a previously compressed json getting the original json

- Params:
  - data : json data
  - schema : schema (optional)

## Quick start

```typescript
import { JsonLight } from 'json-light'

const data = {
 name: 'Spain',
 region: 'Europe',
 phoneCode: '34',
 timezones: [
  { name: 'Madrid', offset: 1, pos: { lat: 40.4165, log: -3.70256 } },
  { name: 'Ceuta', offset: 1, pos: { lat: 35.8883, log: -5.3162 } },
  { name: 'Canary', offset: 0, pos: { lat: 28.1248, log: -15.43 } }
 ]
}
```

Schema:

```typescript
const schema = JsonLight.schema(data)
console.log(schema)
```

Output:

```txt
{ name:string,
 region:string,
 phoneCode:string,
 timezones:[
  {name:string,
  offset:integer,
  pos:{lat:decimal,log:decimal}
  }
 ]
}
```

Compress:

```typescript
const compressed = JsonLight.compress(data, schema)
console.log(JSON.stringify(compressed, null, 2))
```

Output:

```javascript
{
  "_": [
    "Spain",
    "Europe",
    "34"
  ],
  "timezones": [
    {
      "_": [
        "Madrid",
        1
      ],
      "pos": [
        40.4165,
        -3.70256
      ]
    },
    {
      "_": [
        "Ceuta",
        1
      ],
      "pos": [
        35.8883,
        -5.3162
      ]
    },
    {
      "_": [
        "Canary",
        0
      ],
      "pos": [
        28.1248,
        -15.43
      ]
    }
  ]
}
```

Decompress:

```typescript
const decompressed = JsonLight.decompress(compressed, schema)
console.log(JSON.stringify(decompressed, null, 2))
```

Output:

```javascript
{
  "name": "Spain",
  "region": "Europe",
  "phoneCode": "34",
  "timezones": [
    {
      "name": "Madrid",
      "offset": 1,
      "pos": {
        "lat": 40.4165,
        "log": -3.70256
      }
    },
    {
      "name": "Ceuta",
      "offset": 1,
      "pos": {
        "lat": 35.8883,
        "log": -5.3162
      }
    },
    {
      "name": "Canary",
      "offset": 0,
      "pos": {
        "lat": 28.1248,
        "log": -15.43
      }
    }
  ]
}
```

## CLI

Install

```sh
npm install -g json-light 
```

Version:

```sh
json-light version
```

Schema:

```sh
json-light schema -i source.json
```

Compress:

```sh
json-light compress -i source.json -o compressed.json -s '{name:string,region:string,phoneCode:string,timezones:[{name:string,offset:integer,pos:{lat:decimal,log:decimal}}]}' 
```

Decompress:

```sh
json-light decompress -i compressed.json -o original.json -s '{name:string,region:string,phoneCode:string,timezones:[{name:string,offset:integer,pos:{lat:decimal,log:decimal}}]}' 
```

## CLI examples

these examples are based on the files found in the git repository

### Schema

```sh
json-light schema -i ./src/dev/sources/countries.json
json-light schema -i ./src/dev/sources/northwind.json
```

Output:

```javascript
[{name:string,iso3:string,iso2:string,numeric_code:string,phone_code:string,capital:string,currency:string,currency_symbol:string,tld:string,native:string,region:string,subregion:string,timezones:[{zoneName:string,gmtOffset:integer,gmtOffsetName:string,abbreviation:string,tzName:string}],translations:{kr:string,br:string,pt:string,nl:string,hr:string,fa:string,de:string,es:string,fr:string,ja:string,it:string,cn:string},latitude:string,longitude:string,emoji:string,emojiU:string,states:[{id:integer,name:string,state_code:string,latitude:string,longitude:string,type:string}]}]

{entities:[{entity:string,rows:[{id:any,name:string,description:string,contact:string,phone:string,address:string,city:string,region:string,postalCode:string,country:string,lastName:string,firstName:string,title:string,titleOfCourtesy:string,birthDate:string,hireDate:string,reportsToId:integer,homepage:string,supplierId:integer,categoryId:integer,quantity:string,price:decimal,inStock:integer,onOrder:integer,reorderLevel:integer,discontinued:boolean,customerId:string,employeeId:integer,orderDate:string,requiredDate:string,shippedDate:string,shipViaId:integer,freight:decimal,details:[{orderId:integer,productId:integer,unitPrice:decimal,quantity:integer,discount:integer}]}]}]}
```

### Compress

```sh
json-light compress -i ./src/dev/sources/countries.json -o ./src/dev/results/countries.json
json-light compress -i ./src/dev/sources/northwind.json -o ./src/dev/results/northwind.json
```

### Decompress

```sh
json-light decompress -i ./src/dev/results/countries.json -o ./src/dev/results/countries_original.json
json-light decompress -i ./src/dev/results/northwind.json -o ./src/dev/results/northwind_original.json


```

### Results

```sh
[4.0K]  .
├── [4.0K]  results
│   ├── [427K]  countries.json
│   ├── [712K]  countries_original.json
│   ├── [ 43M]  customers.json
│   ├── [ 79M]  customers_original.json
│   ├── [328K]  northwind.json
│   └── [464K]  northwind_original.json
└── [4.0K]  sources
    ├── [949K]  countries.json
    ├── [154M]  customers.json
    └── [893K]  northwind.json
```
