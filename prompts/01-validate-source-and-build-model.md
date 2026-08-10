# Validate the source and build the semantic model

Read the Excel workbook:

`data/power_bi_model_data.xlsx`

The workbook contains the intended Power BI source tables and includes a Model Guide and Data Dictionary.

Inspect these structured Excel tables:

- `tblSales`
- `tblCustomer`
- `tblProduct`
- `tblCalendar`

Do not modify the Power BI model during the validation phase.

## Phase 1 — Source validation

For each table, confirm:

1. worksheet and structured-table range,
2. exact row count,
3. exact column names,
4. observed data types,
5. keys declared by the Model Guide or Data Dictionary,
6. keys proven unique and non-null in the actual data,
7. foreign keys,
8. duplicate-key counts,
9. null counts by column,
10. referential-integrity failures,
11. date coverage and gaps,
12. discrepancies between the documentation and actual workbook.

Validate whether `SalesAmount` equals:

`Quantity * UnitPrice * (1 - DiscountPct)`

First inspect whether `DiscountPct` stores 10% as `0.10` or `10`; do not assume. Compare monetary values after rounding both sides to two decimal places. Report the mismatch count, total absolute difference and up to 10 sample mismatches.

## Phase 2 — Proposed semantic model

Confirm this star schema using the actual source columns:

- `Sales[CustomerKey]` many-to-one `Customer[CustomerKey]`
- `Sales[ProductKey]` many-to-one `Product[ProductKey]`
- `Sales[OrderDate]` many-to-one `Calendar[Date]`

Use active, single-direction filters from dimensions to `Sales`.

Confirm that `Calendar[Date]` is continuous, unique and non-null, and should be used to mark `Calendar` as the date table.

Return:

1. overall PASS or FAIL,
2. a concise validation table with PASS/FAIL for every check,
3. blocking issues,
4. non-blocking warnings,
5. the proposed tables, keys, relationships, data types and transformations,
6. confirmation that no model changes were made.

Stop and wait for explicit approval.

## Phase 3 — Build after approval

Only after I explicitly approve the validation report:

1. confirm the connected model is `sales-report/sales-report.pbip`,
2. create or update the four approved tables and partitions,
3. create the approved relationships,
4. mark `Calendar` as the date table using `Calendar[Date]`,
5. configure `Calendar[MonthName]` to sort by `Calendar[MonthNumber]`,
6. apply appropriate data types, summarization and key visibility,
7. refresh only if required and supported,
8. validate exact row counts, relationships and source totals,
9. read all created objects back from the model.

Do not create measures or report pages in this prompt.

Return PASS or FAIL for each build and validation check, plus all errors and unsupported operations.
