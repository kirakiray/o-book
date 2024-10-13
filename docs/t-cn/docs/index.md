# o-book 2

o-book 2 是一個文檔生成工具，它將會是你使用過的最簡單的文檔站生成工具之一。只需一個 HTML 文件，就可以將你編寫的 Markdown 文章生成為功能完善的文檔網站。它基於 [ofa.js](https://ofajs.com/) 開發，使用起來非常簡單；

## 使用前的準備

在使用 o-book 之前，你需要掌握 [Markdown](https://www.google.com/search?q=markdown) 的基本語法。另外，你還需要準備一個文本編輯器。我們推薦使用微軟推出的 [VSCode](https://code.visualstudio.com/)，它不僅免費，而且有大量擴展可供選擇，使你的文檔編輯工作更加高效。

## 準備文件

在撰寫文檔之前，需要在本地準備好項目的基礎文件。為了方便起見，我們已經為你提供了項目的初始文件，你只需點擊以下鏈接下載並解壓縮到本地即可：

[下載項目文件](../../publics/stand-up.zip)

後面我們會說明一下幾個關鍵文件的含義；

## 運行項目

obook官方提供了三種方式運行你的項目，你可以根據需求**選擇其中一種方式**啟動即可：

1. **標準模式**：使用本地服務器查看 o-book 組件，從而預覽和生成文檔站。
2. **命令行模式**：使用 Node.js 和命令行預覽和生成文檔站。
3. **網頁應用模式**：通過網頁直接選擇本地 Markdown 文件夾進行預覽和生成。

[標準模式](./run-mode/base-mode.md) 需要靜態服務器打開下載好的文件；

[命令行模式](./run-mode/cli-mode.md) 需要有一定前端開發知識基礎，通過 `npm` 安裝 `o-book` 模塊，後面就可以通過命令行進行預覽和打包項目；這個模式也可以成為腳本自動化的一部分；

[網頁應用模式](./run-mode/webapp-mode.md) 不需要你有任何開發知識，只需要打開網站，選擇本地文件夾，就能查看和打包你的項目；