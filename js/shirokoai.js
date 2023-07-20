let heoGPTIsRunning = true;
let heo_aiPostExplanation = 'testtest';
let heoGPTModel = 'HeoGPT';
let aiTalkMode = false;
// 私有函数
var heoGPT = {
  //加载AI解释
  aiExplanation: async function () {
    const element = document.querySelector(".ai-explanation");
    if (!element) {
      return;
    }
    if (heo_aiPostExplanation === '') {
      heo_aiPostExplanation = element.innerText;
    }
    const textPromise = heoGPT.synonymReplace(heo_aiPostExplanation);
    heoGPT.aiShowAnimation(Promise.resolve(textPromise));
  },

  //使用HeoGPT生成AI解释
  loadHeogpt: async function () {
    if (heogpt === null) {
      const response = await fetch('/json/shirokoai.json');
      heogpt = await response.json();
    }
  },

  //读取文章中的所有文本
  getTitleAndContent: function () {
    const title = document.title;
    const container = document.getElementsByClassName('post-detail');
    const paragraphs = container.getElementsByTagName('p');
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
    let content = '';

    for (let h of headings) {
      content += h.innerText + ' ';
    }

    for (let p of paragraphs) {
      // 移除包含'http'的链接
      const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
      content += filteredText;
    }

    const combinedText = title + ' ' + content;
    const truncatedText = combinedText.slice(0, 1000);
    return truncatedText;
  },

  fetchTianliGPT: async function (content, key) {
    const apiUrl = `https://summary.tianli0.top/?content=${encodeURIComponent(content)}&key=${encodeURIComponent(key)}`;
    const timeout = 20000; // 设置超时时间（毫秒）

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(apiUrl, { signal: controller.signal });

      if (response.ok) {
        const data = await response.json();
        return data.summary;
      } else {
        throw new Error('请求失败');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('请求超时');
      } else {
        console.error('请求失败：', error);
      }
      return '获取文章摘要超时。当你出现这个问题时，可能是因为文章过长导致的AI运算量过大， 您可以稍等一下然后重新切换到TianliGPT模式，或者尝试使用HeoGPT模式。';
    }
  },

  tianliGPTGenerate: async function () {
    const contentPromise = heoGPT.fetchTianliGPT(heoGPT.getTitleAndContent(), "5Q5RpqtK5Dkwn1X9Gi5e");
    heoGPT.aiShowAnimation(contentPromise);
  },

  toggleGPTModel: function () {
    if (heoGPTIsRunning) {
      return;
    }
    const element = document.getElementById('ai-tag');
    if (heoGPTModel === 'TianliGPT') {
      heoGPTModel = 'HeoGPT';
      heoGPT.aiShowAnimation(Promise.resolve(heo_aiPostExplanation));
      element.innerText = 'HeoGPT';
    } else {
      heoGPTModel = 'TianliGPT';
      heoGPT.tianliGPTGenerate();
      element.innerText = 'TianliGPT';
    }
  },

  aiShowAnimation: function (textPromise) {
    const element = document.querySelector(".ai-explanation");
    if (!element) {
      return;
    }

    if (heoGPTIsRunning) {
      return;
    }
    heoGPT.cleanSuggestions();
    heoGPTIsRunning = true;
    const typingDelay = 25;
    const waitingTime = 2000;
    const punctuationDelayMultiplier = 6;

    element.style.display = "block";
    element.innerHTML = "生成中..." + '<span class="blinking-cursor"></span>';

    let animationRunning = false;
    let currentIndex = 0;
    let initialAnimation = true;

    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    textPromise.then(text => {
      let lastUpdateTime = performance.now();

    function type() {
      if (currentIndex < text.length && animationRunning) {
        const currentTime = performance.now();
        const timeDiff = currentTime - lastUpdateTime;

        const letter = text.slice(currentIndex, currentIndex + 1);
        const isPunctuation = /[，。！、？,.!?]/.test(letter);
        const delay = isPunctuation ? typingDelay * punctuationDelayMultiplier : typingDelay;

        if (timeDiff >= delay) {
          element.innerText = text.slice(0, currentIndex + 1);
          lastUpdateTime = currentTime;
          currentIndex++;

          if (currentIndex < text.length) {
            element.innerHTML =
              text.slice(0, currentIndex) +
              '<span class="blinking-cursor"></span>';
          } else {
            element.innerHTML = text;
            element.style.display = "block";
            heoGPT.createSuggestions();
            heoGPTIsRunning = false;
          }
        }
        requestAnimationFrame(type);
      }
    }

      function checkVisibility() {
        if (isInViewport(element)) {
          if (!animationRunning) {
            animationRunning = true;
            if (initialAnimation) {
              setTimeout(() => {
                type();
                initialAnimation = false;
              }, waitingTime);
            } else {
              type();
            }
          }
        } else {
          animationRunning = false;
        }
      }

      window.addEventListener('scroll', checkVisibility);
      window.addEventListener('resize', checkVisibility);

      function checkVisibility() {
        if (isInViewport(element)) {
          if (!animationRunning) {
            animationRunning = true;
            if (initialAnimation) {
              setTimeout(() => {
                type();
                initialAnimation = false;
              }, waitingTime);
            } else {
              type();
            }
          }
        } else {
          animationRunning = false;
        }
      }
    
      window.addEventListener('scroll', checkVisibility);
      window.addEventListener('resize', checkVisibility);
    
      // 使用 setInterval 添加定时器，周期性检查元素可见性
      const visibilityCheckInterval = setInterval(checkVisibility, 500);
    
      // 当动画完成后，清除定时器
      if (!heoGPTIsRunning) {
        clearInterval(visibilityCheckInterval);
      }
    
      // Trigger initial visibility check
      checkVisibility();
    }).catch(error => {
      console.error("获取信息失败:", error);
      element.innerHTML = "获取信息失败";
      element.style.display = "block";
      heoGPTIsRunning = false;
    });
  },

  //近义词替换
  synonymReplace: async function (inputString) {
    await heoGPT.loadHeogpt();

    const keys = Object.keys(heogpt);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const values = heogpt[key];
      const regex = new RegExp(key, 'gi');

      inputString = inputString.replace(regex, () => {
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex];
      });
    }

    return inputString;
  },

  //对话模式添加建议按钮
  createSuggestionItemWithAction: function (text, action) {
    // 查找具有class为ai-suggestions的元素
    const suggestionsContainer = document.querySelector('.ai-suggestions');

    if (!suggestionsContainer) {
      console.error('无法找到具有class为ai-suggestions的元素');
      return;
    }

    // 创建一个新的div元素，并为其设置class和文本内容
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('ai-suggestions-item');
    suggestionItem.textContent = text;

    // 为新元素添加点击事件监听器，点击时执行传入的action函数
    suggestionItem.addEventListener('click', () => {
      action();
    });

    // 将新创建的元素插入到ai-suggestions元素中
    suggestionsContainer.appendChild(suggestionItem);
  },

  cleanSuggestions: function () {
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    if (!suggestionsContainer) {
      console.error('无法找到具有class为ai-suggestions的元素');
      return;
    }
    suggestionsContainer.innerHTML = '';
  },

  createSuggestions: function () {
    if (!aiTalkMode) {
      return;
    }
    heoGPT.cleanSuggestions();
    if (heoGPTModel === 'HeoGPT') {
      heoGPT.createSuggestionItemWithAction("谁是颜导？", () => heoGPT_whoIsHeo());
      heoGPT.createSuggestionItemWithAction("推荐一些其他的文章", () => toRandomPost());
      heoGPT.createSuggestionItemWithAction("显示文章摘要", () => heoGPT_showAiExplanation());
      heoGPT.createSuggestionItemWithAction("我也想给我的博客安装一个AI摘要", () => tianliGPT_buyKey());
    } else if (heoGPTModel === 'TianliGPT') {
      heoGPT.createSuggestionItemWithAction("我也想给我的博客安装一个AI摘要", () => tianliGPT_buyKey());
      heoGPT.createSuggestionItemWithAction("前往Tianli博客", () => tianliGPT_toTianliBlog());
    }

    function tianliGPT_toTianliBlog() {
      window.open('https://tianli-blog.club/', '_blank');
    }

    function tianliGPT_buyKey() {
      window.open('https://blog.zhheo.com/p/ec57d8b2.html', '_blank');
    }

    function heoGPT_whoIsHeo() {
      heoGPT.aiShowAnimation(Promise.resolve("老师，颜导Kris Yan 是一名学生，还在探索期。他的GitHub主页上有一些他的作品，您可以去看看。此外，他还开发了一个名为“ShirokoAI”的博客嵌入功能，该程序旨在使用AI过对文章进行简要总结和文字显示来提高用户体验。如果您想了解更多关于他的信息，可以访问他的个人网站或博客。"));
    }

    function heoGPT_toHeoHome() {
      window.open('https://daoblog.top/', '_blank');
    }

    function heoGPT_showAiExplanation() {
      heoGPT.aiShowAnimation(Promise.resolve(heo_aiPostExplanation));
    }
  }
}


function AIEngine() {
  const aiTag = document.querySelector('.ai-tag');
  if (aiTag) {
    aiTag.addEventListener('click', () => {
      if (heoGPTIsRunning) {
        return;
      }
      aiTalkMode = true;
      if (heoGPTModel === 'HeoGPT') {
        heoGPTTalkMode();
      } else {
        tianliGPTTalkMode();
      }
    });
  }

}

function addAIToggleListener() {
  const aiTag = document.querySelector('#ai-Toggle');
  if (aiTag) {
    aiTag.addEventListener('click', () => {
      heoGPT.toggleGPTModel();
    });
  }
}

function heoGPTTalkMode() {
  const suggestionElements = document.querySelectorAll('.ai-suggestions');
  if (!suggestionElements) {
    return;
  }
  heoGPT.aiShowAnimation(Promise.resolve("老师您好，这里是白子，是Yandao的摘要生成助理ShirokoW，是一个基于GPT系列模型与DaoCorrection的混合语言模型。我在这里只负责摘要的预生成和显示，你无法与我直接沟通，但我可以回答一些预设的问题。"));
}

function tianliGPTTalkMode() {
  const suggestionElements = document.querySelectorAll('.ai-suggestions');
  if (!suggestionElements) {
    return;
  }
  heoGPT.aiShowAnimation(Promise.resolve("你好，我是Tianli开发的摘要生成助理TianliGPT，是一个基于GPT-3.5的生成式AI。我在这里只负责摘要的实时生成和显示，你无法与我直接沟通，如果你也需要一个这样的AI摘要接口，可以在下方查看部署教程。"));
}