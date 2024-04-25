# TIPS

## クエリログ調査の一行実施

```
docker-compose exec template_db mysql -uroot -ptemplate -e 'set global general_log = on'; docker-compose exec template_db sh -c 'tail -f /var/lib/mysql/*.log'
```