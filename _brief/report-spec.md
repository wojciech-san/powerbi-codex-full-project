# Sales and Profitability Management — Report Specification

## Approval status

- Selected concept: Option 2 — Sales and Profitability Management
- Status: Draft locked for approval; report authoring has not started.
- Delivery target: `sales-report/sales-report.pbip`
- Semantic-model rule: preserve all approved tables, columns, relationships, Power Query definitions, settings, and 17 validated measures unchanged.

## Report purpose and audience

This four-page report helps sales, finance, and product managers monitor commercial performance, diagnose product and margin drivers, compare customer markets, and understand time and discount patterns. It uses only the approved semantic model and explicit measures.

The report must answer these questions:

1. How are sales, profit, margin, orders, and order value performing, and which categories, channels, and segments drive the result?
2. Which categories, subcategories, and products generate sales and gross profit, and where are margins or discounts weak?
3. Which countries, cities, segments, and channel-market combinations contribute the most sales and profit?
4. How are sales and discounts changing over time, including year-over-year and month-over-month comparisons?

## Approved scope

The approved report contains exactly four standard 1280 × 720 pages:

1. Executive Overview
2. Product and Margin
3. Customer and Market
4. Trends and Discounts

All pages use native Power BI visuals. No tooltip page or drill-through page is required. The existing blank `Page 1` may be renamed and reused as `Executive Overview`; the other three pages may be added. A native page navigator appears consistently at the bottom of every page.

## Approved semantic bindings

### Measures

- Performance: `Sales[Sales Amount]`, `Sales[Total Quantity]`, `Sales[Average Order Value]`, `Sales[Order Count]`, `Sales[Average Selling Price]`
- Profitability: `Sales[Gross Cost]`, `Sales[Gross Profit]`, `Sales[Gross Margin %]`
- Discounts: `Sales[Discount Amount]`, `Sales[Average Discount %]`
- Time intelligence: `Sales[Sales Amount YTD]`, `Sales[Sales Amount Previous Year]`, `Sales[Sales Amount YoY]`, `Sales[Sales Amount YoY %]`, `Sales[Sales Amount Previous Month]`, `Sales[Sales Amount MoM]`, `Sales[Sales Amount MoM %]`

### Dimensions and detail fields

- Calendar: `Calendar[Date]`, `Calendar[Year]`, `Calendar[MonthName]`, `Calendar[MonthNumber]`, `Calendar[Quarter]`
- Product: `Product[ProductName]`, `Product[Category]`, `Product[Subcategory]`
- Customer/market: `Customer[CustomerName]`, `Customer[Segment]`, `Customer[Country]`, `Customer[City]`
- Sales: `Sales[Channel]`

No implicit aggregation may replace an approved measure. `Calendar[MonthName]` must retain its semantic-model sort by `Calendar[MonthNumber]`.

## Global filters and interaction rules

- Every page has two compact dropdown slicers in the upper-right header band: `Calendar[Year]` and `Sales[Channel]`.
- The Year and Channel slicers are synchronized across all four pages.
- Default state: `Calendar[Year] = 2026`; `Sales[Channel] = All`.
- The active slicer state must always remain visible. Single-select is enabled for Year; Channel permits multi-select and includes Select all.
- KPI cards filter to the selected context.
- Chart-to-card interaction uses Filter so KPI values reflect a selected category, product, market, segment, or period.
- Chart-to-chart interaction uses Highlight by default to retain context. Use Filter for tables/matrices where exact selected rows are more useful than retained context.
- The page navigator changes pages only and does not alter filter context.
- There are no bookmarks, hidden state panels, custom navigation buttons, or personalized visuals in scope.

## Page specifications

### 1. Executive Overview

Purpose: provide a scan-first view of current commercial performance and the largest category, channel, and segment drivers.

Required KPIs:

- `Sales[Sales Amount]`
- `Sales[Gross Profit]`
- `Sales[Gross Margin %]`
- `Sales[Order Count]`
- `Sales[Average Order Value]`

Required visuals and reading order:

1. Insight-led page title and synchronized Year/Channel slicers.
2. Five compact KPI cards in one row.
3. Monthly Sales Amount trend with Sales Amount Previous Year as the comparison line.
4. Ranked Sales Amount by Product Category bar chart.
5. Ranked Sales Amount by Sales Channel bar chart.
6. Ranked Gross Profit by Customer Segment bar chart.
7. Page navigator.

Sort category, channel, and segment charts by their measure descending. Category, channel, and segment selections highlight peer charts and filter the KPI cards. Default tooltips show the category label plus Sales Amount, Gross Profit, and Gross Margin % where applicable. No drill-through is required.

### 2. Product and Margin

Purpose: identify the categories, subcategories, and products that create sales and profit and expose margin/discount trade-offs.

Required KPIs:

- `Sales[Sales Amount]`
- `Sales[Gross Profit]`
- `Sales[Gross Margin %]`
- `Sales[Discount Amount]`

Required visuals and reading order:

1. Insight-led page title and synchronized Year/Channel slicers.
2. Four compact KPI cards.
3. Product hierarchy matrix using Category, Subcategory, and ProductName with Sales Amount, Gross Profit, Gross Margin %, and Discount Amount. Default expansion stops at Subcategory; ProductName is available through expand/collapse.
4. Scatter chart by ProductName with Sales Amount on X, Gross Margin % on Y, Gross Profit as bubble size, and Category as legend.
5. Ranked Sales Amount by Subcategory bar chart, limited to Top 10 by Sales Amount.
6. Average Discount % by Category column chart.
7. Page navigator.

The matrix uses data bars on Sales Amount and Gross Profit and semantic font/background color on Gross Margin % (positive teal emphasis, low values muted; no unsupported target threshold). Scatter and chart selections filter the matrix and KPI cards and highlight the other charts. Default tooltips include ProductName or grouping label, Sales Amount, Gross Profit, Gross Margin %, and Average Discount %. No drill-through is required.

### 3. Customer and Market

Purpose: compare market contribution and profitability without relying on uncertain map geocoding or ambiguous customer-name aggregation.

Required KPIs:

- `Sales[Sales Amount]`
- `Sales[Gross Profit]`
- `Sales[Gross Margin %]`
- `Sales[Order Count]`

Required visuals and reading order:

1. Insight-led page title and synchronized Year/Channel slicers.
2. Four compact KPI cards.
3. Ranked horizontal bar chart of Sales Amount by Country.
4. City performance table with Country, City, Sales Amount, Gross Profit, Gross Margin %, and Order Count; sorted by Sales Amount descending and limited to the Top 20 cities by Sales Amount.
5. Ranked Gross Profit by Segment bar chart.
6. Country-by-Channel matrix with Sales Amount as values and row totals enabled.
7. Page navigator.

Country and segment selections filter KPI cards and the city/matrix detail, while peer charts highlight the selected contribution. The city table uses data bars for Sales Amount and Gross Profit and semantic color for Gross Margin %. Default tooltips show the market label, Sales Amount, Gross Profit, Gross Margin %, and Order Count. No map and no customer-level ranking are included because there is no latitude/longitude and `Customer[CustomerName]` is not unique. No drill-through is required.

### 4. Trends and Discounts

Purpose: explain current movement in sales and discounting using the approved prior-year and prior-month sales measures.

Required KPIs:

- `Sales[Sales Amount YTD]`
- `Sales[Sales Amount YoY %]`
- `Sales[Sales Amount MoM %]`
- `Sales[Average Discount %]`

Required visuals and reading order:

1. Insight-led page title and synchronized Year/Channel slicers.
2. Four compact KPI cards.
3. Monthly line chart with Sales Amount and Sales Amount Previous Year.
4. Monthly column chart of Discount Amount.
5. Channel comparison chart with Average Discount % and Gross Margin %.
6. Monthly performance matrix with MonthName, Sales Amount, Sales Amount Previous Year, Sales Amount YoY, Sales Amount YoY %, Sales Amount Previous Month, Sales Amount MoM, and Sales Amount MoM %.
7. Page navigator.

Months use natural calendar order. Positive YoY/MoM variance is teal and negative variance is red; missing prior-period values remain blank and are not treated as zero. Period selections filter KPI cards and detail and highlight peer charts. Default tooltips show month, current Sales Amount, prior-year Sales Amount, YoY %, Discount Amount, and Average Discount %. No drill-through is required.

## Layout and reading order

- Canvas: 1280 × 720, 24 px outer margin, 16 px minimum gutter, 8 px snap grid.
- Reading order is left-to-right, top-to-bottom: page title, slicers, KPI row, primary analysis, supporting analysis/detail, page navigator.
- The top-left is reserved for the page title; slicers remain right-aligned and never overlap data visuals.
- Cards are compact and equal-sized. No single card is a hero visual.
- Chart titles state the analytical question or comparison concisely; visual-type names such as “Bar chart” are prohibited.
- Tables/matrices grow to fill their allocated regions and avoid unused bottom whitespace.

## Design rules

- Tone: corporate cool, decision-focused, and moderately dense.
- Signature: a consistent cyan KPI spine paired with ranked slate driver panels on every page.
- Page background: cool grey `#EEF2F5`.
- Visual surfaces: light slate `#F8FAFC`, with subtle `#CBD5E1` borders and 8 px corner radius.
- Primary text: dark slate `#1E293B`; secondary text: `#475569`.
- Primary accent: cyan `#00A6C8`; use the accent for selected/high-priority data, not decoration.
- Positive variance: teal `#168C7A`; negative variance: red `#C94C4C`; discount emphasis: amber `#D99A2B`.
- Typography: Segoe UI throughout; 20 pt semibold page titles, 11–12 pt visual titles, 9–10 pt labels, 24–30 pt KPI values.
- Use minimal legends and gridlines, restrained conditional formatting, accessible contrast, concise labels, and consistent alignment.
- Avoid gradients except purposeful sequential bar intensity or table data bars. Avoid shadows, decorative shapes, oversized logos, custom visuals, and ornamental icons.
- The report title and every visual must have meaningful alt text. Do not rely on color alone: signs, labels, and values must communicate variance direction.

## Number formats

- Currency amounts (`Sales Amount`, `Gross Cost`, `Gross Profit`, `Discount Amount`, `Average Order Value`, `Average Selling Price`, and prior-period/delta currency measures): euro currency, thousands separator, zero decimals on cards/charts, and two decimals in tables/matrices; use display units K/M where space requires.
- Percentages (`Gross Margin %`, `Average Discount %`, `Sales Amount YoY %`, `Sales Amount MoM %`): one decimal place; signed variance percentages display `+` for positive and `-` for negative.
- Counts and quantities (`Order Count`, `Total Quantity`): whole numbers with thousands separator.
- Dates: localized short date where shown; MonthName is displayed without truncation and sorted by MonthNumber.
- Blank time-comparison results display as blank, not `0`, `0.0%`, or an error.

## KPI validation rules

1. Under the unfiltered full-model context, the report must reconcile to: Sales Amount €5,407,457.50; Total Quantity 21,266; Order Count 4,457; Gross Cost €3,590,758.01; Gross Profit €1,816,699.49; Gross Margin 33.60%; Discount Amount €290,590.75; Average Discount 5.10%.
2. Under the default `Calendar[Year] = 2026` and Channel = All context, Sales Amount must reconcile to €2,674,702.88; Sales Amount YoY must reconcile to -€58,051.74 and Sales Amount YoY % to -2.12%.
3. The sum of category, channel, country, or segment Sales Amount in an unfiltered visual context must reconcile to the corresponding Sales Amount card.
4. Gross Profit must equal Sales Amount minus Gross Cost in every tested filter context, and Gross Margin % must equal Gross Profit divided by Sales Amount.
5. Slicer changes must produce the same values as direct DAX queries for at least one Year selection and one Channel selection.
6. Previous-year and previous-month measures must remain blank when no valid comparison period exists.

## Acceptance criteria

- Exactly the four approved pages exist, in the approved order, with no duplicate or blank pages.
- Every required visual, slicer, binding, sort, number format, tooltip, and interaction is present and follows this specification.
- PBIR validation runs after each page and returns zero errors; final validation also returns zero errors. Remote-schema reachability warnings may be reported separately if they remain environmental.
- Every page reloads successfully through Power BI Desktop Bridge and receives screenshot-based visual review.
- Screenshots show no overlap, clipping, scrollbar in titles, truncated critical labels, illegible text, excessive whitespace, or inconsistent alignment.
- All PBIR JSON is UTF-8 without BOM.
- Default filters and synchronized slicers work across all pages; chart-to-card and chart-to-detail interactions behave as specified.
- KPI reconciliation passes under the full-model and default contexts.
- Semantic-model metadata, Power Query definitions, relationships, and all validated measures remain unchanged.
- No publishing occurs.

## Known limitations

- There are no budget, target, forecast, inventory, return, fulfillment, pipeline, or sales-representative fields or measures.
- Prior-period measures exist for Sales Amount only, so profit, margin, order, and quantity YoY/MoM comparisons are out of scope.
- Geography has Country and City categories but no latitude/longitude; the approved design uses ranked visuals rather than a map.
- `Customer[CustomerName]` is not unique, so customer-level rankings and drill-through are excluded.
- There are no precomputed ranks, rank shifts, formal performance thresholds, or target-gap measures.

## Canonical design contract

```yaml
Design Brief:
  generated_by: powerbi-report-design
  contract_version: 1
  mode: brownfield
  design_identity:
    tone: "Corporate cool: decision-focused, light-slate surfaces, cyan accent, Segoe UI hierarchy, moderate density, and restrained analytical chrome."
    signature: "Cyan KPI spine with ranked slate driver panels repeated across pages."
    current_tone: "Blank default Power BI canvas with no established visual identity."
    current_signature: "None."
  archetype: "Executive-to-analytical management report"
  color_map:
    - measure: "Sales[Sales Amount]"
      color: "#00A6C8"
      tint: "#DDF6FA"
    - measure: "Sales[Gross Profit]"
      color: "#2D7F8C"
      tint: "#E1F0F2"
    - measure: "Sales[Gross Margin %]"
      color: "#168C7A"
      tint: "#DDF3EE"
    - measure: "Sales[Order Count]"
      color: "#486581"
      tint: "#E7EDF3"
    - measure: "Sales[Average Order Value]"
      color: "#6D5B97"
      tint: "#EEEAF5"
    - measure: "Sales[Discount Amount]"
      color: "#D99A2B"
      tint: "#FAEED8"
    - measure: "Sales[Average Discount %]"
      color: "#D99A2B"
      tint: "#FAEED8"
    - measure: "Sales[Sales Amount Previous Year]"
      color: "#64748B"
      tint: "#E8ECF1"
    - measure: "Sales[Sales Amount YTD]"
      color: "#00A6C8"
      tint: "#DDF6FA"
    - measure: "Sales[Sales Amount YoY %]"
      color: "#168C7A"
      tint: "#DDF3EE"
    - measure: "Sales[Sales Amount MoM %]"
      color: "#168C7A"
      tint: "#DDF3EE"
  pages:
    - name: "Executive Overview"
      role: landing
      archetype: Executive
      layout_variant: B
      variant_rationale: "Five KPI values need immediate visibility while balanced trend and ranked-driver panels explain the result."
      page_background: "#EEF2F5"
      layout_summary: "Inline filters, compact KPI strip, one trend panel, three ranked driver panels, and persistent bottom navigation."
      layout_contract:
        canvas: { width: 1280, height: 720, margin: 24, gutter: 16, snap: 8 }
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 8, 2]
            filters: [8, 1, 13, 2]
            kpis: [1, 2, 13, 4]
            trend: [1, 4, 8, 8]
            category_driver: [8, 4, 13, 8]
            channel_driver: [1, 8, 7, 12]
            segment_driver: [7, 8, 13, 12]
            navigation: [1, 12, 13, 13]
        placements:
          - { id: page_title, region: header, kind: textbox, text: "How is commercial performance tracking?", purpose: "Frame the page's management question." }
          - { id: year_slicer, region: filters, kind: slicer, field_bindings: "Calendar[Year]", slicer_type: dropdown, slot: 1, of: 2 }
          - { id: channel_slicer, region: filters, kind: slicer, field_bindings: "Sales[Channel]", slicer_type: dropdown, slot: 2, of: 2 }
          - { id: sales_card, region: kpis, kind: cardVisual, purpose: "What is total sales?", field_bindings: "Sales[Sales Amount]", color_strategy: measure_match, slot: 1, of: 5 }
          - { id: profit_card, region: kpis, kind: cardVisual, purpose: "What is gross profit?", field_bindings: "Sales[Gross Profit]", color_strategy: measure_match, slot: 2, of: 5 }
          - { id: margin_card, region: kpis, kind: cardVisual, purpose: "What is gross margin?", field_bindings: "Sales[Gross Margin %]", color_strategy: semantic, comparison_basis: "Positive profitability, without an invented target threshold.", slot: 3, of: 5 }
          - { id: orders_card, region: kpis, kind: cardVisual, purpose: "How many orders were placed?", field_bindings: "Sales[Order Count]", color_strategy: measure_match, slot: 4, of: 5 }
          - { id: aov_card, region: kpis, kind: cardVisual, purpose: "What is average order value?", field_bindings: "Sales[Average Order Value]", color_strategy: measure_match, slot: 5, of: 5 }
          - id: sales_trend
            region: trend
            kind: lineChart
            purpose: "How do monthly sales compare with the prior year?"
            field_bindings: { Category: "Calendar[MonthName]", Y: ["Sales[Sales Amount]", "Sales[Sales Amount Previous Year]"] }
            color_strategy: measure_match
          - id: category_sales
            region: category_driver
            kind: barChart
            purpose: "Which product categories drive sales?"
            field_bindings: { Category: "Product[Category]", Y: "Sales[Sales Amount]" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: channel_sales
            region: channel_driver
            kind: barChart
            purpose: "Which channels drive sales?"
            field_bindings: { Category: "Sales[Channel]", Y: "Sales[Sales Amount]" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: segment_profit
            region: segment_driver
            kind: barChart
            purpose: "Which customer segments generate gross profit?"
            field_bindings: { Category: "Customer[Segment]", Y: "Sales[Gross Profit]" }
            sort_policy: value_desc
            color_strategy: gradient
          - { id: page_navigator, region: navigation, kind: pageNavigator, purpose: "Navigate among the four approved pages." }
        space_audit:
          content_cell_count: 132
          placed_cell_count: 132
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region: { name: trend, pct_of_content: 21 }
          balance_rationale: "The KPI strip and four analysis panels occupy every content band; the trend is largest but does not starve the ranked drivers."
    - name: "Product and Margin"
      role: detail
      archetype: Analytical
      layout_variant: A
      variant_rationale: "A product hierarchy needs the largest panel, supported by relationship and ranking views."
      page_background: "#EEF2F5"
      layout_summary: "Inline filters, KPI strip, hierarchy matrix plus product scatter, two supporting category panels, and bottom navigation."
      layout_contract:
        canvas: { width: 1280, height: 720, margin: 24, gutter: 16, snap: 8 }
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 8, 2]
            filters: [8, 1, 13, 2]
            kpis: [1, 2, 13, 4]
            product_matrix: [1, 4, 8, 8]
            product_scatter: [8, 4, 13, 8]
            subcategory_driver: [1, 8, 7, 12]
            category_discount: [7, 8, 13, 12]
            navigation: [1, 12, 13, 13]
        placements:
          - { id: page_title, region: header, kind: textbox, text: "Which products create sales and margin?", purpose: "Frame the product profitability question." }
          - { id: year_slicer, region: filters, kind: slicer, field_bindings: "Calendar[Year]", slicer_type: dropdown, slot: 1, of: 2 }
          - { id: channel_slicer, region: filters, kind: slicer, field_bindings: "Sales[Channel]", slicer_type: dropdown, slot: 2, of: 2 }
          - { id: sales_card, region: kpis, kind: cardVisual, purpose: "What is product sales?", field_bindings: "Sales[Sales Amount]", color_strategy: measure_match, slot: 1, of: 4 }
          - { id: profit_card, region: kpis, kind: cardVisual, purpose: "What is product gross profit?", field_bindings: "Sales[Gross Profit]", color_strategy: measure_match, slot: 2, of: 4 }
          - { id: margin_card, region: kpis, kind: cardVisual, purpose: "What is product gross margin?", field_bindings: "Sales[Gross Margin %]", color_strategy: semantic, comparison_basis: "Positive profitability, without an invented target threshold.", slot: 3, of: 4 }
          - { id: discount_card, region: kpis, kind: cardVisual, purpose: "How much discount was granted?", field_bindings: "Sales[Discount Amount]", color_strategy: measure_match, slot: 4, of: 4 }
          - id: product_hierarchy
            region: product_matrix
            kind: pivotTable
            purpose: "How do category, subcategory, and product sales, profit, margin, and discount compare?"
            field_bindings:
              Rows: ["Product[Category]", "Product[Subcategory]", "Product[ProductName]"]
              Values: ["Sales[Sales Amount]", "Sales[Gross Profit]", "Sales[Gross Margin %]", "Sales[Discount Amount]"]
            sort_policy: value_desc
            color_strategy: semantic
          - id: product_position
            region: product_scatter
            kind: scatterChart
            purpose: "Which products combine scale, margin, and profit?"
            field_bindings: { Details: "Product[ProductName]", X: "Sales[Sales Amount]", Y: "Sales[Gross Margin %]", Size: "Sales[Gross Profit]", Legend: "Product[Category]" }
            color_strategy: unique
          - id: subcategory_sales
            region: subcategory_driver
            kind: barChart
            purpose: "Which subcategories lead sales?"
            field_bindings: { Category: "Product[Subcategory]", Y: "Sales[Sales Amount]" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: category_discount
            region: category_discount
            kind: columnChart
            purpose: "Where is average discount highest by category?"
            field_bindings: { Category: "Product[Category]", Y: "Sales[Average Discount %]" }
            sort_policy: value_desc
            color_strategy: gradient
          - { id: page_navigator, region: navigation, kind: pageNavigator, purpose: "Navigate among the four approved pages." }
        space_audit:
          content_cell_count: 132
          placed_cell_count: 132
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region: { name: product_matrix, pct_of_content: 21 }
          balance_rationale: "The hierarchy matrix receives the widest analytical area while the scatter and two supporting comparisons remain readable."
    - name: "Customer and Market"
      role: detail
      archetype: Comparative
      layout_variant: B
      variant_rationale: "Ranked markets and a city table provide more reliable comparisons than geocoded mapping for the available fields."
      page_background: "#EEF2F5"
      layout_summary: "Inline filters, KPI strip, country ranking plus city detail, segment and country-channel comparison panels, and bottom navigation."
      layout_contract:
        canvas: { width: 1280, height: 720, margin: 24, gutter: 16, snap: 8 }
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 8, 2]
            filters: [8, 1, 13, 2]
            kpis: [1, 2, 13, 4]
            country_driver: [1, 4, 7, 8]
            city_detail: [7, 4, 13, 8]
            segment_driver: [1, 8, 6, 12]
            country_channel: [6, 8, 13, 12]
            navigation: [1, 12, 13, 13]
        placements:
          - { id: page_title, region: header, kind: textbox, text: "Which markets and segments drive performance?", purpose: "Frame the market contribution question." }
          - { id: year_slicer, region: filters, kind: slicer, field_bindings: "Calendar[Year]", slicer_type: dropdown, slot: 1, of: 2 }
          - { id: channel_slicer, region: filters, kind: slicer, field_bindings: "Sales[Channel]", slicer_type: dropdown, slot: 2, of: 2 }
          - { id: sales_card, region: kpis, kind: cardVisual, purpose: "What is market sales?", field_bindings: "Sales[Sales Amount]", color_strategy: measure_match, slot: 1, of: 4 }
          - { id: profit_card, region: kpis, kind: cardVisual, purpose: "What is market gross profit?", field_bindings: "Sales[Gross Profit]", color_strategy: measure_match, slot: 2, of: 4 }
          - { id: margin_card, region: kpis, kind: cardVisual, purpose: "What is market gross margin?", field_bindings: "Sales[Gross Margin %]", color_strategy: semantic, comparison_basis: "Positive profitability, without an invented target threshold.", slot: 3, of: 4 }
          - { id: orders_card, region: kpis, kind: cardVisual, purpose: "How many market orders were placed?", field_bindings: "Sales[Order Count]", color_strategy: measure_match, slot: 4, of: 4 }
          - id: country_sales
            region: country_driver
            kind: barChart
            purpose: "Which countries drive sales?"
            field_bindings: { Category: "Customer[Country]", Y: "Sales[Sales Amount]" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: city_performance
            region: city_detail
            kind: tableEx
            purpose: "Which cities contribute the most sales and profit?"
            field_bindings: ["Customer[Country]", "Customer[City]", "Sales[Sales Amount]", "Sales[Gross Profit]", "Sales[Gross Margin %]", "Sales[Order Count]"]
            sort_policy: value_desc
            color_strategy: semantic
          - id: segment_profit
            region: segment_driver
            kind: barChart
            purpose: "Which customer segments generate gross profit?"
            field_bindings: { Category: "Customer[Segment]", Y: "Sales[Gross Profit]" }
            sort_policy: value_desc
            color_strategy: gradient
          - id: country_channel_matrix
            region: country_channel
            kind: pivotTable
            purpose: "How does sales vary by country and channel?"
            field_bindings: { Rows: "Customer[Country]", Columns: "Sales[Channel]", Values: "Sales[Sales Amount]" }
            sort_policy: value_desc
            color_strategy: gradient
          - { id: page_navigator, region: navigation, kind: pageNavigator, purpose: "Navigate among the four approved pages." }
        space_audit:
          content_cell_count: 132
          placed_cell_count: 132
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region: { name: country_channel, pct_of_content: 21 }
          balance_rationale: "Four balanced market views fill the page; the wider matrix supports cross-channel scanning without overwhelming the country, city, or segment views."
    - name: "Trends and Discounts"
      role: detail
      archetype: Analytical
      layout_variant: C
      variant_rationale: "Time comparisons require one dominant trend, one discount trend, and a dense monthly evidence table."
      page_background: "#EEF2F5"
      layout_summary: "Inline filters, variance KPI strip, paired monthly trends, channel comparison plus monthly matrix, and bottom navigation."
      layout_contract:
        canvas: { width: 1280, height: 720, margin: 24, gutter: 16, snap: 8 }
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 8, 2]
            filters: [8, 1, 13, 2]
            kpis: [1, 2, 13, 4]
            sales_trend: [1, 4, 8, 8]
            discount_trend: [8, 4, 13, 8]
            channel_comparison: [1, 8, 6, 12]
            monthly_detail: [6, 8, 13, 12]
            navigation: [1, 12, 13, 13]
        placements:
          - { id: page_title, region: header, kind: textbox, text: "How are sales momentum and discounts changing?", purpose: "Frame the period comparison question." }
          - { id: year_slicer, region: filters, kind: slicer, field_bindings: "Calendar[Year]", slicer_type: dropdown, slot: 1, of: 2 }
          - { id: channel_slicer, region: filters, kind: slicer, field_bindings: "Sales[Channel]", slicer_type: dropdown, slot: 2, of: 2 }
          - { id: sales_ytd_card, region: kpis, kind: cardVisual, purpose: "What is year-to-date sales?", field_bindings: "Sales[Sales Amount YTD]", color_strategy: measure_match, slot: 1, of: 4 }
          - { id: yoy_card, region: kpis, kind: cardVisual, purpose: "How did sales change year over year?", field_bindings: "Sales[Sales Amount YoY %]", color_strategy: semantic, insight_basis: "Sign of year-over-year sales variance.", comparison_basis: prior_year, slot: 2, of: 4 }
          - { id: mom_card, region: kpis, kind: cardVisual, purpose: "How did sales change month over month?", field_bindings: "Sales[Sales Amount MoM %]", color_strategy: semantic, insight_basis: "Sign of month-over-month sales variance.", comparison_basis: prior_month, slot: 3, of: 4 }
          - { id: avg_discount_card, region: kpis, kind: cardVisual, purpose: "What is the average discount rate?", field_bindings: "Sales[Average Discount %]", color_strategy: measure_match, slot: 4, of: 4 }
          - id: monthly_sales
            region: sales_trend
            kind: lineChart
            purpose: "How do monthly sales compare with the prior year?"
            field_bindings: { Category: "Calendar[MonthName]", Y: ["Sales[Sales Amount]", "Sales[Sales Amount Previous Year]"] }
            color_strategy: measure_match
          - id: monthly_discount
            region: discount_trend
            kind: columnChart
            purpose: "How much discount was granted each month?"
            field_bindings: { Category: "Calendar[MonthName]", Y: "Sales[Discount Amount]" }
            sort_policy: natural_order
            color_strategy: gradient
          - id: channel_rates
            region: channel_comparison
            kind: barChart
            purpose: "How do discount and margin rates compare by channel?"
            field_bindings: { Category: "Sales[Channel]", Y: ["Sales[Average Discount %]", "Sales[Gross Margin %]"] }
            sort_policy: value_desc
            color_strategy: measure_match
          - id: monthly_performance
            region: monthly_detail
            kind: pivotTable
            purpose: "What current, prior, and variance values explain each month?"
            field_bindings:
              Rows: "Calendar[MonthName]"
              Values: ["Sales[Sales Amount]", "Sales[Sales Amount Previous Year]", "Sales[Sales Amount YoY]", "Sales[Sales Amount YoY %]", "Sales[Sales Amount Previous Month]", "Sales[Sales Amount MoM]", "Sales[Sales Amount MoM %]"]
            sort_policy: natural_order
            color_strategy: semantic
          - { id: page_navigator, region: navigation, kind: pageNavigator, purpose: "Navigate among the four approved pages." }
        space_audit:
          content_cell_count: 132
          placed_cell_count: 132
          empty_cell_pct: 0
          unplaced_regions: []
          largest_region: { name: monthly_detail, pct_of_content: 21 }
          balance_rationale: "The two trend panels establish momentum while the channel comparison and monthly matrix provide equally visible explanatory evidence."
  interaction_pattern:
    drill_targets: []
    cross_filter_rules:
      - "Slicers -> all data visuals: Filter"
      - "Charts -> KPI cards: Filter"
      - "Charts -> peer charts: Highlight"
      - "Charts -> tables and matrices: Filter"
      - "Page navigator -> data visuals: None"
  accessibility:
    alt_text_strategy: "State the business question, measure, comparison basis, and visible grouping for every visual; card alt text includes the measure and active filter context."
    contrast_notes: "Dark-slate text on light-slate surfaces exceeds accessible contrast; cyan is not used for small text, and variance direction is communicated by sign and label as well as color."
  theme:
    base: "Existing Power BI base theme adapted to the approved corporate-cool palette while preserving required per-visual safeguards."
    user_overrides: "Preserve the 1280 x 720 canvas and all validated model number formats; do not add custom fonts or custom visuals."
```
