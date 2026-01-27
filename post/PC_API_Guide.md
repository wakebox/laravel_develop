# PC 財產管理系統 Postman API 完整指南

## 📋 目錄
- [環境設定](#環境設定)
- [認證方式](#認證方式)
- [API 清單](#api-清單)
- [資料結構說明](#資料結構說明)
- [欄位詳細說明](#欄位詳細說明)
- [使用範例](#使用範例)
- [常見問題](#常見問題)

## 🔧 環境設定

### 1. 匯入 Collection
將 `PC_FixedAsset_API.postman_collection.json` 匯入到 Postman

### 2. 匯入 Environment
將 `PC_API.postman_environment.json` 匯入到 Postman

### 3. 設定環境變數
在 Postman 中設定以下環境變數：

| 變數名稱 | 說明 | 範例值 | 必填 |
|---------|------|--------|------|
| `devUrl` | API 基礎網址 | `http://localhost:8000` | ✅ |
| `jwtToken` | JWT 認證 Token | `eyJ0eXAiOiJKV1QiLCJhbGc...` | ✅ |
| `assetId` | 測試用資產ID | `1` | ❌ |
| `assetNumber` | 測試用財產編號 | `FA-2024-001` | ❌ |
| `keeperId` | 測試用保管人ID | `1` | ❌ |
| `departmentId` | 測試用部門ID | `1` | ❌ |

## 🔐 認證方式

所有 API 都使用 **Bearer Token** 認證方式：

```
Authorization: Bearer {{jwtToken}}
```

Collection 已經自動設定認證，只需要在環境變數中設定 `jwtToken` 即可。

## 📚 API 清單

### 固定資產管理

| 功能 | Method | Path | 說明 |
|------|--------|------|------|
| 取得列表 | GET | `/api/pc/assets` | 分頁列表 |
| 搜尋資產 | GET | `/api/pc/assets/search` | 關鍵字搜尋 |
| 取得編號列表 | GET | `/api/pc/assets/numbers/list` | 下拉選單用 |
| 根據編號查詢 | GET | `/api/pc/assets/number` | 根據財產編號 |
| 取得單筆 | GET | `/api/pc/assets/{id}` | 詳細資料 |
| 新增資產 | POST | `/api/pc/assets` | 建立新資產 |
| 更新資產 | PUT | `/api/pc/assets/{id}` | 更新資產 |
| 刪除資產 | DELETE | `/api/pc/assets/{id}` | 軟刪除 |

### 異動記錄

| 功能 | Method | Path | 說明 |
|------|--------|------|------|
| 取得異動記錄 | GET | `/api/pc/transdetail/asset/{assetId}` | 資產的異動明細 |

## 📊 資料結構說明

### 固定資產主表 (pc_fixed_assets)

#### 基本資料欄位

| 欄位名稱 | 資料型態 | 長度 | 必填 | 說明 | 備註 |
|---------|---------|------|------|------|------|
| `id` | bigInteger | - | 自動 | 主鍵 | 自動產生 |
| `assetNumber` | string | 50 | ✅ | 財產編號 | 唯一值 |
| `assetName` | string | 200 | ✅ | 財產名稱 | - |
| `assetSpec` | string | 500 | ❌ | 資產規格 | 詳細規格說明 |
| `unit` | string | 20 | ❌ | 單位 | 台、組、張等 |
| `supplier` | string | 50 | ❌ | 供應商 | 廠商名稱 |
| `acquisitionDate` | date | - | ❌ | 取得日期 | YYYY-MM-DD |
| `initialQuantity` | tinyInteger | - | ✅ | 列管列帳 | 1列管/2列帳/3列管列帳 |
| `keeperId` | bigInteger | - | ✅ | 保管人ID | 外鍵→sc_users |
| `departmentId` | bigInteger | - | ❌ | 部門ID | 外鍵→sc_departments |
| `location` | string | 200 | ❌ | 存放地點 | 實體位置 |
| `acquisitionAmount` | bigInteger | - | ❌ | 取得數量 | 固定為1 |
| `acquisitionPrice` | bigInteger | - | ✅ | 取得成本 | 金額(元) |
| `costNotDepreciated` | bigInteger | - | ❌ | 成本總額 | 預設=取得成本 |
| `mainAssetNumber` | string | 50 | ✅ | 主財產類號 | 資產分類代碼 |
| `subCategory` | string | 50 | ❌ | 總帳科目 | 會計科目 |
| `closeDate` | date | - | ❌ | 關帳年月 | YYYY-MM-DD |
| `budgetSource` | bigInteger | - | ❌ | 預留殘值 | 金額(元) |
| `extension` | tinyInteger | - | ❌ | 抵押狀態 | 0/1 |
| `investment` | tinyInteger | - | ❌ | 投保狀況 | 0/1 |

#### 折舊相關欄位

| 欄位名稱 | 資料型態 | 長度 | 必填 | 說明 | 備註 |
|---------|---------|------|------|------|------|
| `depreciationCategory` | string | 50 | ❌ | 折舊科目 | 科目名稱 |
| `cumulativeDepreciationCategory` | string | 50 | ❌ | 累計折舊科目 | 科目名稱 |
| `startDate` | date | - | ❌ | 開始提列年月 | YYYY-MM-DD |
| `usefulLifeMonths` | integer | - | ❌ | 耐用年限(月) | 月數 |
| `usedLifeMonths` | integer | - | ❌ | 總用年限(月) | 已使用月數 |
| `residualValueRate` | integer | - | ❌ | 估前累計 | 百分比 |
| `zero` | integer | - | ❌ | 攤提至零日期 | 0/1 |
| `continued` | integer | - | ❌ | 續提月數 | 月數 |

#### 異動相關欄位

| 欄位名稱 | 資料型態 | 長度 | 必填 | 說明 | 備註 |
|---------|---------|------|------|------|------|
| `addAmount` | integer | - | ❌ | 增添改良 | 金額(元) |
| `addDate` | date | - | ❌ | 增添日期 | YYYY-MM-DD |
| `originalValue` | integer | - | ❌ | 重估差價 | 金額(元) |
| `stockValue` | integer | - | ❌ | 庫存數量 | 預設=取得數量 |

#### 系統欄位

| 欄位名稱 | 資料型態 | 說明 |
|---------|---------|------|
| `createdAt` | timestamp | 建立時間 |
| `updatedAt` | timestamp | 更新時間 |
| `deletedAt` | timestamp | 刪除時間(軟刪除) |

### 異動記錄明細表 (pc_asset_transaction_details)

| 欄位名稱 | 資料型態 | 必填 | 說明 | 備註 |
|---------|---------|------|------|------|
| `id` | bigInteger | 自動 | 主鍵 | 自動產生 |
| `assetId` | bigInteger | ✅ | 固定資產ID | 外鍵→pc_fixed_assets |
| `type` | integer | ✅ | 異動類別 | 1新增/2出售/3報廢/4移轉/5改良 |
| `keeperId` | bigInteger | ❌ | 保管人ID | 外鍵→sc_users |
| `transactionQuantity` | bigInteger | ❌ | 異動數量 | 數量 |
| `transactionAmount` | bigInteger | ❌ | 異動金額 | 金額(元) |
| `transactionDate` | date | ❌ | 異動時間 | YYYY-MM-DD |

## 📝 欄位詳細說明

### 列管列帳類型 (initialQuantity)

| 值 | 名稱 | 說明 | 使用時機 |
|----|------|------|---------|
| 1 | 列管 | 僅登記管理，不入帳 | 低價值物品、消耗品等 |
| 2 | 列帳 | 僅入帳，不登記管理 | 只需財務記錄的資產 |
| 3 | 列管列帳 | 同時登記管理與入帳 | 重要資產、高價值設備 |

### 異動類別 (type)

| 值 | 名稱 | 說明 | 觸發時機 |
|----|------|------|---------|
| 1 | 新增 | 新購資產 | 初次購入資產時 |
| 2 | 出售 | 出售資產 | 資產出售給外部時 |
| 3 | 報廢 | 報廢處理 | 資產報廢時 |
| 4 | 移轉 | 移轉給其他部門/人員 | 保管人或部門變更時 |
| 5 | 改良 | 資產改良升級 | 資產升級或改良時 |

### 折舊科目說明

#### depreciationCategory (折舊科目)
記錄資產的折舊費用科目名稱，例如：
- `折舊費用-電腦設備`
- `折舊費用-辦公家具`
- `折舊費用-機器設備`
- `折舊費用-運輸設備`

**資料型態**: string(50)  
**用途**: 用於財務報表的折舊費用歸類

#### cumulativeDepreciationCategory (累計折舊科目)
記錄資產的累計折舊科目名稱，例如：
- `累計折舊-電腦設備`
- `累計折舊-辦公家具`
- `累計折舊-機器設備`
- `累計折舊-運輸設備`

**資料型態**: string(50)  
**用途**: 用於資產負債表顯示累計折舊金額

### 金額欄位說明

所有金額欄位統一使用 **整數型態 (integer/bigInteger)**，單位為 **元 (新台幣)**：

| 欄位 | 說明 | 範例值 |
|------|------|--------|
| `acquisitionPrice` | 取得成本 | 30000 表示 30,000 元 |
| `costNotDepreciated` | 成本總額 | 30000 表示 30,000 元 |
| `budgetSource` | 預留殘值 | 3000 表示 3,000 元 |
| `addAmount` | 增添改良金額 | 5000 表示 5,000 元 |
| `originalValue` | 重估差價 | -2000 表示負差價 2,000 元 |
| `transactionAmount` | 異動金額 | 25000 表示 25,000 元 |

### 日期欄位說明

所有日期欄位統一使用 **YYYY-MM-DD** 格式：

| 欄位 | 說明 | 範例 |
|------|------|------|
| `acquisitionDate` | 取得日期 | `2024-01-15` |
| `startDate` | 開始提列年月 | `2024-02-01` |
| `closeDate` | 關帳年月 | `2025-12-31` |
| `addDate` | 增添日期 | `2024-06-01` |
| `transactionDate` | 異動時間 | `2024-03-20` |

## 💡 使用範例

### 範例 1: 新增電腦設備 (完整欄位)

```json
POST /api/pc/assets
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "assetNumber": "FA-2024-001",
  "assetName": "桌上型電腦",
  "assetSpec": "Intel Core i7-12700, 16GB DDR4, 512GB NVMe SSD, Windows 11 Pro",
  "unit": "台",
  "supplier": "宏碁電腦股份有限公司",
  "acquisitionDate": "2024-01-15",
  "initialQuantity": 3,
  "keeperId": 1,
  "departmentId": 1,
  "location": "資訊室-A棟3樓",
  "acquisitionAmount": 1,
  "acquisitionPrice": 30000,
  "costNotDepreciated": 30000,
  "mainAssetNumber": "FA-2024",
  "subCategory": "電腦設備",
  "depreciationCategory": "折舊費用-電腦設備",
  "cumulativeDepreciationCategory": "累計折舊-電腦設備",
  "startDate": "2024-02-01",
  "usefulLifeMonths": 60,
  "usedLifeMonths": 0,
  "residualValueRate": 10,
  "stockValue": 1
}
```

**說明**:
- 電腦設備通常選擇「列管列帳」(initialQuantity = 3)
- 耐用年限設定為 60 個月 (5年)
- 殘值率設定為 10%
- 折舊科目直接使用字串描述

### 範例 2: 新增辦公家具 (最小必填)

```json
POST /api/pc/assets
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "assetNumber": "FA-2024-002",
  "assetName": "辦公桌",
  "unit": "張",
  "acquisitionDate": "2024-01-20",
  "initialQuantity": 1,
  "keeperId": 2,
  "acquisitionPrice": 8000,
  "mainAssetNumber": "FA-2024"
}
```

**說明**:
- 辦公家具通常選擇「列管」(initialQuantity = 1)
- 只填寫必填欄位即可建立資產
- 系統會自動設定預設值

### 範例 3: 新增印表機 (含折舊設定)

```json
POST /api/pc/assets
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "assetNumber": "FA-2024-003",
  "assetName": "雷射印表機",
  "assetSpec": "HP LaserJet Pro M404dn，黑白雷射，38ppm",
  "unit": "台",
  "supplier": "惠普科技股份有限公司",
  "acquisitionDate": "2024-02-01",
  "initialQuantity": 3,
  "keeperId": 3,
  "departmentId": 2,
  "location": "行政大樓-1樓",
  "acquisitionAmount": 1,
  "acquisitionPrice": 15000,
  "mainAssetNumber": "FA-2024",
  "subCategory": "辦公設備",
  "depreciationCategory": "折舊費用-辦公設備",
  "cumulativeDepreciationCategory": "累計折舊-辦公設備",
  "startDate": "2024-03-01",
  "usefulLifeMonths": 36,
  "stockValue": 1
}
```

### 範例 4: 更新資產基本資料

```json
PUT /api/pc/assets/1
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "assetName": "桌上型電腦(已升級)",
  "assetSpec": "Intel Core i7-12700, 32GB DDR4, 1TB NVMe SSD, 已升級記憶體",
  "location": "資訊室-B棟5樓"
}
```

### 範例 5: 資產移轉 (更換保管人與部門)

```json
PUT /api/pc/assets/1
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "keeperId": 5,
  "departmentId": 3,
  "location": "研發大樓-2樓"
}
```

**說明**:
- 更新保管人與部門後，系統會自動記錄異動明細
- 異動類別會標記為「移轉」(type = 4)

### 範例 6: 資產改良 (增添改良)

```json
PUT /api/pc/assets/1
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "addAmount": 5000,
  "addDate": "2024-06-15",
  "assetSpec": "Intel Core i7-12700, 32GB DDR4, 1TB NVMe SSD, 已加裝獨立顯卡"
}
```

**說明**:
- 記錄資產改良的金額與日期
- 更新規格說明
- 系統會記錄異動明細 (type = 5)

### 範例 7: 資產結案

```json
PUT /api/pc/assets/1
Content-Type: application/json
Authorization: Bearer {{jwtToken}}

{
  "closeDate": "2025-12-31",
  "zero": 1,
  "stockValue": 0
}
```

**說明**:
- 設定關帳年月
- zero = 1 表示已攤提至零
- stockValue = 0 表示庫存歸零

### 範例 8: 搜尋資產

```
GET /api/pc/assets/search?keyword=電腦
Authorization: Bearer {{jwtToken}}
```

**說明**:
- 搜尋財產編號、名稱或規格包含「電腦」的資產

### 範例 9: 取得資產列表 (分頁)

```
GET /api/pc/assets?page=1&perPage=15
Authorization: Bearer {{jwtToken}}
```

**說明**:
- page: 第幾頁 (從 1 開始)
- perPage: 每頁顯示筆數，設為 'all' 可取得全部

### 範例 10: 根據財產編號查詢

```
GET /api/pc/assets/number?assetNumber=FA-2024-001
Authorization: Bearer {{jwtToken}}
```

### 範例 11: 取得資產異動記錄

```
GET /api/pc/transdetail/asset/1
Authorization: Bearer {{jwtToken}}
```

**說明**:
- 取得資產ID為1的所有異動記錄
- 包含新增、出售、報廢、移轉、改良等記錄

## ❓ 常見問題

### Q1: 如何取得 JWT Token？
**A**: 請先呼叫登入 API 取得 Token，然後設定到環境變數 `jwtToken` 中。

```json
POST /api/auth/login
Content-Type: application/json

{
  "account": "your_account",
  "password": "your_password"
}
```

### Q2: 財產編號需要符合特定格式嗎？
**A**: 財產編號為唯一值，長度不超過 50 字元。格式可自訂，建議使用有意義的編號規則，例如：
- `FA-2024-001`: FA(固定資產) + 年度 + 流水號
- `IT-001`: 部門代碼 + 流水號
- `COMP-20240115-001`: 類別 + 日期 + 流水號

### Q3: 列管列帳類型如何選擇？
**A**: 
- **列管(1)**: 用於需要實體管理但不需入帳的資產（如低價值物品、消耗品）
- **列帳(2)**: 用於只需財務記錄的資產
- **列管列帳(3)**: 用於需要完整管理與財務記錄的重要資產（推薦用於高價值設備）

### Q4: 折舊科目如何填寫？
**A**: `depreciationCategory` 和 `cumulativeDepreciationCategory` 現在為字串欄位（長度50），可以直接填寫科目名稱，建議格式：

**折舊科目範例**:
- `折舊費用-電腦設備`
- `折舊費用-辦公家具`
- `折舊費用-運輸設備`
- `折舊費用-機器設備`

**累計折舊科目範例**:
- `累計折舊-電腦設備`
- `累計折舊-辦公家具`
- `累計折舊-運輸設備`
- `累計折舊-機器設備`

### Q5: 如何處理資產移轉？
**A**: 資產移轉有兩種方式：

1. **簡單移轉**: 直接更新 `keeperId` 和 `departmentId`
2. **完整移轉**: 使用資產移轉作業表 (pc_asset_transfers) 記錄詳細資訊

系統會自動在異動記錄明細表中記錄移轉記錄 (type = 4)。

### Q6: 軟刪除是什麼意思？
**A**: 使用 DELETE API 刪除資產時，資料不會真正從資料庫移除，只會標記 `deleted_at` 時間戳。這樣可以：
- 保留歷史記錄
- 維護資料完整性
- 需要時可以還原資料

如需還原，請聯繫系統管理員或使用資料庫管理工具。

### Q7: 取得數量為什麼說固定是 1？
**A**: `acquisitionAmount` 欄位設計為記錄單一資產的數量概念。系統設計上：
- 每筆資產記錄代表一個獨立管理的資產單位
- 如果購買 5 台相同電腦，建議建立 5 筆記錄（各有獨一的財產編號）
- 或使用 `acquisitionAmount` = 5 表示批次購買，但會視為一個管理單位

### Q8: 如何查詢某個部門的所有資產？
**A**: 目前可以：
1. 使用列表 API 並在後端加入過濾參數
2. 取得全部資料後在前端過濾
3. 使用搜尋功能搭配部門名稱

未來版本會加入更多過濾選項。

### Q9: 日期格式是什麼？
**A**: 所有日期欄位統一使用 `YYYY-MM-DD` 格式：
- ✅ 正確: `2024-01-15`
- ❌ 錯誤: `15/01/2024`, `2024/01/15`, `01-15-2024`

### Q10: 金額欄位的單位是什麼？
**A**: 所有金額欄位單位為「元」(新台幣)，使用整數型態：
- 30000 表示 30,000 元
- 不需要加上貨幣符號或千分位逗號
- 系統會自動處理顯示格式

### Q11: 耐用年限如何設定？
**A**: `usefulLifeMonths` 欄位以「月」為單位：
- 3 年 = 36 個月
- 5 年 = 60 個月
- 10 年 = 120 個月

常見資產耐用年限參考：
- 電腦設備: 36-60 個月
- 辦公家具: 60-120 個月
- 運輸設備: 60-84 個月
- 機器設備: 60-180 個月

### Q12: 如何批次新增資產？
**A**: 目前 API 僅支援單筆新增。如需批次新增，建議：
1. 使用迴圈依序呼叫 POST API
2. 或準備 Excel/CSV 匯入功能（未來版本）
3. 或使用資料庫直接匯入（需要資料庫權限）

### Q13: 更新資產時，哪些欄位不能修改？
**A**: 
- ✅ 可以修改: 除了 `assetNumber` 以外的所有欄位
- ❌ 不可修改: `assetNumber` (財產編號，唯一識別碼)
- ℹ️ 如需更改財產編號，建議建立新資產並刪除舊資產

### Q14: API 回應格式是什麼？
**A**: 標準回應格式：

**成功**:
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**失敗**:
```json
{
  "success": false,
  "message": "錯誤訊息",
  "errors": { ... }
}
```

### Q15: 如何處理 Token 過期？
**A**: 當 Token 過期時，API 會回傳 401 錯誤：
```json
{
  "message": "Unauthenticated."
}
```

請重新呼叫登入 API 取得新的 Token。

## 📞 技術支援

如有任何問題，請聯繫開發團隊。

## 📚 相關文件

- 資料庫 ER 圖: `/docs/fixed-asset-er-model.drawio`
- Migration 檔案: `/database/migrations/2026_01_23_113601_create_pc_tables.php`
- Model 檔案: `/app/Models/PC/`
- Controller 檔案: `/app/Http/Controllers/PC/`
- Resource 檔案: `/app/Http/Resources/PC/`

---

**版本**: 2.0.0  
**最後更新**: 2026-01-27  
**維護團隊**: PC 財產管理系統開發團隊
