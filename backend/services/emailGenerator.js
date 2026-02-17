const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function generateBatchEmails(analyses) {
  if (!analyses || !Array.isArray(analyses) || analyses.length === 0) {
    throw new Error('No analyses provided for email generation');
  }

  // Validate all analyses have required fields
  const invalidAnalyses = analyses.filter(a => !a.company_name || !a.analysisData);
  if (invalidAnalyses.length > 0) {
    throw new Error(`${invalidAnalyses.length} analysis/analyses missing required fields (company_name or analysisData)`);
  }

  // Build prompt with all company data
  const companiesText = analyses
    .map((a, idx) => {
      const data = a.analysisData || a;
      return `
Company ${idx + 1}: ${a.company_name}
Profile: ${data.profile}
Pain Points: ${Array.isArray(data.painPoints) ? data.painPoints.join(', ') : data.painPoints}
Tech Stack: ${data.techStack}
Outreach Angle: ${data.outreachAngle}
`;
    })
    .join('\n---\n');

  const systemPrompt = `You are an expert SDR email writer specializing in the logistics and trucking industry.
Generate personalized cold outreach emails for multiple prospects.
Each email should:
- Be 100-150 words
- Reference specific pain points from the company analysis
- Include a clear HappyRobot value proposition
- Be professional and ready to send
- Have a natural signature line

Format your response as:
[COMPANY_NAME_1]
[Email body here]

[COMPANY_NAME_2]
[Email body here]

etc.`;

  const userPrompt = `Generate personalized cold outreach emails for these prospects:

${companiesText}

Remember: Each email should be unique, specific to the company's pain points, and compelling.`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4-turbo',
        max_tokens: 2000,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Validate OpenAI response structure
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response structure from OpenAI API');
    }

    const content = response.data.choices[0].message.content;
    const emails = parseEmailResponse(content, analyses);

    if (!emails || emails.length === 0) {
      throw new Error('Failed to parse emails from OpenAI response');
    }

    return emails;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }
    if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded');
    }
    console.error('OpenAI API error:', error.message);
    throw new Error(`Failed to generate emails: ${error.message}`);
  }
}

// Parse OpenAI response into structured email objects
function parseEmailResponse(content, analyses) {
  const emails = [];
  const companyNames = analyses.map(a => a.company_name);

  // Split by company name markers
  let currentEmail = null;
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if line is a company name
    const matchedCompany = companyNames.find(name =>
      trimmed.includes(name) || trimmed.startsWith(`[${name}`) || trimmed === name
    );

    if (matchedCompany) {
      if (currentEmail) {
        emails.push(currentEmail);
      }
      currentEmail = {
        companyName: matchedCompany,
        email: ''
      };
    } else if (currentEmail && trimmed && !trimmed.startsWith('[')) {
      currentEmail.email += line + '\n';
    }
  }

  if (currentEmail) {
    emails.push(currentEmail);
  }

  // Clean up email text
  return emails.map(e => ({
    companyName: e.companyName,
    email: e.email.trim()
  }));
}

module.exports = { generateBatchEmails };
