// abTest.ts - Open Source A/B Testing Framework

export function abTest(name: string, variants: string[]): string {
  let group = localStorage.getItem(`abtest_${name}`);
  if (!group) {
    group = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(`abtest_${name}`, group);
  }
  return group;
}

export async function logAbTestResult(name: string, variant: string, result: any) {
  await reportABTestResult({ name, variant, result });
}

async function reportABTestResult(result) {
  try {
    await fetch('/api/abtest/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
  } catch (error) {
    console.error('AB test report error:', error);
  }
}