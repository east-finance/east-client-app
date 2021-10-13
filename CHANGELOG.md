### EAST 1.1.0

`eastContractId` and `eastContractVersion` params is removed from app.config.json. Specified contract params will be taken from east-service `/config` endpoint after user will be logged in.

Supported params in app.config.json:
```json
{
  "clientAddress": "https://carter.welocal.dev",
  "heapMetricsId": "3889900902",
  "yandexMetricsId": "85383388"
}
```
