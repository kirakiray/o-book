# 標準模式

標準模式就是使用本地的靜態服務器，打開準備好的 `_preview.html` 文件。如果你使用我們推薦的VSCode 編輯器，那麽這個步驟非常簡單：

1. 打開 [LiveServer](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 擴展頁面，點擊安裝，然後會自動打開VSCode並進行擴展安裝。

2. 將下載的項目解壓縮，使用 VSCode 打開該文件夾。

3. 在VSCode內，右鍵根目錄下的 `_preview.html` 文件，選擇 `open with live server`。等待頁面初始化完成後，就能點擊頁面上的鏈接進行預覽。

`_preview.html` 文件就是預覽項目的啟動器。你也可以不使用 LiveServer，使用其他能夠啟動靜態服務器的擴展。

這種使用VSCode打開方式的成本最低，編輯器內可以快速啟動靜態服務器。當然，你也可以使用其他的 Markdown 編輯器，如 Typora，開發工具如 Eclipse，甚至是你系統自帶的文本編輯器，只要你覺得方便即可。

至於靜態服務器，你可以使用本地搭建的服務器，如 Nginx、Apache 等，只要它能夠用來訪問靜態 HTML 文件就可以。

## 如何打包

同上，在服務器模式下打開 `_preview.html`，點擊 `下載網站` 就能得到打包好的靜態文件；

接下來，你可以直接進入[基礎文件](../base-files.md)章節查看更多信息。
