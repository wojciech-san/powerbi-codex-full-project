const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const reportDir = path.join(root, 'sales-report', 'sales-report.Report');
const definitionDir = path.join(reportDir, 'definition');
const pagesDir = path.join(definitionDir, 'pages');
const visualSchema = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json';
const pageSchema = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json';
const pagesSchema = 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json';
const throughArg = process.argv.find(x => x.startsWith('--through='));
const through = throughArg ? Number(throughArg.split('=')[1]) : 4;
if (!Number.isInteger(through) || through < 1 || through > 4) throw new Error('--through must be 1..4');

const COLORS = {
  bg: '#EEF2F5', surface: '#F8FAFC', border: '#CBD5E1', text: '#1E293B', muted: '#475569',
  cyan: '#00A6C8', profit: '#2D7F8C', good: '#168C7A', bad: '#C94C4C', amber: '#D99A2B',
  orders: '#486581', aov: '#6D5B97', prior: '#64748B', band: '#F1F5F9'
};

const measureColors = {
  'Sales Amount': COLORS.cyan,
  'Gross Profit': COLORS.profit,
  'Gross Margin %': COLORS.good,
  'Order Count': COLORS.orders,
  'Average Order Value': COLORS.aov,
  'Discount Amount': COLORS.amber,
  'Average Discount %': COLORS.amber,
  'Sales Amount Previous Year': COLORS.prior,
  'Sales Amount YTD': COLORS.cyan,
  'Sales Amount YoY %': COLORS.good,
  'Sales Amount MoM %': COLORS.good
};

function id(seed) { return crypto.createHash('sha1').update(seed).digest('hex').slice(0, 20); }
function filterId(seed) { return crypto.createHash('sha1').update(seed).digest('hex').slice(0, 24); }
function pageId(index, name) { return index === 0 ? 'f3ab505313100cc99777' : id(`page:${name}`); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { encoding: 'utf8' });
}
function lit(value, kind = 'text') {
  if (kind === 'bool') return { expr: { Literal: { Value: value ? 'true' : 'false' } } };
  if (kind === 'int') return { expr: { Literal: { Value: `${value}L` } } };
  if (kind === 'num') return { expr: { Literal: { Value: `${value}D` } } };
  return { expr: { Literal: { Value: `'${String(value).replace(/'/g, "''")}'` } } };
}
function color(hex) { return { solid: { color: lit(hex) } }; }
function column(table, property, active = false) {
  const p = {
    field: { Column: { Expression: { SourceRef: { Entity: table } }, Property: property } },
    queryRef: `${table}.${property}`,
    nativeQueryRef: property
  };
  if (active) p.active = true;
  return p;
}
function measure(property) {
  return {
    field: { Measure: { Expression: { SourceRef: { Entity: 'Sales' } }, Property: property } },
    queryRef: `Sales.${property}`,
    nativeQueryRef: property
  };
}
function standardVco(title, altText, opts = {}) {
  return {
    title: [{ properties: {
      show: lit(Boolean(title), 'bool'),
      text: lit(title || ''),
      fontFamily: lit('Segoe UI Semibold'),
      fontSize: lit(opts.titleSize || 11, 'num'),
      bold: lit(true, 'bool'),
      fontColor: color(COLORS.text),
      titleWrap: lit(true, 'bool')
    }}],
    background: [{ properties: {
      show: lit(opts.background !== false, 'bool'), color: color(opts.backgroundColor || COLORS.surface), transparency: lit(0, 'num')
    }}],
    border: [{ properties: {
      show: lit(opts.border !== false, 'bool'), color: color(COLORS.border), radius: lit(8, 'num'), width: lit(1, 'num')
    }}],
    padding: [{ properties: {
      top: lit(opts.padding ?? 8, 'num'), bottom: lit(opts.padding ?? 8, 'num'),
      left: lit(opts.padding ?? 8, 'num'), right: lit(opts.padding ?? 8, 'num')
    }}],
    visualHeader: [{ properties: { show: lit(false, 'bool') }}],
    general: [{ properties: { altText: lit(altText) }}],
    visualTooltip: [{ properties: { show: lit(true, 'bool') }}]
  };
}
function position(x, y, width, height, order) {
  return { x, y, z: order * 1000, height, width, tabOrder: order * 1000 };
}
function baseVisual(pageName, key, type, pos, visual) {
  const name = id(`${pageName}:${key}`);
  return { name, json: { $schema: visualSchema, name, position: pos, visual: { visualType: type, ...visual } } };
}
function topNFilter(dimensionTable, dimensionField, factTable, factField, count) {
  const dimensionColumn = source => ({ Column: { Expression: { SourceRef: source }, Property: dimensionField } });
  const factAggregation = {
    Aggregation: {
      Expression: { Column: { Expression: { SourceRef: { Source: 'f' } }, Property: factField } },
      Function: 0
    }
  };
  return {
    name: `Filter${filterId(`${dimensionTable}:${dimensionField}:${factTable}:${factField}:${count}`)}`,
    field: dimensionColumn({ Entity: dimensionTable }),
    type: 'TopN',
    filter: {
      Version: 2,
      From: [
        {
          Name: 'subquery',
          Expression: {
            Subquery: {
              Query: {
                Version: 2,
                From: [
                  { Name: 'd', Entity: dimensionTable, Type: 0 },
                  { Name: 'f', Entity: factTable, Type: 0 }
                ],
                Select: [{ Column: dimensionColumn({ Source: 'd' }).Column, Name: 'field' }],
                OrderBy: [{ Direction: 2, Expression: factAggregation }],
                Top: count
              }
            }
          },
          Type: 2
        },
        { Name: 'd', Entity: dimensionTable, Type: 0 }
      ],
      Where: [{
        Condition: {
          In: {
            Expressions: [dimensionColumn({ Source: 'd' })],
            Table: { SourceRef: { Source: 'subquery' } }
          }
        }
      }]
    },
    howCreated: 'User'
  };
}
function withTopN(visual, dimensionTable, dimensionField, factTable, factField, count) {
  visual.json.filterConfig = { filters: [topNFilter(dimensionTable, dimensionField, factTable, factField, count)] };
  return visual;
}
function textbox(pageName, key, text, pos, order) {
  return baseVisual(pageName, key, 'textbox', position(pos.x, pos.y, pos.w, pos.h, order), {
    objects: { general: [{ properties: { paragraphs: [{ textRuns: [{ value: text, textStyle: {
      fontFamily: 'Segoe UI Semibold', fontSize: '20pt', fontWeight: 'bold', color: COLORS.text
    }}], horizontalTextAlignment: 'left' }] }}] },
    visualContainerObjects: {
      background: [{ properties: { show: lit(false, 'bool') }}],
      border: [{ properties: { show: lit(false, 'bool') }}],
      padding: [{ properties: { top: lit(0, 'num'), bottom: lit(0, 'num'), left: lit(0, 'num'), right: lit(0, 'num') }}],
      visualHeader: [{ properties: { show: lit(false, 'bool') }}],
      general: [{ properties: { altText: lit(text) }}]
    }
  });
}
function yearFilterObject() {
  const expr = { Column: { Expression: { SourceRef: { Source: 'c' } }, Property: 'Year' } };
  return {
    filter: {
      Version: 2,
      From: [{ Name: 'c', Entity: 'Calendar', Type: 0 }],
      Where: [{ Condition: { In: { Expressions: [expr], Values: [[{ Literal: { Value: '2026L' } }]] } } }]
    }
  };
}
function slicer(pageName, key, table, field, label, x, width, order, syncGroup, select2026 = false, single = false) {
  const objects = {
    data: [{ properties: { mode: lit('Dropdown') }}],
    header: [{ properties: { show: lit(true, 'bool'), text: lit(label), fontFamily: lit('Segoe UI Semibold'), textSize: lit(10, 'num'), bold: lit(true, 'bool'), fontColor: color(COLORS.text) }}],
    selection: [{ properties: { strictSingleSelect: lit(single, 'bool'), singleSelect: lit(single, 'bool'), selectAllCheckboxEnabled: lit(!single, 'bool') }}]
  };
  if (select2026) objects.general = [{ properties: { filter: yearFilterObject() }}];
  return baseVisual(pageName, key, 'slicer', position(x, 8, width, 80, order), {
    query: { queryState: { Values: { projections: [column(table, field)] } } },
    syncGroup: { groupName: syncGroup, fieldChanges: true, filterChanges: true },
    objects,
    visualContainerObjects: {
      background: [{ properties: { show: lit(true, 'bool'), color: color(COLORS.surface), transparency: lit(0, 'num') }}],
      border: [{ properties: { show: lit(true, 'bool'), color: color(COLORS.border), radius: lit(8, 'num'), width: lit(1, 'num') }}],
      padding: [{ properties: { top: lit(0, 'num'), bottom: lit(0, 'num'), left: lit(8, 'num'), right: lit(8, 'num') }}],
      visualHeader: [{ properties: { show: lit(false, 'bool') }}],
      general: [{ properties: { altText: lit(`${label} filter, synchronized across report pages`) }}]
    }
  });
}
function card(pageName, key, measureName, label, pos, order, accent, format = {}) {
  const selector = { id: 'default' };
  const props = {
    show: lit(true, 'bool'), fontFamily: lit('Segoe UI Semibold'), fontSize: lit(format.fontSize || 24, 'num'),
    bold: lit(true, 'bool'), fontColor: color(format.fontColor || COLORS.text), horizontalAlignment: lit('left'),
    labelDisplayUnits: lit(format.units || '-1'), labelPrecision: lit(format.precision ?? 0, 'int'), showBlankAs: lit('')
  };
  const defaultCardFormat = measureName.includes('%') ? '0.0%' :
    (['Order Count', 'Total Quantity'].includes(measureName) ? '#,0' : '€ #,0;−€ #,0;€ 0');
  props.customFormatString = lit(format.customFormatString || defaultCardFormat);
  return baseVisual(pageName, key, 'cardVisual', position(pos.x, pos.y, pos.w, pos.h, order), {
    query: { queryState: { Data: { projections: [measure(measureName)] } } },
    objects: {
      value: [{ properties: props, selector }],
      label: [{ properties: { show: lit(true, 'bool'), text: lit(label), fontFamily: lit('Segoe UI'), fontSize: lit(10, 'num'), fontColor: color(COLORS.muted), position: lit('aboveValue'), textWrap: lit(false, 'bool') }, selector }],
      accentBar: [{ properties: { show: lit(true, 'bool'), position: lit('Left'), color: color(accent), width: lit(4, 'num') }, selector }],
      outline: [{ properties: { show: lit(false, 'bool') }, selector }],
      padding: [{ properties: { paddingUniform: lit(8, 'num') }, selector }]
    },
    visualContainerObjects: standardVco('', `${label}: ${measureName}, responsive to active report filters`, { padding: 4 })
  });
}
function chartObjects(type, baseColor, showLegend = false, multi = [], valueFormat = null) {
  const objects = {
    categoryAxis: [{ properties: { show: lit(true, 'bool'), fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), labelColor: color(COLORS.muted), showAxisTitle: lit(false, 'bool'), gridlineShow: lit(false, 'bool') }}],
    valueAxis: [{ properties: { show: lit(true, 'bool'), fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), labelColor: color(COLORS.muted), labelDisplayUnits: lit('-1'), labelPrecision: lit(0, 'int'), showAxisTitle: lit(false, 'bool'), gridlineShow: lit(false, 'bool') }}],
    labels: [{ properties: { show: lit(type === 'barChart', 'bool'), fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), color: color(COLORS.text), labelDisplayUnits: lit('-1'), labelPrecision: lit(0, 'int'), labelPosition: lit('OutsideEnd'), ...(valueFormat ? { valueCustomFormatString: lit(valueFormat) } : {}) }}],
    legend: [{ properties: { show: lit(showLegend, 'bool'), position: lit('Top'), showTitle: lit(false, 'bool'), fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), labelColor: color(COLORS.muted) }}]
  };
  if (multi.length) {
    objects.dataPoint = multi.map(([queryRef, hex]) => ({ properties: { fill: color(hex) }, selector: { metadata: queryRef } }));
  } else {
    objects.dataPoint = [{ properties: { defaultColor: color(baseColor) }}];
  }
  return objects;
}
function cartesian(pageName, key, type, title, categorySpec, measures, pos, order, opts = {}) {
  const categoryProjection = column(categorySpec.table, categorySpec.field, true);
  const queryState = {
    Category: { projections: [categoryProjection] },
    Y: { projections: measures.map(measure) }
  };
  if (opts.series) queryState.Series = { projections: [column(opts.series.table, opts.series.field, true)] };
  if (opts.tooltips?.length) queryState.Tooltips = { projections: opts.tooltips.map(measure) };
  const query = { queryState };
  if (opts.sortMeasure) query.sortDefinition = { sort: [{ field: measure(opts.sortMeasure).field, direction: 'Descending' }], isDefaultSort: false };
  const multi = measures.length > 1 ? measures.map(m => [`Sales.${m}`, measureColors[m] || COLORS.cyan]) : [];
  const visualType = opts.clustered ? (type === 'barChart' ? 'clusteredBarChart' : 'clusteredColumnChart') : type;
  return baseVisual(pageName, key, visualType, position(pos.x, pos.y, pos.w, pos.h, order), {
    query,
    objects: chartObjects(type, opts.color || measureColors[measures[0]] || COLORS.cyan, Boolean(opts.series || measures.length > 1), multi, opts.valueFormat || (measures.every(m => m.includes('%')) ? '0.0%' : '€ #,0')),
    visualContainerObjects: standardVco(title, `${title}. ${opts.alt || ''}`.trim())
  });
}
function scatter(pageName, key, title, pos, order) {
  return baseVisual(pageName, key, 'scatterChart', position(pos.x, pos.y, pos.w, pos.h, order), {
    query: { queryState: {
      Category: { projections: [column('Product', 'ProductName', true)] },
      Series: { projections: [column('Product', 'Category', true)] },
      X: { projections: [measure('Sales Amount')] },
      Y: { projections: [measure('Gross Margin %')] },
      Size: { projections: [measure('Gross Profit')] },
      Tooltips: { projections: [measure('Average Discount %')] }
    } },
    objects: {
      legend: [{ properties: { show: lit(true, 'bool'), position: lit('Top'), showTitle: lit(false, 'bool'), fontSize: lit(9, 'num'), labelColor: color(COLORS.muted) }}],
      categoryAxis: [{ properties: { show: lit(true, 'bool'), fontSize: lit(9, 'num'), labelColor: color(COLORS.muted), showAxisTitle: lit(true, 'bool'), titleText: lit('Sales Amount'), titleColor: color(COLORS.muted), gridlineShow: lit(false, 'bool') }}],
      valueAxis: [{ properties: { show: lit(true, 'bool'), fontSize: lit(9, 'num'), labelColor: color(COLORS.muted), showAxisTitle: lit(true, 'bool'), titleText: lit('Gross Margin %'), titleColor: color(COLORS.muted), gridlineShow: lit(false, 'bool') }}]
    },
    visualContainerObjects: standardVco(title, `${title}. Each bubble is a product; position shows sales and margin, bubble size shows gross profit.`)
  });
}
function dataBars(queryRef, positiveColor) {
  return { properties: { dataBars: {
    positiveColor: color(positiveColor), negativeColor: color(COLORS.bad), axisColor: color(COLORS.border),
    reverseDirection: lit(false, 'bool'), hideText: lit(false, 'bool')
  } }, selector: { metadata: queryRef } };
}
function conditionalFont(measureName) {
  return {
    properties: { fontColor: { solid: { color: { expr: { Conditional: {
      Cases: [{ Condition: { Comparison: { ComparisonKind: 2, Left: measure(measureName).field, Right: { Literal: { Value: '0D' } } } }, Value: { Literal: { Value: `'${COLORS.good}'` } } }],
      DefaultValue: { Literal: { Value: `'${COLORS.bad}'` } }
    } } } } } },
    selector: { data: [{ dataViewWildcard: { matchingOption: 1 } }], metadata: `Sales.${measureName}` }
  };
}
function matrix(pageName, key, title, rows, columns, values, pos, order, opts = {}) {
  const queryState = {
    Rows: { projections: rows.map((x, i) => column(x.table, x.field, opts.activeRowIndex === i)) },
    Values: { projections: values.map(m => ({ ...measure(m), nativeQueryRef: opts.aliases?.[m] || m })) }
  };
  if (columns?.length) queryState.Columns = { projections: columns.map(x => column(x.table, x.field)) };
  const objects = {
    columnHeaders: [{ properties: { columnAdjustment: lit('growToFit'), autoSizeColumnWidth: lit(true, 'bool'), fontFamily: lit('Segoe UI Semibold'), fontSize: lit(9, 'num'), bold: lit(true, 'bool'), fontColor: color(COLORS.text), backColor: color('#E2E8F0'), wordWrap: lit(true, 'bool') }}],
    rowHeaders: [{ properties: { fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), fontColor: color(COLORS.text), backColor: color(COLORS.surface), stepped: lit(opts.stepped !== false, 'bool'), showExpandCollapseButtons: lit(rows.length > 1, 'bool'), wordWrap: lit(false, 'bool') }}],
    values: [{ properties: { fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), fontColorPrimary: color(COLORS.text), fontColorSecondary: color(COLORS.text), backColorPrimary: color(COLORS.surface), backColorSecondary: color(COLORS.band), bandedRowHeaders: lit(true, 'bool'), wordWrap: lit(false, 'bool') }}],
    rowTotal: [{ properties: { bold: lit(true, 'bool'), fontColor: color(COLORS.text), backColor: color('#E2E8F0'), applyToHeaders: lit(true, 'bool') }}]
  };
  if (opts.dataBars) objects.columnFormatting = opts.dataBars.map(([m, c]) => dataBars(`Sales.${m}`, c));
  if (opts.conditional) objects.values.push(...opts.conditional.map(conditionalFont));
  const visual = {
    query: { queryState, ...(opts.sortMeasure ? { sortDefinition: { sort: [{ field: measure(opts.sortMeasure).field, direction: 'Descending' }], isDefaultSort: false } } : {}) },
    objects,
    visualContainerObjects: { ...standardVco(title, `${title}. Rows are grouped by ${rows.map(r => r.field).join(', ')}.`), stylePreset: [{ properties: { name: lit('None') }}] }
  };
  if (opts.expandValues?.length && rows.length > 1) {
    visual.expansionStates = [{
      roles: ['Rows'],
      levels: rows.map((r, i) => ({ queryRefs: [`${r.table}.${r.field}`], isCollapsed: i !== 0, ...(i === 0 ? { identityKeys: [column(r.table, r.field).field] } : {}), isPinned: true })),
      root: { children: opts.expandValues.map(v => ({ identityValues: [{ Literal: { Value: `'${v}'` } }], isToggled: true })) }
    }];
  }
  return baseVisual(pageName, key, 'pivotTable', position(pos.x, pos.y, pos.w, pos.h, order), visual);
}
function tableVisual(pageName, key, title, fields, values, pos, order, opts = {}) {
  const objects = {
    columnHeaders: [{ properties: { columnAdjustment: lit('growToFit'), autoSizeColumnWidth: lit(true, 'bool'), fontFamily: lit('Segoe UI Semibold'), fontSize: lit(9, 'num'), bold: lit(true, 'bool'), fontColor: color(COLORS.text), backColor: color('#E2E8F0'), wordWrap: lit(true, 'bool') }}],
    values: [{ properties: { fontFamily: lit('Segoe UI'), fontSize: lit(9, 'num'), fontColorPrimary: color(COLORS.text), fontColorSecondary: color(COLORS.text), backColorPrimary: color(COLORS.surface), backColorSecondary: color(COLORS.band), wordWrap: lit(false, 'bool') }}]
  };
  if (opts.dataBars) objects.columnFormatting = opts.dataBars.map(([m, c]) => dataBars(`Sales.${m}`, c));
  if (opts.conditional) objects.values.push(...opts.conditional.map(conditionalFont));
  return baseVisual(pageName, key, 'tableEx', position(pos.x, pos.y, pos.w, pos.h, order), {
    query: {
      queryState: { Values: { projections: [...fields.map(f => column(f.table, f.field)), ...values.map(measure)] } },
      ...(opts.sortMeasure ? { sortDefinition: { sort: [{ field: measure(opts.sortMeasure).field, direction: 'Descending' }], isDefaultSort: false } } : {})
    },
    objects,
    visualContainerObjects: { ...standardVco(title, `${title}. Table columns include ${fields.map(f => f.field).join(', ')} and ${values.join(', ')}.`), stylePreset: [{ properties: { name: lit('None') }}] }
  });
}
function navigator(pageName, order) {
  return baseVisual(pageName, 'page_navigator', 'pageNavigator', position(24, 664, 1232, 48, order), {
    visualContainerObjects: {
      background: [{ properties: { show: lit(false, 'bool') }}],
      border: [{ properties: { show: lit(false, 'bool') }}],
      padding: [{ properties: { top: lit(0, 'num'), bottom: lit(0, 'num'), left: lit(0, 'num'), right: lit(0, 'num') }}],
      visualHeader: [{ properties: { show: lit(false, 'bool') }}],
      general: [{ properties: { altText: lit('Page navigation for Executive Overview, Product and Margin, Customer and Market, and Trends and Discounts') }}]
    }
  });
}
function basePage(index, name, title) {
  const visuals = [];
  let order = 1;
  visuals.push(textbox(name, 'page_title', title, { x: 24, y: 16, w: 760, h: 48 }, order++));
  visuals.push(slicer(name, 'year_slicer', 'Calendar', 'Year', 'Year', 888, 160, order++, 'SalesReportYear', true, true));
  visuals.push(slicer(name, 'channel_slicer', 'Sales', 'Channel', 'Channel', 1064, 192, order++, 'SalesReportChannel', false, false));
  return { index, name, id: pageId(index, name), visuals, nextOrder: () => order++ };
}
function addInteractions(page, charts, cards, details = []) {
  const interactions = [];
  for (const sourceKey of charts) {
    const source = page.visuals.find(v => v.key === sourceKey || v.name === sourceKey);
    if (!source) continue;
    for (const targetKey of cards) {
      const target = page.visuals.find(v => v.key === targetKey || v.name === targetKey);
      if (target) interactions.push({ source: source.name, target: target.name, type: 'DataFilter' });
    }
    for (const targetKey of charts) {
      if (sourceKey === targetKey) continue;
      const target = page.visuals.find(v => v.key === targetKey || v.name === targetKey);
      if (target) interactions.push({ source: source.name, target: target.name, type: 'HighlightFilter' });
    }
    for (const targetKey of details) {
      const target = page.visuals.find(v => v.key === targetKey || v.name === targetKey);
      if (target) interactions.push({ source: source.name, target: target.name, type: 'DataFilter' });
    }
  }
  page.interactions = interactions;
}
function push(page, key, visual) { visual.key = key; page.visuals.push(visual); return visual; }

function buildExecutive() {
  const p = basePage(0, 'Executive Overview', 'How is commercial performance tracking?');
  const k = [
    ['sales_card', 'Sales Amount', 'Sales Amount (EUR)', COLORS.cyan, {}],
    ['profit_card', 'Gross Profit', 'Gross Profit (EUR)', COLORS.profit, {}],
    ['margin_card', 'Gross Margin %', 'Gross Margin', COLORS.good, { units: '1', precision: 1 }],
    ['orders_card', 'Order Count', 'Orders', COLORS.orders, { units: '1', precision: 0 }],
    ['aov_card', 'Average Order Value', 'Avg Order Value (EUR)', COLORS.aov, {}]
  ];
  k.forEach((x, i) => push(p, x[0], card(p.name, x[0], x[1], x[2], { x: 24 + i * 248, y: 104, w: 232, h: 88 }, p.nextOrder(), x[3], x[4])));
  push(p, 'sales_trend', cartesian(p.name, 'sales_trend', 'lineChart', 'Monthly sales versus prior year', { table: 'Calendar', field: 'MonthName' }, ['Sales Amount', 'Sales Amount Previous Year'], { x: 24, y: 208, w: 712, h: 216 }, p.nextOrder(), { tooltips: ['Gross Profit', 'Gross Margin %'], alt: 'Current sales is cyan and prior-year sales is slate.' }));
  push(p, 'category_sales', cartesian(p.name, 'category_sales', 'barChart', 'Which categories drive sales?', { table: 'Product', field: 'Category' }, ['Sales Amount'], { x: 752, y: 208, w: 504, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', tooltips: ['Gross Profit', 'Gross Margin %'] }));
  push(p, 'channel_sales', cartesian(p.name, 'channel_sales', 'barChart', 'Which channels drive sales?', { table: 'Sales', field: 'Channel' }, ['Sales Amount'], { x: 24, y: 440, w: 608, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', tooltips: ['Gross Profit', 'Gross Margin %'] }));
  push(p, 'segment_profit', cartesian(p.name, 'segment_profit', 'barChart', 'Which segments generate profit?', { table: 'Customer', field: 'Segment' }, ['Gross Profit'], { x: 648, y: 440, w: 608, h: 216 }, p.nextOrder(), { sortMeasure: 'Gross Profit', tooltips: ['Sales Amount', 'Gross Margin %'] }));
  push(p, 'page_navigator', navigator(p.name, p.nextOrder()));
  addInteractions(p, ['sales_trend', 'category_sales', 'channel_sales', 'segment_profit'], k.map(x => x[0]));
  return p;
}
function buildProduct() {
  const p = basePage(1, 'Product and Margin', 'Which products create sales and margin?');
  const k = [
    ['sales_card', 'Sales Amount', 'Sales Amount (EUR)', COLORS.cyan, {}],
    ['profit_card', 'Gross Profit', 'Gross Profit (EUR)', COLORS.profit, {}],
    ['margin_card', 'Gross Margin %', 'Gross Margin', COLORS.good, { units: '1', precision: 1 }],
    ['discount_card', 'Discount Amount', 'Discount Amount (EUR)', COLORS.amber, {}]
  ];
  k.forEach((x, i) => push(p, x[0], card(p.name, x[0], x[1], x[2], { x: 24 + i * 312, y: 104, w: 296, h: 88 }, p.nextOrder(), x[3], x[4])));
  push(p, 'product_hierarchy', matrix(p.name, 'product_hierarchy', 'Product hierarchy performance', [
    { table: 'Product', field: 'Category' }, { table: 'Product', field: 'Subcategory' }, { table: 'Product', field: 'ProductName' }
  ], [], ['Sales Amount', 'Gross Profit', 'Gross Margin %', 'Discount Amount'], { x: 24, y: 208, w: 712, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', dataBars: [['Sales Amount', COLORS.cyan], ['Gross Profit', COLORS.profit]], conditional: ['Gross Margin %'], activeRowIndex: 1 }));
  push(p, 'product_position', scatter(p.name, 'product_position', 'Which products combine scale and margin?', { x: 752, y: 208, w: 504, h: 216 }, p.nextOrder()));
  push(p, 'subcategory_sales', withTopN(cartesian(p.name, 'subcategory_sales', 'barChart', 'Which subcategories lead sales?', { table: 'Product', field: 'Subcategory' }, ['Sales Amount'], { x: 24, y: 440, w: 608, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', tooltips: ['Gross Profit', 'Gross Margin %', 'Average Discount %'] }), 'Product', 'Subcategory', 'Sales', 'SalesAmount', 10));
  push(p, 'category_discount', cartesian(p.name, 'category_discount', 'columnChart', 'Where is average discount highest?', { table: 'Product', field: 'Category' }, ['Average Discount %'], { x: 648, y: 440, w: 608, h: 216 }, p.nextOrder(), { sortMeasure: 'Average Discount %', color: COLORS.amber, tooltips: ['Sales Amount', 'Gross Profit', 'Gross Margin %'] }));
  push(p, 'page_navigator', navigator(p.name, p.nextOrder()));
  addInteractions(p, ['product_position', 'subcategory_sales', 'category_discount'], k.map(x => x[0]), ['product_hierarchy']);
  return p;
}
function buildMarket() {
  const p = basePage(2, 'Customer and Market', 'Which markets and segments drive performance?');
  const k = [
    ['sales_card', 'Sales Amount', 'Sales Amount (EUR)', COLORS.cyan, {}],
    ['profit_card', 'Gross Profit', 'Gross Profit (EUR)', COLORS.profit, {}],
    ['margin_card', 'Gross Margin %', 'Gross Margin', COLORS.good, { units: '1', precision: 1 }],
    ['orders_card', 'Order Count', 'Orders', COLORS.orders, { units: '1', precision: 0 }]
  ];
  k.forEach((x, i) => push(p, x[0], card(p.name, x[0], x[1], x[2], { x: 24 + i * 312, y: 104, w: 296, h: 88 }, p.nextOrder(), x[3], x[4])));
  push(p, 'country_sales', cartesian(p.name, 'country_sales', 'barChart', 'Which countries drive sales?', { table: 'Customer', field: 'Country' }, ['Sales Amount'], { x: 24, y: 208, w: 608, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', tooltips: ['Gross Profit', 'Gross Margin %', 'Order Count'] }));
  push(p, 'city_performance', withTopN(tableVisual(p.name, 'city_performance', 'Which cities contribute most?', [{ table: 'Customer', field: 'Country' }, { table: 'Customer', field: 'City' }], ['Sales Amount', 'Gross Profit', 'Gross Margin %', 'Order Count'], { x: 648, y: 208, w: 608, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', dataBars: [['Sales Amount', COLORS.cyan], ['Gross Profit', COLORS.profit]], conditional: ['Gross Margin %'] }), 'Customer', 'City', 'Sales', 'SalesAmount', 20));
  push(p, 'segment_profit', cartesian(p.name, 'segment_profit', 'barChart', 'Which segments generate profit?', { table: 'Customer', field: 'Segment' }, ['Gross Profit'], { x: 24, y: 440, w: 504, h: 216 }, p.nextOrder(), { sortMeasure: 'Gross Profit', tooltips: ['Sales Amount', 'Gross Margin %', 'Order Count'] }));
  push(p, 'country_channel', matrix(p.name, 'country_channel', 'How does sales vary by country and channel?', [{ table: 'Customer', field: 'Country' }], [{ table: 'Sales', field: 'Channel' }], ['Sales Amount'], { x: 544, y: 440, w: 712, h: 216 }, p.nextOrder(), { sortMeasure: 'Sales Amount', dataBars: [['Sales Amount', COLORS.cyan]] }));
  push(p, 'page_navigator', navigator(p.name, p.nextOrder()));
  addInteractions(p, ['country_sales', 'segment_profit'], k.map(x => x[0]), ['city_performance', 'country_channel']);
  return p;
}
function buildTrends() {
  const p = basePage(3, 'Trends and Discounts', 'How are sales momentum and discounts changing?');
  const k = [
    ['sales_ytd_card', 'Sales Amount YTD', 'Sales YTD (EUR)', COLORS.cyan, {}],
    ['yoy_card', 'Sales Amount YoY %', 'Sales YoY', COLORS.good, { units: '1', precision: 1, customFormatString: '+0.0%;-0.0%;0.0%' }],
    ['mom_card', 'Sales Amount MoM %', 'Sales MoM', COLORS.good, { units: '1', precision: 1, customFormatString: '+0.0%;-0.0%;0.0%' }],
    ['avg_discount_card', 'Average Discount %', 'Avg Discount', COLORS.amber, { units: '1', precision: 1 }]
  ];
  k.forEach((x, i) => push(p, x[0], card(p.name, x[0], x[1], x[2], { x: 24 + i * 312, y: 104, w: 296, h: 88 }, p.nextOrder(), x[3], x[4])));
  push(p, 'monthly_sales', cartesian(p.name, 'monthly_sales', 'lineChart', 'Monthly sales versus prior year', { table: 'Calendar', field: 'MonthName' }, ['Sales Amount', 'Sales Amount Previous Year'], { x: 24, y: 208, w: 712, h: 216 }, p.nextOrder(), { tooltips: ['Sales Amount YoY %', 'Discount Amount', 'Average Discount %'] }));
  push(p, 'monthly_discount', cartesian(p.name, 'monthly_discount', 'columnChart', 'How much discount was granted each month?', { table: 'Calendar', field: 'MonthName' }, ['Discount Amount'], { x: 752, y: 208, w: 504, h: 216 }, p.nextOrder(), { color: COLORS.amber, tooltips: ['Average Discount %', 'Sales Amount'] }));
  push(p, 'channel_rates', cartesian(p.name, 'channel_rates', 'barChart', 'How do discount and margin compare by channel?', { table: 'Sales', field: 'Channel' }, ['Average Discount %', 'Gross Margin %'], { x: 24, y: 440, w: 504, h: 216 }, p.nextOrder(), { clustered: true, sortMeasure: 'Gross Margin %' }));
  push(p, 'monthly_performance', matrix(p.name, 'monthly_performance', 'Monthly current and prior-period evidence', [{ table: 'Calendar', field: 'MonthName' }], [], ['Sales Amount', 'Sales Amount Previous Year', 'Sales Amount YoY', 'Sales Amount YoY %', 'Sales Amount Previous Month', 'Sales Amount MoM', 'Sales Amount MoM %'], { x: 544, y: 440, w: 712, h: 216 }, p.nextOrder(), {
    conditional: ['Sales Amount YoY', 'Sales Amount YoY %', 'Sales Amount MoM', 'Sales Amount MoM %'],
    aliases: {
      'Sales Amount': 'Current Sales',
      'Sales Amount Previous Year': 'Prior Year',
      'Sales Amount YoY': 'YoY Δ',
      'Sales Amount YoY %': 'YoY %',
      'Sales Amount Previous Month': 'Prior Month',
      'Sales Amount MoM': 'MoM Δ',
      'Sales Amount MoM %': 'MoM %'
    }
  }));
  push(p, 'page_navigator', navigator(p.name, p.nextOrder()));
  addInteractions(p, ['monthly_sales', 'monthly_discount', 'channel_rates'], k.map(x => x[0]), ['monthly_performance']);
  return p;
}

function installTheme() {
  const themeFile = 'SalesManagement-c0a6c820.json';
  const themePath = path.join(reportDir, 'StaticResources', 'RegisteredResources', themeFile);
  const theme = {
    name: themeFile,
    dataColors: [COLORS.cyan, COLORS.profit, COLORS.good, COLORS.amber, COLORS.orders, COLORS.aov, COLORS.prior, COLORS.bad],
    good: COLORS.good, neutral: COLORS.amber, bad: COLORS.bad,
    maximum: COLORS.cyan, center: COLORS.amber, minimum: '#DDF6FA', null: COLORS.border,
    foreground: COLORS.text, foregroundNeutralSecondary: COLORS.muted, background: COLORS.surface, tableAccent: COLORS.cyan,
    textClasses: {
      title: { fontFace: 'Segoe UI Semibold', fontSize: 12, color: COLORS.text },
      header: { fontFace: 'Segoe UI Semibold', fontSize: 11, color: COLORS.text },
      label: { fontFace: 'Segoe UI', fontSize: 9, color: COLORS.muted },
      callout: { fontFace: 'Segoe UI Semibold', fontSize: 24, color: COLORS.text }
    }
  };
  writeJson(themePath, theme);
  const reportPath = path.join(definitionDir, 'report.json');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  report.themeCollection.customTheme = {
    name: themeFile,
    reportVersionAtImport: { visual: '2.9.0', report: '3.3.0', page: '2.3.1' },
    type: 'RegisteredResources'
  };
  report.resourcePackages = report.resourcePackages.filter(x => x.name !== 'RegisteredResources');
  report.resourcePackages.push({ name: 'RegisteredResources', type: 'RegisteredResources', items: [{ name: themeFile, path: themeFile, type: 'CustomTheme' }] });
  writeJson(reportPath, report);
}
function writePage(page) {
  const pageDir = path.join(pagesDir, page.id);
  const visualsDir = path.join(pageDir, 'visuals');
  fs.rmSync(visualsDir, { recursive: true, force: true });
  fs.mkdirSync(visualsDir, { recursive: true });
  for (const v of page.visuals) writeJson(path.join(visualsDir, v.name, 'visual.json'), v.json);
  const pageJson = {
    $schema: pageSchema,
    name: page.id,
    displayName: page.name,
    displayOption: 'FitToPage',
    height: 720,
    width: 1280,
    objects: {
      background: [{ properties: { color: color(COLORS.bg), transparency: lit(0, 'num') }}],
      outspace: [{ properties: { color: color('#D8E0E7'), transparency: lit(0, 'num') }}]
    }
  };
  if (page.interactions?.length) pageJson.visualInteractions = page.interactions;
  writeJson(path.join(pageDir, 'page.json'), pageJson);
}

installTheme();
const allPages = [buildExecutive(), buildProduct(), buildMarket(), buildTrends()];
const selected = allPages.slice(0, through);
for (const page of selected) writePage(page);
const approvedIds = new Set(allPages.map(p => p.id));
for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
  if (entry.isDirectory() && approvedIds.has(entry.name) && !selected.some(p => p.id === entry.name)) {
    fs.rmSync(path.join(pagesDir, entry.name), { recursive: true, force: true });
  }
}
writeJson(path.join(pagesDir, 'pages.json'), { $schema: pagesSchema, pageOrder: selected.map(p => p.id), activePageName: selected[0].id });
console.log(JSON.stringify({ through, pages: selected.map(p => ({ id: p.id, displayName: p.name, visuals: p.visuals.length })) }, null, 2));
