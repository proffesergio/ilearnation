// Disable framework CLI telemetry before loading its entrypoint, including on Windows.
process.env.NEXT_TELEMETRY_DISABLED = '1';
await import('next/dist/bin/next');
