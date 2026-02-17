const axios = require('axios');

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

async function synthesizeIntelligence(aggregatedData) {
  const { companyName, news, searchResults } = aggregatedData;

  const systemPrompt = `You are an expert SDR intelligence analyst specializing in the logistics and trucking industry.
You analyze companies through the lens of AI-powered call automation solutions like HappyRobot.
Your goal is to surface operational pain points and craft compelling outreach angles.

Focus on:
- Driver communication challenges (coordination, compliance, safety)
- Dispatch and routing inefficiencies
- Customer communication friction
- Compliance and safety tracking burdens
- Lack of automation in operations`;

  const userPrompt = `Analyze this trucking/logistics company and provide intelligence for an SDR pitching AI-powered call automation:

Company: ${companyName}

Recent News:
${news.map(n => `- ${n.title}`).join('\n') || 'No recent news available'}

Search Results:
${searchResults.map(r => `- ${r.title}: ${r.snippet}`).join('\n') || 'Limited search data'}

Provide a JSON response with exactly these fields:
{
  "profile": "2-3 sentence company overview including size, location, specialty, and business model",
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "techStack": "1-2 sentence assessment of visible technology/infrastructure. If unknown, say 'Limited public tech visibility'",
  "outreachAngle": "Specific 1-2 sentence cold call pitch for HappyRobot that addresses their pain points"
}`;

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const content = response.data.content[0].text;
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse JSON from Claude response');
  } catch (error) {
    console.error('Claude API error:', error.message);
    return {
      profile: 'Unable to generate profile at this time.',
      painPoints: ['Unable to analyze at this time'],
      techStack: 'Data unavailable',
      outreachAngle: 'Please try again shortly.'
    };
  }
}

module.exports = { synthesizeIntelligence };
