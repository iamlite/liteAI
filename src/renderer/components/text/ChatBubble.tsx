import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BiCopy, BiCheck } from 'react-icons/bi';
import { v4 as uuid } from 'uuid';
import StyledMarkdown from './StyledMarkdown';
import { useTiktoken } from '../context/TiktokenContext';

type CodeBlockProps = {
  language?: string;
  code: string;
  handleCopy: () => void;
  copied: boolean;
};

function CodeBlock({ language, code, handleCopy, copied }: CodeBlockProps) {
  const customStyle: React.CSSProperties = {
    borderRadius: '0.75em',
    overflowX: 'auto',
    maxWidth: '100%',
  };

  return (
    <div className="relative">
      <SyntaxHighlighter
        language={language || undefined}
        style={vscDarkPlus}
        customStyle={customStyle}
      >
        {code}
      </SyntaxHighlighter>
      <button
        type="button"
        className="btn btn-xs btn-circle btn-base-100 absolute top-1 right-1 text-xs opacity-10 hover:opacity-100 transition duration-500"
        onClick={handleCopy}
      >
        {copied ? <BiCheck /> : <BiCopy />}
      </button>
    </div>
  );
}

CodeBlock.defaultProps = {
  language: undefined,
};

type MessageBlockProps = {
  block: string;
  index: number;
};

function MessageBlock({ block, index }: MessageBlockProps) {
  const [copied, setCopied] = useState(false);
  const isCodeBlock = index % 2 !== 0;
  const language = isCodeBlock ? block.split('\n')[0].trim() : null;
  const code = isCodeBlock ? block.slice((language?.length || 0) + 1) : null;

  const handleCopy = () => {
    if (!isCodeBlock || !code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return isCodeBlock && code ? (
    <div className="relative">
      <CodeBlock
        language={language}
        code={code}
        handleCopy={handleCopy}
        copied={copied}
      />
    </div>
  ) : (
    <StyledMarkdown>{block}</StyledMarkdown>
  );
}

type ChatBubbleProps = {
  message: string;
  role: string;
};

function ChatBubble({ message, role }: ChatBubbleProps) {
  const [copiedBubble, setCopiedBubble] = useState(false);
  const chatBubbleRef = useRef<HTMLDivElement>(null);
  const { getTokenCount } = useTiktoken();
  const tokenCount = useMemo(
    () => getTokenCount(message),
    [getTokenCount, message]
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (copiedBubble) {
      timeoutId = setTimeout(() => setCopiedBubble(false), 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [copiedBubble]);

  const handleBubbleCopy = () => {
    if (!chatBubbleRef.current) return;
    navigator.clipboard.writeText(chatBubbleRef.current.innerText);
    setCopiedBubble(true);
  };

  const renderMessage = () => {
    const containsCodeBlocks = message.includes('```');
    if (containsCodeBlocks) {
      const blocks = message.split('```');
      return blocks.map((block, index) => (
        <MessageBlock block={block} index={index} key={uuid()} />
      ));
    }
    return <StyledMarkdown>{message}</StyledMarkdown>;
  };

  const props = useSpring({
    from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    config: { tension: 100, friction: 10 },
  });

  const avatarURL = localStorage.getItem(
    role === 'user' ? 'userAvatarURL' : 'assistantAvatarURL'
  );

  const isShortMessage = message.length < 10;

  return (
    <animated.div style={props}>
      <div className={`chat ${role === 'user' ? 'chat-end' : 'chat-start'}`}>
        {avatarURL && (
          <div className="chat-image avatar">
            <div className="w-10 mask mask-hexagon">
              <img src={avatarURL} alt={role} />
            </div>
          </div>
        )}
        <div className="chat-header" />
        <div
          ref={chatBubbleRef}
          className={`chat-bubble ${
            role === 'assistant'
              ? 'chat-bubble-base-100'
              : 'chat-bubble-primary'
          } max-w-[50%] py-3 px-4 rounded-xl drop-shadow-lg transition ease-in-out duration-500`}
          style={{
            whiteSpace: 'pre-wrap',
            minHeight: '1em',
            position: 'relative',
          }}
        >
          {renderMessage()}
          <div
            className={`text-xs text-base-content opacity-50 absolute ${
              role === 'user' ? 'left-2' : 'right-2'
            } -bottom-5 truncate`}
          >
            Tokens: {tokenCount}
          </div>
        </div>
        <div className="chat-footer">
          {isShortMessage ? null : (
            <button
              type="button"
              className="pl-2 text-xs truncate opacity-20 hover:opacity-100 transition duration-500"
              onClick={handleBubbleCopy}
            >
              {copiedBubble ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    </animated.div>
  );
}

export default ChatBubble;
