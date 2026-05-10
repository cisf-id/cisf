import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const keyPath = resolve(process.cwd(), './private/service_acc.json');
let credentials: any;

try {
  const content = readFileSync(keyPath, 'utf8');
  credentials = JSON.parse(content);
} catch (e) {
  console.error('Gagal memuat file kunci GA:', e);
}

// Inisialisasi client di luar handler agar lebih cepat (singleton)
const analyticsClient = new BetaAnalyticsDataClient({ credentials });

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const propertyId = '534535710';

  if (!credentials) {
    return { views: '0', error: 'Service Account Key tidak ditemukan' };
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2023-01-01', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: slug,
          },
        },
      },
    });

    const views = response.rows?.[0]?.metricValues?.[0]?.value || '0';
    return { views };
  } catch (error: any) {
    return { views: '0', error: error.message };
  }
});