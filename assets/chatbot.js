
// 漂浮式 GPT 聊天框（右下角）
const chatWidget = document.createElement('div');
chatWidget.style.position = 'fixed';
chatWidget.style.bottom = '20px';
chatWidget.style.right = '20px';
chatWidget.style.zIndex = '9999';
chatWidget.innerHTML = `
  <button id="openChat" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 8px;">💬 問我</button>
  <div id="chatBox" style="display: none; width: 300px; height: 400px; background: white; border: 1px solid #ccc; border-radius: 10px; padding: 10px; overflow-y: scroll; margin-top: 10px;">
    <div style="font-weight: bold;">AI 助理</div>
    <div id="chatContent" style="height: 80%; overflow-y: auto;"></div>
    <input id="chatInput" type="text" placeholder="輸入問題..." style="width: 100%; margin-top: 10px;" />
  </div>
`;
document.body.appendChild(chatWidget);

document.getElementById('openChat').onclick = () => {
  const box = document.getElementById('chatBox');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
};

document.getElementById('chatInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const userInput = e.target.value;
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML += `<div><b>你：</b>${userInput}</div>`;

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_OPENAI_API_KEY', // 請於 .env.template 設定實際金鑰
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: userInput }]
      })
    })
    .then(res => res.json())
    .then(data => {
      const reply = data.choices[0].message.content;
      chatContent.innerHTML += `<div><b>AI：</b>${reply}</div>`;
      e.target.value = '';
    })
    .catch(err => {
      chatContent.innerHTML += `<div><b>AI：</b>錯誤，請檢查 API 金鑰或網路連線。</div>`;
    });
  }
});
