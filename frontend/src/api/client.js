/**
 * JobGuard API Client
 * Connects to the FastAPI backend with timeout, error handling,
 * and dual-spelling tolerance for backend keys.
 */

const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : '';

const TIMEOUT_MS = 15000;

/**
 * Predicts whether a job posting is fraudulent.
 * @param {Object} jobPayload - Job post attributes
 * @returns {Promise<{ isFraud: boolean, probability: number, raw: any }>}
 */
export async function predictJob(jobPayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: jobPayload.title || '',
        company_profile: jobPayload.company_profile || '',
        description: jobPayload.description || '',
        requirements: jobPayload.requirements || '',
        employment_type: jobPayload.employment_type || 'Unknown',
        required_experience: jobPayload.required_experience || 'Unknown',
        required_education: jobPayload.required_education || 'Unknown',
        telecommuting: Number(jobPayload.telecommuting) === 1 ? 1 : 0,
        has_company_logo: Number(jobPayload.has_company_logo) === 1 ? 1 : 0,
        has_questions: Number(jobPayload.has_questions) === 1 ? 1 : 0,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `Server responded with HTTP ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          if (Array.isArray(errorJson.detail)) {
            errorMsg = errorJson.detail.map(d => `${d.loc?.join('.')}: ${d.msg}`).join(', ');
          } else {
            errorMsg = errorJson.detail;
          }
        }
      } catch {
        // use default errorMsg
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Tolerant key access as required by contract
    const rawFraud = data.fradulent ?? data.fraudulent ?? 0;
    const rawProb = data.pobability ?? data.probability ?? 0.0;

    const probability = typeof rawProb === 'number' ? rawProb : parseFloat(rawProb) || 0;
    const isFraud = Boolean(rawFraud);

    return {
      isFraud,
      probability: Math.min(Math.max(probability, 0), 1),
      raw: data
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Analysis timed out after 15 seconds. The prediction server took too long to respond.');
    }
    throw error;
  }
}

/**
 * Checks API server health
 * @returns {Promise<{ ok: boolean, latencyMs: number }>}
 */
export async function checkHealth() {
  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);
    return { ok: response.ok, latencyMs };
  } catch {
    clearTimeout(timeoutId);
    return { ok: false, latencyMs: 0 };
  }
}
