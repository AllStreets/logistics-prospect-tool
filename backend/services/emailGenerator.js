const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function generateBatchEmails(analyses) {
  if (!analyses || analyses.length === 0) {
    throw new Error('No analyses provided for email generation');
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

    const content = response.data.choices[0].message.content;
    const emails = parseEmailResponse(content, analyses);
    return emails;
  } catch (error) {
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
