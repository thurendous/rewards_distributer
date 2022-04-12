# Overview
このrepositoryは以下の機能を持っている。
- transparent proxy patternを使ったupgradeability
- Merkletreeを利用したエアドロ
  - JIPに関してはこの機能を用いてインセンティブのawardを配る

一般的にはUpgradeabilityのあるコントラクトに関しては
- Proxy Side Contracts（proxy側→Upgrade関連）
- Implementation Side Contracts（implementation側→Logic関連）

に分けることができる。

This project has adopted Transparent method for the upgradability.

> 本readmeの読み方：codeを参照しつつ読まれることが望ましい。
# Proxy Side Contract
本repositoryの`backup/contracts`フォルダ

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
``` solidity
function changeAdmin(address newAdmin) external virtual ifAdmin {
    _changeAdmin(newAdmin);
}
```
adminのみが呼び出せる関数: adminを変更する
``` solidity
function upgradeTo(address newImplementation) external ifAdmin  {
    _upgradeToAndCall(newImplementation, bytes(""), false);
}
```
``` solidity
function upgradeToAndCall(address newImplementation, bytes calldata data) external payable ifAdmin 
``` 
adminのみが呼び出せる関数: implementationをアップグレードさせる。`upgradeToAndCall`の場合、`_data`がは呼び出すとともにimplementationの関数を呼び出すことを意味する
``` solidity
function _beforeFallback() internal virtual override　{
    require(msg.sender != _getAdmin(), "TransparentUpgradeableProxy: admin cannot fallback to proxy target");
    super._beforeFallback();
}
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
function _fallback() internal virtual{
    _beforeFallback();
    _delegate(_implementation());
}

fallback () external payable virtual {
    _fallback();
}
```
callをimplementation側へ転送する`_fallback`関数を実装している。`fallback`関数は`_fallback`関数を呼び出す。

#### -> 継承 ERC1967Upgrade

それ以外のlibraryとして導入されたコントラクト：`Address`、`IBeacon`、`StorageSlot`


# Implementation Side Contracts
コントラクトの継承の構造は以下の通り：

- SimpleMerkleDistributer
  - AbstractMerkleDistributer
    - AccessControlEnumerableUpgradeable
    - ReentrancyGuardUpgradeable


## SimpleMerkleDistributer
``` solidity
function initialize(address initialToken, bytes32 initialMerkleRoot)
        public
        initializer
    {
        AbstractMerkleDistributer.initialize(); 

        token = IERC20Metadata(initialToken);
        merkleRoot = initialMerkleRoot;
    }
```
initialize関数はupgradeableなコントラクトをデプロイする時にproxyのstateをイニシャライズするために呼び出されるconstructorのような存在。   
- `AbstractMerkleDistributer.initialize();`
  - `AbstractMerkleDistributer`にある関数を呼び出し、`msg.sender`にadmin roleを付与する
  - `address initialToken, bytes32 initialMerkleRoot`を引数として入れて、ERC20 tokenの関数を呼び出す準備やmerklerootを保存しておく。

``` solidity
function setMerkleRoot(bytes32 newMerkleRoot)
        public
        onlyAdminOrModeratorRoles
    {
        merkleRoot = newMerkleRoot;
    }
```
管理者のみがMerklerootを書き込める`setMerkeRoot()`関数。

> note: Merklerootはユニーク性（衝突することがまずない）があるため、一旦ブロックチェーンへデプロイするとローカルの受取人のjsonファイル（アカウント、受け取る金額）が確定し、改ざんできないことが前提となる。

``` solidity
function setHasClaimedPerRecipientAndUniqueKey(
        address recipient, 
        string memory uniqueKey,
        bool newHasClaimed
    )
        public
        onlyAdminOrModeratorRoles
    {
        hasClaimed[recipient][uniqueKey] = newHasClaimed;
    }
```
とあるアカウントがclaimしたらこちらの`hasClaimed`をtrueにする関数


``` solidity
function claim(
    address recipient,
    uint256 amount,
    string memory uniqueKey,
    bytes32[] calldata proof
) external override nonReentrant {
    require(
        (
            _msgSender() == recipient
            ||  hasRole(DEFAULT_ADMIN_ROLE, _msgSender())
            ||  hasRole(MODERATOR_ROLE, _msgSender())
        ),
        "Cannot claim reward of others."
    );

    (bool isClaimable, string memory message) = getIsClaimable(
        recipient,
        amount,
        uniqueKey,
        proof
    );
    require(isClaimable, message);

    hasClaimed[recipient][uniqueKey] = true;
    require(token.transfer(recipient, amount), "Transfer failed");

    emit Claim(recipient, amount, uniqueKey);
}
```
一番重要なアカウントがawardを受け取る際に使う`claim`関数。その流れを説明する。

- 受け取りアドレス、claimするtoken数、ユニークキー、merkleproofを引数とする
- awardを受け取るには
  - 受け取りアドレスは自分でなければならない
  - 管理者（admin, moderator）ロールなら他人のアドレスを使って受け取れる
- `getIsClaimable`関数を使って受け取れるかについてMerklerootのチェックをする
- `hasClaimed`をtrueにして記録
- tokenを使ってtokenのtransferをする
- Claimイベントを放出
> note: uniqueKeyに関しては、merkleroot作成に使われるため、設定したuniqueKeyでないと受け取れない

``` solidity
function getIsClaimable(
    address recipient,
    uint256 amount,
    string memory uniqueKey,
    bytes32[] calldata proof
) public view returns (bool, string memory) {
    if (hasClaimed[recipient][uniqueKey]) {
        return (false, "Recipient already claimed");
    }

    bytes32 leaf = keccak256(abi.encodePacked(recipient, amount, uniqueKey));
    bool isValidLeaf = MerkleProofUpgradeable.verify(
        proof,
        merkleRoot,
        leaf
    );
    if (!isValidLeaf) {
        return (false, "Not a valid leaf");
    }

    return (true, "Reward is claimable");
}
```
claimできるか確認するための関数。
- 引数：受け取りアドレス、受け取りtoken数、ユニークキー、proof
- 受け取れる場合はtrue、受け取れない場合はfalseを返す
- 途中でleafを作成し、isValidLeafでMerkle treeの中で有効であることを確認している

``` solidity
    function claimAllDiposits() public onlyAdminOrModeratorRoles {
        uint256 currentBalance = token.balanceOf(address(this));
        if (currentBalance <= 0) {
            revert('No available balance');
        }

        require(
            token.transfer(_msgSender(), currentBalance), 
            "Transfer failed"
        );
    }
```
コントラクトにあるERC20 tokenをすべて引き出すための関数。送り先アドレスはmsg.senderのアドレス。ただし、adminかmoderatorでないと呼び出せない。

### ->継承 AbstractMerkleDistributer
``` solidity
bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
```
MODERATOR_ROLEのロールを状態変数を作成。ACESS ROLE管理用。

### ->継承 ReentrancyGuardUpgradeable
Reentrancy攻撃から守るためのコントラクト。継承することで、`nonReentrant`modifierが使えるようになる。


### ->継承 AccessControlEnumerableUpgradeable
- ロールベースのaccess controlができるようにするコントラクト
- 今回はADMIN, MODERATORについてのロールを設定している

### import IERC20Metadata
- IERC20に加えて、`decimals()`、`name()`、`symbol()`のインターフェイスが追加されている。
- 今回`decimals()`、`transfer()`、`symbol()`が使われている

