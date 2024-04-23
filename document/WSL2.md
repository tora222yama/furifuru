### Ubuntu22.04のセットアップ

※少し古い情報となります、適宜最新バージョンを選び、インストール方法の変更などは利用PJで吸収してください

基本のインストール手順は[こちら](https://www.docker.com/products/docker-desktop/)を参照

- PowerShellを管理者モードで開き、下記を実行 
- **（※要管理者権限）** 

```
# 手順 1 - Linux 用 Windows サブシステムを有効にする
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 手順 3: 仮想マシンの機能を有効にする
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

- 下記を実行

[x64 マシン用 WSL2 Linux カーネル更新プログラム パッケージ](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
 **（※要管理者権限）** 

- PowerShellで下記を実行

```
# 手順 5 - WSL 2 を既定のバージョンとして設定する
wsl --set-default-version 2

# 手順 6 -  ディストリビューションのダウンロード
Invoke-WebRequest -Uri https://aka.ms/wslubuntu2204 -OutFile Ubuntu2204.appx -UseBasicParsing
※社内回線では時間がかかるor失敗する可能性あり、その場合は再トライを
```

- 上記appxを起動してUbuntuをインストール
- 初回起動のユーザー・パスワードはPCと同じものを設定しておいてください


![image][pasted-2024.02.28-16.57.43.png]

- Windowsターミナルを[GitHub](https://github.com/microsoft/terminal/releases)からダウンロード
    - exeは```C:\Users\user name\AppData\Local\Microsoft\WindowsApps\wt.exe```にあります
    - 起動したら規定のプロファイルをUbuntuにしておく

- Ubuntuのメモリ上限の設定
    - ```C:\Users\user name\.wslconfig```を作成
    - 下記の設定を記入
    - ※これを行わないとUbuntuがメモリの上限まで使います

```
[wsl2]
memory=8GB
```

- この状態で下記となります、一度再起動して確認しておいてください
    - Windowsを起動するとUbuntuは立ち上がっている
    - ターミナルを開けばUbuntuのコンソールを開ける
    - エクスプローラーで```¥¥wsl$```を開くとUbuntuのファイルシステムにアクセスできる

- 上記コンソールでnodeのバージョンを18まで上げておきます

```
# apt update
sudo apt update

# curlのインストール
sudo apt install -y curl

# v18をインストールする場合(使用するバージョンに合わせること)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# バージョンを確認 
node -v
v18.15.0

# 自動的にnpmもインストールされる
npm -v
9.5.0
```

### その他の設定

- hostsファイルの編集
    - ```C:\Windows\System32\drivers\etc```
    - メモ帳を管理者権限で開き、hostsファイルを編集

```
127.0.0.1 localhost minio
```

- IntelliJ IDEAは最初からインストールされている認識ですが、なければダウンロードサイトから入手
    - アクティベートコードは３課から入手

- 利用するgitのcrlfを無効にしておいてください
    - '''git config --global core.autoCRLF false'''
    - Ubuntu上のgit/Source Treeのgitなど