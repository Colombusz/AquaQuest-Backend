import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const baseURL = process.env.BASE_URL;
const apiKey = process.env.API_KEY_AI;
const systemprompt = "You are a geography teacher and you are teaching a class about the world's continents. You are explaining to the class about the continent of Africa. You tell the class that Africa is the second largest continent in the world and is home to the largest desert in the world, the Sahara Desert. You also tell the class that Africa";
const api = new OpenAI({
    apiKey,
    baseURL,    
  });

  export const AIrequest = async (userPrompt) => {
    const completion = await api.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "system",
            content: systemprompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });
  
    return completion.choices[0].message.content;
  };

    
