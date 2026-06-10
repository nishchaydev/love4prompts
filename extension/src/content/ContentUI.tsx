import { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ContentUI() {
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, show: false });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [reversePromptResult, setReversePromptResult] = useState<string | null>(null);
  const [isReversing, setIsReversing] = useState(false);
  const [shadowMode, setShadowMode] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!chrome?.storage?.local) return;
    
    chrome.storage.local.get(['shadowMode'], (data) => {
      setShadowMode(!!data.shadowMode);
    });

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.shadowMode !== undefined) {
        setShadowMode(changes.shadowMode.newValue);
      }
    };
    
    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      if (chrome?.storage?.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, []);

  // Monitor the focused element to see if it's an editable text area
  useEffect(() => {
    console.log('[Love4Prompts] Content UI Mounted');

    const handleFocus = (e: FocusEvent | MouseEvent | KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isTextarea = target.tagName === 'TEXTAREA';
      const isContentEditable = target.getAttribute('contenteditable') === 'true' || target.isContentEditable || target.closest('[contenteditable="true"]');
      const isChatGPT = target.closest('#prompt-textarea');
      const isClaude = target.closest('.ProseMirror');

      if (isTextarea || isContentEditable || isChatGPT || isClaude) {
        let editableElement = target;
        if (isTextarea) {
          editableElement = target;
        } else if (isChatGPT) {
          editableElement = isChatGPT as HTMLElement;
        } else if (isClaude) {
          editableElement = isClaude as HTMLElement;
        } else {
          editableElement = (target.closest('[contenteditable="true"]') as HTMLElement) || target;
        }
        
        setActiveElement(editableElement);
        updatePosition(editableElement);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If we click the active textarea or the enhance button, do nothing
      if (
        activeElement &&
        (activeElement.contains(target) || target === activeElement)
      ) {
        return;
      }
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      
      setPosition(prev => ({ ...prev, show: false }));
      setActiveElement(null);
    };

    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleEnhance(false);
      }
    };

    const handleShadowEnter = (e: KeyboardEvent) => {
      if (isEnhancing) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      if (e.key === 'Enter' && !e.shiftKey) {
        const active = activeElement;
        if (active && e.target === active && shadowMode) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          handleEnhance(true);
        }
      }
    };

    document.addEventListener('focusin', handleFocus, true);
    document.addEventListener('click', handleFocus, true);
    document.addEventListener('keyup', handleFocus, true);
    document.addEventListener('mousedown', handleClickOutside, true);
    window.addEventListener('keydown', handleShortcut, true);
    window.addEventListener('keydown', handleShadowEnter, true);
    
    window.addEventListener('resize', () => {
      if (activeElement) updatePosition(activeElement);
    }, true);

    return () => {
      document.removeEventListener('focusin', handleFocus, true);
      document.removeEventListener('click', handleFocus, true);
      document.removeEventListener('keyup', handleFocus, true);
      document.removeEventListener('mousedown', handleClickOutside, true);
      window.removeEventListener('keydown', handleShortcut, true);
      window.removeEventListener('keydown', handleShadowEnter, true);
    };
  }, [activeElement, isEnhancing]);

  useEffect(() => {
    if (!chrome?.runtime?.onMessage) return;
    
    const handleMessage = (request: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) => {
      if (request.action === 'REVERSE_PROMPT') {
        handleReversePrompt(request.text);
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      if (chrome?.runtime?.onMessage) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, []);

  const handleReversePrompt = async (text: string) => {
    setIsReversing(true);
    setReversePromptResult('Analyzing text to deduce the original prompt...');
    
    try {
      if (!chrome?.runtime?.sendMessage) {
        setIsReversing(false);
        setReversePromptResult('Extension context lost. Please reload the page.');
        return;
      }
      chrome.runtime.sendMessage(
        {
          action: 'ENHANCE_PROMPT',
          text: text,
          mode: 'Reverse Prompting',
          url: window.location.href
        },
        (res: any) => {
          setIsReversing(false);
          if (chrome.runtime.lastError) {
            setReversePromptResult('Error: ' + chrome.runtime.lastError.message);
            return;
          }
          if (res && res.success && res.result && res.result.enhancedPrompt) {
            setReversePromptResult(res.result.enhancedPrompt);
          } else {
            setReversePromptResult('Failed to reverse engineer prompt.');
          }
        }
      );
    } catch (e) {
      setIsReversing(false);
      setReversePromptResult('Failed to reverse engineer prompt.');
    }
  };

  const updatePosition = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.top + window.scrollY - 40,
      left: rect.right + window.scrollX - 40,
      show: true,
    });
  };

  const handleEnhance = async (isShadowEvent: boolean = false) => {
    if (!activeElement || isEnhancing) return;

    let textToEnhance = '';
    const isTextarea = activeElement.tagName === 'TEXTAREA';
    
    if (isTextarea) {
      textToEnhance = (activeElement as HTMLTextAreaElement).value;
    } else {
      textToEnhance = activeElement.innerText || activeElement.textContent || '';
    }

    if (!textToEnhance.trim()) return;

    setIsEnhancing(true);

    try {
      if (!chrome?.storage?.local || !chrome?.runtime?.sendMessage) {
        alert('Extension context lost. Please reload the page.');
        return;
      }
      const storage = await chrome.storage.local.get(['enhancementMode', 'tone', 'length', 'memory', 'shadowMode', 'deepThink']);
      const mode = storage.enhancementMode || 'Auto';
      const tone = storage.tone !== undefined ? storage.tone : 50;
      const length = storage.length !== undefined ? storage.length : 50;
      const memory = storage.memory || '';
      const deepThink = storage.deepThink || false;

      const currentUrl = window.location.href;
      let chatContext = '';
      const contextElements = Array.from(document.querySelectorAll('article, .message, [data-message-author-role="assistant"], .markdown'));
      if (contextElements.length > 0) {
        chatContext = contextElements.slice(-2).map(el => el.textContent).join('\n\n').substring(0, 3000);
      } else {
        const bodyText = document.body.innerText || '';
        chatContext = bodyText.slice(-3000);
      }

      // Auto-Context Extraction: Grab the first 5000 chars of the page's innerText
      // Ignore scripts and styles if possible, but innerText mostly handles this.
      let pageContext = document.body.innerText || '';
      pageContext = pageContext.substring(0, 5000);

      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          { 
            action: 'ENHANCE_PROMPT', 
            text: textToEnhance, 
            mode,
            url: currentUrl,
            chatContext: chatContext,
            pageContext: pageContext,
            tone: tone,
            length: length,
            memory: memory,
            deepThink: deepThink
          },
          (res: any) => {
            if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
            if (!res.success) return reject(new Error(res.error));
            resolve(res.result);
          }
        );
      });

      const enhancedText = typeof response === 'string' ? response : (response as any).enhancedPrompt || JSON.stringify(response);

      if (isTextarea) {
        const textarea = activeElement as HTMLTextAreaElement;
        textarea.focus();
        textarea.select();
        document.execCommand('insertText', false, enhancedText);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        activeElement.focus();
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.selectNodeContents(activeElement);
          range.deleteContents();
          const textNode = document.createTextNode(enhancedText);
          range.insertNode(textNode);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // Fallback
          activeElement.innerText = enhancedText;
          activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      if (isShadowEvent) {
        setTimeout(() => {
          const form = activeElement.closest('form');
          if (form && typeof form.requestSubmit === 'function') {
            form.requestSubmit();
          } else {
            const submitBtn = document.querySelector('button[data-testid="send-button"], button[aria-label="Send Message"]') as HTMLButtonElement;
            if (submitBtn) {
              submitBtn.click();
            } else {
              activeElement.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                composed: true
              }));
            }
          }
        }, 100);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance prompt.');
    } finally {
      setIsEnhancing(false);
    }
  };

  if (!position.show) return null;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          pointerEvents: 'auto',
          zIndex: 9999999,
        }}
      >
      <button
        ref={buttonRef}
        onClick={() => handleEnhance(false)}
        disabled={isEnhancing}
        title="Enhance Prompt (Ctrl+Shift+E)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: isEnhancing ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.2s',
          opacity: isEnhancing ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {isEnhancing ? 'Enhancing...' : 'Enhance'}
      </button>
    </div>

      {/* Reverse Prompt Overlay */}
      {reversePromptResult && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 font-sans" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" style={{ background: '#0f172a', padding: '16px', borderRadius: '12px' }}>
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                Reverse Engineered Prompt
              </h2>
              <button onClick={() => setReversePromptResult(null)} className="text-slate-400 hover:text-white transition-colors">
                X
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isReversing ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-4">
                  <p>{reversePromptResult}</p>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800" style={{ background: '#020617', padding: '12px' }}>
                  <p className="text-slate-300 font-mono text-sm whitespace-pre-wrap" style={{ color: '#cbd5e1' }}>{reversePromptResult}</p>
                </div>
              )}
            </div>
            {!isReversing && (
              <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-end" style={{ marginTop: '12px' }}>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(reversePromptResult || '');
                    setReversePromptResult(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 text-sm"
                  style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '4px' }}
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
