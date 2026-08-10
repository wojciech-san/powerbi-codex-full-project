# Create and validate approved measures

The semantic-model audit is approved.

First confirm that the connected model is `sales-report/sales-report.pbip` and inspect the actual tables, columns and existing measure DAX.

Do not recreate or overwrite these existing measures:

- `Sales Amount`
- `Total Quantity`
- `Average Order Value`

Use the actual model names exactly. Do not invent missing columns or business definitions.

## Preflight

Before creating anything, verify that each requested measure can be derived unambiguously from the model and Data Dictionary.

Use these definitions unless the existing approved model documentation defines them differently:

- `Order Count`: distinct count of the actual order identifier. If no order identifier exists, stop and report the ambiguity.
- `Average Selling Price`: `DIVIDE([Sales Amount], [Total Quantity])`.
- `Gross Cost`: quantity multiplied by the actual unit-cost column and summed. If the model has only a line-cost column, use its documented definition instead. If neither exists, stop and report the missing dependency.
- `Gross Profit`: `[Sales Amount] - [Gross Cost]`.
- `Gross Margin %`: `DIVIDE([Gross Profit], [Sales Amount])`.
- `Discount Amount`: gross sales before discount minus `[Sales Amount]`, using the documented discount representation and source rounding rule.
- `Average Discount %`: `DIVIDE([Discount Amount], [Sales Amount] + [Discount Amount])`.

Before writes, report any definition that cannot be confirmed. Do not create an ambiguous measure.

## Measures to create

### Display folder: `01 Sales`

- `Order Count`
- `Average Selling Price`

### Display folder: `02 Profitability`

- `Gross Cost`
- `Gross Profit`
- `Gross Margin %`

### Display folder: `03 Discounts`

- `Discount Amount`
- `Average Discount %`

### Display folder: `04 Time Intelligence`

- `Sales Amount YTD`
- `Sales Amount Previous Year`
- `Sales Amount YoY`
- `Sales Amount YoY %`
- `Sales Amount Previous Month`
- `Sales Amount MoM`
- `Sales Amount MoM %`

Use `Calendar[Date]` for all time-intelligence calculations.

Use these comparison rules:

- Previous Year: same date context one year earlier.
- YoY: current sales minus previous-year sales.
- YoY %: YoY divided by previous-year sales.
- Previous Month: same date context shifted one month earlier.
- MoM: current sales minus previous-month sales.
- MoM %: MoM divided by previous-month sales.

Use `DIVIDE` for ratios. Return BLANK when a comparison denominator is zero or no corresponding comparison period exists.

## Formatting

Apply:

- currency format for monetary values,
- whole-number format for counts and quantities,
- percentage format for percentage measures,
- consistent decimal precision with the existing model.

Do not rename or change existing objects unless explicitly required and reported.

## Validation

After creation:

1. read every new measure back from the model,
2. show the stored DAX, format string and display folder,
3. run unfiltered total queries,
4. validate results by year and month,
5. test previous-year and previous-month boundary behavior,
6. reconcile gross profit as sales minus gross cost,
7. reconcile discount amount against source calculations where possible,
8. report DAX errors, unexpected blanks, infinities or suspicious results,
9. confirm existing measures were not modified.

If one measure fails, do not delete or overwrite unrelated existing measures. Report successful and failed creations separately.

Do not create report pages yet.

Return overall PASS or FAIL and evidence for every validation step.
