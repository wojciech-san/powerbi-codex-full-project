# Propose, plan, build, style and validate the Power BI report

The semantic model and measures have already been created, audited, and approved.

Do not repeat Prompts 1–3.

Do not:

- reload the Excel source,
- rebuild model tables,
- recreate relationships,
- modify Power Query,
- recreate or change validated DAX measures,
- change validated KPI definitions.

Use:

- Power BI project: `sales-report/sales-report.pbip`
- the approved semantic model and measures currently open in Power BI Desktop

Read the report-planning, report-design, and report-authoring skills before proceeding.

Use Power BI Desktop Bridge for report reloads, screenshots, and visual validation.

---

## Phase 1 — Read-only model and report analysis

During Phase 1, do not create or edit:

- report pages,
- visuals,
- slicers,
- themes,
- semantic-model objects,
- DAX measures.

1. Confirm that the connected semantic model and report belong to:

   `sales-report/sales-report.pbip`

2. Inspect the approved semantic model, including:

   - tables,
   - business-facing columns,
   - relationships,
   - date fields,
   - hierarchies,
   - existing measures,
   - measure display folders,
   - data categories,
   - available geographic fields,
   - product fields,
   - customer fields,
   - sales-channel fields,
   - time-intelligence measures.

3. Inspect the current report definition.

4. If report pages already exist:

   - inventory all pages,
   - inventory all visuals and slicers,
   - inspect or capture screenshots,
   - identify pages that are complete, incomplete, blank, duplicated, or invalid.

5. Infer the most useful business questions that can be answered using only the existing model and measures.

6. Do not invent:

   - fields,
   - columns,
   - relationships,
   - measures,
   - business definitions.

7. If an important analytical question cannot be answered with the existing model, identify the limitation clearly.

---

## Phase 2 — Propose three report concepts

Based only on the inspected semantic model and available measures, propose three distinct Power BI report concepts.

Do not use predefined report templates or predefined page counts.

Determine the most appropriate:

- audience,
- report purpose,
- number of pages,
- page names,
- analytical depth,
- visuals,
- filters,
- interactions,

based on what the model can support.

The three options should differ meaningfully in:

- intended audience,
- level of detail,
- number of pages,
- visual density,
- analytical focus,
- navigation complexity,
- interaction depth.

For each option provide:

### 1. Option name

Give the option a clear descriptive name.

### 2. Intended audience

Examples may include:

- executive leadership,
- sales management,
- finance management,
- product management,
- business analysts,
- operational teams.

Choose the audience based on the available data.

### 3. Report objective

Explain what the report is designed to help users understand or decide.

### 4. Recommended number of pages

Determine the page count from the model and business questions.

Do not assume that three pages are always correct.

### 5. Proposed pages

For every page provide:

- page name,
- business purpose,
- primary business question,
- intended audience,
- required KPIs,
- proposed visuals,
- fields and measures used,
- slicers and filters,
- default filter context,
- tooltip behavior,
- drill-through behavior where useful,
- cross-visual interaction expectations,
- approximate layout,
- reading order.

### 6. Main KPIs

List the existing measures that would be used.

Do not propose measures that do not exist.

### 7. Visual design

Describe:

- visual types,
- KPI placement,
- chart hierarchy,
- detail-table requirements,
- navigation approach,
- expected visual density.

### 8. Strengths

Explain the advantages of the option.

### 9. Limitations

Explain what the option does not cover well.

### 10. Complexity

Rate the option as:

- Low
- Medium
- High

Explain the reason.

### 11. Build and validation risk

Identify possible risks such as:

- too many visuals,
- limited available fields,
- complex interactions,
- limited prior-period data,
- difficult geographic analysis,
- large detail matrices,
- unsupported drill-through requirements.

### 12. Model compatibility

State whether the option can be built completely from the existing semantic model and measures.

Use:

- Fully supported
- Partially supported
- Not supported

Explain any gaps.

---

## Phase 3 — Compare and recommend

After presenting the three options, create a comparison table containing:

- option name,
- intended audience,
- number of pages,
- primary focus,
- analytical depth,
- visual density,
- complexity,
- model compatibility,
- main advantage,
- main limitation.

Then recommend one option.

The recommendation must be based on:

- the available model tables,
- available dimensions,
- available measures,
- time coverage,
- likely audience value,
- clarity,
- usability,
- implementation risk,
- report maintainability.

Explain:

1. why the recommended option is the strongest choice,
2. why its page count is appropriate,
3. why its page structure matches the model,
4. what trade-offs it makes,
5. why it is preferable to the other two options.

Do not automatically select or build the recommended option.

---

## Default design direction

Use this design direction when evaluating all three options:

- 16:9 page size,
- 1280 × 720 canvas,
- cool-grey page background,
- slate visual surfaces,
- cyan accent color,
- consistent typography,
- consistent margins,
- aligned visual containers,
- balanced whitespace,
- concise titles,
- prominent KPI cards,
- restrained conditional formatting,
- native Power BI visuals only,
- accessible contrast,
- readable font sizes,
- minimal legends,
- minimal gridlines,
- minimal decorative elements,
- consistent currency formatting,
- consistent percentage formatting.

Prefer purposeful visuals over decorative visuals.

Do not add a visual unless it answers a defined business question.

---

## Phase 3 output and approval gate

Return:

1. connected model confirmation,
2. existing page inventory,
3. existing visual inventory,
4. inferred business questions,
5. three detailed report options,
6. comparison table,
7. recommended option,
8. recommended number of pages,
9. recommended page names,
10. missing fields or measures,
11. model limitations,
12. report-blocking issues.

Return:

`REPORT OPTIONS: READY FOR SELECTION`

Then stop.

Do not create:

- `_brief/report-spec.md`,
- pages,
- visuals,
- slicers,
- themes,

before I select one option.

---

## Phase 4 — Create the selected report specification

Continue only after I explicitly select an option.

After selection:

1. create the folder `_brief` if it does not exist,

2. create:

   `_brief/report-spec.md`

3. use the selected option as the source of truth,

4. include:

   - report purpose,
   - target audience,
   - approved number of pages,
   - approved page names,
   - business questions,
   - required KPIs,
   - required visuals,
   - fields and measures,
   - slicers,
   - default filters,
   - interactions,
   - tooltips,
   - drill-through behavior,
   - layout and reading order,
   - design rules,
   - number formats,
   - KPI validation rules,
   - acceptance criteria.

Return the completed report specification.

Return:

`REPORT SPECIFICATION: READY FOR APPROVAL`

Then stop.

Do not build report pages before final approval.

---

## Phase 5 — Build after final approval

Continue only after I explicitly approve `_brief/report-spec.md`.

1. Inspect the current PBIR report definition.

2. Do not create duplicate:

   - pages,
   - visuals,
   - slicers,
   - navigation objects.

3. Preserve correct existing content.

4. Repair or replace only blank, incomplete, duplicated, or invalid report content.

5. Build only the approved pages and visuals.

6. Use existing model objects exactly.

7. Use explicit measures instead of implicit aggregations.

8. Apply the approved:

   - layout,
   - titles,
   - styling,
   - slicers,
   - sorting,
   - tooltips,
   - interactions,
   - number formats.

9. Preserve validated filter logic and KPI definitions.

10. Write all PBIR JSON files as:

    `UTF-8 without BOM`

11. Build one page at a time.

For each page:

1. create or inspect the page,
2. create or update visuals,
3. bind fields and measures,
4. configure slicers,
5. configure sorting,
6. configure tooltips,
7. configure interactions,
8. apply formatting,
9. validate PBIR,
10. require zero errors,
11. reload through Power BI Desktop Bridge,
12. capture a screenshot,
13. inspect the screenshot,
14. correct visual defects,
15. validate and reload again.

Do not publish the report.

---

## Phase 6 — Final validation

After the report is built:

1. run PBIR validation and require zero errors,
2. confirm PBIR JSON files use UTF-8 without BOM,
3. reload or reopen through Power BI Desktop Bridge,
4. capture a final screenshot of every page,
5. return a complete page and visual inventory,
6. reconcile main KPIs with DAX query results,
7. test default filters and slicers,
8. test cross-visual interactions,
9. check titles, labels, formats, overlaps, clipping, spacing, alignment, readability, whitespace, and visual clutter,
10. confirm that no semantic-model objects, Power Query definitions, relationships, or validated measures changed,
11. report unsupported operations or remaining limitations.

---

## Required final response

Return:

1. selected report option,
2. overall PASS or FAIL,
3. pages created or updated,
4. visuals created, updated, preserved, or removed,
5. design choices applied,
6. PBIR validation result,
7. UTF-8-without-BOM result,
8. Desktop Bridge reload result,
9. screenshot paths,
10. KPI reconciliation results,
11. slicer and interaction test results,
12. confirmation that the semantic model and measures were unchanged,
13. remaining issues or limitations.

Return:

`REPORT STATUS: READY`

only when all critical requirements pass.

Otherwise return:

`REPORT STATUS: NOT READY`