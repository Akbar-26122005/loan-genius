import React, { createRef, useState, useEffect } from 'react'

const messageListRef = createRef()

export const MessageSystem = () => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const timer = setInterval(() => {
            if (messages.length > 0) {
                const now = Date.now()
                setMessages(prev => 
                    prev.filter(msg => now - msg.id < 5000)
                )
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [messages])

    
    messageListRef.current = {
        clearMessage: () => setMessages([])
        ,addMessage: (text = '', type = 'warning-message') => {
            const id = Date.now()
            setMessages(prev => [...prev, { id, text, type }])

            setTimeout(() => {
                setMessages(prev => prev.filter(msg => msg.id !== id))
            }, 5000)
        }
    }

    const handleDelete = id => {
        setMessages(prev => prev.filter(msg => msg.id !== id))
    }

    return (
        <div className="message-list no-copy">
            {messages.map(msg => (
                <div 
                    key={msg.id} 
                    className={`message-tile ${msg.type}`}
                    onClick={() => handleDelete(msg.id)}
                >
                    {msg.text}
                </div>
            ))} 
        </div>
    )
}

export const showMessage = (text, type) => {
    messageListRef.current?.addMessage(text, type)
}