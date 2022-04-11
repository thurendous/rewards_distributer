# Overview
このプロジェクトは以下の機能を持っている。
- transparent proxy patternを使ったupgradeability
- Merkle treeを使ったエアドロ


This project has adopted Transparent method for the upgradability.


# Proxy Side Contracts

## TransparentUpgradeableProxy
コントラクトの継承の構造は以下の通り：

- TransparentUpgradeableProxy
  - ERC1967Proxy
    - Proxy
    - ERC1967Upgrade

こちらは[transparent proxy pattern](https://blog.openzeppelin.com/the-transparent-proxy-pattern/)。 
- This contract implements a proxy that is upgradeable by an admin. 
- 1. If any account other than the admin calls the proxy, the call will be forwarded to the implementation, even if that call matches one of the admin functions exposed by the proxy itself.
- 1. adminでないアカウントがproxyをcallする場合、callはimplementation側へ転送される。proxy側に暴露している関数であったとしてもadminでないアカウントからは呼び出されないようになっている。

- 2. If the admin calls the proxy, it can access the admin functions, but its calls will never be forwarded to the
implementation. If the admin tries to call a function on the implementation it will fail with an error that says "admin cannot fallback to proxy target".
- 2. adminアカウントがproxyを呼び出す場合、admin関連関数へのアクセスができる。

下記関数ifAdminが存在することで、全てのcallについてadminからのものやuserからのものに分けていることになる。

``` 
    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }
```

上記分ける理由は関数の衝突があることである。

以下の記事を参照してほしい
https://medium.com/nomic-foundation-blog/malicious-backdoors-in-ethereum-proxies-62629adf3357
### 主要な関数
```
function changeAdmin(address newAdmin) external virtual ifAdmin
```
adminのみが呼び出せる関数: adminを変更する
```
function upgradeTo(address newImplementation) external ifAdmin 
```
```
function upgradeToAndCall(address newImplementation, bytes calldata data) external payable ifAdmin 
```
adminのみが呼び出せる関数: implementationをアップグレードさせる。`upgradeToAndCall`の場合、`_data`がは呼び出すとともに関数を呼び出すことを意味する
```
function _beforeFallback() internal virtual override
```
fallback関数へ転送する際に、adminでないことを確認するための関数

### -> 継承 ERC1967Proxy
```
constructor(address _logic, bytes memory _data) payable
```
イニシャライズさせるための関数。implementationの`address`、`_data`を引数とする。
```
function _implementation() internal view virtual override returns (address impl) 
```
internalな関数としてimplementationのaddressを返す

#### -> 継承 Proxy
```
function _fallback() internal virtual
```
callをimplementation側へ転送する_fallback関数を実装している。

#### -> 継承 ERC1967Upgrade

それ以外のlibraryとして導入されたコントラクト：`Address`、`IBeacon`、`StorageSlot`


# Implementation Side Contracts


