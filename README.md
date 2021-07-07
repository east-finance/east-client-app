# EAST Client v1.0

Readme контракта EAST:

https://gitlab.wvservices.com/waves-enterprise/east-contract/-/blob/master/README.md

## Сценарии

### Переменные
| Option | Description |
| ------ | ----------- |
| westRate | Цена токена WEST в USD. Предоставляет оракул, ключ контракта **000003_latest** |
| rwaRate   | Цена токена USDap в USD. Предоставляет оракул, ключ контракта **000010_latest** |
| westCollateral | Параметр из конфига контракта EAST. **По умолчанию = 2.5** |
| rwaPart | Параметр из конфига контракта EAST. **По умолчанию = 0.5**  |
| westPart | (1 - rwaPart). **По умолчанию = 0.5**  |
| vaultEastAmount | Количество EAST, записанное в волте |
| vaultWestAmount | Количество WEST, записанное в волте |

### Функции, которые используются в расчетах

#### Формула 1 (*WestByEastAmount*): Количество WEST с адреса, за которые можно купить заданное количество EAST
```
WestByEastAmount = EastAmount * ((usdpPart / westRate) + ((1 - rwaPart) / westRate * westCollateral))
```

#### Формула 2 (*calculateVault*): Расчет содержимого Vault при создании

```js
// westTransferAmount: сколько WEST было переведено на админский адрес для конвертации в волт

calculateVault = (westTransferAmount) => {
    const rwaPartInPosition = rwaPart / ((1 - rwaPart) * westCollateral + rwaPart)
    const westToRwaAmount = rwaPartInPosition * westTransferAmount
    const eastAmount = (westToRwaAmount * westRate) / rwaPart
    const rwaAmount = westToRwaAmount * westRate / rwaRate
    return {
        eastAmount,
        rwaAmount,
        westAmount: westTransferAmount - westToRwaAmount,
    }
}
```

#### Формула 3 (vaultWestAmountDelta): delta между количеством WEST в волте по текущему курсу и фактическое количество WEST
```
// expectedVaultWestAmount - сколько было бы WEST в волте по текущему курсу WEST
expectedVaultWestAmount = (vaultEastAmount * westPart * rwaRate * westCollateral) / westRate
vaultWestAmountDelta = expectedVaultWestAmount - vaultWestAmount
```

#### Формула 4 (exchangeEast): конвертирование "свободных" EAST в WEST для операции reissue
```js
westAmount  = (eastAmount * rwaPart) / westRate
```

## Сценарии

### Сценарий 1: mint. Выпуск EAST, создание нового vault

Пусть `usdapRate` = 0.9978, `westRate` = 0.4.

Пользователь хочет купить 10 EAST токенов.

По формуле *WestByEastAmount* (Формула 1) считаем, сколько WEST смогут обеспечить это количество EAST:
```
WestByEastAmount = 10 * ((0.5 / 0.4) + ((1 - 0.5) / 0.4 * 2.5)) = 43.75 WEST
```
После подтверждения отправляется атомик (Transfer(westAmount) + DockerCall('mint', transferId)).

Контракт рассчитывает Vault по формуле `calculateVault`:
```js
    const rwaPartInPosition = 0.5 / ((1 - 0.5) * 2.5 + 0.5) = 0.28571428
    const westToRwaAmount = 0.28571428 * 43.75 = 12.49999974
    const eastAmount = (12.49999974 * 0.4) / 0.5 = 9.999999792
    const rwaAmount = 12.49999974 * 0.4 / 0.9978 = 5.011024149
    const westAmount = 43.75 - 12.49999974 = 31.25

    // Содержимое Vault
    return {
      eastAmount,
      rwaAmount,
      westAmount,
    }
```

### Сценарий 2: issue. Довыпуск EAST, цена WEST не менялась

Пусть `usdapRate` = 0.9978, `westRate` = 0.4.

Пользователь хочет добавить в существующий волт 25 WEST.

По формуле `calculateVault` рассчитывается количетсво EAST токенов, которые будут добавлены в Vault:
```
{ eastAmount } = calculateVault(25 WEST)
eastAmount = 5.71428571, они будут добавлены в существующий vault
```
Клиент отправляет Atomic(Transfer(25 WEST) + DockerCall('supply', transferId) + DockerCall('reissue')). Операция reissue вызывается без параметра maxWestToExchange. 


### Сценарий 3: issue. Довыпуск EAST, цена WEST выросла

Пусть в волте:

`vaultEastAmount` = 19.75775277 EAST

`vaultWestAmount` = 61.60714284

`usdapRate` = 0.9978

`westRate` = 0.6 (токен WEST вырос на $0.2)

Рассчитываем, delta между количеством WEST в волте и сколько этот волт  бы по текущему курсу (Формула 3):

```
vaultWestAmountDelta = (((19.75775277 * 0.5 * 0.9978 * 2.5) / 0.6) - 61.60714284) = 41.07142857 - 61.60714284 = -20.53571427 WEST
```
vaultWestAmountDelta < 0, это значит, что в волте находится больше токенов WEST, чем требуется для стандартного обеспечения.
Конвертируем vaultWestAmountDelta в EAST:
```
freeEastAmount = calculateVault(20.53571427 WEST) = 7.05634027 EAST
```
Эти EAST из выросших в цене WEST мы можем бесплатно получить в наш волт, снизив обеспечение до стандартных 250%.

Если пользователь хочет забрать <= freeEastAmount, то делается операция:
```
const maxWestToExchange = exchangeEast(7.05634027 EAST) = 5.86734694 WEST
DockerCall('reissue'), { maxWestToExchange: 5.86734694 }
```
Если пользователь хочет купить больше EAST, чем freeEastAmount, то для суммы EAST, превышающей freeEastAmount, делаются операции из Сценария 2. 
Фактически, пользователь добавляет свои WEST с адреса только сверху "бесплатных" WEST.

### Сценарий 4. Довыпуск EAST, цена WEST упала

Пусть, цена WEST (westRate) упала с 0.6 до 0.4.

`vaultWestAmountDelta` = 10.349099 WEST.

Пользователь хочет докупить EAST. Далее сценарий аналогичен Сценарию 2, но к сумме трансфера WEST будет прибавлен размер vaultWestAmountDelta для нормализации обеспечения.
