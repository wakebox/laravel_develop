# PC 財產管理系統 API 文檔

## 📁 Postman 文件

- **Collection**: `PC_FixedAsset_API.postman_collection.json`
- **Environment**: `PC_API.postman_environment.json`

## 🔧 環境變數設定

### 匯入步驟

1. 開啟 Postman
2. 點選左上角 **Import** 按鈕
3. 匯入 `PC_FixedAsset_API.postman_collection.json`
4. 匯入 `PC_API.postman_environment.json`
5. 在右上角選擇 "PC API Environment"
6. 點擊環境變數旁的 👁️ 圖示，設定 `jwtToken` 值

### 環境變數說明

| 變數名稱 | 說明 | 預設值 | 類型 |
|---------|------|--------|------|
| `devUrl` | API 基礎網址 | `http://localhost:8000` | default |
| `jwtToken` | JWT 認證 Token | (空白，需要設定) | secret |
| `assetId` | 測試用資產ID | `1` | default |
| `assetNumber` | 測試用財產編號 | `FA-2024-001` | default |

## 🔐 認證方式

所有 API 請求都使用 **Bearer Token** 認證：

```
Authorization: Bearer {{jwtToken}}
```

Collection 已在根層級設定認證，所有請求會自動帶入 `{{jwtToken}}` 變數。

## 📋 API 端點總覽

### 固定資產管理

| # | 方法 | 路徑 | 說明 |
|---|------|------|------|
| 1 | GET | `/api/pc/assets` | 取得固定資產列表 |
| 2 | GET | `/api/pc/assets/search` | 搜尋固定資產 |
| 3 | GET | `/api/pc/assets/numbers/list` | 取得財產編號列表 |
| 4 | GET | `/api/pc/assets/number` | 根據財產編號查詢 |
| 5 | GET | `/api/pc/assets/{id}` | 取得單筆固定資產 |
| 6 | POST | `/api/pc/assets` | 新增固定資產 |
| 7 | PUT | `/api/pc/assets/{id}` | 更新固定資產 |
| 8 | DELETE | `/api/pc/assets/{id}` | 刪除固定資產 |
| 9 | GET | `/api/pc/assets/keeper` | 根據保管人查詢 |
| 10 | GET | `/api/pc/assets/department` | 根據部門查詢 |
| 11 | GET | `/api/pc/assets/check-number` | 檢查財產編號 |

### 異動記錄明細

| # | 方法 | 路徑 | 說明 |
|---|------|------|------|
| 1 | GET | `/api/pc/transdetail/asset/{assetId}` | 取得資產的異動記錄 |

## 📖 欄位說明

### 必填欄位 ✅

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `assetNumber` | string | 財產編號 (唯一) | "FA-2024-001" |
| `assetName` | string | 財產名稱 | "桌上型電腦" |
| `unit` | string | 單位 | "台" |
| `acquisitionDate` | date | 取得日期 | "2024-01-15" |
| `initialQuantity` | integer | 列管列帳類型 (1/2/3) | 3 |
| `keeperId` | integer | 保管人ID | 1 |
| `departmentId` | integer | 部門ID | 1 |
| `acquisitionAmount` | integer | 取得數量 | 1 |
| `acquisitionPrice` | integer | 取得成本 | 30000 |
| `mainAssetNumber` | string | 主財產類號 | "FA-2024" |

### 列管列帳類型

| 值 | 常數 | 名稱 | 說明 |
|----|------|------|------|
| 1 | TYPE_MANAGE | 列管 | 僅列入管理 |
| 2 | TYPE_ACCOUNT | 列帳 | 僅列入帳務 |
| 3 | TYPE_MANAGE_ACCOUNT | 列管列帳 | 同時列管與列帳 |

### 選填欄位 ❌

**基本資料：**
- `assetSpec`: 規格
- `supplier`: 廠商
- `location`: 存放地點
- `costNotDepreciated`: 成本總額 (預設=取得成本)
- `subCategory`: 總帳科目
- `budgetSource`: 預留殘值
- `extension`: 抵押狀態
- `investment`: 投保狀況
- `closeDate`: 關帳年月

**折舊相關：**
- `depreciationCategoryId`: 折舊科目ID
- `cumulativeDepreciationCategoryId`: 累計折舊科目ID
- `startDate`: 開始提列年月
- `usefulLifeMonths`: 耐用年限(月)
- `usedLifeMonths`: 總用年限(月)
- `residualValueRate`: 估前累計
- `zero`: 攤提至零日期
- `continued`: 續提月數

**異動相關：**
- `addAmount`: 增添改良
- `addDate`: 增添日期
- `originalValue`: 重估差價
- `stockValue`: 庫存數量 (預設=取得數量)

## 📝 使用範例

### 1. 新增固定資產 (最小必填)

```json
POST {{devUrl}}/api/pc/assets
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "assetNumber": "FA-2024-002",
  "assetName": "印表機",
  "unit": "台",
  "acquisitionDate": "2024-01-20",
  "initialQuantity": 1,
  "keeperId": 2,
  "departmentId": 1,
  "acquisitionAmount": 1,
  "acquisitionPrice": 8000,
  "mainAssetNumber": "FA-2024"
}
```

### 2. 更新固定資產

```json
PUT {{devUrl}}/api/pc/assets/1
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "assetName": "桌上型電腦(已升級)",
  "location": "資訊室-B棟5樓",
  "keeperId": 2
}
```

### 3. 搜尋固定資產

```
GET {{devUrl}}/api/pc/assets/search?keyword=電腦
Authorization: Bearer {{jwtToken}}
```

### 4. 取得列表 (分頁)

```
GET {{devUrl}}/api/pc/assets?page=1&perPage=15
Authorization: Bearer {{jwtToken}}
```

### 5. 取得全部資料

```
GET {{devUrl}}/api/pc/assets?perPage=all
Authorization: Bearer {{jwtToken}}
```

## 📊 回應格式

### 成功回應 (列表)

```json
{
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "assetNumber": "FA-2024-001",
        "assetName": "桌上型電腦",
        "keeper": {
          "id": 1,
          "name": "王小明",
          "account": "ming.wang"
        },
        "department": {
          "id": 1,
          "name": "資訊部",
          "code": "IT"
        }
      }
    ],
    "per_page": 15,
    "total": 100
  }
}
```

### 成功回應 (單筆)

```json
{
  "data": {
    "id": 1,
    "assetNumber": "FA-2024-001",
    "assetName": "桌上型電腦",
    "keeper": {...},
    "department": {...},
    "depreciationCategoryId": 101,
    "stockValue": 1,
    "transactionDetails": [...]
  }
}
```

### 錯誤回應

```json
{
  "message": "找不到該固定資產"
}
```

### 驗證錯誤

```json
{
  "message": "The asset number has already been taken.",
  "errors": {
    "assetNumber": [
      "財產編號已存在"
    ]
  }
}
```

## ⚠️ 注意事項

1. **財產編號唯一性**: `assetNumber` 必須唯一
2. **軟刪除**: 刪除操作使用軟刪除，資料不會真的被刪除
3. **日期格式**: 所有日期格式為 `YYYY-MM-DD`
4. **整數欄位**: 金額和數量都是整數 (不使用小數點)
5. **預設值**:
   - `acquisitionAmount` = 1
   - `costNotDepreciated` = `acquisitionPrice`
   - `stockValue` = `acquisitionAmount`
6. **認證**: 所有請求都需要 JWT Token
7. **camelCase**: 請求使用 camelCase，資料庫使用 snake_case (自動轉換)

## 🚀 快速開始

1. **匯入文件**
   ```
   - PC_FixedAsset_API.postman_collection.json
   - PC_API.postman_environment.json
   ```

2. **設定環境**
   - 選擇 "PC API Environment"
   - 設定 `jwtToken` 變數

3. **測試 API**
   - 選擇任一請求
   - 點擊 "Send"
   - 查看回應

## 📞 技術支援

如有問題請聯繫系統管理員。
