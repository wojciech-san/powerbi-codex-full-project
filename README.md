# 📊 Power BI + Codex Full Project

> A complete AI-assisted Power BI development workflow using Codex CLI, Power BI MCP, PBIP/PBIR, reusable prompts, human approval gates, and validation.

## 🎯 Project Goal

This repository demonstrates a repeatable workflow for building a Power BI report with Codex.

The project starts from an Excel source workbook and uses:

- 💻 VS Code
- 🤖 Codex CLI
- 🔌 Power BI Modeling MCP
- 🧠 Microsoft Power BI authoring skills
- 🛠️ Power BI Report Authoring CLI
- 🌉 Power BI Desktop Bridge
- 📁 PBIP / PBIR project files

The goal is not only to generate a report, but to build it through a controlled process with:

- ✅ source-data validation
- ✅ semantic-model validation
- 🔍 read-only audit
- 🧮 DAX measure creation and testing
- 📝 report planning
- 👤 human approval gates
- 🧪 PBIR validation
- 📸 screenshot-based QA
- 🎯 KPI reconciliation

---

## 📈 Final Result

The project produces a four-page Sales and Profitability report:

1. 📊 **Executive Overview**
2. 💰 **Product and Margin**
3. 🌍 **Customer and Market**
4. 📉 **Trends and Discounts**

The report helps answer questions such as:

- How are sales and profitability performing?
- Which products and categories drive revenue and profit?
- Which countries, customer segments, and channels perform best?
- How are sales and discounts changing over time?

---

## 📁 Project Structure

```text
PowerBICodex/
├── _brief/
│   └── report-spec.md
├── data/
│   └── power_bi_model_data.xlsx
├── microsoft-fabric-skills/
├── prompts/
│   ├── 01-validate-source-and-build-model.md
│   ├── 02-read-only-model-audit.md
│   ├── 03-create-and-validate-measures.md
│   └── 04-plan-build-and-validate-report.md
├── sales-report/
│   ├── sales-report.pbip
│   ├── sales-report.Report/
│   └── sales-report.SemanticModel/
├── screenshots/
├── tools/
├── AGENTS.md
└── README.md
