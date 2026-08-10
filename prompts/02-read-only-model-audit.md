# Read-only semantic-model audit

Perform a read-only audit of the semantic model currently open in Power BI Desktop.

First confirm that the connected model corresponds to:

`sales-report/sales-report.pbip`

If it does not, or if multiple candidate models are available, stop without making changes.

Do not create, update, delete, rename, import, refresh or save anything.

## Required checks

1. The model contains exactly these four semantic-model tables, including hidden tables in the count:
   - `Sales`
   - `Customer`
   - `Product`
   - `Calendar`

2. Exact row counts, verified with `COUNTROWS` queries where needed, are:
   - `Sales`: 8000
   - `Customer`: 250
   - `Product`: 50
   - `Calendar`: 730

3. These relationships exist and are active:
   - `Customer[CustomerKey]` one-to-many `Sales[CustomerKey]`
   - `Product[ProductKey]` one-to-many `Sales[ProductKey]`
   - `Calendar[Date]` one-to-many `Sales[OrderDate]`

   For each relationship, report cardinality, cross-filter direction, active status and endpoint data types. Filtering must be single-direction from the dimension to `Sales`.

4. `Calendar` is marked as the date table using `Calendar[Date]`.

5. `Calendar[MonthName]` is sorted by `Calendar[MonthNumber]`.

6. Relationship keys have compatible data types, date columns use the intended date type, and numeric columns use appropriate numeric types.

7. Technical keys and helper sort columns are hidden where appropriate. List every hidden column and flag questionable visibility rather than guessing.

8. Default summarization is appropriate, especially `Do not summarize` for keys, dates and descriptive attributes.

9. List all existing measures with:
   - measure name,
   - table,
   - stored DAX expression,
   - format string,
   - display folder,
   - description if available,
   - dependency or DAX error if detected.

10. Report all modeling, relationship, datatype, formatting, metadata or naming issues.

## Required response

Return:

1. overall PASS or FAIL,
2. PASS or FAIL for every numbered check,
3. exact evidence for failures,
4. warnings separated from blocking errors,
5. confirmation that no changes were applied.
