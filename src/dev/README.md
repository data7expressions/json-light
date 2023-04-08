# Dev

## CLI Labs

### Schema

```sh
json-light schema -i ./sources/countries.json
```

```javascript
[{name:string,iso3:string,iso2:string,numeric_code:string,phone_code:string,capital:string,currency:string,currency_symbol:string,tld:string,native:string,region:string,subregion:string,timezones:[{zoneName:string,gmtOffset:integer,gmtOffsetName:string,abbreviation:string,tzName:string}],translations:{kr:string,br:string,pt:string,nl:string,hr:string,fa:string,de:string,es:string,fr:string,ja:string,it:string,cn:string},latitude:string,longitude:string,emoji:string,emojiU:string,states:[{id:integer,name:string,state_code:string,latitude:string,longitude:string,type:string}]}]
```

### Compress

```sh
json-light compress -i ./sources/countries.json -o ./results/countries.json
```

