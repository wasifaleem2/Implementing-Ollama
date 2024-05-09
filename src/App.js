import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./App.css"

function App() {
  const [inputText, setInputText] = useState('What is weather today?');
  const [ollamaModel, setOllamaModel] = useState('');
  const [response, setResponse] = useState([]);
  const [responseLoader, setResponseLoader] = useState(false);

  const apiUrl = 'http://localhost:11434/api/generate';

  useEffect(()=>{
    console.log(ollamaModel)
  },[ollamaModel])

  const getChat = async (question) => {
    if (!question) return;
    const payload = {
      model: "tinydolphin:latest", // Use the phi3:latest or gemma:2b or tinydolphin:latest
      prompt: question,
      stream: false,
    };
    try {
      console.log("in get chat", question);
      const response = await axios.post(apiUrl, payload);
      console.log("api response", response?.data)
      console.log("api response message", response?.data?.response)
      setResponseLoader(false)
      let fullResp = {
        question: question,
        answere: response?.data?.response,
      }
      return fullResp;
    } catch (error) {
      setResponseLoader(false)
      console.log("error:", error);
      return "";
    }
  };

  const sendMessage = async () => {
    console.log("run send function with message", inputText)
    try {
      setResponseLoader(true)
      const chatResponse = await getChat(inputText);
      if(chatResponse){
        setInputText("")
      }
      console.log("**", chatResponse);
      setResponse([...response, chatResponse]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='app'>
      <h1 style={{textAlign: "center"}}>Ollama Chat</h1>
      <select className='model-select' onChange={(e)=>setOllamaModel(e.target.value)}>
        <option>tinydolphin:latest</option>
        <option>gemma:2b</option>
        <option>phi3:latest</option>
      </select>
      <div className='response-container'>
        {response.map((singleMessage, ind) => (
          <div>
            <div className='question'>{singleMessage.question}</div>
            <div key={ind} className='response-box'>
              {singleMessage.answere}
            </div>
          </div>
        ))}
      </div>
      {
        responseLoader ? 
        <div className="flex-generic">
          <span className="loader"></span>
        </div> : null
      }
      <div className='flex-generic ask-box'>
        <input
          className='ask-box-input'
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button className='ask-box-btn' onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
