const axios = require('axios');

const stripCodeFences = (value) => value.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitError = (error) => error.response?.status === 429;

const requestWithRetry = async (requestFn, { retries = 2, baseDelayMs = 500 } = {}) => {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error) || attempt === retries) {
        throw error;
      }

      await sleep(baseDelayMs * (attempt + 1));
    }
  }

  throw lastError || new Error('Request failed');
};

const extractJson = (value) => {
  const cleaned = stripCodeFences(value);
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('AI response did not contain JSON');
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
};

const parseJsonResponse = (value) => JSON.parse(extractJson(value));

const isLegacyGeminiModel = (model) => typeof model === 'string' && /^gemini-1\.5-/i.test(model);

const getProviderErrorMessage = (error, provider) => {
  if (error.response?.status === 404) {
    const details = error.response.data?.error?.message || error.response.data?.message || 'resource not found';
    return `${provider} request failed with 404: ${details}`;
  }

  if (error.response?.status === 429) {
    const details = error.response.data?.error?.message || error.response.data?.message || 'rate limit exceeded';
    return `${provider} request failed with 429: ${details}`;
  }

  return error.message || `${provider} request failed`;
};

const geminiRequest = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is missing');
  }

  const configuredModel = process.env.GEMINI_MODEL;
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash'
  ];

  if (configuredModel && !isLegacyGeminiModel(configuredModel)) {
    candidateModels.unshift(configuredModel);
  }

  let lastError = null;
  let lastStatus = null;

  for (const model of candidateModels) {
    try {
      const response = await requestWithRetry(
        () => axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          },
          { timeout: 60000 }
        )
      );

      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      lastError = error;
      lastStatus = error.response?.status || null;

      if (error.response?.status !== 404 && error.response?.status !== 429) {
        throw new Error(getProviderErrorMessage(error, 'Gemini'));
      }
    }
  }

  throw new Error(getProviderErrorMessage(lastError || new Error('Gemini request failed'), `Gemini${lastStatus ? ` (${lastStatus})` : ''}`));
};

const openaiRequest = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is missing');
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  try {
    const response = await requestWithRetry(() => axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages: [
        {
          role: 'system',
          content: 'Return only valid JSON. No markdown, no code fences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    },
    {
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  ));

    return response.data.choices?.[0]?.message?.content || '';
  } catch (error) {
    throw new Error(getProviderErrorMessage(error, 'OpenAI'));
  }
};

const callProvider = async (provider, prompt) => {
  if (provider === 'openai') {
    return openaiRequest(prompt);
  }

  if (provider === 'gemini') {
    return geminiRequest(prompt);
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
};

const callAi = async (prompt) => {
  const configuredProvider = process.env.OPENAI_API_KEY
    ? 'openai'
    : (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  try {
    const responseText = await callProvider(configuredProvider, prompt);
    return parseJsonResponse(responseText);
  } catch (error) {
    throw new Error(getProviderErrorMessage(error, configuredProvider === 'openai' ? 'OpenAI' : 'Gemini'));
  }
};

const analyzeResume = async (resumeText) => {
  const prompt = `You are an ATS resume analyzer for a student career platform. Analyze the resume text and return JSON with this exact structure: {"atsScore": number, "missingSkills": string[], "suggestions": string[]}. Score must be between 0 and 100. Keep arrays concise and practical. Resume text:\n\n${resumeText}`;
  return callAi(prompt);
};

const mentorReply = async ({ userMessage, history }) => {
  const prompt = `You are a concise AI career mentor for students. Respond helpfully and practically. Keep the reply short, specific, and supportive. Return JSON with this exact structure: {"reply": string}.\n\nConversation history:\n${history.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n')}\n\nCurrent user message: ${userMessage}`;
  return callAi(prompt);
};

const generateRoadmap = async ({ currentSkills, targetRole }) => {
  const prompt = `You are a career roadmap generator for students. Generate a weekly learning roadmap for the target role. Return JSON with this exact structure: {"weeks": [{"title": string, "topics": string[], "resources": string[]}]}. Keep it practical, 4 to 8 weeks long, and tailored to these current skills: ${currentSkills.join(', ') || 'none'}. Target role: ${targetRole}.`;
  return callAi(prompt);
};

module.exports = {
  analyzeResume,
  mentorReply,
  generateRoadmap
};
