import { NextResponse } from 'next/server';

// TODO: replace TEAMID with the actual Apple Developer Team ID before deploying.
export function GET() {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: 'TEAMID.com.moibooknativeapp',
          paths: [
            '/dashboard',
            '/events*',
            '/moi*',
            '/guests*',
            '/vendors*',
            '/ledger*',
          ],
        },
      ],
    },
  });
}
