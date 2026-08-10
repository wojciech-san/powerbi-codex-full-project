# Power BI project

This project contains:

- Source Excel file: `data/power_bi_model_data.xlsx`
- Power BI project: `sales-report/sales-report.pbip`
- Microsoft Power BI skills: `microsoft-fabric-skills/plugins/powerbi-authoring/skills`

## Required skills

For semantic-model work, first read and follow:

`microsoft-fabric-skills/plugins/powerbi-authoring/skills/semantic-model-authoring/SKILL.md`

For report planning, read:

`microsoft-fabric-skills/plugins/powerbi-authoring/skills/powerbi-report-planning/SKILL.md`

For visual design, read:

`microsoft-fabric-skills/plugins/powerbi-authoring/skills/powerbi-report-design/SKILL.md`

For report creation, read:

`microsoft-fabric-skills/plugins/powerbi-authoring/skills/powerbi-report-authoring/SKILL.md`

## Tool usage

Use a read-only spreadsheet or Python-based analysis method to inspect the Excel workbook. Do not infer source contents from the Power BI model.

Use the `powerbi-modeling-mcp` server for:

- tables and columns,
- Power Query partitions,
- relationships,
- hierarchies,
- measures and DAX,
- semantic-model settings and validation.

Use the report-authoring tools described by the Power BI authoring skills for:

- pages,
- visuals,
- slicers and filters,
- formatting and themes,
- screenshots and report validation.

Before any MCP write operation, confirm that the connected Power BI Desktop model corresponds to `sales-report/sales-report.pbip`. If multiple candidate models or Desktop instances are available, stop and report them without making changes.

## Required workflow

1. Analyze the Excel workbook.
2. Propose and validate the star schema.
3. Wait for explicit approval.
4. Build or update the semantic model.
5. Validate row counts, relationships, settings and totals.
6. Audit the model without changes.
7. Create and test approved measures.
8. Plan the report from `_brief/report-spec.md`.
9. Wait for explicit approval of the report plan.
10. Build, style and validate the report.

Do not create report pages until the semantic model and measures have been reviewed and approved.

Never invent table, column, measure or page names. Inspect the workbook, model and report specification first.

Preserve existing validated objects unless a prompt explicitly authorizes a change. If a required operation is unsupported by the available tools, report the limitation instead of editing PBIP/PBIR files by guesswork.
