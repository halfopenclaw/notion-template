// Popup.js - AI Quick Actions

const API_URL = 'http://localhost:3000/api/chat'; // 改為你既 API URL

document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const clearBtn = document.getElementById('clearBtn');
  const inputText = document.getElementById('inputText');
  const action = document.getElementById('action');
  const resultDiv = document.getElementById('result');
  const resultContent = document.getElementById('resultContent');
  
  // 獲取選取既文字
  chrome.runtime.sendMessage({ type: 'getSelection' }, (response) => {
    if (response && response.text) {
      inputText.value = response.text;
    }
  });
  
  // 處理按鈕
  processBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) {
      alert('請輸入文字');
      return;
    }
    
    const selectedAction = action.value;
    const prompt = getPrompt(selectedAction, text);
    
    resultDiv.style.display = 'block';
    resultContent.textContent = '處理緊...';
    processBtn.disabled = true;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test_key' // 實際使用時要改
        },
        body: JSON.stringify({
          message: prompt,
          systemPrompt: getSystemPrompt(selectedAction)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        resultContent.textContent = data.response;
      } else {
        resultContent.textContent = '錯誤: ' + (data.error || '未知錯誤');
      }
    } catch (error) {
      resultContent.textContent = '連接錯誤: ' + error.message;
    } finally {
      processBtn.disabled = false;
    }
  });
  
  // 清除按鈕
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    resultDiv.style.display = 'none';
    resultContent.textContent = '';
  });
});

// 根據動作獲取 prompt
function getPrompt(action, text) {
  const prompts = {
    summarize: `請總結以下文字既主要內容 (簡潔):\n\n${text}`,
    translate: `請翻譯成英文:\n\n${text}`,
    professional: `請將以下文字改寫為更專業既風格:\n\n${text}`,
    friendly: `請將以下文字改寫為更友好既風格:\n\n${text}`,
    shorten: `請將以下文字簡化為最精簡既版本:\n\n${text}`
  };
  return prompts[action] || prompts.summarize;
}

// 獲取 system prompt
function getSystemPrompt(action) {
  const prompts = {
    summarize: '你係一個專業既文字總結助手，擅長提取重點。',
    translate: '你係一個專業既翻譯助手，準確翻譯任何語言。',
    professional: '你既寫作風格專業、正式、清晰。',
    friendly: '你既寫作風格friendly、溫暖、易讀。',
    shorten: '你擅長將複雜既文字簡化為精簡既版本。'
  };
  return prompts[action] || '你係一個有用既AI助手。';
}
