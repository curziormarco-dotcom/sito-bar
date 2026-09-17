import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';
import { cmsIsConfigured } from '../../../../lib/cms-configured';
export const runtime = 'nodejs';


function unavailable() {
  return Response.json({ error: 'Pannello non ancora configurato.' }, { status: 503 });
}
export async function GET(request: Request) {
  return cmsIsConfigured() ? makeRouteHandler({ config }).GET(request) : unavailable();
}
export async function POST(request: Request) {
  return cmsIsConfigured() ? makeRouteHandler({ config }).POST(request) : unavailable();
}
