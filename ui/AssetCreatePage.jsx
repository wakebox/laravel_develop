import React, { useEffect, useMemo, useState } from "react";
import "./AssetCreatePage.css";

const statusOptions = [
    { value: "1", label: "列管且列帳" },
    { value: "2", label: "列管不列帳" },
    { value: "3", label: "列帳不列管" }
];

const mortgageOptions = [
    { value: "1", label: "未抵押" },
    { value: "2", label: "已抵押" }
];

const insuranceOptions = [
    { value: "1", label: "未投保" },
    { value: "2", label: "已投保" }
];

const unitOptions = [
    { value: "台", label: "台" },
    { value: "輛", label: "輛" },
    { value: "棟", label: "棟" },
    { value: "匹", label: "匹" }
];

const vendors = [
    { value: "v1", label: "新鴻科技" },
    { value: "v2", label: "聯達實業" }
];

const employees = [
    { value: "e1", label: "王小明" },
    { value: "e2", label: "陳怡君" }
];

const departments = [
    { value: "D001", label: "D001 研發部" },
    { value: "D002", label: "D002 行政部" }
];

const accounts = [
    { value: "A100", label: "A100 固定資產" },
    { value: "A200", label: "A200 累計折舊" }
];

const listRows = [
    {
        id: "FA-2025-0001",
        name: "高效能伺服器",
        spec: "2U/64GB",
        vendor: "新鴻科技",
        status: "列管且列帳",
        date: "114/06/23",
        qty: 1,
        cost: "1,000,000",
        keeper: "王小明",
        dept: "D001"
    }
];

const changeRecords = [
    {
        seq: "0001",
        type: "新增",
        keeper: "王小明",
        qty: 1,
        amount: "1,000,000",
        time: "2025/11/20"
    }
];

const initialForm = {
    assetNo: "",
    assetName: "",
    assetSpec: "",
    unit: "",
    vendor: "",
    acquireDate: "",
    status: "1",
    keeper: "",
    dept: "",
    location: "",
    qty: 1,
    cost: "",
    costTotal: "",
    mainAssetNo: "",
    account: "",
    residual: "",
    residualManual: false,
    mortgage: "1",
    insurance: "1",
    deprAccount: "",
    accDeprAccount: "",
    startYm: "",
    lifeMonths: "",
    continueMonths: "12",
    estAccumDepr: "",
    residualToZero: true,
    improveCost: "",
    improveDate: "",
    revalDiff: "",
    inventoryQty: 1,
    closeYm: ""
};

const tabs = [
    { id: "basic", label: "基本區" },
    { id: "depr", label: "折舊區" },
    { id: "change", label: "異動區" },
    { id: "history", label: "異動記錄" }
];

export default function AssetCreatePage() {
    const [activeTab, setActiveTab] = useState("basic");
    const [form, setForm] = useState(initialForm);

    const residualAuto = useMemo(() => {
        const cost = Number(form.cost.replace(/,/g, ""));
        const life = Number(form.lifeMonths);
        if (!cost || !life) return "";
        const raw = Math.floor(cost / (life + 12)) * 12;
        return String(raw);
    }, [form.cost, form.lifeMonths]);

    useEffect(() => {
        if (form.residualManual) return;
        setForm((prev) => ({ ...prev, residual: residualAuto }));
    }, [residualAuto, form.residualManual]);

    useEffect(() => {
        setForm((prev) => ({ ...prev, costTotal: prev.cost }));
    }, [form.cost]);

    const handleChange = (key) => (event) => {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleResidualChange = (event) => {
        setForm((prev) => ({
            ...prev,
            residualManual: true,
            residual: event.target.value
        }));
    };

    const isContinueMonthsDisabled = !form.residualToZero;

    return (
        <div className="asset-page">
            <header className="page-header">
                <div>
                    <p className="eyebrow">固定資產</p>
                    <h1>資產資料建立</h1>
                    <p className="subtitle">依 OA3.0 架構設計的前端示意頁。</p>
                </div>
                <div className="header-actions">
                    <button className="btn ghost">重設</button>
                    <button className="btn primary">存檔</button>
                </div>
            </header>

            <section className="panel search-panel">
                <div className="panel-title">查詢條件</div>
                <div className="grid-4">
                    <Field label="財產編號">
                        <input placeholder="模糊搜尋" />
                    </Field>
                    <Field label="財產名稱">
                        <input placeholder="模糊搜尋" />
                    </Field>
                    <Field label="供應商">
                        <select defaultValue="">
                            <option value="">請選擇</option>
                            {vendors.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="列管/列帳">
                        <select defaultValue="">
                            <option value="">請選擇</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
                <div className="panel-actions">
                    <button className="btn">查詢</button>
                    <button className="btn ghost">清除</button>
                </div>
            </section>

            <section className="panel list-panel">
                <div className="panel-title">OA 列表</div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>財產編號</th>
                                <th>財產名稱</th>
                                <th>資產規格</th>
                                <th>供應商</th>
                                <th>列管/列帳</th>
                                <th>取得日期</th>
                                <th>取得數量</th>
                                <th>取得成本</th>
                                <th>保管人</th>
                                <th>部門編號</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listRows.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.spec}</td>
                                    <td>{row.vendor}</td>
                                    <td>{row.status}</td>
                                    <td>{row.date}</td>
                                    <td>{row.qty}</td>
                                    <td className="number">{row.cost}</td>
                                    <td>{row.keeper}</td>
                                    <td>{row.dept}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="panel form-panel">
                <div className="panel-title">資產資料維護</div>
                <div className="tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? "tab active" : "tab"}
                            onClick={() => setActiveTab(tab.id)}
                            type="button"
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "basic" && (
                    <div className="grid-3">
                        <Field label="財產編號" required>
                            <input value={form.assetNo} onChange={handleChange("assetNo")} placeholder="僅英文與數字" />
                        </Field>
                        <Field label="財產名稱" required>
                            <input value={form.assetName} onChange={handleChange("assetName")} />
                        </Field>
                        <Field label="資產規格">
                            <input value={form.assetSpec} onChange={handleChange("assetSpec")} />
                        </Field>

                        <Field label="單位" required>
                            <select value={form.unit} onChange={handleChange("unit")}>
                                <option value="">請選擇</option>
                                {unitOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="供應商">
                            <select value={form.vendor} onChange={handleChange("vendor")}>
                                <option value="">請選擇</option>
                                {vendors.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="取得日期">
                            <input type="date" value={form.acquireDate} onChange={handleChange("acquireDate")} />
                        </Field>

                        <Field label="列管/列帳" required>
                            <select value={form.status} onChange={handleChange("status")}>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="保管人" required>
                            <select value={form.keeper} onChange={handleChange("keeper")}>
                                <option value="">請選擇</option>
                                {employees.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="部門編號">
                            <select value={form.dept} onChange={handleChange("dept")}>
                                <option value="">請選擇</option>
                                {departments.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="hint">預設依保管人帶入，可自行調整。</div>
                        </Field>

                        <Field label="存放地點">
                            <input value={form.location} onChange={handleChange("location")} />
                        </Field>
                        <Field label="取得數量" readOnly>
                            <input value={form.qty} readOnly />
                        </Field>
                        <Field label="取得成本" required>
                            <input value={form.cost} onChange={handleChange("cost")} placeholder="正整數" />
                        </Field>

                        <Field label="成本總和" readOnly>
                            <input value={form.costTotal} readOnly />
                            <div className="hint">預設等於取得成本。</div>
                        </Field>
                        <Field label="主財產編號" required>
                            <input value={form.mainAssetNo} onChange={handleChange("mainAssetNo")} placeholder="預設=財產編號" />
                        </Field>
                        <Field label="帳務科目" required>
                            <select value={form.account} onChange={handleChange("account")}>
                                <option value="">請選擇</option>
                                {accounts.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="預留殘值">
                            <input value={form.residual} onChange={handleResidualChange} />
                            <div className="hint">預設自動計算，存檔限制不可大於取得成本。</div>
                        </Field>
                        <Field label="抵押狀態">
                            <select value={form.mortgage} onChange={handleChange("mortgage")}>
                                {mortgageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="hint">存檔後鎖定，僅由抵押作業回寫。</div>
                        </Field>
                        <Field label="投保狀態">
                            <select value={form.insurance} onChange={handleChange("insurance")}>
                                {insuranceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="hint">存檔後鎖定，僅由投保作業回寫。</div>
                        </Field>
                    </div>
                )}

                {activeTab === "depr" && (
                    <div className="grid-3">
                        <Field label="折舊科目" required>
                            <select value={form.deprAccount} onChange={handleChange("deprAccount")}>
                                <option value="">請選擇</option>
                                {accounts.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="累積折舊科目" required>
                            <select value={form.accDeprAccount} onChange={handleChange("accDeprAccount")}>
                                <option value="">請選擇</option>
                                {accounts.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="開始提列年月" required>
                            <input value={form.startYm} onChange={handleChange("startYm")} placeholder="110/09" />
                        </Field>

                        <Field label="耐用年限＿個月" required>
                            <input value={form.lifeMonths} onChange={handleChange("lifeMonths")} placeholder="正整數" />
                        </Field>
                        <Field label="續用年限＿個月">
                            <input value={form.continueMonths} onChange={handleChange("continueMonths")} placeholder="正整數" />
                        </Field>
                        <Field label="估前累折">
                            <input value={form.estAccumDepr} onChange={handleChange("estAccumDepr")} placeholder="正整數" />
                        </Field>

                        <Field label="資產殘值攤提至0" required>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={form.residualToZero}
                                    onChange={handleChange("residualToZero")}
                                />
                                IF 打勾=Y，未勾=N
                            </label>
                        </Field>
                        <Field label="續提月數">
                            <input
                                value={form.continueMonths}
                                onChange={handleChange("continueMonths")}
                                disabled={isContinueMonthsDisabled}
                            />
                            <div className="hint">殘值攤提至0=Y 時必填，預設 12 個月。</div>
                        </Field>
                    </div>
                )}

                {activeTab === "change" && (
                    <div className="grid-3">
                        <Field label="增添改良">
                            <input value={form.improveCost} onChange={handleChange("improveCost")} />
                        </Field>
                        <Field label="增添改良日期">
                            <input type="date" value={form.improveDate} onChange={handleChange("improveDate")} />
                        </Field>
                        <Field label="重估差價">
                            <input value={form.revalDiff} onChange={handleChange("revalDiff")} />
                        </Field>

                        <Field label="庫存數量" readOnly>
                            <input value={form.inventoryQty} readOnly />
                        </Field>
                        <Field label="關帳年月" readOnly>
                            <input value={form.closeYm} readOnly placeholder="系統回寫" />
                        </Field>
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>序號</th>
                                    <th>異動類型</th>
                                    <th>保管人</th>
                                    <th>異動數量</th>
                                    <th>資產取得成本</th>
                                    <th>異動時間</th>
                                </tr>
                            </thead>
                            <tbody>
                                {changeRecords.map((row) => (
                                    <tr key={row.seq}>
                                        <td>{row.seq}</td>
                                        <td>{row.type}</td>
                                        <td>{row.keeper}</td>
                                        <td>{row.qty}</td>
                                        <td className="number">{row.amount}</td>
                                        <td>{row.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="panel-actions footer-actions">
                    <div className="note">金額欄位顯示千分位，例如 1,000,000。</div>
                    <div className="actions">
                        <button className="btn ghost">取消</button>
                        <button className="btn primary">送出</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Field({ label, required, readOnly, children }) {
    return (
        <label className={readOnly ? "field read-only" : "field"}>
            <div className="label">
                <span>{label}</span>
                {required && <span className="required">*</span>}
            </div>
            {children}
        </label>
    );
}
