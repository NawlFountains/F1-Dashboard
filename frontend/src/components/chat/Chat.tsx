import { useState } from "react";
import { SendIcon } from "../styles/Icons";

export default function Chat() {
    const [assistantMessages, setAssistantMessages] = useState<string[]>([ "Hello, how can I help you?" ]);
    const [userMessages, setUserMessages] = useState<string[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");

    const handleSendMessage = () => {
        inputMessage.trim() && setUserMessages([...userMessages, inputMessage]);
        setInputMessage("");
    }

    return (
        <div className="flex flex-col gap-2 divider-y divider-gruv-bg2 dark:divider-gruv-fg2 w-full h-full border rounded border-gruv-bg3 bg-gruv-bg2 dark:border-gruv-fg3 dark:bg-gruv-bg2 justify-center items-center m-2">
        <div>
            <h1 className="text-2xl p-3 font-bold text-gruv-bg2 dark:text-gruv-fg2">Rulebook Chat</h1>
        </div>

        {/* Chat history */}
        <div className="flex flex-col w-full h-full overflow-y-scroll">
            {assistantMessages.map((message, index) => (
                <div key={index} className="flex flex-row justify-start items-center gap-2 p-2">
                    <div className="flex flex-col justify-center items-start gap-1 border rounded border-gruv-bg3 bg-gruv-bg2 dark:border-gruv-fg3 dark:bg-gruv-bg2 p-2">
                        <div className="text-sm font-bold text-gruv-bg2 dark:text-gruv-fg2 border-b border-gruv-bg3 dark:border-gruv-fg3">Assistant</div>
                        <div className="text-sm ml-2 mt-2 text-gruv-bg2 dark:text-gruv-fg2">{message}</div>
                    </div>
                </div>
            ))}
            {userMessages.map((message, index) => (
                <div key={index} className="flex flex-row justify-end items-center gap-2 p-2">
                    <div className="flex flex-col justify-center items-end gap-1 border rounded border-gruv-bg3 bg-gruv-bg2 dark:border-gruv-fg3 dark:bg-gruv-bg2 p-2">
                        <div className="text-sm font-bold text-gruv-bg2 dark:text-gruv-fg2 border-b border-gruv-bg3 dark:border-gruv-fg3">You</div>
                        <div className="text-sm mr-2 mt-2 text-gruv-bg2 dark:text-gruv-fg2">{message}</div>
                    </div>
                </div>
            ))}
        </div>
        {/* User input */}
        <div
            className="flex flex-row justify-center items-center gap-2 mt-2 w-full bg-gruv-bg3 dark:bg-gruv-fg3 p-2">
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage();
                    }
                }}
                className=" p-2 w-full"/>
            <button
                onClick={handleSendMessage}
                className="text-3xl bg-gruv-orange text-gruv-bg2 p-2 rounded hover:bg-gruv-orange-dark dark:hover:bg-gruv-orange-light">
                    <SendIcon/>
            </button>
        </div>
        </div>
    )
}