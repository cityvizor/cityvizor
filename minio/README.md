# S3 / Minio

Návod jak nastavit minio server pro CityVizor

Příkaz `mc` je **Minio Client**, který si můžete nainstalovat dle návodu https://docs.min.io/docs/minio-client-complete-guide.html

```shell
# $ACCESS_KEY a $SECRET_KEY jsou přístupové oprávnění administrátora minio serveru
# URL http://minio.cityvizor.otevrenamesta je použitelná, pokud máte CityVizor spuštěný pomocí docker-compose, případně použijte vlastní URL
mc alias set cv http://minio.cityvizor.otevrenamesta $ACCESS_KEY $SECRET_KEY
# Přidáme uživatele ACCESS_KEY=cityvizor SECRET_KEY=cityvizor
mc admin user add cv cityvizor cityvizor
# Vytvoříme 2 buckety, jeden pro server/worker a druhý pro veřejně dostupné soubory (CDN)
mc mb cv/cityvizor
mc mb cv/cityvizor-public
# Uzivatel cityvizor by měl mít právo k zápisu k oběma bucketům
mc admin policy set cv/cityvizor readwrite user=cityvizor
# Bucket cityvizor-public by měl být otevřen pro veřejné stahování souborů
mc policy set download cv/cityvizor-public
```
