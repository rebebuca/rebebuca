import { FC } from 'react'
import { Space, message } from 'antd'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import copy from 'copy-to-clipboard'
import './index.scss'
import { CopyOutlined } from '@ant-design/icons'

const Answer: FC<{ answer: string }> = ({ answer }) => {
  return (
    <div>
      <Space direction="vertical" size="middle">
        <Markdown
          components={{
            code(props) {
              const { children, className, node, ...rest } = props
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <div className="code-box">
                  <div className="copy">
                    <CopyOutlined
                      onClick={() => {
                        copy(String(children))
                        message.success('copied!')
                      }}
                    />
                  </div>
                  <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{
                      paddingTop: '20px',
                      paddingBottom: '10px',
                      fontSize: '12px',
                      width: '550px',
                      overflowX: 'scroll'
                    }}
                    wrapLines={true}
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    showLineNumbers
                  />
                </div>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            }
          }}
        >
          {answer}
        </Markdown>
      </Space>
    </div>
  )
}

export default Answer
