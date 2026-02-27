// Background.js - AI Quick Actions

// 右鍵選單
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ai-summarize',
    title: '🤖 AI 總結',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'ai-translate',
    title: '🌐 AI 翻譯',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'ai-rewrite',
    title: '✏️ AI 改寫',
    contexts: ['selection']
  });
});

// 處理右鍵選單
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const action = info.menuItemId;
  const text = info.selectionText;
  
  if (text) {
    // 發送既popup度處理
    chrome.tabs.sendMessage(tab.id, {
      type: 'processSelection',
      text: text,
      action: action
    });
  }
});

// 獲取選取既文字既message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getSelection') {
    // 呢個需要content script既幫助
    sendResponse({ text: '' });
  }
  return true;
});

// 快捷鍵處理
chrome.commands.onCommand.addListener((command) => {
  if (command === 'summarize-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'summarizeFromShortcut' });
    });
  }
});
