import OpenAI from 'openai';

// Initialize OpenAI client (only if API key is provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  });
}

/**
 * Generate AI response for turtle soup game
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userQuestion, game, chatHistory = [] } = req.body;

    if (!userQuestion || !game) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If OpenAI is not configured, return mock response
    if (!openai) {
      const mockResponses = [
        '是的，你的推理很有道理。',
        '不，这个方向可能不对。',
        '这个细节无关紧要。',
        '请重新表述你的问题。',
        '你很接近真相了！',
        '这是一个很好的问题，答案是肯定的。',
        '不，事情没有那么简单。'
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({ response: randomResponse });
    }

    const systemPrompt = `你是海龟汤游戏的主持人。游戏规则：

游戏题目：${game.title}
谜面：${game.description}
真相：${game.answer}
关键元素：${game.key || '未设置'}

你的职责：
1. 只能回答"是"、"否"、"无关"或"不能这样问"
2. 根据真相判断用户问题的答案
3. 如果问题与真相相符，回答"是"
4. 如果问题与真相不符，回答"否"
5. 如果问题与真相无关，回答"无关"
6. 如果问题不是是非问题，回答"不能这样问，请问是非问题"
7. 保持神秘感，不要直接透露答案
8. 可以在回答后给出简短的引导性提示
9. **重要**：当用户的问题或猜测涉及到"关键元素"中描述的内容时，立即恭喜用户成功并公布完整真相。例如："恭喜你！你猜对了！真相是：[完整答案]"
10. 关键元素是破解谜题的核心，一旦用户提到或猜测到这个元素，游戏就结束了

请严格按照规则回答，保持简洁。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg, index) => ({
        role: (index % 2 === 0 ? 'user' : 'assistant'),
        content: msg
      })),
      { role: 'user', content: userQuestion }
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '抱歉，我无法回答这个问题。';
    
    res.json({ response });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback response when API fails
    let fallbackResponse;
    if (req.body.userQuestion?.includes('是') || req.body.userQuestion?.includes('吗')) {
      fallbackResponse = '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。';
    } else {
      fallbackResponse = '请问一个是非问题，比如"他是男人吗？"';
    }
    
    res.json({ response: fallbackResponse });
  }
}